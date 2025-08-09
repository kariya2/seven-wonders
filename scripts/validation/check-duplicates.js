const fs = require('fs');

// Read the Age 1 cards file
const fileContent = fs.readFileSync('./packages/shared/src/data/cards/age1.ts', 'utf8');

// Parse the cards array manually
const cardsMatch = fileContent.match(/export const age1Cards.*?\[([\s\S]*?)\];/);
if (cardsMatch) {
  // Extract card names and IDs
  const cardData = [];
  const cardBlocks = cardsMatch[1].split(/\},\s*\{/);
  
  cardBlocks.forEach(block => {
    const idMatch = block.match(/id:\s*['"]([^'"]+)['"]/);
    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    const minPlayersMatch = block.match(/minPlayers:\s*(\d+)/);
    
    if (idMatch && nameMatch && minPlayersMatch) {
      cardData.push({
        id: idMatch[1],
        name: nameMatch[1],
        minPlayers: parseInt(minPlayersMatch[1])
      });
    }
  });
  
  // Group by name to find duplicates
  const cardsByName = {};
  cardData.forEach(card => {
    if (!cardsByName[card.name]) {
      cardsByName[card.name] = [];
    }
    cardsByName[card.name].push({
      id: card.id,
      minPlayers: card.minPlayers
    });
  });
  
  // Find and display duplicates
  console.log('=== Age I Card Analysis ===\n');
  console.log('Cards appearing multiple times with different minPlayers:');
  console.log('-'.repeat(50));
  
  let hasDuplicates = false;
  Object.entries(cardsByName).forEach(([name, instances]) => {
    if (instances.length > 1) {
      hasDuplicates = true;
      console.log(`\n${name}:`);
      instances.forEach(inst => {
        console.log(`  - ID: ${inst.id}, Min Players: ${inst.minPlayers}+`);
      });
    }
  });
  
  if (!hasDuplicates) {
    console.log('No duplicate card names found.');
  }
  
  console.log('\n' + '-'.repeat(50));
  console.log(`Total unique card names: ${Object.keys(cardsByName).length}`);
  console.log(`Total card instances: ${cardData.length}`);
  
  // Show distribution by player count
  console.log('\n=== Card Distribution by Player Count ===');
  for (let players = 3; players <= 7; players++) {
    const availableCards = cardData.filter(c => c.minPlayers <= players);
    console.log(`${players} players: ${availableCards.length} cards available`);
  }
}