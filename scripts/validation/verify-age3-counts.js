// Verify Age III card counts match expected distribution
const fs = require('fs');
const path = require('path');

// Read the TypeScript file and extract copy counts
const filePath = path.join(__dirname, 'packages/shared/src/data/cards/age3Templates.ts');
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

console.log('=== AGE III CARD COUNT VERIFICATION (BASE CARDS ONLY) ===\n');
console.log(`Found ${cards.length} base cards\n`);

// Calculate totals
const playerCounts = [3, 4, 5, 6, 7];
let allCorrect = true;
playerCounts.forEach(pc => {
  const baseTotal = cards.reduce((sum, card) => sum + (card.counts[pc] || 0), 0);
  const guildsNeeded = pc + 2; // Number of guild cards to add
  const totalCards = baseTotal + guildsNeeded;
  const expected = pc * 7;
  const status = totalCards === expected ? '✓' : '✗';
  
  console.log(`${pc} players: ${baseTotal} base + ${guildsNeeded} guilds = ${totalCards}/${expected} cards ${status}`);
  
  if (totalCards !== expected) {
    console.log(`  Difference: ${totalCards - expected}`);
    allCorrect = false;
  }
});

if (!allCorrect) {
  // Show detailed breakdown
  console.log('\n=== DETAILED CARD COUNTS ===');
  cards.forEach((card, i) => {
    const countsStr = playerCounts.map(pc => `${pc}P:${card.counts[pc] || 0}`).join(', ');
    console.log(`Card ${i + 1}: ${countsStr}`);
  });
}