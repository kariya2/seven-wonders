# Seven Wonders Game Server

WebSocket and REST API server for Seven Wonders game.

## Features

- **WebSocket Support**: Real-time game updates via Socket.io
- **REST API**: Game management and data endpoints
- **Game Engine Integration**: Uses `@seven-wonders/core` for game logic
- **Multiplayer Support**: Handle multiple concurrent games

## Architecture

```
src/
├── api/        # REST API endpoints
├── auth/       # Authentication middleware
├── db/         # Database connections (future)
├── game/       # Game logic and WebSocket handlers
└── websocket/  # WebSocket utilities
```

## API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/wonders` - Get available wonders
- `GET /api/cards/:age` - Get cards for an age
- `POST /api/games` - Create a new game
- `GET /api/games/:gameId` - Get game status

### WebSocket Events

#### Client -> Server

- `game:join` - Join a game
- `game:start` - Start a game
- `game:action` - Send a game action
- `disconnect` - Leave the game

#### Server -> Client

- `game:joined` - Confirmation of joining
- `game:started` - Game has started
- `game:state` - Updated game state
- `player:joined` - Another player joined
- `player:left` - A player left
- `error` - Error occurred

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test
```

## Environment Variables

Create a `.env` file:

```env
PORT=3001
CLIENT_URL=http://localhost:3000
API_KEY=your-secret-api-key
```

## Future Enhancements

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User authentication (JWT)
- [ ] Game replay system
- [ ] Matchmaking
- [ ] AI opponents
- [ ] Tournament mode
