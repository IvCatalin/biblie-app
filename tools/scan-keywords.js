// Numără, pe lucrare, unitățile care pomenesc personaje/evenimente din Geneza 1–26 (cuvinte-cheie), ca să se vadă unde merită căutat. node tools/scan-keywords.js [--show=slug]
const fs = require('fs');
const ZW = /[⁠​‌]/g;
const L = (() => { const s = fs.readFileSync('public/library-data.js', 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); })();
const plain = (t) => String(t).replace(ZW, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const SKIP = /^(talmud-|mishna-|kab-|tanakh-|tora-rosen|haftarot|sp-|vt-info|nt-info)/;
const K = { adam: /\bAdam\b|\bEv[aeiă]\b|\bEden|paradis|rai(ul)?\b/i, cain: /\bCain\b|\bAbel\b|\bSet\b|Enoh|Enoc|Metusal|Lameh/i, noe: /\bNoe\b|\bNoah|potop|corabi|curcubeu|Sem\b.*Ham|Iafet/i, babel: /Babel|Nimrod|turnul/i, avraam: /Avram|Avraam|Abraam|Abraham/i, sara: /\bSara\b|Sarai|Agar|Ișmael|Ismael|Melhi?sedec|Melchi/i, sodoma: /Sodom|Gomor|\bLot\b/i, isaac: /\bIsaac\b|Rebec|Esau|Esav|Abimelec|Avimeleh/i };
const works = [];
for (const k of ['deuterocanonic', 'pseudepigraf', 'apocrifeNT', 'patristice']) (function w(o) { if (!o) return; if (Array.isArray(o)) return o.forEach(w); if (typeof o !== 'object') return; if (o.slug && !o.isHeader) { if (o.available && !SKIP.test(o.slug)) works.push(o); return; } for (const kk of ['subfolders', 'items', 'books']) if (o[kk]) w(o[kk]); })(L[k]);
function chapters(b) { let ch = b.chapters || []; if (b.lazySrc && !ch.length) { const w = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/' + b.lazySrc, 'utf8'))(w); ch = (w.LIB_LAZY[b.slug] || {}).chapters || []; } return ch.map(c => { if (c.verses && c.verses.length) return c; if (c.lazyChap) { const w2 = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/' + c.lazyChap, 'utf8'))(w2); const d = w2.LIB_LAZY[b.slug + '#' + c.num]; return { num: c.num, verses: Array.isArray(d) ? d : (d && d.verses) || [] }; } return { num: c.num, verses: [] }; }); }
const show = (process.argv.find(a => a.startsWith('--show=')) || '').split('=')[1];
const rows = [];
for (const b of works) {
  const cnt = {}; let tot = 0, units = 0; const lines = [];
  for (const c of chapters(b)) for (const u of c.verses || []) { units++; const t = plain(u.t); let hit = false; for (const k in K) if (K[k].test(t)) { cnt[k] = (cnt[k] || 0) + 1; hit = true; } if (hit) { tot++; if (show === b.slug) lines.push(c.num + ':' + u.v + ' ' + t.slice(0, 100)); } }
  if (show === b.slug) console.log(lines.join('\n'));
  if (tot) rows.push({ slug: b.slug, units, tot, cnt });
}
if (!show) { rows.sort((a, b) => b.tot - a.tot); for (const r of rows) console.log(r.slug.padEnd(34) + String(r.tot).padStart(4) + '/' + String(r.units).padEnd(5) + Object.entries(r.cnt).map(e => e[0] + e[1]).join(' ')); }
