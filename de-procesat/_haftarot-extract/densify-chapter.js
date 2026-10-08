// node densify-chapter.js <chNum> <dataFile> [--scrie]
// Adauga tag-uri noi (cuvinte/fraze) in tokens[] ale unui capitol deja existent
// in haftarot-ciclu-saptamanal.json, fara sa modifice tag-urile deja existente,
// textCompare/refs/commentaries (acelea raman neschimbate).
// dataFile (module.exports) = [ { v: "54:1", newTags: [ [fraza, {heb,translit,strong,pos,def_ro,dict_ro,greek?,greek_def_ro?,diff_ro?}], ... ] }, ... ]
const fs = require('fs');
const SRC = 'de-procesat/_haftarot-extract/haftarot-ciclu-saptamanal.json';
const master = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const [chNumStr, dataFile] = args;
const chNum = +chNumStr;
const ch = master.chapters.find(c => c.num === chNum);
if (!ch) throw new Error('capitol inexistent: ' + chNum);
const data = require('./' + dataFile);
const byV = {}; data.forEach(d => byV[d.v] = d);

const errs = [];
let added = 0;

for (const v of ch.verses) {
  const d = byV[v.v];
  if (!d) continue;
  let toks = v.tokens.slice();
  for (const [phrase, info] of d.newTags) {
    let found = false;
    for (let i = 0; i < toks.length; i++) {
      if (toks[i].heb) continue;
      const idx = toks[i].t.indexOf(phrase);
      if (idx >= 0) {
        const before = toks[i].t.slice(0, idx);
        const after = toks[i].t.slice(idx + phrase.length);
        const entries = [];
        if (before) entries.push({ t: before });
        entries.push(Object.assign({ t: phrase, w: phrase }, info));
        if (after) entries.push({ t: after });
        toks.splice(i, 1, ...entries);
        found = true;
        break;
      }
    }
    if (!found) { errs.push(v.v + ': "' + phrase + '" nu apare in portiunea netagata'); continue; }
    added++;
  }
  if (toks.map(t => t.t).join('') !== v.t) { errs.push(v.v + ': RECONSTRUCTIE GRESITA dupa inserare'); continue; }
  v.tokens = toks;
}

const nv = ch.verses.length;
const nt = ch.verses.reduce((a, v) => a + v.tokens.filter(t => t.heb).length, 0);
console.log('Capitolul', chNum, '(' + ch.title + '):', added, 'tag-uri noi,', nv, 'versete,', nt, 'tagate total, densitate', (nt / nv).toFixed(2), '/verset');
if (errs.length) { console.log('ERORI (' + errs.length + '):'); errs.forEach(e => console.log(e)); }

if (process.argv.includes('--scrie')) {
  if (errs.length) { console.log('NU s-a scris (exista erori).'); process.exit(1); }
  fs.writeFileSync(SRC, JSON.stringify(master, null, 1));
  console.log('Scris in fisierul de lucru.');
}
