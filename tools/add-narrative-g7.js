// Geneza 7: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Jubilee, Cartea Dreptului, Sirah, 2 Enoh, Josephus) + corecturi la rândurile editoriale.
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
const JUB = 'Cartea Jubileelor 5 — comparație', JUB7 = 'Cartea Jubileelor 7 — comparație', CD = 'Cartea Dreptului 5 — comparație', ENOH = '1 Enoh';
// Cartea Dreptului 5:1–24 reia Geneza 7:1–24
for (let g = 1; g <= 24; g++) add(g, CD, 'cartea-dreptului', [[5, g, g]]);
// Cartea Jubileelor 5
add(11, JUB, 'jubileele', [[5, 22, 24]]);
add(12, JUB, 'jubileele', [[5, 25, 25]]);
add(20, JUB, 'jubileele', [[5, 26, 26]]);
add(24, JUB, 'jubileele', [[5, 27, 27]]);
const f = P + 'genesis-7.js';
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
{ const x = byV(11), text = josUnit(4, 3);
  if (D.some(y => y.commentaries.some(c => c.text && plain(c.text) === text))) nSkip++; else { x.commentaries.push({ author: 'Josephus Flavius, Antichitățile Iudaice, Cartea I, cap. 4', text }); nNew++; } }
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
