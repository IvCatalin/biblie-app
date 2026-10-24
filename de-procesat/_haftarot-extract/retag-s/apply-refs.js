// node apply-refs.js <cap> [--scrie] — pune trimiterile din refs-cNN.js ({ "verset": [ "Carte c:v", ... ] }) în capitol; plafon 6 per verset
const fs = require('fs'), path = require('path');
const WF = path.join(__dirname, '../haftarot-sarbatori.json');
const cn = +process.argv[2]; const d = JSON.parse(fs.readFileSync(WF, 'utf8')); const ch = d.chapters.find(c => c.num === cn);
const spec = require('./refs-c' + String(cn).padStart(2, '0') + '.js'); const errs = [];
const RE = /^(\d )?[A-ZĂÂÎȘȚa-zăâîșț]+( [a-zăâîșț]+)* \d+:\d+([,-]\d+)*$/;
for (const v of ch.verses) {
  const r = spec[v.v]; if (!r) { errs.push(v.v + ': lipsește din refs'); continue; }
  if (r.length > 6) errs.push(v.v + ': peste 6 trimiteri (' + r.length + ')');
  for (const x of r) if (!RE.test(x)) errs.push(v.v + ': format ' + x);
  if (new Set(r).size !== r.length) errs.push(v.v + ': duplicate');
  v.refs = r;
}
const tot = ch.verses.reduce((s, v) => s + v.refs.length, 0);
console.log(`Cap. ${cn}: ${tot} trimiteri = ${(tot / ch.verses.length).toFixed(2)}/verset; fără: ${ch.verses.filter(v => !v.refs.length).map(v => v.v).join(',') || '-'}`);
if (errs.length) { console.log(errs.join('\n')); process.exit(1); }
if (process.argv.includes('--scrie')) { fs.writeFileSync(WF, JSON.stringify(d, null, 1)); console.log('Scris.'); }
