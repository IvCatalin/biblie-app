// Construiește indexul „ce din Diverse se leagă de ce capitol din Geneza” prin trimiteri explicite (Geneza/Facerea/Bereșit N:V) în text și note, pentru TOATE lucrările din Bibliotecă.
// node index-diverse-geneza.js → data/geneza-diverse-index.json + data/geneza-diverse-index.md
const fs = require('fs');
const P = 'C:/Users/ivcatali/biblie-app/public/';
const OUT = 'C:/Users/ivcatali/biblie-app/data/';
const html = fs.readFileSync(P + 'biblie-demo.html', 'utf8');
const i0 = html.indexOf('const LIBRARY = ') + 16;
const L = JSON.parse(html.slice(i0, html.indexOf('\n', i0)).trim().replace(/;$/, ''));
const plain = (t) => String(t).replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const REF = /(?:Geneza|Facerea|Facere|Bereșit|Bereshit|Gen\.)\s*(\d{1,2})(?:\s*:\s*(\d{1,2}))?/g;
const SKIP = /^(tora-rosen|haftarot|sp-|tanakh-genesis)/;
const works = [];
(function walk(o, folder) { if (!o) return; if (Array.isArray(o)) return o.forEach(x => walk(x, folder)); if (typeof o !== 'object') return; if (o.slug && !o.isHeader) { works.push({ b: o, folder }); } Object.values(o).forEach(x => typeof x === 'object' && walk(x, folder)); })(Object.entries(L).map(([k, f]) => ({ k, f: f.books || f.subfolders })), '');
// deduplicare
const seen = new Set(); const list = [];
for (const { b } of works) { if (seen.has(b.slug) || !b.available || SKIP.test(b.slug)) continue; seen.add(b.slug); list.push(b); }
// folder pentru fiecare slug
const folderOf = {}; Object.entries(L).forEach(([k, f]) => { const w = (items, lab) => (items || []).forEach(e => { if (e && e.items) w(e.items, lab); else if (e && e.slug) folderOf[e.slug] = lab; }); w(f.books, f.label || k); (f.subfolders || []).forEach(s => w(s.items, (f.label || k) + ' / ' + (s.label || ''))); });
const idx = {}; // cap -> slug -> {name, units:[{c, v, g}]}
const total = {};
function loadCh(b) {
  let ch = b.chapters || [];
  if (b.lazySrc && !ch.length) { const ww = { LIB_LAZY: {}, HAFTAROT_DATA: {} }; try { new Function('window', fs.readFileSync(P + b.lazySrc, 'utf8'))(ww); } catch (e) { return []; } const d = ww.LIB_LAZY[b.slug]; ch = d ? d.chapters : []; }
  return ch;
}
for (const b of list) {
  const chs = loadCh(b);
  chs.forEach((ch, ci) => {
    let verses = ch.verses;
    if (!verses && ch.lazyChap) { const ww = { LIB_LAZY: {} }; try { new Function('window', fs.readFileSync(P + ch.lazyChap, 'utf8'))(ww); verses = ww.LIB_LAZY[b.slug + '#' + ch.num]; } catch (e) {} }
    (verses || []).forEach(v => {
      const txt = plain(v.t || '') + ' ' + (v.notes || []).join(' ') + ' ' + String(v.t || '').replace(/<[^>]+>/g, ' ');
      const found = new Set(); let m; REF.lastIndex = 0;
      while ((m = REF.exec(txt))) { const g = +m[1]; if (g >= 1 && g <= 50) found.add(m[2] ? g + ':' + m[2] : String(g)); }
      found.forEach(g => {
        const gc = +g.split(':')[0];
        idx[gc] = idx[gc] || {}; const o = (idx[gc][b.slug] = idx[gc][b.slug] || { nume: b.name_ro || b.name, loc: folderOf[b.slug] || '', unitati: [] });
        o.unitati.push({ cap: ch.num != null ? ch.num : ci + 1, v: v.v, geneza: g });
      });
    });
  });
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(OUT + 'geneza-diverse-index.json', JSON.stringify(idx, null, 1), 'utf8');
let md = '# Index: ce din „Diverse” se leagă de ce capitol din Geneza\n\nGenerat cu `node tools/index-diverse-geneza.js` din trimiterile explicite („Geneza/Facerea/Bereșit N:V”) din textul și notele fiecărei lucrări din Bibliotecă (Tora Rosen, Haftarot, Pentateuhul Samaritean și comentatorii Tanakh sunt excluse: au propriile intrări pe verset). Numerotarea capitolelor Genezei este cea a trimiterii din sursă.\n\nFiecare linie: lucrare (slug) — nr. unități care citează capitolul — primele locuri (capitol:unitate → verset Geneza).\n\n';
for (let g = 1; g <= 50; g++) {
  const e = idx[g]; md += '## Geneza ' + g + '\n';
  if (!e) { md += '_nicio trimitere explicită în Diverse_\n\n'; continue; }
  const rows = Object.entries(e).sort((a, b) => b[1].unitati.length - a[1].unitati.length);
  rows.forEach(([slug, o]) => { md += '- `' + slug + '` (' + o.nume + ') — ' + o.unitati.length + ' — ' + o.unitati.slice(0, 6).map(u => u.cap + ':' + u.v + '→' + u.geneza).join(', ') + (o.unitati.length > 6 ? ', …' : '') + '\n'; });
  md += '\n';
}
fs.writeFileSync(OUT + 'geneza-diverse-index.md', md, 'utf8');
const cnt = []; for (let g = 1; g <= 50; g++) cnt.push(g + ':' + (idx[g] ? Object.keys(idx[g]).length : 0));
console.log('lucrări scanate:', list.length, '| lucrări per capitol Geneza:', cnt.join(' '));

// ---- completare: lucrări narative paralele (Jubilee, Cartea Dreptului, Josephus, Apocalipsa lui Moise etc.), capitol cu capitol, + ce e deja în genesis-N.js ----
{
  let md2 = fs.readFileSync(OUT + 'geneza-diverse-index.md', 'utf8');
  md2 += '\n---\n\n# Ce rânduri sunt deja în fișierele genesis-N.js (după autor, număr de rânduri)\n\n';
  for (let n = 1; n <= 50; n++) {
    const f = P + 'genesis-' + n + '.js'; if (!fs.existsSync(f)) continue;
    const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const by = {};
    w.CHAPTER_DATA.forEach(x => (x.commentaries || []).forEach(c => { const a = String(c.author || '').replace(/\s*[\d.:,\-–—]+.*$/, '').replace(/,.*$/, '').replace(/\s*\(.*$/, '').trim() || '?'; by[a] = (by[a] || 0) + 1; }));
    md2 += '- Geneza ' + n + ' (' + w.CHAPTER_DATA.length + ' versete): ' + Object.entries(by).sort((a, b) => b[1] - a[1]).map(([a, c]) => a + ' ' + c).join('; ') + '\n';
  }
  md2 += '\n---\n\n# Lucrări narative care urmăresc Geneza capitol cu capitol (începutul fiecărui capitol, pentru orientare)\n\nNu au trimiteri explicite „Geneza N:V”; se leagă după conținut. Folosește-le la verificarea fiecărui capitol de Geneză.\n';
  const NAR = ['jubileele', 'cartea-dreptului', 'josephus-antichitati-cartea1', 'apocalipsa-moise', 'viata-adam-eva', '1-enoh', '2-enoh', 'oracolele-sibiline', 'iosif-aseneth', 'apocalipsa-avraam', 'testament-iosif', 'testament-iuda', 'testament-levi', 'testament-ruben', 'testament-simeon', 'testament-zabulon', 'testament-dan', 'testament-neftali', 'testament-gad', 'testament-aser', 'testament-isahar', 'testament-veniamin'];
  for (const slug of NAR) {
    const b = list.find(x => x.slug === slug); if (!b) { md2 += '\n## ' + slug + ' (lipsă)\n'; continue; }
    const chs = loadCh(b);
    md2 += '\n## ' + slug + ' — ' + (b.name_ro || b.name) + ' (' + chs.length + ' capitole)\n';
    chs.forEach((ch, ci) => { let verses = ch.verses; if (!verses && ch.lazyChap) { const ww = { LIB_LAZY: {} }; try { new Function('window', fs.readFileSync(P + ch.lazyChap, 'utf8'))(ww); verses = ww.LIB_LAZY[b.slug + '#' + ch.num]; } catch (e) {} } const t = verses && verses[0] ? plain(verses[0].t).slice(0, 80) : ''; md2 += '- ' + (ch.num != null ? ch.num : ci + 1) + (ch.title && !/^Capitolul \d+$/.test(ch.title) ? ' [' + String(ch.title).slice(0, 50) + ']' : '') + ': ' + t + '\n'; });
  }
  fs.writeFileSync(OUT + 'geneza-diverse-index.md', md2, 'utf8');
  console.log('md final bytes', md2.length);
}
