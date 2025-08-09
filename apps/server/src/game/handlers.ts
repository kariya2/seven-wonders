import { Server, Socket } from 'socket.io';
import { GameEngine, GameState, GameAction } from '@seven-wonders/core';
import { z } from 'zod';

// In-memory game storage (replace with database in production)
const games = new Map<
  string,
  {
    engine: GameEngine;
    state: GameState;
    players: Map<string, string>; // socketId -> playerId
  }
>();

const JoinGameSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  wonderPreference: z.string().optional(),
});

const GameActionSchema = z.object({
  gameId: z.string(),
  action: z.any(), // TODO: properly type this with GameAction schema
});

export function setupGameHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Handle joining a game
    socket.on('game:join', (data) => {
      try {
        const { gameId, playerId } = JoinGameSchema.parse(data);

        socket.join(gameId);

        // Get or create game
        let game = games.get(gameId);
        if (!game) {
          const engine = new GameEngine();
          game = {
            engine,
            state: null as any, // Will be initialized when game starts
            players: new Map(),
          };
          games.set(gameId, game);
        }

        // Add player to game
        game.players.set(socket.id, playerId);

        // Notify other players
        socket.to(gameId).emit('player:joined', {
          playerId,
          playerCount: game.players.size,
        });

        socket.emit('game:joined', {
          gameId,
          playerCount: game.players.size,
        });
      } catch (error) {
        socket.emit('error', {
          message: 'Failed to join game',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Handle game actions
    socket.on('game:action', (data) => {
      try {
        const { gameId, action } = GameActionSchema.parse(data);

        const game = games.get(gameId);
        if (!game) {
          throw new Error('Game not found');
        }

        // Apply action to game state
        const newState = game.engine.applyAction(
          game.state,
          action as GameAction
        );
        game.state = newState;

        // Broadcast new state to all players in the game
        io.to(gameId).emit('game:state', {
          state: newState,
          lastAction: action,
        });
      } catch (error) {
        socket.emit('error', {
          message: 'Failed to process action',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Handle starting a game
    socket.on('game:start', (data) => {
      try {
        const { gameId } = z.object({ gameId: z.string() }).parse(data);

        const game = games.get(gameId);
        if (!game) {
          throw new Error('Game not found');
        }

        if (game.players.size < 3) {
          throw new Error('Need at least 3 players to start');
        }

        // Initialize game
        const playerIds = Array.from(game.players.values());
        const wonderAssignments = {}; // TODO: Implement wonder assignment logic

        game.state = game.engine.initializeGame(
          playerIds,
          wonderAssignments as any
        );

        // Notify all players that game has started
        io.to(gameId).emit('game:started', {
          state: game.state,
        });
      } catch (error) {
        socket.emit('error', {
          message: 'Failed to start game',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);

      // Remove player from all games
      games.forEach((game, gameId) => {
        if (game.players.has(socket.id)) {
          const playerId = game.players.get(socket.id);
          game.players.delete(socket.id);

          // Notify other players
          io.to(gameId).emit('player:left', {
            playerId,
            playerCount: game.players.size,
          });

          // Clean up empty games
          if (game.players.size === 0) {
            games.delete(gameId);
          }
        }
      });
    });
  });
}
