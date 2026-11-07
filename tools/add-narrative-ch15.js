// Geneza 15: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Jubilee 12–13, Mișna, Josephus I.8).
// node tools/add-narrative-ch15.js [--write]
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
const J = 'Cartea Jubileelor 14 — comparație';
for (const [gv, u1, u2] of [[1, 1, 1], [2, 2, 2], [4, 3, 3], [5, 4, 5], [6, 6, 6], [7, 7, 7], [8, 8, 8], [9, 9, 10], [10, 11, 11], [11, 12, 12], [12, 13, 13], [14, 14, 14], [15, 15, 15], [16, 16, 16], [17, 17, 17], [18, 18, 18]]) add(gv, J, 'jubileele', [[14, u1, u2]]);
const f = P + 'genesis-15.js';
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
// Josephus: I.11 §3 (Dumnezeu laudă virtutea lui Avram)
for (const [gv, cap, par, lab] of [[1, 11, 3, 'cap. 11']]) {
  const text = josUnit(cap, par);
  if (has(text)) { nSkip++; continue; }
  byV(gv).commentaries.push({ author: 'Josephus Flavius, Antichitățile Iudaice, Cartea I, ' + lab, text }); nNew++;
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
