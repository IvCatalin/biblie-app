// Geneza 9: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Jubilee, Cartea Dreptului, Sirah, 2 Enoh, Josephus) + corecturi la rândurile editoriale.
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
const JUB = 'Cartea Jubileelor 6 — comparație', JUB7 = 'Cartea Jubileelor 7 — comparație', CD = 'Cartea Dreptului 6 — comparație', ENOH = '1 Enoh';
// Cartea Jubileelor 6–7 (nu există retrăire a Genezei 9 în Cartea Dreptului: capitolul 7 trece direct la listele din Geneza 10)
add(2, JUB, 'jubileele', [[6, 5, 5]]);
add(3, JUB, 'jubileele', [[6, 6, 6]]);
add(4, JUB, 'jubileele', [[6, 7, 7]]);
add(6, JUB, 'jubileele', [[6, 8, 8]]);
add(9, JUB, 'jubileele', [[6, 10, 10]]);
add(13, JUB, 'jubileele', [[6, 15, 16]]);
add(20, JUB7, 'jubileele', [[7, 1, 5]]);
add(21, JUB7, 'jubileele', [[7, 6, 7]]);
add(22, JUB7, 'jubileele', [[7, 8, 8]]);
add(23, JUB7, 'jubileele', [[7, 9, 9]]);
add(24, JUB7, 'jubileele', [[7, 10, 10]]);
add(26, JUB7, 'jubileele', [[7, 11, 11]]);
add(27, JUB7, 'jubileele', [[7, 12, 12]]);
const f = P + 'genesis-9.js';
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
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
