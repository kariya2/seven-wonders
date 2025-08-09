// Quick validation script
const templates = [
  // Current Age I distribution
  { name: 'Lumber Yard', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Ore Vein', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Clay Pool', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Stone Pit', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Timber Yard', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Clay Pit', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Excavation', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Forest Cave', copies: { 3: 0, 4: 0, 5: 1, 6: 1, 7: 1 } },
  { name: 'Tree Farm', copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 } },
  { name: 'Mine', copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 } },
  { name: 'Loom', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Glassworks', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Press', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'East Trading Post', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'West Trading Post', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Marketplace', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Tavern', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 3 } },
  { name: 'Forum', copies: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 } },
  { name: 'Caravansery', copies: { 3: 1, 4: 2, 5: 2, 6: 3, 7: 3 } },
  { name: 'Stockade', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Barracks', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Guard Tower', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Apothecary', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Workshop', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Scriptorium', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Altar', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Theatre', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Baths', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Pawnshop', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 } },
];

const playerCounts = [3, 4, 5, 6, 7];

console.log('Current Age I Card Distribution:');
console.log('=' .repeat(50));

playerCounts.forEach(pc => {
  const total = templates.reduce((sum, t) => sum + t.copies[pc], 0);
  const expected = pc * 7;
  const diff = expected - total;
  
  console.log(`\n${pc} players: ${total}/${expected} cards`);
  if (diff !== 0) {
    console.log(`  Missing: ${diff} cards`);
  }
});