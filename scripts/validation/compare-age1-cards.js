// Compare what's in our templates vs what should be there

// What SHOULD be there according to the documentation
const correctAge1 = [
  // Brown cards
  { name: 'Lumber Yard', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  { name: 'Ore Vein', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  { name: 'Clay Pool', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  { name: 'Stone Pit', copies: { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 } },
  { name: 'Timber Yard', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Clay Pit', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Excavation', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 1 } },
  { name: 'Forest Cave', copies: { 3: 0, 4: 0, 5: 1, 6: 1, 7: 1 } },
  { name: 'Tree Farm', copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 } },
  { name: 'Mine', copies: { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 } },
  // Grey cards
  { name: 'Loom', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Glassworks', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Press', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  // Yellow cards
  { name: 'East Trading Post', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'West Trading Post', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Marketplace', copies: { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 } },
  { name: 'Tavern', copies: { 3: 0, 4: 1, 5: 2, 6: 2, 7: 3 } },
  // Red cards
  { name: 'Stockade', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Barracks', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Guard Tower', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  // Green cards
  { name: 'Apothecary', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Workshop', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Scriptorium', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  // Blue cards
  { name: 'Altar', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Theatre', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Baths', copies: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 } },
  { name: 'Pawnshop', copies: { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 } },
];

// Check totals
console.log('=== CORRECT AGE I TOTALS (from documentation) ===');
[3, 4, 5, 6, 7].forEach(pc => {
  const total = correctAge1.reduce((sum, card) => sum + card.copies[pc], 0);
  console.log(`${pc} players: ${total} cards (should be ${pc * 7})`);
});

console.log('\n=== WHAT WE NEED TO ADD ===');
console.log('Looking at the PDF pages more carefully...');
console.log('\nThe issue is clear: We have 27 unique cards defined.');
console.log('But we\'re missing ADDITIONAL COPIES of some cards!');
console.log('\nIn Seven Wonders, the same card can appear multiple times in a deck.');
console.log('For example, at 7 players there are TWO "Lumber Yard" cards in play.');
console.log('\nLet me check what additional copies we\'re missing for 5 and 6 players...');

// Find missing cards for 5 players
console.log('\n=== FOR 5 PLAYERS ===');
console.log('Need 35 total, have 30, missing 5 cards');
console.log('Looking at the counts, we need to add more copies of existing cards.');

// Find missing cards for 6 players  
console.log('\n=== FOR 6 PLAYERS ===');
console.log('Need 42 total, have 36, missing 6 cards');
console.log('Looking at the counts, we need to add more copies of existing cards.');

console.log('\n=== THE REAL ISSUE ===');
console.log('The PDF shows that for 5 and 6 players, there are ADDITIONAL cards that');
console.log('appear in the deck that we haven\'t accounted for. Let me check the PDF again...');