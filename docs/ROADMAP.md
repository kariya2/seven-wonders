7 Wonders Online — Roadmap & Architecture
Goal: Ship a web-first, rules-accurate, online 7 Wonders with a clean path to AI agents.
Non-goals (v1): App-Store binaries, accounts/social graph, expansions (Leaders/Cities), matchmaking ladder.

Tech Stack (end-state)
Client: Next.js 15 (App Router) + React + PixiJS (canvas for cards) + Zustand (state).

API: Next.js Edge Functions (Vercel) with tRPC (procedures + subscriptions).

Persistence: PlanetScale (MySQL over HTTP) via Drizzle ORM. Start with in-memory Map, then upgrade.

Core Rules: @seven-wonders/core pure TypeScript reducer (applyAction), fully deterministic.

Bots/RL: @seven-wonders/bots (TS heuristics). Python Gymnasium bridge later.

CI/CD: GitHub Actions → Vercel deploy on green.

Repository Layout
bash
Copy
Edit
/apps/web # Next app (UI + Edge API)
/packages/core # Pure rules engine (no IO)
/packages/shared # Shared types & Zod schemas
/packages/bots # Heuristic + RL sidecars (later)
/docs # This doc, ADRs, test plans
Core Data Model (minimum)
ts
Copy
Edit
// packages/core/src/types.ts
export type Age = 1|2|3;
export type CardColor = 'brown'|'gray'|'yellow'|'red'|'blue'|'green'|'purple';
export type Resource = 'wood'|'stone'|'clay'|'ore'|'glass'|'papyrus'|'textile';
export type ScienceSymbol = 'gear'|'tablet'|'compass';

export interface CostSpec {
coins?: number;
resources?: Partial<Record<Resource, number>>;
}

export type EffectSpec =
| { kind: 'resource'; produces: Partial<Record<Resource, number>> }
| { kind: 'military'; shields: number }
| { kind: 'science'; symbol: ScienceSymbol }
| { kind: 'commerce'; coins: number } // keep simple; extend later
| { kind: 'victory'; points: number }
| { kind: 'guild'; formula: string };

export interface Card {
id: string; name: string; age: Age; color: CardColor;
cost: CostSpec; effect: EffectSpec;
copies: Partial<Record<3|4|5|6|7, number>>;
chainFrom?: string; chainTo?: string[];
}

export interface PlayerState {
id: string; hand: string[]; tableau: string[];
coins: number; military: number;
science: Record<ScienceSymbol, number>;
wonderStage: number;
}

export interface GameState {
id: string; players: PlayerState[];
age: Age; turn: number; // 1..6
decks: Record<Age, string[]>; // card ids (shuffled at start of age)
discard: string[];
version: number; // monotonic; server increments
}
Protocol & Integrity
Server authoritative. Client emits Action proposals; server validates with reducer, rejects on mismatch.

Versioning. Every action includes {stateVersion}; server rejects stale actions.

Validation. All inbound payloads pass zod schemas in packages/shared.

Security. No trust in client; payments, chaining, and affordability recalculated on server.

Milestones (each ends with a demo + tests)
M1 — Rules Engine Complete
Build

Implement applyAction(state, action) with: PLAY_CARD, DISCARD, BUILD_WONDER, payment (own + neighbors), chaining, turn advance, age advance, end-game scoring (blue, red, green, yellow basics, guilds as simple formulas first).

Helper buildAgeDeck(age, players) using Card.copies.

Tests

Unit: 150+ Vitest cases covering rulebook examples (science set bonus, military ties, chain builds, guild scoring edge cases).

Fuzz: random legal actions for 10k steps → no throws; final scores deterministic for fixed seed.

Demo

CLI hot-seat game (stdin) completes 3 Ages; printed scores match manual count on sample script.

M2 — Edge API (In-Memory)
Build

tRPC procedures: createRoom(players), joinRoom(roomId), action(roomId, Action), stateSub(roomId) (WebSocket or SSE).

