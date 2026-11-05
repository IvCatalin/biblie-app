// Geneza 3: adaugă rândurile cu text real, cuvânt cu cuvânt, din lucrările Bibliotecii (Diverse): apocrife, pseudepigrafe, Kabbala, Soferim.
// node add-diverse-g3.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const html = fs.readFileSync(P + 'biblie-demo.html', 'utf8');
const i0 = html.indexOf('const LIBRARY = ') + 16;
const L = JSON.parse(html.slice(i0, html.indexOf('\n', i0)).trim().replace(/;$/, ''));
const plain = (t) => String(t).replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const BOOKS = {};
function chaptersOf(slug) {
  if (BOOKS[slug]) return BOOKS[slug];
  let book = null;
  (function walk(o) { if (!o || book) return; if (Array.isArray(o)) return o.forEach(walk); if (o.slug === slug && !o.isHeader && o.available) { book = o; return; } Object.values(o).forEach(x => typeof x === 'object' && walk(x)); })(L);
  if (!book) throw new Error('lipsă ' + slug);
  let ch = book.chapters || [];
  if (book.lazySrc && !ch.length) { const ww = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + book.lazySrc, 'utf8'))(ww); ch = ww.LIB_LAZY[slug].chapters; }
  return (BOOKS[slug] = ch);
}
// segmente: [capitol, de la, până la]; unitățile din același capitol se lipesc cu spațiu (apocalipsele sunt fragmentate la mijloc de frază), paragrafele Zohar cu <br><br>
function take(slug, segs, sep) {
  const parts = [];
  for (const [c, a, b] of segs) {
    const ch = chaptersOf(slug).find(x => x.num === c); if (!ch) throw new Error('lipsă cap ' + slug + ' ' + c);
    const vs = ch.verses.filter(v => v.v >= a && v.v <= b); if (vs.length !== b - a + 1) throw new Error('lipsă unități ' + slug + ' ' + c + ':' + a + '-' + b + ' (' + vs.length + ')');
    parts.push(vs.map(v => plain(v.t)).join(sep));
  }
  return parts.join(sep === ' ' ? ' ' : sep);
}
const SP = ' ', PB = '<br><br>';
// [verset Geneza 3, eticheta, slug, [[cap,de la,până la]], separator, ținta butonului {num, v}]
const A = [];
const add = (gv, label, slug, segs, sep, tgt) => A.push({ gv, label, slug, segs, sep: sep || SP, tgt: tgt || { num: segs[0][0], v: segs[0][1] } });
const AM = 'Apocalipsa lui Moise', VA = 'Viața lui Adam și Eva', CD = 'Cartea Dreptului';
// Kabbala și Soferim (evrei, primele)
add(5, 'Tratatul Soferim, cap. 4', 'talmud-minor-soferim', [[4, 4, 4]], PB);
add(1, 'Sefer HaBahir, par. 200', 'kab-sefer-habahir', [[1, 200, 200]], PB);
add(24, 'Sefer HaBahir, par. 99', 'kab-sefer-habahir', [[1, 99, 99]], PB);
add(1, 'Zohar Chadash, Bereșit 783–784', 'kab-zo-zohar-chadash', [[1, 783, 784]], PB);
add(6, 'Zohar Chadash, Bereșit 786', 'kab-zo-zohar-chadash', [[1, 786, 786]], PB);
add(7, 'Zohar Chadash, Bereșit 787', 'kab-zo-zohar-chadash', [[1, 787, 787]], PB);
add(8, 'Zohar Chadash, Bereșit 788', 'kab-zo-zohar-chadash', [[1, 788, 788]], PB);
// apocrife și pseudepigrafe
add(1, AM + ' 16–17 — comparație', 'apocalipsa-moise', [[16, 1, 6], [17, 1, 4]], SP);
add(2, AM + ' 17 — comparație', 'apocalipsa-moise', [[17, 3, 5]], SP);
add(4, AM + ' 18 — comparație', 'apocalipsa-moise', [[18, 1, 3]], SP);
add(5, AM + ' 18 — comparație', 'apocalipsa-moise', [[18, 4, 6]], SP);
add(6, AM + ' 19 — comparație', 'apocalipsa-moise', [[19, 1, 3]], SP);
add(7, AM + ' 20 — comparație', 'apocalipsa-moise', [[20, 1, 5]], SP);
add(8, AM + ' 22 — comparație', 'apocalipsa-moise', [[22, 1, 4]], SP);
add(9, AM + ' 23 — comparație', 'apocalipsa-moise', [[23, 1, 1]], SP);
add(10, AM + ' 23 — comparație', 'apocalipsa-moise', [[23, 2, 2]], SP);
add(11, AM + ' 23 — comparație', 'apocalipsa-moise', [[23, 3, 3]], SP);
add(12, AM + ' 21 — comparație', 'apocalipsa-moise', [[21, 1, 6]], SP);
add(13, AM + ' 23 — comparație', 'apocalipsa-moise', [[23, 4, 4]], SP);
add(14, AM + ' 26 — comparație', 'apocalipsa-moise', [[26, 1, 3]], SP);
add(15, AM + ' 26 — comparație', 'apocalipsa-moise', [[26, 4, 4]], SP);
add(16, AM + ' 25 — comparație', 'apocalipsa-moise', [[25, 1, 4]], SP);
add(17, AM + ' 24 — comparație', 'apocalipsa-moise', [[24, 1, 1]], SP);
add(18, AM + ' 24 — comparație', 'apocalipsa-moise', [[24, 2, 2]], SP);
add(19, AM + ' 24 — comparație', 'apocalipsa-moise', [[24, 3, 4]], SP);
add(1, VA + ' 16 — comparație', 'viata-adam-eva', [[16, 1, 4]], SP);
add(6, VA + ' 33 — comparație', 'viata-adam-eva', [[33, 1, 3]], SP);
add(13, VA + ' 37 — comparație', 'viata-adam-eva', [[37, 3, 3], [38, 1, 2]], SP);
add(16, VA + ' 35 — comparație', 'viata-adam-eva', [[35, 2, 3]], SP);
add(17, VA + ' 26 — comparație', 'viata-adam-eva', [[26, 2, 2]], SP);
add(24, CD + ' 1 — comparație', 'cartea-dreptului', [[1, 12, 12]], SP);
add(6, CD + ' 1 — comparație', 'cartea-dreptului', [[1, 9, 10]], SP);
add(1, '2 Enoh 31 — comparație', '2-enoh', [[31, 3, 5]], SP);
add(6, '1 Enoh 32 — comparație', '1-enoh', [[32, 6, 6]], SP);
add(1, '3 Baruh 9 — comparație', '3-baruh', [[9, 7, 7]], SP);
add(13, '2 Baruh 48 — comparație', '2-baruh', [[48, 42, 42]], SP);
add(6, 'Apocalipsa lui Avraam 23 — comparație', 'apocalipsa-avraam', [[23, 1, 11]], SP);
add(1, 'Înțelepciunea lui Solomon 2 — comparație', 'intelepciunea-lui-solomon', [[2, 23, 24]], SP);
add(6, 'Înțelepciunea lui Isus Sirah 25 — comparație', 'sirah', [[25, 24, 24]], SP);
add(6, 'Oracolele Sibiline 1 — comparație', 'oracolele-sibiline', [[1, 7, 7]], SP);
add(7, 'Oracolele Sibiline 1 — comparație', 'oracolele-sibiline', [[1, 8, 8]], SP);
add(24, 'Cartea Jubileelor 3 — comparație', 'jubileele', [[3, 32, 32]], SP);

