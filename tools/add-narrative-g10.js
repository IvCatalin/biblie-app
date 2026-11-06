// Geneza 10: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Cartea Dreptului 7, Jubilee 8–9, Josephus I.5 și I.7).
// node tools/add-narrative-g10.js [--write]
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
const CD = 'Cartea Dreptului 7 — comparație', JUB8 = 'Cartea Jubileelor 8 — comparație', JUB9 = 'Cartea Jubileelor 9 — comparație';
add(1, CD, 'cartea-dreptului', [[7, 1, 1]]);
add(2, CD, 'cartea-dreptului', [[7, 2, 2]]);
add(3, CD, 'cartea-dreptului', [[7, 3, 3]]);
add(4, CD, 'cartea-dreptului', [[7, 6, 6]]);
add(6, CD, 'cartea-dreptului', [[7, 10, 10]]);
add(8, CD, 'cartea-dreptului', [[7, 23, 23]]);
add(9, CD, 'cartea-dreptului', [[7, 24, 24]]);
add(10, CD, 'cartea-dreptului', [[7, 25, 29]]);
add(13, CD, 'cartea-dreptului', [[7, 11, 11]]);
add(15, CD, 'cartea-dreptului', [[7, 13, 13]]);
add(20, CD, 'cartea-dreptului', [[7, 14, 14]]);
add(22, CD, 'cartea-dreptului', [[7, 15, 17]]);
add(25, CD, 'cartea-dreptului', [[7, 19, 20]]);
add(29, CD, 'cartea-dreptului', [[7, 21, 21]]);
add(31, CD, 'cartea-dreptului', [[7, 18, 18]]);
add(2, JUB9, 'jubileele', [[9, 7, 13]]);
add(5, JUB8, 'jubileele', [[8, 10, 11]]);
add(6, JUB8, 'jubileele', [[8, 22, 24]]);
add(20, JUB9, 'jubileele', [[9, 1, 1]]);
add(22, JUB9, 'jubileele', [[9, 2, 6]]);
add(24, JUB8, 'jubileele', [[8, 5, 7]]);
add(25, JUB8, 'jubileele', [[8, 8, 9]]);
add(32, JUB9, 'jubileele', [[9, 14, 15]]);
const f = P + 'genesis-10.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
const byV = (v) => D.find(x => x.num === v);
let nNew = 0, nSkip = 0;
const josW = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + 'josephus/antichitati-01.js', 'utf8'))(josW);
const josUnit = (n, v) => plain(josW.LIB_LAZY['josephus-antichitati-cartea1#' + n].find(x => x.v === v).t);
const has = (text) => D.some(y => y.commentaries.some(c => c.text && plain(c.text) === text));
for (const a of A) {
  const x = byV(a.gv); const text = take(a.slug, a.segs);
  if (has(text)) { nSkip++; continue; }
  x.commentaries.push({ author: a.label, text, src: { slug: a.slug, spec: a.tgt } }); nNew++;
}
// Josephus: I.7 §1 (Iafet), §2 (Ham), §4 (Șem); I.5 §2 (Nimrod)
for (const [gv, cap, par, lab] of [[2, 7, 1, 'cap. 7'], [6, 7, 2, 'cap. 7'], [21, 7, 4, 'cap. 7'], [8, 5, 2, 'cap. 5']]) {
  const text = josUnit(cap, par);
  if (has(text)) { nSkip++; continue; }
  byV(gv).commentaries.push({ author: 'Josephus Flavius, Antichitățile Iudaice, Cartea I, ' + lab, text }); nNew++;
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
