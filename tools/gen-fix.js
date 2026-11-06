// Aplică corecturile de etichete ale capitolului N din tools/gN-fix.js (module.exports = [[verset, {w, heb?}, patch], ...]).  node tools/gen-fix.js N [--write]
// patch: obiect cu câmpuri de pus; valoarea null șterge câmpul. Potrivirea e după cuvânt (w) și, opțional, după ebraică (heb).
const fs = require('fs');
const N = +process.argv[2], WRITE = process.argv.includes('--write');
const OPS = require('./g' + N + '-fix.js');
const f = 'public/genesis-' + N + '.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
let n = 0, miss = 0;
for (const [v, m, patch] of OPS) {
  const x = D.find(q => q.num === v); if (!x) { console.log('VERSET LIPSĂ', v); miss++; continue; }
  const hit = x.tokens.filter(t => t.heb && (m.w === undefined || t.w === m.w) && (m.heb === undefined || t.heb === m.heb) && (m.greek === undefined || t.greek === m.greek));
  if (!hit.length) { console.log('NU GĂSESC', v, JSON.stringify(m)); miss++; continue; }
  for (const t of hit) { if (patch === 'dezeticheteaza') { for (const k of Object.keys(t)) if (k !== 't') delete t[k]; } else for (const [k, val] of Object.entries(patch)) { if (val === null) delete t[k]; else t[k] = val; } n++; }
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| etichete corectate:', n, '| neîntâlnite:', miss);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
