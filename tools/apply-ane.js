// Adaugă rândurile „Context cultural-istoric” din tools/ane-context-data.js. node tools/apply-ane.js [--write]
const fs = require('fs'); const WRITE = process.argv.includes('--write'); const rows = require('./ane-context-data.js'); let n = 0;
const by = {}; rows.forEach(r => (by[r[0]] = by[r[0]] || []).push(r));
for (const g in by) { const f = 'public/genesis-' + g + '.js'; const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
  for (const [, v, text] of by[g]) { const x = D.find(q => q.num === v); if (!x) { console.log('lipsă verset', g, v); continue; } if (x.commentaries.some(c => c.text === text)) continue; x.commentaries.push({ author: 'Context cultural-istoric (Orientul Apropiat Antic)', text }); n++; }
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8'); }
console.log((WRITE ? 'SCRIS' : 'PROBĂ') + ' | rânduri noi ' + n);
