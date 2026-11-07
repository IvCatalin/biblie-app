// Caută în TOATE lucrările disponibile din Bibliotecă (în afara celor tratate) unitățile care se potrivesc cu versete din Geneza 1..N, după suprapunerea de cuvinte cu textul Rosen. node tools/scan-diverse.js [N=26] [--min=18] [--out=data/scan-context.json]
const fs = require('fs');
const N = +(process.argv.find(a => /^\d+$/.test(a)) || 26), MIN = +((process.argv.find(a => a.startsWith('--min=')) || '--min=18').split('=')[1]);
const ZW = /[⁠​‌]/g;
const L = (() => { const s = fs.readFileSync('public/library-data.js', 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); })();
const plain = (t) => String(t).replace(ZW, '').replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const SKIP = /^(talmud-|mishna-|kab-|tanakh-|tora-rosen|haftarot|sp-|vt-info|nt-info|tg:)/;
const works = [];
for (const k of ['deuterocanonic', 'pseudepigraf', 'apocrifeNT', 'patristice']) (function w(o) { if (!o) return; if (Array.isArray(o)) return o.forEach(w); if (typeof o !== 'object') return; if (o.slug && !o.isHeader) { if (o.available && !SKIP.test(o.slug)) works.push(o); return; } for (const kk of ['subfolders', 'items', 'books']) if (o[kk]) w(o[kk]); })(L[k]);
function chapters(b) {
  let ch = b.chapters || [];
  if (b.lazySrc && !ch.length) { const w = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/' + b.lazySrc, 'utf8'))(w); ch = (w.LIB_LAZY[b.slug] || {}).chapters || []; }
  return ch.map(c => { if (c.verses && c.verses.length) return c; if (c.lazyChap) { const w2 = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/' + c.lazyChap, 'utf8'))(w2); const d = w2.LIB_LAZY[b.slug + '#' + c.num]; return { num: c.num, verses: Array.isArray(d) ? d : (d && d.verses) || [] }; } return { num: c.num, verses: [] }; });
}
const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const stems = (s) => [...new Set((strip(s).match(/[a-z0-9]{4,}/g) || []).map(w => w.slice(0, 5)))];
const V = []; const df = {};
for (let n = 1; n <= N; n++) { const D = new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA; for (const x of D) { const st = new Set(stems(x.tokens.map(t => t.t).join(''))); st.forEach(w => df[w] = (df[w] || 0) + 1); V.push({ n, v: x.num, st }); } }
const idf = (w) => Math.log(V.length / (1 + (df[w] || 0)));
const res = []; const sum = {};
for (const b of works) for (const c of chapters(b)) for (const u of c.verses || []) {
  const t = plain(u.t); if (t.length < 60) continue; const st = stems(t); let best = null, bs = 0, second = 0, sh = 0;
  for (const g of V) { let s = 0, k = 0; for (const w of st) if (g.st.has(w)) { s += idf(w); k++; } if (s > bs) { second = bs; bs = s; best = g; sh = k; } else if (s > second) second = s; }
  if (best && bs >= MIN && sh >= 5 && bs >= second * 1.25) { res.push({ slug: b.slug, name: b.name_ro || b.name, cap: c.num, v: u.v, gn: best.n, gv: best.v, score: +bs.toFixed(1), len: t.length, head: t.slice(0, 90) }); sum[b.slug] = (sum[b.slug] || 0) + 1; }
}
const out = (process.argv.find(a => a.startsWith('--out=')) || '--out=data/scan-context.json').split('=')[1];
fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log('lucrări scanate:', works.length, '| potriviri:', res.length);
console.log(Object.entries(sum).sort((a, b) => b[1] - a[1]).map(e => e[0] + ' ' + e[1]).join(' | '));
