// Scoate dublurile: aceeași unitate din Bibliotecă (src) apărută de mai multe ori în același capitol Geneză — se păstrează varianta cea mai lungă (la egalitate, prima). node tools/dedupe-context.js [--write]
const fs = require('fs'); const WRITE = process.argv.includes('--write'); let tot = 0;
for (let n = 1; n <= 27; n++) {
  const f = 'public/genesis-' + n + '.js'; if (!fs.existsSync(f)) continue;
  const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA; let ch = 0; const best = {};
  for (const x of D) for (const c of x.commentaries || []) if (c.src && c.src.spec) { const k = c.src.slug + '#' + c.src.spec.num + ':' + c.src.spec.v; const L = (c.text || '').length; if (!best[k] || L > best[k].L) best[k] = { L, c }; }
  for (const x of D) { const keep = []; for (const c of x.commentaries || []) { if (c.src && c.src.spec) { const k = c.src.slug + '#' + c.src.spec.num + ':' + c.src.spec.v; if (best[k].c !== c) { ch++; continue; } } keep.push(c); } x.commentaries = keep; }
  const pk = (c) => (c.author || '').split(/[(,]/)[0].trim() + '|' + (c.text || '').replace(/<[^>]+>/g, '').replace(/s+/g, ' ').trim().slice(0, 140);
  { const g = {}; for (const x of D) for (const c of x.commentaries || []) if (c.text && !/^În lucru/.test(c.text)) (g[pk(c)] = g[pk(c)] || []).push({ c, x }); for (const k in g) if (g[k].length > 1) { const arr = g[k].slice().sort((a, b) => b.c.text.length - a.c.text.length); const keep = arr[0].c; if (!keep.src) { const o = arr.find(e => e.c.src); if (o) keep.src = o.c.src; } for (const e of arr.slice(1)) { e.x.commentaries.splice(e.x.commentaries.indexOf(e.c), 1); ch++; } } }
  if (ch) { tot += ch; console.log('Geneza ' + n + ': ' + ch + ' dubluri scoase'); if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8'); }
}
console.log((WRITE ? 'SCRIS' : 'PROBĂ') + ' | ' + tot);
