// Aplică peste Geneza 6: def_ro, greek_def_ro, diff_ro, dict_ro (tools/g6-data.js, tools/g6-lex-data.js). node tools/g6-apply.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const load = n => new Function('window', fs.readFileSync(P + 'genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
const D = load(6), data = require('./g6-data.js'), lex = require('./g6-lex-data.js');
const pick = (m, t) => m[t.strong + '|' + t.w] !== undefined ? m[t.strong + '|' + t.w] : m[t.strong];
const old = {}; for (let n = 1; n <= 5; n++) load(n).forEach(x => x.tokens.filter(t => t.heb && t.dict_ro && !/^Vezi mai sus/.test(t.dict_ro) && data.reuse.includes(t.strong)).forEach(t => { old[t.strong] = old[t.strong] || t.dict_ro; }));
let nd = 0, ng = 0, ndi = 0, nk = 0, nre = 0; const noG = new Set(), noD = [];
for (const x of D) for (const t of x.tokens.filter(t => t.heb)) {
  const d = pick(data.def, t); if (d !== undefined && t.def_ro !== d) { t.def_ro = d; nd++; }
  if (t.greek) { if (lex.greek[t.greek]) { if (t.greek_def_ro !== lex.greek[t.greek]) { t.greek_def_ro = lex.greek[t.greek]; ng++; } } else if (!t.greek_def_ro) noG.add(t.greek); }
  const k = pick(data.dict, t);
  if (k !== undefined) { if (t.dict_ro !== k) { t.dict_ro = k; nk++; } }
  else if (old[t.strong]) { if (t.dict_ro !== old[t.strong]) { t.dict_ro = old[t.strong]; nre++; } }
  else noD.push(x.num + ':' + t.w + ' ' + t.strong);
}
for (const [v, w, text] of lex.diff) {
  const ts = D.find(y => y.num === v).tokens.filter(t => t.heb && t.w === w);
  if (!ts.length) throw new Error('cuvânt lipsă ' + v + ' ' + w);
  ts.forEach(t => { if (t.diff_ro !== text) { t.diff_ro = text; ndi++; } });
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| def_ro puse', nd, '| greek_def_ro puse', ng, '| diff_ro puse', ndi, '| dict_ro noi', nk, '| dict_ro reutilizate', nre, '| forme grecești fără intrare:', [...noG].join(' ') || 'niciuna', '| fără dict_ro:', noD.join(', ') || 'niciunul');
if (WRITE) fs.writeFileSync(P + 'genesis-6.js', 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
