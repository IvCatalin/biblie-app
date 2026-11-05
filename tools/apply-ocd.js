// Adaugă rândurile din fișierul de date (verset, autor, text tradus) la commentaries[] al versetului, la sfârșit. node tools/apply-ocd.js N tools/gN-ocd-data.js [--write]
const fs = require('fs');
const N = +process.argv[2]; const data = require(require('path').resolve(process.argv[3])); const WRITE = process.argv.includes('--write');
const f = 'C:/Users/ivcatali/biblie-app/public/genesis-' + N + '.js';
const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const D = w.CHAPTER_DATA;
const plain = (t) => String(t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
let n = 0, skip = 0; const per = {};
for (const [v, author, text] of data) {
  const x = D.find(y => y.num === v); if (!x) throw new Error('verset lipsă ' + v);
  if (x.commentaries.some(c => plain(c.text) === plain(text))) { skip++; continue; }
  if (/[A-Za-z]{3,} (the|and|of|with|from) [a-z]{3,}/.test(text.replace(/<[^>]+>/g, ''))) throw new Error('reziduu englez la ' + v + ' ' + author);
  x.commentaries.push({ author, text }); n++; per[v] = (per[v] || 0) + 1;
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'rânduri noi', n, '| omise', skip, '| pe verset:', JSON.stringify(per));
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
