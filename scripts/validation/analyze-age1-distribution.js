// Analyze Age I card distribution based on the PDF Quick Reference

// Based on PDF pages 1-2 (7 players), 5-6 (6 players), 9-10 (5 players), 13-14 (4 players), 17-18 (3 players)
const actualDistribution = {
  // Brown cards (Raw Materials)
  'Lumber Yard': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Ore Vein': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Clay Pool': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Stone Pit': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Timber Yard': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
  'Clay Pit': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
  'Excavation': { 3: 0, 4: 1, 5: 1, 6: 1, 7: 1 },
  'Forest Cave': { 3: 0, 4: 0, 5: 1, 6: 1, 7: 1 },
  'Tree Farm': { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 },
  'Mine': { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 },
  
  // Grey cards (Manufactured Goods)
  'Loom': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  'Glassworks': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  'Press': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  
  // Yellow cards (Commercial)
  'East Trading Post': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'West Trading Post': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Marketplace': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  'Tavern': { 3: 0, 4: 1, 5: 2, 6: 2, 7: 3 },
  
  // Red cards (Military)
  'Stockade': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Barracks': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Guard Tower': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  
  // Blue cards (Civil)
  'Altar': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Theatre': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Baths': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Pawnshop': { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 },
  
  // Green cards (Science)
  'Apothecary': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Workshop': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Scriptorium': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  
  // Additional for yellow - based on visible duplicates in PDF
  'Forum': { 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 },
  'Caravansery': { 3: 1, 4: 2, 5: 2, 6: 3, 7: 3 },
};

// Current template distribution (what's in age1Templates.ts)
const currentDistribution = {
  'Lumber Yard': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Ore Vein': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Clay Pool': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Stone Pit': { 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 },
  'Timber Yard': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
  'Clay Pit': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
  'Excavation': { 3: 0, 4: 1, 5: 1, 6: 1, 7: 1 },
  'Forest Cave': { 3: 0, 4: 0, 5: 1, 6: 1, 7: 1 },
  'Tree Farm': { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 },
  'Mine': { 3: 0, 4: 0, 5: 0, 6: 1, 7: 1 },
  'Loom': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  'Glassworks': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  'Press': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  'Tavern': { 3: 0, 4: 1, 5: 2, 6: 2, 7: 3 },
  'East Trading Post': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'West Trading Post': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Marketplace': { 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
  'Forum': { 3: 2, 4: 2, 5: 3, 6: 3, 7: 3 },
  'Caravansery': { 3: 2, 4: 3, 5: 3, 6: 3, 7: 3 },
  'Stockade': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Barracks': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Guard Tower': { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Apothecary': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Workshop': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Scriptorium': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Altar': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Theatre': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Baths': { 3: 1, 4: 1, 5: 1, 6: 1, 7: 2 },
  'Pawnshop': { 3: 0, 4: 1, 5: 1, 6: 1, 7: 2 },
};

console.log('=== SEVEN WONDERS AGE I CARD DISTRIBUTION ANALYSIS ===\n');

const playerCounts = [3, 4, 5, 6, 7];

// Calculate totals for both distributions
playerCounts.forEach(pc => {
  const actualTotal = Object.values(actualDistribution).reduce((sum, card) => sum + card[pc], 0);
  const currentTotal = Object.values(currentDistribution).reduce((sum, card) => sum + card[pc], 0);
  const expected = pc * 7;
  
  console.log(`${pc} PLAYERS:`);
  console.log(`  Expected: ${expected} cards (${pc} players × 7 cards)`);
  console.log(`  Actual (from PDF): ${actualTotal} cards`);
  console.log(`  Current (in code): ${currentTotal} cards`);
  
  if (actualTotal !== expected) {
    console.log(`  ⚠️ PDF count differs from expected by: ${actualTotal - expected}`);
  }
  if (currentTotal !== expected) {
    console.log(`  ❌ Code count differs from expected by: ${currentTotal - expected}`);
  }
  console.log();
});

// Find discrepancies between actual and current
console.log('\n=== CARD-BY-CARD DISCREPANCIES ===\n');
let hasDiscrepancy = false;

Object.keys(actualDistribution).forEach(cardName => {
  const actual = actualDistribution[cardName];
  const current = currentDistribution[cardName];
  
  if (!current) {
    console.log(`❌ Missing card: ${cardName}`);
    hasDiscrepancy = true;
    return;
  }
  
  playerCounts.forEach(pc => {
    if (actual[pc] !== current[pc]) {
      console.log(`${cardName} (${pc} players): Expected ${actual[pc]}, got ${current[pc]}`);
      hasDiscrepancy = true;
    }
  });
});

// Check for extra cards in current
Object.keys(currentDistribution).forEach(cardName => {
  if (!actualDistribution[cardName]) {
    console.log(`❌ Extra card in code: ${cardName}`);
    hasDiscrepancy = true;
  }
});

if (!hasDiscrepancy) {
  console.log('✅ No discrepancies found - distributions match!');
}

// The issue: Forum and Caravansery have wrong counts
console.log('\n=== KEY FINDINGS ===');
console.log('The main issues are with Forum and Caravansery cards:');
console.log('\nForum:');
console.log('  Current:', JSON.stringify(currentDistribution['Forum']));
console.log('  Should be:', JSON.stringify(actualDistribution['Forum']));
console.log('\nCaravansery:');
console.log('  Current:', JSON.stringify(currentDistribution['Caravansery']));
console.log('  Should be:', JSON.stringify(actualDistribution['Caravansery']));