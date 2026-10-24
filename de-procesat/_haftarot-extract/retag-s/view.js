process.env.OSHBMAP = process.env.OSHBMAP || require('path').join(__dirname, '../../_sarbatori_extract/oshb-map-sarbatori.json');
process.env.SPLITF = process.env.SPLITF || require('path').join(__dirname, 'split-sarb.json');
// node retag/view.js <cap> [vDe] [vPana] — afișează versetele capitolului (text Rosen) + cuvintele ebraice OSHB indexate, pentru scrierea specificației retag/cNN.js
// Marcaj: «·» = cuvânt format numai din funcții (conjuncție/prepoziție/articol/particulă) — taguit doar împreună cu un cuvânt vecin.
const fs = require('fs'), path = require('path');
const X = path.join(__dirname, '../../_haftarot-deuteronom-extract');
const O = require(path.join(X, 'oshb.js'));
const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../haftarot-sarbatori.json'), 'utf8'));
const FUNC = /^(C|Td|R|Ti|Tn|To|Tr|Tc|Ta|Te|Tj|Tm)/;
const isFunc = m => { const g = m.slice(1).split('/'); return g.some(s => FUNC.test(s)) && g.every(s => FUNC.test(s) || /^S[php]/.test(s)); };
const cn = +process.argv[2]; const a = process.argv[3], b = process.argv[4];
const ch = d.chapters.find(c => c.num === cn);
console.log(`## Cap. ${cn} ${ch.title} — ${ch.ref}`);
let on = !a;
for (const v of ch.verses) {
  if (a && v.v === a) on = true;
  if (!on) continue;
  const ws = O.haftWords(cn, v.v);
  console.log(`\n[${v.v}] ${v.t}`);
  console.log(ws.map(w => `${w.i}${isFunc(w.morph) ? '·' : ''}:${w.translit}/${w.strong.slice(1)}/${w.pos.replace('substantiv', 's').replace('verb, ', 'v ').replace('nume propriu', 'np').replace('particulă negativă', 'neg').replace('marcă a complementului direct', 'et').replace('prepoziție', 'prep').replace('conjuncție', 'conj').replace('construct', 'c.').replace('masculin', 'm').replace('feminin', 'f').replace('singular', 'sg').replace('plural', 'pl')}`).join('  '));
  if (b && v.v === b) break;
}