const f = P + 'genesis-3.js';
const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const D = w.CHAPTER_DATA;
let n = 0, skipped = 0; const JEW = /^(Talmud|Zohar|Tratatul Soferim|Sefer HaBahir)/;
for (const x of D) {
  const mine = A.filter(a => a.gv === x.num); if (!mine.length) continue;
  const jew = [], other = [];
  for (const a of mine) {
    const text = take(a.slug, a.segs, a.sep);
    if (x.commentaries.some(c => c.text && plain(c.text) === plain(text))) { skipped++; continue; }
    const row = { author: a.label, text, src: { slug: a.slug, spec: a.tgt } };
    (JEW.test(a.label) ? jew : other).push(row); n++;
  }
  let at = -1; x.commentaries.forEach((c, i) => { if (JEW.test(c.author || '')) at = i; });
  if (at < 0) { let lastTan = -1; x.commentaries.forEach((c, i) => { if (/^(Rashi|Targum|Ibn Ezra|Ramban|Sforno|Rashbam|Da'at|Radak|Chizkuni|Bekhor|Or HaChaim)/.test(c.author || '')) lastTan = i; }); at = lastTan; }
  x.commentaries.splice(at + 1, 0, ...jew);
  x.commentaries.push(...other);
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'rânduri noi:', n, '| omise (deja existente):', skipped);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
