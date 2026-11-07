// Adaugă manual unități din Bibliotecă la versete: node tools/add-units.js slug:cap:v>gen:verset ... [--write]. Textul = unitatea întreagă, cu src pentru „Citește pasajul”.
const fs = require('fs'); const WRITE = process.argv.includes('--write');
const ZW = /[⁠​‌]/g;
const L = (() => { const s = fs.readFileSync('public/library-data.js', 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); })();
const plain = (t) => String(t).replace(ZW, '').replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const book = (slug) => { let b = null; (function f(o) { if (!o || b) return; if (Array.isArray(o)) return o.forEach(f); if (typeof o !== 'object') return; if (o.slug === slug && !o.isHeader && o.available) { b = o; return; } Object.values(o).forEach(f); })(L); return b; };
const chapOf = (b, num) => { let ch = (b.chapters || []).find(c => c.num === num) || (b.chapters || [])[num - 1]; if (ch && ch.verses && ch.verses.length) return ch; if (ch && ch.lazyChap) { const w2 = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/' + ch.lazyChap, 'utf8'))(w2); const dd = w2.LIB_LAZY[b.slug + '#' + num]; return { num, verses: Array.isArray(dd) ? dd : (dd && dd.verses) || [] }; } if (b.lazySrc) { const w = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/' + b.lazySrc, 'utf8'))(w); const d = w.LIB_LAZY[b.slug]; ch = (d.chapters || []).find(c => c.num === num); if (ch && ch.verses && ch.verses.length) return ch; const lz = ch && ch.lazyChap; if (lz) { const w2 = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/' + lz, 'utf8'))(w2); const dd = w2.LIB_LAZY[b.slug + '#' + num]; return { num, verses: Array.isArray(dd) ? dd : dd.verses }; } } return ch; };
const LAB = { jubileele: (n) => 'Cartea Jubileelor ' + n + ' — comparație', 'cartea-dreptului': (n) => 'Cartea Dreptului ' + n + ' — comparație' };
const byCh = {};
for (const a of process.argv.slice(2).filter(a => a.includes('>'))) {
  const [l, r] = a.split('>'); const [slug, cap, v] = l.split(':'); const [gn, gv] = r.split(':').map(Number);
  const b = book(slug); if (!b) { console.log('lipsă lucrare', slug); continue; } const ch = chapOf(b, +cap); const u = ch && (ch.verses || []).find(x => String(x.v) === String(v)); if (!u) { console.log('lipsă unitate', a); continue; }
  const text = plain(u.t); const author = slug === 'eusebiu-istoria' ? 'Eusebiu din Cezareea, Istoria bisericească, Cartea I, cap. ' + cap : slug === 'documentul-damasc' ? 'Documentul de la Damasc ' + cap + ':' + v : LAB[slug] ? LAB[slug](+cap) : (b.name_ro || b.name).replace(/\s*\(.*$/, '') + ' ' + cap + ':' + v;
  (byCh[gn] = byCh[gn] || []).push({ gv, row: { author, text, src: { slug, spec: { num: +cap, v: u.v } } } });
}
let n = 0;
for (const gn in byCh) { const f = 'public/genesis-' + gn + '.js'; const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
  for (const a of byCh[gn]) { const x = D.find(q => q.num === a.gv); if (!x) { console.log('lipsă verset', gn, a.gv); continue; } if (D.some(y => y.commentaries.some(c => c.text && plain(c.text) === a.row.text))) { console.log('există deja', a.row.author); continue; } x.commentaries.push(a.row); n++; console.log('+ ' + gn + ':' + a.gv + ' ' + a.row.author); }
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8'); }
console.log((WRITE ? 'SCRIS' : 'PROBĂ') + ' | ' + n);
