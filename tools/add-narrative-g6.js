// Geneza 6: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Jubilee, Cartea Dreptului, Sirah, 2 Enoh, Josephus) + corecturi la rândurile editoriale.
// node tools/add-narrative-g5.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const ZW = /[\u2060\u200B\u200C]/g; // semnul de proprietate invizibil din textele Bibliotecii nu se copiază în capitol
const L = (() => { const s = fs.readFileSync(P + 'library-data.js', 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); })();
const plain = (t) => String(t).replace(ZW, '').replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const BOOKS = {};
function chaptersOf(slug) {
  if (BOOKS[slug]) return BOOKS[slug];
  let book = null;
  (function walk(o) { if (!o || book) return; if (Array.isArray(o)) return o.forEach(walk); if (typeof o !== 'object') return; if (o.slug === slug && !o.isHeader && o.available) { book = o; return; } Object.values(o).forEach(walk); })(L);
  if (!book) throw new Error('lipsă ' + slug);
  let ch = book.chapters || [];
  if (book.lazySrc && !ch.length) { const ww = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + book.lazySrc, 'utf8'))(ww); ch = ww.LIB_LAZY[slug].chapters; }
  return (BOOKS[slug] = ch);
}
function take(slug, segs) {
  return segs.map(([c, a, b]) => {
    const ch = chaptersOf(slug).find(x => x.num === c); if (!ch) throw new Error('lipsă cap ' + slug + ' ' + c);
    const vs = ch.verses.filter(v => v.v >= a && v.v <= b); if (vs.length !== b - a + 1) throw new Error('lipsă unități ' + slug + ' ' + c + ':' + a + '-' + b);
    return vs.map(v => plain(v.t)).join(' ');
  }).join(' ');
}
const A = [];
const add = (gv, label, slug, segs) => A.push({ gv, label, slug, segs, tgt: { num: segs[0][0], v: segs[0][1] } });
const JUB = 'Cartea Jubileelor 5 — comparație', JUB7 = 'Cartea Jubileelor 7 — comparație', CD = 'Cartea Dreptului 4 — comparație', ENOH = '1 Enoh';
// Cartea Dreptului 4:11–31 reia Geneza 6:1–22
[[1, 11], [2, 12], [3, 13], [4, 14], [5, 15], [7, 16], [8, 17], [9, 18], [10, 19], [11, 20], [12, 21], [13, 22], [14, 23], [15, 24], [16, 25], [17, 26], [18, 27], [19, 28], [20, 29], [21, 30], [22, 31]].forEach(([g, u]) => add(g, CD, 'cartea-dreptului', [[4, u, u]]));
// Cartea Jubileelor 5 și 7
add(2, JUB, 'jubileele', [[5, 1, 1]]);
add(3, JUB, 'jubileele', [[5, 8, 8]]);
add(4, JUB, 'jubileele', [[5, 6, 7]]);
add(4, JUB7, 'jubileele', [[7, 21, 22]]);
add(5, JUB7, 'jubileele', [[7, 24, 24]]);
add(7, JUB, 'jubileele', [[5, 4, 4]]);
add(7, JUB, 'jubileele', [[5, 20, 20]]);
add(8, JUB, 'jubileele', [[5, 5, 5]]);
add(9, JUB, 'jubileele', [[5, 19, 19]]);
add(11, JUB7, 'jubileele', [[7, 23, 23]]);
add(12, JUB, 'jubileele', [[5, 2, 3]]);
add(13, JUB7, 'jubileele', [[7, 25, 25]]);
add(14, JUB, 'jubileele', [[5, 21, 22]]);
// 1 Enoh (Veghetorii, uriașii, Noe avertizat), Testamente, Sirah, Înțelepciunea, Baruh
add(2, '1 Enoh 6 — comparație', '1-enoh', [[6, 1, 4]]);
add(4, '1 Enoh 7 — comparație', '1-enoh', [[7, 1, 5]]);
add(4, '1 Enoh 15 — comparație', '1-enoh', [[15, 8, 11]]);
add(13, '1 Enoh 10 — comparație', '1-enoh', [[10, 1, 3]]);
add(2, 'Testamentul lui Ruben 5 — comparație', 'testament-ruben', [[5, 6, 7]]);
add(4, 'Testamentul lui Neftali 3 — comparație', 'testament-neftali', [[3, 5, 5]]);
add(4, 'Sirah 16 — comparație', 'sirah', [[16, 7, 7]]);
add(4, 'Înțelepciunea lui Solomon 14 — comparație', 'intelepciunea-lui-solomon', [[14, 6, 6]]);
add(4, 'Baruh 3 — comparație', 'baruh', [[3, 26, 28]]);
const f = P + 'genesis-6.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
const byV = (v) => D.find(x => x.num === v);
let nNew = 0, nSkip = 0, nDel = 0, nFix = 0;

// Josephus (Antichități I, cap. 4, §2): lazy, cheia „josephus-antichitati-cartea1#4”
const josW = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + 'josephus/antichitati-01.js', 'utf8'))(josW);
const josUnit = (n, v) => plain(josW.LIB_LAZY['josephus-antichitati-cartea1#' + n].find(x => x.v === v).t);
for (const a of A) {
  const x = byV(a.gv); const text = take(a.slug, a.segs);
  if (D.some(y => y.commentaries.some(c => c.text && plain(c.text) === text))) { nSkip++; continue; }
  x.commentaries.push({ author: a.label, text, src: { slug: a.slug, spec: a.tgt } }); nNew++;
}
{ const x = byV(3), text = josUnit(4, 2);
  if (D.some(y => y.commentaries.some(c => c.text && plain(c.text) === text))) nSkip++; else { x.commentaries.push({ author: 'Josephus Flavius, Antichitățile Iudaice, Cartea I, cap. 4', text }); nNew++; } }
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
