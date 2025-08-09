// Simple test to verify the game engine works
const { GameEngine } = require('./dist/engine/gameEngine');

console.log('Testing game engine...');

try {
  const engine = new GameEngine();
  console.log('✅ GameEngine created successfully');
} catch (error) {
  console.log('❌ Failed to create GameEngine:', error.message);
}
