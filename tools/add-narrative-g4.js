// Geneza 1–2: rânduri cu text real, cuvânt cu cuvânt, din lucrările narative/paralele din Bibliotecă (Jubilee, 4 Ezdra, 2 Enoh, Cartea Dreptului, Sibiline, Sirah, Înțelepciunea lui Solomon, Odele, Barnaba, Manase, 2 Macabei, Tovit, Josephus).
// node add-narrative-g12.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const html = fs.readFileSync(P + 'library-data.js', 'utf8');
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
function take(slug, segs) {
  return segs.map(([c, a, b]) => {
    const ch = chaptersOf(slug).find(x => x.num === c); if (!ch) throw new Error('lipsă cap ' + slug + ' ' + c);
    const vs = ch.verses.filter(v => v.v >= a && v.v <= b); if (vs.length !== b - a + 1) throw new Error('lipsă unități ' + slug + ' ' + c + ':' + a + '-' + b);
    return vs.map(v => plain(v.t)).join(' ');
  }).join(' ');
}
const A = [];
const add = (ch, gv, label, slug, segs, tgt) => A.push({ ch, gv, label, slug, segs, tgt: tgt || { num: segs[0][0], v: segs[0][1] } });
const CD = 'Cartea Dreptului 1 — comparație', JUB = 'Cartea Jubileelor 4 — comparație', AM = 'Apocalipsa lui Moise', JOS = 'Josephus Flavius, Antichitățile Iudaice, Cartea I, cap. 2';
add(4, 1, JUB, 'jubileele', [[4, 1, 1]]);
add(4, 1, CD, 'cartea-dreptului', [[1, 13, 13]]);
add(4, 1, AM + ' 1 — comparație', 'apocalipsa-moise', [[1, 2, 3]]);
add(4, 2, CD, 'cartea-dreptului', [[1, 14, 14]]);
add(4, 3, CD, 'cartea-dreptului', [[1, 15, 15]]);
add(4, 5, CD, 'cartea-dreptului', [[1, 16, 16]]);
add(4, 8, JUB, 'jubileele', [[4, 2, 2]]);
add(4, 8, CD, 'cartea-dreptului', [[1, 17, 27]]);
add(4, 8, AM + ' 2–3 — comparație', 'apocalipsa-moise', [[2, 1, 4], [3, 1, 1]]);
add(4, 9, CD, 'cartea-dreptului', [[1, 28, 29]]);
add(4, 10, CD, 'cartea-dreptului', [[1, 30, 30]]);
add(4, 10, JUB, 'jubileele', [[4, 3, 3]]);
add(4, 11, CD, 'cartea-dreptului', [[1, 31, 31]]);
add(4, 12, CD, 'cartea-dreptului', [[1, 32, 32]]);
add(4, 12, JUB, 'jubileele', [[4, 4, 4]]);
add(4, 16, CD, 'cartea-dreptului', [[1, 33, 33]]);
add(4, 17, CD, 'cartea-dreptului', [[1, 34, 35]]);
add(4, 17, JUB, 'jubileele', [[4, 9, 9]]);
add(4, 18, CD, 'cartea-dreptului', [[1, 36, 36]]);
add(4, 25, JUB, 'jubileele', [[4, 7, 7]]);
add(4, 25, AM + ' 4 — comparație', 'apocalipsa-moise', [[4, 1, 2]]);
add(4, 25, 'Viața lui Adam și Eva 24 — comparație', 'viata-adam-eva', [[24, 1, 1]]);
add(4, 26, JUB, 'jubileele', [[4, 11, 12]]);

let n = 0, skipped = 0;
const f = P + 'genesis-4.js'; const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const D = w.CHAPTER_DATA;
// Josephus: capitolul se rezolvă din etichetă (fără src); unitățile vin din fișierul lazyChap
const JOS_UNITS = (() => { const book = (function f(o){ if(!o) return null; if(Array.isArray(o)){ for(const x of o){ const r=f(x); if(r) return r; } return null; } if(typeof o!=='object') return null; if(o.slug==='josephus-antichitati-cartea1' && o.available) return o; for(const k of Object.keys(o)){ const r=f(o[k]); if(r) return r; } return null; })(L); let chs = book.chapters || []; if (book.lazySrc && !chs.length) { const ww0={LIB_LAZY:{}}; new Function('window', fs.readFileSync(P+book.lazySrc,'utf8'))(ww0); chs = ww0.LIB_LAZY[book.slug].chapters; } const ch=chs.find(c=>/^Cartea I, cap\. 2 /.test(c.title)); const ww1={LIB_LAZY:{}}; new Function('window', fs.readFileSync(P+ch.lazyChap,'utf8'))(ww1); return ww1.LIB_LAZY[book.slug+'#'+ch.num]; })();
const josRows = [[8, 1], [17, 2], [25, 3]];
for (const x of D) {
  for (const a of A.filter(a => a.ch === 4 && a.gv === x.num)) {
    const text = take(a.slug, a.segs);
    if (x.commentaries.some(c => c.text && plain(c.text) === plain(text))) { skipped++; continue; }
    x.commentaries.push({ author: a.label, text, src: { slug: a.slug, spec: a.tgt } }); n++;
  }
  for (const [gv, u] of josRows) if (gv === x.num) { const text = plain(JOS_UNITS.find(v => v.v === u).t); if (!x.commentaries.some(c => plain(c.text) === text)) { x.commentaries.push({ author: JOS, text }); n++; } else skipped++; }
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'rânduri noi:', n, '| omise:', skipped);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
