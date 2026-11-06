// Geneza 11: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Cartea Dreptului 7, Jubilee 10–12, Mișna, Zoharul Nou, Josephus I.5–I.7).
// node tools/add-narrative-g11.js [--write]
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
const CD = 'Cartea Dreptului 7 — comparație', JUB10 = 'Cartea Jubileelor 10 — comparație', JUB11 = 'Cartea Jubileelor 11 — comparație', JUB12 = 'Cartea Jubileelor 12 — comparație';
add(1, CD, 'cartea-dreptului', [[7, 41, 41]]);
add(2, CD, 'cartea-dreptului', [[7, 38, 38]]);
add(3, JUB10, 'jubileele', [[10, 20, 20]]);
add(4, JUB10, 'jubileele', [[10, 19, 19]]);
add(4, 'Zoharul Nou, Zohar Hadash 13:48', 'kab-zo-zohar-chadash', [[13, 48, 48]]);
add(5, JUB10, 'jubileele', [[10, 23, 23]]);
add(6, JUB10, 'jubileele', [[10, 22, 22]]);
add(8, JUB10, 'jubileele', [[10, 24, 24]]);
add(8, 'Mișna, Sanhedrin 10:3', 'mishna-sanhedrin', [[10, 3, 3]]);
add(9, JUB10, 'jubileele', [[10, 25, 26]]);
add(9, CD, 'cartea-dreptului', [[7, 28, 28]]);
add(18, JUB10, 'jubileele', [[10, 18, 18]]);
add(20, JUB11, 'jubileele', [[11, 6, 6]]);
add(22, JUB11, 'jubileele', [[11, 8, 8]]);
add(24, JUB11, 'jubileele', [[11, 10, 12]]);
add(26, JUB11, 'jubileele', [[11, 14, 15]]);
add(26, CD, 'cartea-dreptului', [[7, 45, 46]]);
add(28, JUB11, 'jubileele', [[11, 3, 3]]);
add(28, JUB12, 'jubileele', [[12, 12, 14]]);
add(29, JUB12, 'jubileele', [[12, 9, 11]]);
add(31, JUB12, 'jubileele', [[12, 15, 15]]);
const f = P + 'genesis-11.js';
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
// Josephus: I.5 §1 (coborârea în câmpie), §3 (turnul), I.6 §1 (risipirea), I.7 §5 (genealogia lui Șem până la Avraam)
for (const [gv, cap, par, lab] of [[2, 5, 1, 'cap. 5'], [4, 5, 3, 'cap. 5'], [8, 6, 1, 'cap. 6'], [10, 7, 5, 'cap. 7']]) {
  const text = josUnit(cap, par);
  if (has(text)) { nSkip++; continue; }
  byV(gv).commentaries.push({ author: 'Josephus Flavius, Antichitățile Iudaice, Cartea I, ' + lab, text }); nNew++;
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
