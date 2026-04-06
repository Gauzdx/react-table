const fs = require('fs');

const NUM_ROWS = 1000;
const NUM_COLS = 1000;

const typesA = [
  () => '[A] ' + (Math.random() * 100).toFixed(1), 
  () => '[A] ' + ['Alpha', 'Beta', 'Gamma'][Math.floor(Math.random() * 3)], 
];

const typesB = [
  () => '[B] ' + (Math.random() * 1000).toFixed(0),
  () => '[B] ' + ['Delta', 'Epsilon', 'Zeta'][Math.floor(Math.random() * 3)],
];

function generate(filename, types) {
  return new Promise((resolve) => {
    const writeStream = fs.createWriteStream(filename);
    console.log(`Generating ${NUM_ROWS}x${NUM_COLS} for ${filename}...`);
    for (let r = 0; r < NUM_ROWS; r++) {
      let rowStr = '';
      for (let c = 0; c < NUM_COLS; c++) {
        const generator = types[Math.floor(Math.random() * types.length)];
        rowStr += generator() + (c < NUM_COLS - 1 ? ',' : '');
      }
      rowStr += '\n';
      writeStream.write(rowStr);
    }
    writeStream.end(() => {
      console.log(`Finished writing ${filename}.`);
      resolve();
    });
  });
}

async function main() {
  await generate('dataA.csv', typesA);
  await generate('dataB.csv', typesB);
}

main();
