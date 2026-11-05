// Aplică greek_def_ro (din fișierul de date, pe forma grecească) și diff_ro (listă [verset, cuvânt, text]) peste capitolul N. node tools/apply-lex.js N tools/gN-lex-data.js [--write]
const fs = require('fs');
const N = +process.argv[2]; const data = require(require('path').resolve(process.argv[3])); const WRITE = process.argv.includes('--write');
const f = 'C:/Users/ivcatali/biblie-app/public/genesis-' + N + '.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
const defs = process.argv.find(a => /--def=/.test(a)) ? require(require('path').resolve(process.argv.find(a => /--def=/.test(a)).slice(6))) : {};
let g = 0, d = 0, df = 0; const miss = new Set();
for (const x of D) for (const t of x.tokens.filter(t => t.heb)) {
  if (defs[t.strong] && (!t.def_ro || t.def_ro.length <= 12)) { t.def_ro = defs[t.strong]; df++; }
  if (!t.greek_def_ro) { if (data.greek[t.greek]) { t.greek_def_ro = data.greek[t.greek]; g++; } else miss.add(t.greek); }
}
for (const [v, w, text] of (data.diff || [])) {
  const x = D.find(y => y.num === v); const ts = x.tokens.filter(t => t.heb && t.w === w);
  if (!ts.length) throw new Error('cuvânt lipsă ' + v + ' ' + w);
  ts.forEach(t => { t.diff_ro = text; d++; });
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'def_ro puse', df, '| greek_def_ro puse', g, '| diff_ro puse', d, '| forme grecești fără intrare:', [...miss].join(' ') || 'niciuna');
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
