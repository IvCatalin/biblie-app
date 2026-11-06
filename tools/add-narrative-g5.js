// Geneza 5: rânduri cu text real, cuvânt cu cuvânt, din lucrările din Bibliotecă (Jubilee, Cartea Dreptului, Sirah, 2 Enoh, Sifra di-Țeniuta, Josephus) + corecturi la rândurile editoriale.
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
const JUB = 'Cartea Jubileelor 4 — comparație';
// Cartea Jubileelor 4
add(5, JUB, 'jubileele', [[4, 29, 30]]);
add(9, JUB, 'jubileele', [[4, 13, 13]]);
add(12, JUB, 'jubileele', [[4, 14, 14]]);
add(15, JUB, 'jubileele', [[4, 15, 15]]);
add(18, JUB, 'jubileele', [[4, 16, 19]]);
add(21, JUB, 'jubileele', [[4, 20, 20]]);
add(22, JUB, 'jubileele', [[4, 21, 22]]);
add(24, JUB, 'jubileele', [[4, 23, 25]]);
add(25, JUB, 'jubileele', [[4, 27, 27]]);
add(29, JUB, 'jubileele', [[4, 28, 28]]);
// Cartea Dreptului
add(5, 'Cartea Dreptului 3 — comparație', 'cartea-dreptului', [[3, 14, 16]]);
add(15, 'Cartea Dreptului 2 — comparație', 'cartea-dreptului', [[2, 37, 37]]);
add(22, 'Cartea Dreptului 3 — comparație', 'cartea-dreptului', [[3, 1, 2]]);
for (const [gv, u] of [[23, 1], [24, 2], [25, 3], [26, 4], [27, 5], [28, 6], [29, 7], [30, 8], [31, 9], [32, 10]]) add(gv, 'Cartea Dreptului 4 — comparație', 'cartea-dreptului', [[4, u, u]]);
// Sirah, 2 Enoh
add(24, 'Sirah 44 — comparație', 'sirah', [[44, 16, 16]]);
add(24, 'Sirah 49 — comparație', 'sirah', [[49, 15, 15]]);
add(21, '2 Enoh 1 — comparație', '2-enoh', [[1, 2, 2]]);
add(24, '2 Enoh 67 — comparație', '2-enoh', [[67, 1, 2]]);
// Zohar, Sifra di-Țeniuta (citează explicit Geneza 5:29)
add(29, 'Zohar, Sifra di-Țeniuta 2:5', 'kab-zo-sifra-ditzniuta', [[2, 5, 5]]);

const f = P + 'genesis-5.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
const byV = (v) => D.find(x => x.num === v);
let nNew = 0, nSkip = 0, nDel = 0, nFix = 0;

// Josephus (Antichități I): lazy, cheia „josephus-antichitati-cartea1#N”; textele se iau din fișier
const josW = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + 'josephus/antichitati-01.js', 'utf8'))(josW);
const josUnit = (n, v) => plain(josW.LIB_LAZY['josephus-antichitati-cartea1#' + n].find(x => x.v === v).t);
const JOS3 = 'Josephus Flavius, Antichitățile Iudaice, Cartea I, cap. 3';

for (const a of A) {
  const x = byV(a.gv); const text = take(a.slug, a.segs);
  if (D.some(y => y.commentaries.some(c => c.text && plain(c.text) === text))) { nSkip++; continue; }
  x.commentaries.push({ author: a.label, text, src: { slug: a.slug, spec: a.tgt } }); nNew++;
}
{ const x = byV(3), text = josUnit(4, 4);
  if (D.some(y => y.commentaries.some(c => c.text && plain(c.text) === text))) nSkip++; else { x.commentaries.push({ author: JOS3, text }); nNew++; } }

// --- corecturi la rândurile existente ---
// 1) Lista Regilor Sumerieni: Alulim domnește 28.800 de ani (Prisma Weld-Blundell)
{ const c = byV(1).commentaries.find(c => /Context cultural/.test(c.author)); if (c && c.text.includes('28.000 de ani')) { c.text = c.text.replace('28.000 de ani', '28.800 de ani'); nFix++; } }
// 2) Bereshit Rabbah nu e în Bibliotecă: rezumatul scris de noi se scoate
{ const c = byV(24).commentaries.find(c => /Bereshit Rabbah/.test(c.author)); if (c && !/În lucru/.test(c.text)) { c.text = 'În lucru: traducerea acestui comentariu urmează.'; nFix++; } }
// 3) rândurile despre cronologia samariteană: text neutru, cu cifrele verificate din textul samaritean al versetelor (62+785=847; 67+653=720; 53+600=653) și anii calculați
const SP = { 20: 'Pentateuhul Samaritean are la Iared 62 de ani la nașterea lui Enoh și 785 de ani după aceea, în total 847, față de 162 + 800 = 962 în textul masoretic. Cu cifrele samaritene, Iared moare în anul 1307 de la creație, chiar anul potopului.',
  27: 'Pentateuhul Samaritean are la Matusalem 67 de ani la nașterea lui Lameh și 653 de ani după aceea, în total 720, față de 187 + 782 = 969 în textul masoretic și în Septuaginta. Cu cifrele samaritene, Matusalem moare în anul 1307 de la creație, chiar anul potopului.',
  31: 'Pentateuhul Samaritean are la Lameh 53 de ani la nașterea lui Noe și 600 de ani după aceea, în total 653, față de 182 + 595 = 777 în textul masoretic. Cu cifrele samaritene, Lameh moare în anul 1307, chiar anul potopului; după cele masoretice, moare în anul 1651, cu cinci ani înainte de potop (1656).' };
for (const [v, t] of Object.entries(SP)) { const c = byV(+v).commentaries.find(c => /Descoperire din verificarea/.test(c.author) || c.author === 'Pentateuhul Samaritean — cronologie'); if (c) { c.author = 'Pentateuhul Samaritean — cronologie'; c.text = t; nFix++; } }
// 4) note editoriale greșite sau redundante cu panoul lexical: se scot; „Notă structurală” la v2, v4, v8 rămân (verificate); v23 se rescrie
const KEEP = new Set(['2|Notă structurală', '4|Notă structurală', '8|Notă structurală']);
for (const x of D) {
  const before = x.commentaries.length;
  x.commentaries = x.commentaries.filter(c => !(/^Notă (structurală|lingvistică)$/.test(c.author) && !KEEP.has(x.num + '|' + c.author) && !(x.num === 23)));
  nDel += before - x.commentaries.length;
}
{ const c = byV(23).commentaries.find(c => c.author === 'Notă structurală'); if (c) { c.text = '365 de ani, numărul zilelor unui an solar, e cea mai scurtă viață din capitol; Enoh nu moare: „l-a luat Dumnezeu” (5:24).'; nFix++; } }

console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| rânduri noi:', nNew, '| omise (existau):', nSkip, '| note scoase:', nDel, '| rânduri corectate:', nFix);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
