// Geneza 12: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Jubilee 12–13, Mișna, Josephus I.8).
// node tools/add-narrative-ch12.js [--write]
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
const JUB12 = 'Cartea Jubileelor 12 — comparație', JUB13 = 'Cartea Jubileelor 13 — comparație';
add(4, JUB12, 'jubileele', [[12, 28, 29]]);
add(5, JUB13, 'jubileele', [[13, 1, 1]]);
add(6, JUB13, 'jubileele', [[13, 2, 2]]);
add(6, 'Mișna, Sotah 7:5', 'mishna-sotah', [[7, 5, 5]]);
add(7, JUB13, 'jubileele', [[13, 3, 4]]);
add(8, JUB13, 'jubileele', [[13, 5, 9]]);
add(9, JUB13, 'jubileele', [[13, 10, 10]]);
add(10, JUB13, 'jubileele', [[13, 11, 12]]);
add(16, JUB13, 'jubileele', [[13, 14, 14]]);
add(17, JUB13, 'jubileele', [[13, 13, 13]]);
add(20, JUB13, 'jubileele', [[13, 15, 15]]);
const f = P + 'genesis-12.js';
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
// Josephus: I.8 §1 (Avram părăsește Caldeea la 75 de ani)
for (const [gv, cap, par, lab] of [[4, 8, 1, 'cap. 8']]) {
  const text = josUnit(cap, par);
  if (has(text)) { nSkip++; continue; }
  byV(gv).commentaries.push({ author: 'Josephus Flavius, Antichitățile Iudaice, Cartea I, ' + lab, text }); nNew++;
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
