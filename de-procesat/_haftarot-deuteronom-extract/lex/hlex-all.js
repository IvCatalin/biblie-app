// Lexiconul Haftarot pe numere Strong: reunește toate fișierele lex/h*.js (fiecare exportă {Hnnn: {d, x, g, gd}})
const fs = require('fs'); const path = require('path'); const all = {};
for (const f of fs.readdirSync(__dirname).filter(f => /^h\d+\.js$/.test(f)).sort()) {
  const part = require(path.join(__dirname, f));
  for (const [k, v] of Object.entries(part)) { if (all[k]) throw new Error('Strong dublat în lexicon: ' + k + ' (' + f + ')'); all[k] = v; }
}
module.exports = all;