State store: in-memory Map<roomId, {state, sockets}>. Increment state.version each mutation.

Tests

Integration (supertest): 2 simulated players, alternating actions → both receive consistent states.

Concurrency: send stale stateVersion → server rejects with typed error.

Demo

Two browser tabs on localhost stay in sync through Age I.

M3 — Minimal UI (Playable)
Build

/play/[roomId] page with: lobby join, hand display as Pixi rectangles, clickable “play/discard/build”, basic coins/military/science counters, end-of-age modal.

Zustand store + tRPC client hook useGame(roomId).

Tests

Playwright: click a card → state updates; mobile viewport sanity on iPad size.

Demo

Friends play a full 3-player game (ugly but functional) on Mac + iPad.

M4 — Persistence & Reconnect
Build

Swap Map → PlanetScale via Drizzle. Tables:
rooms(id, created_at),
states(room_id PK, blob JSON, version INT),
events(id, room_id, version, action JSON, at).

Load latest snapshot on join; append events; optimistic concurrency on version.

Tests

DB integration: snapshot round-trip; reject double-apply when version mismatches.

Playwright: refresh mid-game → state restored; disconnect/reconnect test.

Demo

Close tab, reopen; same URL resumes game.

M5 — Heuristic Bot & Spectators
Build

packages/bots: chooseAction(state, playerId) heuristic (finish wonder > cheap science > else sell).

Server endpoint to seat bots to meet min players; spectator join (readOnly).

Tests

1,000 self-play games → zero crashes; basic stats printed.

Demo

1 human + 2 bots play to completion.

M6 — Gymnasium Bridge (RL)
Build

Compile core to Wasm (or Node child-proc) and expose Python Env with reset/step.

Sample PPO config (RLlib) and baseline run script.

Tests

PyTest: reset+step for 100 transitions; determinism under fixed seed.

Demo

5–10 min training yields >55% win vs heuristic in eval.

M7 — PWA & Visual Polish
Build

Replace rectangles → SVG sprites; drag-to-play; sound cues.

Workbox offline cache; add to home screen; push/local notifications for Age start.

Tests

Lighthouse PWA ≥90 desktop/mobile; 60 FPS interactions on iPad.

Demo

Installable PWA; fully playable with pleasant feedback.

Testing Matrix (quick vs slow)
On save: Vitest unit (core), ESLint/Prettier, typecheck.

On push: Unit + integration + Playwright e2e (Chromium only).

Nightly: Fuzz 50k steps, Playwright Safari/iOS, RL regression short run.

CI/CD
GitHub Actions:

Install pnpm, cache store.

pnpm -r lint && pnpm -r typecheck && pnpm -r test.

Build web app; deploy to Vercel on main green.

Branch rules: require checks + at least one review (human or AI review).

Agent (LLM) Guard-Rails
Do not add runtime deps without updating this doc or opening an ADR.

Only modify files within the milestone’s scope.

Keep packages/core free of IO and browser APIs.

When editing types, update Zod schemas and fix all downstream compile errors.

Every new reducer feature must include unit tests and at least one fixture that mirrors the rulebook.

Commit style: Conventional Commits (feat:, fix:, test:). Small, reviewable diffs.

Environment & Scripts
.env (local): DATABASE_URL=..., NODE_ENV=development.

Scripts:

pnpm dev (web + edge), pnpm test, pnpm typecheck, pnpm lint, pnpm build.

pnpm core:cli runs hot-seat CLI.

Performance Targets
Server action -> broadcast P95 < 100 ms on Vercel Edge.

60 FPS card animations on iPad Pro (PixiJS).

Memory: keep GameState JSON under 64 KB per room.

Definition of Done (v1.0)
One real 7-player human game finishes on prod with no manual DB edits.

All tests pass; Vercel prod green.

PWA Lighthouse ≥90; reconnects work; bots functional; README reproduces setup.

Backlog (post-v1)
Expansions (Leaders/Cities); Accounts; Matchmaking; Observer API; Analytics dashboard.
