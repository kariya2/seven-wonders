#!/usr/bin/env node

// Comprehensive validation script for all three ages of Seven Wonders cards
const fs = require('fs');
const path = require('path');

function verifyAge(ageNumber, fileName) {
  const filePath = path.join(__dirname, `packages/shared/src/data/cards/${fileName}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const copyPatterns = content.match(/copies:\s*{[^}]+}/g);
  
  if (!copyPatterns) {
    console.error(`No copies patterns found in ${fileName}`);
    return false;
  }
  
  const cards = [];
  copyPatterns.forEach((pattern) => {
    const objContent = pattern.match(/{([^}]+)}/)[1];
    const counts = {};
    
    const pairs = objContent.match(/\d+:\s*\d+/g);
    if (pairs) {
      pairs.forEach(pair => {
        const [players, count] = pair.split(':').map(s => parseInt(s.trim()));
        counts[players] = count;
      });
    }
    
    cards.push(counts);
  });
  
  console.log(`\n=== AGE ${ageNumber} ===`);
  console.log(`Found ${cards.length} cards`);
  
  const playerCounts = [3, 4, 5, 6, 7];
  let allCorrect = true;
  
  playerCounts.forEach(pc => {
    const total = cards.reduce((sum, card) => sum + (card[pc] || 0), 0);
    let expected = pc * 7;
    let status;
    
    // Age III needs special handling for guilds
    if (ageNumber === 'III') {
      const guildsNeeded = pc + 2;
      const totalWithGuilds = total + guildsNeeded;
      status = totalWithGuilds === expected ? '✓' : '✗';
      console.log(`${pc} players: ${total} base + ${guildsNeeded} guilds = ${totalWithGuilds}/${expected} ${status}`);
      if (totalWithGuilds !== expected) {
        allCorrect = false;
      }
    } else {
      status = total === expected ? '✓' : '✗';
      console.log(`${pc} players: ${total}/${expected} cards ${status}`);
      if (total !== expected) {
        allCorrect = false;
      }
    }
  });
  
  return allCorrect;
}

console.log('╔══════════════════════════════════════════════╗');
console.log('║  SEVEN WONDERS CARD DISTRIBUTION VALIDATION  ║');
console.log('╚══════════════════════════════════════════════╝');

const age1OK = verifyAge('I', 'age1Templates.ts');
const age2OK = verifyAge('II', 'age2Templates.ts');
const age3OK = verifyAge('III', 'age3Templates.ts');

console.log('\n' + '═'.repeat(50));
console.log('\nOVERALL RESULTS:');
console.log(`  Age I:   ${age1OK ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Age II:  ${age2OK ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Age III: ${age3OK ? '✓ PASS' : '✗ FAIL'}`);

if (age1OK && age2OK && age3OK) {
  console.log('\n🎉 All ages validated successfully!');
  console.log('The card deck is ready for Seven Wonders gameplay.');
} else {
  console.log('\n⚠️  Some ages have issues that need to be fixed.');
  process.exit(1);
}