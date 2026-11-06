// Aplică peste Geneza 5: def_ro, greek_def_ro, diff_ro, dict_ro (date din tools/g5-data.js și tools/g5-lex-data.js).  node tools/g5-apply.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const load = n => new Function('window', fs.readFileSync(P + 'genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
const D = load(5), data = require('./g5-data.js'), lex = require('./g5-lex-data.js'), chron = require('./g5-chron.js');
const pick = (m, t) => m[t.strong + '|' + t.w] !== undefined ? m[t.strong + '|' + t.w] : m[t.strong];
// dict_ro din Geneza 1–4, pe cod Strong (primul text găsit)
const old = {}; for (let n = 1; n <= 4; n++) load(n).forEach(x => x.tokens.filter(t => t.dict_ro && data.reuse.includes(t.strong)).forEach(t => { old[t.strong] = old[t.strong] || t.dict_ro; }));
let nd = 0, ng = 0, ndf = 0, ndi = 0, nre = 0; const noGreek = new Set();
for (const x of D) for (const t of x.tokens.filter(t => t.heb)) {
  const d = pick(data.def, t); if (d !== undefined && t.def_ro !== d) { t.def_ro = d; nd++; }
  if (!t.greek_def_ro) { if (lex.greek[t.greek]) { t.greek_def_ro = lex.greek[t.greek]; ng++; } else noGreek.add(t.greek); }
  const k = chron.dictByVerse[x.num + "|" + t.w] !== undefined ? chron.dictByVerse[x.num + "|" + t.w] : pick(data.dict, t);
  if (k !== undefined) { if (t.dict_ro !== k) { t.dict_ro = k; ndf++; } }
  else if (old[t.strong] && !t.dict_ro) { t.dict_ro = old[t.strong]; nre++; }
}
for (const [v, w, text] of lex.diff) {
  const ts = D.find(y => y.num === v).tokens.filter(t => t.heb && t.w === w);
  if (!ts.length) throw new Error('cuvânt lipsă ' + v + ' ' + w);
  ts.forEach(t => { if (t.diff_ro !== text) { t.diff_ro = text; ndi++; } });
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| def_ro puse', nd, '| greek_def_ro puse', ng, '| diff_ro puse', ndi, '| dict_ro noi', ndf, '| dict_ro reutilizate din 1–4', nre, '| forme grecești fără intrare:', [...noGreek].join(' ') || 'niciuna');
if (WRITE) fs.writeFileSync(P + 'genesis-5.js', 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
