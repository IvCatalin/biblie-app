// Geneza 1–2: rânduri cu text real, cuvânt cu cuvânt, din lucrările narative/paralele din Bibliotecă (Jubilee, 4 Ezdra, 2 Enoh, Cartea Dreptului, Sibiline, Sirah, Înțelepciunea lui Solomon, Odele, Barnaba, Manase, 2 Macabei, Tovit, Josephus).
// node add-narrative-g12.js [--write]
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
function take(slug, segs) {
  return segs.map(([c, a, b]) => {
    const ch = chaptersOf(slug).find(x => x.num === c); if (!ch) throw new Error('lipsă cap ' + slug + ' ' + c);
    const vs = ch.verses.filter(v => v.v >= a && v.v <= b); if (vs.length !== b - a + 1) throw new Error('lipsă unități ' + slug + ' ' + c + ':' + a + '-' + b);
    return vs.map(v => plain(v.t)).join(' ');
  }).join(' ');
}
const A = [];
const add = (ch, gv, label, slug, segs, tgt) => A.push({ ch, gv, label, slug, segs, tgt: tgt || { num: segs[0][0], v: segs[0][1] } });
const E4 = '4 Ezdra 6 — comparație', E2 = '2 Enoh', CD = 'Cartea Dreptului 1 — comparație', SB = 'Oracolele Sibiline 1 — comparație', SI = 'Înțelepciunea lui Isus Sirah 17 — comparație', WS = 'Înțelepciunea lui Solomon', OD = 'Odele lui Solomon 16 — comparație';
// ---- Geneza 1
add(1, 1, '2 Macabei 7 — comparație', '2-macabei', [[7, 28, 28]]);
add(1, 1, E4, '4-ezdra', [[6, 38, 38]]);
add(1, 1, SB, 'oracolele-sibiline', [[1, 2, 3]]);
add(1, 1, 'Rugăciunea lui Manase 1 — comparație', 'rugaciunea-manase', [[1, 2, 3]]);
add(1, 1, E2 + ' 24 — comparație', '2-enoh', [[24, 2, 5]]);
add(1, 2, E4, '4-ezdra', [[6, 39, 39]]);
add(1, 3, E4, '4-ezdra', [[6, 40, 40]]);
add(1, 3, E2 + ' 25 — comparație', '2-enoh', [[25, 1, 5]]);
add(1, 5, E2 + ' 27 — comparație', '2-enoh', [[27, 1, 2]]);
add(1, 7, E4, '4-ezdra', [[6, 41, 41]]);
add(1, 9, E4, '4-ezdra', [[6, 42, 42]]);
add(1, 10, E2 + ' 28 — comparație', '2-enoh', [[28, 1, 4]]);
add(1, 11, E4, '4-ezdra', [[6, 43, 44]]);
add(1, 14, E4, '4-ezdra', [[6, 45, 46]]);
add(1, 16, E2 + ' 30 — comparație', '2-enoh', [[30, 3, 6]]);
add(1, 16, OD, 'odele-solomon', [[16, 12, 12]]);
add(1, 20, E4, '4-ezdra', [[6, 47, 48]]);
add(1, 20, SB, 'oracolele-sibiline', [[1, 4, 4]]);
add(1, 21, E2 + ' 30 — comparație', '2-enoh', [[30, 7, 8]]);
add(1, 24, E4, '4-ezdra', [[6, 53, 53]]);
add(1, 26, CD, 'cartea-dreptului', [[1, 1, 1]]);
add(1, 26, 'Epistola lui Barnaba 6 — comparație', 'barnaba', [[6, 12, 12]]);
add(1, 26, WS + ' 9 — comparație', 'intelepciunea-lui-solomon', [[9, 1, 3]]);
add(1, 26, E4, '4-ezdra', [[6, 54, 54]]);
add(1, 26, OD, 'odele-solomon', [[16, 13, 13]]);
add(1, 26, E2 + ' 30 — comparație', '2-enoh', [[30, 9, 11]]);
add(1, 27, SI, 'sirah', [[17, 1, 3]]);
add(1, 27, WS + ' 2 — comparație', 'intelepciunea-lui-solomon', [[2, 23, 23]]);
add(1, 28, CD, 'cartea-dreptului', [[1, 6, 6]]);
add(1, 28, SI, 'sirah', [[17, 4, 4]]);
// ---- Geneza 2
add(2, 2, 'Cartea Jubileelor 2 — comparație', 'jubileele', [[2, 25, 25]]);
add(2, 3, 'Cartea Jubileelor 2 — comparație', 'jubileele', [[2, 17, 18]]);
add(2, 7, CD, 'cartea-dreptului', [[1, 2, 2]]);
add(2, 7, SI, 'sirah', [[17, 1, 1]]);
add(2, 7, E2 + ' 30 — comparație', '2-enoh', [[30, 12, 13]]);
add(2, 8, E2 + ' 30 — comparație', '2-enoh', [[30, 1, 1]]);
add(2, 15, 'Cartea Jubileelor 3 — comparație', 'jubileele', [[3, 9, 9]]);
add(2, 17, E2 + ' 30 — comparație', '2-enoh', [[30, 14, 15]]);
add(2, 18, CD, 'cartea-dreptului', [[1, 3, 3]]);
add(2, 18, 'Tovit 8 — comparație', 'tovit', [[8, 6, 6]]);
add(2, 18, SB, 'oracolele-sibiline', [[1, 5, 5]]);
add(2, 19, 'Cartea Jubileelor 3 — comparație', 'jubileele', [[3, 1, 2]]);
add(2, 21, CD, 'cartea-dreptului', [[1, 4, 4]]);
add(2, 21, E2 + ' 30 — comparație', '2-enoh', [[30, 16, 16]]);
add(2, 22, SB, 'oracolele-sibiline', [[1, 6, 6]]);
add(2, 23, CD, 'cartea-dreptului', [[1, 5, 5]]);
add(2, 24, 'Cartea Jubileelor 3 — comparație', 'jubileele', [[3, 7, 7]]);

let n = 0, skipped = 0, removed = 0;
for (const N of [1, 2]) {
  const f = P + 'genesis-' + N + '.js'; const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const D = w.CHAPTER_DATA;
  for (const x of D) {
    if (N === 1 && x.num === 28) { // același text Jubilee ca la 1:26: se scoate dublura
      const before = x.commentaries.length; const j26 = D.find(y => y.num === 26).commentaries.find(c => /^Cartea Jubileelor/.test(c.author));
      x.commentaries = x.commentaries.filter(c => !(/^Cartea Jubileelor/.test(c.author) && j26 && plain(c.text) === plain(j26.text))); removed += before - x.commentaries.length;
    }
    for (const a of A.filter(a => a.ch === N && a.gv === x.num)) {
      const text = take(a.slug, a.segs);
      if (x.commentaries.some(c => c.text && plain(c.text) === plain(text))) { skipped++; continue; }
      x.commentaries.push({ author: a.label, text, src: { slug: a.slug, spec: a.tgt } }); n++;
    }
  }
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'rânduri noi:', n, '| omise:', skipped, '| dubluri scoase:', removed);
