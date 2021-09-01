const fs = require('fs').promises;

const fsTalker = ('./talker.json');

async function fsFetchTalker() {
  try {
    const dataFile = await fs.readFile(fsTalker, 'utf8');
    const result = JSON.parse(dataFile);
    return result;
  } catch (err) {
    console.log(`Erro ${err}`);
  }
}

module.exports = {
  fsFetchTalker,
};