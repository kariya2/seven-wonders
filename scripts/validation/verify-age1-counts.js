// Verify Age I card counts match expected distribution
const fs = require('fs');
const path = require('path');

// Read the TypeScript file and extract copy counts
const filePath = path.join(__dirname, 'packages/shared/src/data/cards/age1Templates.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract all copies: { ... } patterns
const copyPatterns = content.match(/copies:\s*{[^}]+}/g);

if (!copyPatterns) {
  console.error('No copies patterns found!');
  process.exit(1);
}

// Parse the counts
const cards = [];
copyPatterns.forEach((pattern, index) => {
  // Extract the object content
  const objContent = pattern.match(/{([^}]+)}/)[1];
  const counts = {};
  
  // Parse each player count
  const pairs = objContent.match(/\d+:\s*\d+/g);
  pairs.forEach(pair => {
    const [players, count] = pair.split(':').map(s => parseInt(s.trim()));
    counts[players] = count;
  });
  
  cards.push({ index, counts });
});

console.log('=== AGE I CARD COUNT VERIFICATION ===\n');
console.log(`Found ${cards.length} cards\n`);

// Calculate totals
const playerCounts = [3, 4, 5, 6, 7];
playerCounts.forEach(pc => {
  const total = cards.reduce((sum, card) => sum + (card.counts[pc] || 0), 0);
  const expected = pc * 7;
  const status = total === expected ? '✓' : '✗';
  
  console.log(`${pc} players: ${total}/${expected} cards ${status}`);
  
  if (total !== expected) {
    console.log(`  Difference: ${total - expected}`);
  }
});

// Show detailed breakdown
console.log('\n=== DETAILED CARD COUNTS ===');
cards.forEach((card, i) => {
  const countsStr = playerCounts.map(pc => `${pc}P:${card.counts[pc] || 0}`).join(', ');
  console.log(`Card ${i + 1}: ${countsStr}`);
});