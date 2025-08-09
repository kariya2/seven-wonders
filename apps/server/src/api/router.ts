import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { GameEngine } from '@seven-wonders/core';
import { buildDeck, Age } from '@seven-wonders/shared';

const router: ExpressRouter = Router();

// Get available wonders
router.get('/wonders', (req, res) => {
  // TODO: Get from wonder data
  res.json({
    wonders: [
      'alexandria',
      'babylon',
      'ephesus',
      'giza',
      'rhodes',
      'olympia',
      'halicarnassus',
    ],
  });
});

// Get card data for an age
router.get('/cards/:age', (req, res) => {
  try {
    const age = parseInt(req.params.age) as Age;
    if (![Age.I, Age.II, Age.III].includes(age)) {
      return res.status(400).json({ error: 'Invalid age' });
    }

    const playerCount = parseInt(req.query.players as string) || 3;
    if (playerCount < 3 || playerCount > 7) {
      return res
        .status(400)
        .json({ error: 'Player count must be between 3 and 7' });
    }

    const deck = buildDeck(age, playerCount as any);
    res.json({ cards: deck });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get cards',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create a new game
router.post('/games', (req, res) => {
  try {
    const gameId = Math.random().toString(36).substring(2, 15);

    res.json({
      gameId,
      createdAt: new Date().toISOString(),
      status: 'waiting_for_players',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create game',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get game status
router.get('/games/:gameId', (req, res) => {
  // TODO: Implement game status retrieval from storage
  res.json({
    gameId: req.params.gameId,
    status: 'waiting_for_players',
    players: [],
  });
});

export default router;
