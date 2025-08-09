// Count validation for fixed Age I
const counts = {
  3: 21, // Expected for 3 players
  4: 28, // Expected for 4 players
  5: 35, // Expected for 5 players
  6: 42, // Expected for 6 players
  7: 49, // Expected for 7 players
};

// Count cards by summing all copies fields
const cards = [
  // Brown - basics (4 cards × 2 copies at 7p = 8)
  { name: 'Lumber Yard', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  { name: 'Stone Pit', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  { name: 'Clay Pool', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  { name: 'Ore Vein', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  
  // Brown - choices (6 cards × 1 copy = 6)
  { name: 'Tree Farm', copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 } },
  { name: 'Excavation', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Clay Pit', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Timber Yard', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Forest Cave', copies: { 3: 0, 4: 0, 5: 1, 6: 1, 7: 1 } },
  { name: 'Mine', copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 } },
  
  // Grey (3 cards × 2 copies at 7p = 6)
  { name: 'Loom', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Glassworks', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Press', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  
  // Yellow (4 cards)
  { name: 'Tavern', copies: { 3: 0, 4: 1, 5: 2, 6: 2, 7: 3 } },
  { name: 'East Trading Post', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'West Trading Post', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Marketplace', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  
  // Red (3 cards)
  { name: 'Stockade', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Barracks', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Guard Tower', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 } },
  
  // Green (3 cards)
  { name: 'Apothecary', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Workshop', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Scriptorium', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  
  // Blue (4 cards)
  { name: 'Pawnshop', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Baths', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Altar', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Theatre', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
];

console.log('Age I Card Count Validation:');
console.log('=' .repeat(50));

for (const pc of [3, 4, 5, 6, 7]) {
  const total = cards.reduce((sum, card) => sum + card.copies[pc], 0);
  const expected = counts[pc];
  const status = total === expected ? '✓' : '✗';
  
  console.log(`${pc} players: ${total}/${expected} ${status}`);
  
  if (total !== expected) {
    console.log(`  Difference: ${total - expected}`);
  }
}