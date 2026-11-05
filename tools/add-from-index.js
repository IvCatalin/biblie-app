// Adaugă în genesis-N.js rândurile reale din Diverse care citesc explicit versetul (Talmud: o unitate pe verset, cea mai relevantă; Mișna: una; Kabbala/Jubilee: până la 2 pe lucrare).
// node add-from-index.js --ch=1,2,3 [--write] [--list]
const fs = require('fs');
const WRITE = process.argv.includes('--write'), LIST = process.argv.includes('--list');
const chapters = (process.argv.find(a => /^--ch=/.test(a)) || '--ch=1,2,3').slice(5).split(',').map(Number);
const P = 'C:/Users/ivcatali/biblie-app/public/';
const html = fs.readFileSync(P + 'library-data.js', 'utf8');
const i0 = html.indexOf('const LIBRARY = ') + 16;
const L = JSON.parse(html.slice(i0, html.indexOf('\n', i0)).trim().replace(/;$/, ''));
const plain = (t) => String(t).replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const IDX = JSON.parse(fs.readFileSync('C:/Users/ivcatali/biblie-app/data/geneza-diverse-index.json', 'utf8'));
const books = {};
(function walk(o) { if (!o) return; if (Array.isArray(o)) return o.forEach(walk); if (typeof o !== 'object') return; if (o.slug && !o.isHeader && o.available && !books[o.slug]) books[o.slug] = o; Object.values(o).forEach(x => typeof x === 'object' && walk(x)); })(L);
const chCache = {};
function chs(slug) {
  if (chCache[slug]) return chCache[slug]; const b = books[slug]; let c = b.chapters || [];
  if (b.lazySrc && !c.length) { const ww = { LIB_LAZY: {} }; new Function('window', fs.readFileSync(P + b.lazySrc, 'utf8'))(ww); c = ww.LIB_LAZY[slug].chapters; }
  return (chCache[slug] = c);
}
function unit(slug, cap, v) {
  const ch = chs(slug).find(x => (x.num != null ? x.num : null) === cap) || chs(slug)[cap - 1]; if (!ch) return null;
  const vs = ch.verses || []; const u = vs.find(x => x.v === v); return u ? { ch, u } : null;
}
function rank(u, g) { // g = "3:9"
  const notes = (u.notes || []).join(' '); const [c, v] = g.split(':');
  const re = (p) => new RegExp(p + '\\s*' + c + '\\s*:\\s*' + v + '(?!\\d)');
  if (re('Legătură cu Geneza').test(notes)) return 3;
  if (re('Citatul: Geneza').test(notes) || re('Citatele:[^.]*Geneza').test(notes)) return 2;
  return 1;
}
const kind = (slug) => /^talmud-minor/.test(slug) ? 'minor' : /^talmud-/.test(slug) ? 'talmud' : /^mishna-/.test(slug) ? 'mishna' : /^jubileele/.test(slug) ? 'jub' : 'other';
function label(slug, ch, v) {
  const b = books[slug]; const name = b.name || b.name_ro;
  if (kind(slug) === 'talmud') return 'Talmudul Babilonian, ' + name + ', cap. ' + ch.num;
  if (kind(slug) === 'minor') return 'Tratatul ' + name + ', cap. ' + ch.num;
  if (kind(slug) === 'mishna') return 'Mișna, ' + name.replace(/\s*\(.*$/, '') + ' ' + ch.num + ':' + v;
  if (slug === 'jubileele') return 'Cartea Jubileelor ' + ch.num + ' — comparație';
  if (slug === 'kab-zo-zohar-chadash') return 'Zohar Chadash, ' + String(ch.title || 'Bereșit').replace(/^Capitolul.*/, 'Bereșit') + ' ' + v;
  if (slug === 'kab-sefer-habahir') return 'Sefer HaBahir, par. ' + v;
  return (b.name_ro || b.name).replace(/\s*\(.*$/, '') + ' ' + ch.num + ':' + v;
}
const JEW = /^(Talmud|Tratatul|Mișna|Zohar|Sefer HaBahir|Cele |Calea |Grădina|Comentariul|Explicația|Adunarea|Cartea tăinuirii)/;
let added = 0, byKind = {};
for (const N of chapters) {
  const f = P + 'genesis-' + N + '.js'; const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const D = w.CHAPTER_DATA;
  // candidate pe verset
  const cand = {}; // v -> [{slug, cap, v, rank}]
  for (const [slug, o] of Object.entries(IDX[N] || {})) {
    if (slug === 'kab-zo-zohar') continue; // Zohar clasic: rândurile există deja (alese din lucrare)
    for (const x of o.unitati) {
      if (!x.geneza.includes(':')) continue; const gv = +x.geneza.split(':')[1];
      const un = unit(slug, x.cap, x.v); if (!un) continue;
      const rr = rank(un.u, x.geneza); const pt = plain(un.u.t); const mm = new RegExp('(?:Geneza|Facerea|Facere|Bereșit|Bereshit|Gen\\.)\\s*' + N + '\\s*:\\s*' + gv + '(?!\\d)').exec(pt);
      if (!(rr >= 2 || (mm && mm.index <= 120))) continue; if (kind(slug) === 'minor' && !(mm && mm.index <= 120)) continue; // doar unități care citează versetul chiar la început sau îl leagă explicit în note
      (cand[gv] = cand[gv] || []).push({ slug, cap: x.cap, v: x.v, ch: un.ch, u: un.u, r: rr });
    }
  }
  const usedKeys = new Set();
  for (const x of D) {
    const cs = cand[x.num]; if (!cs) continue;
    const have = (t) => x.commentaries.some(c => c.text && plain(c.text) === plain(t));
    const hasTalmud = x.commentaries.some(c => /^Talmud/.test(c.author || ''));
    const hasMishna = x.commentaries.some(c => /^Mi[șs]na/.test(c.author || ''));
    const picks = []; const per = {}; cs.forEach(c => { c.key = c.slug + c.cap + ':' + c.v; });
    for (let i = cs.length - 1; i >= 0; i--) if (usedKeys.has(cs[i].key)) cs.splice(i, 1);
    const bykind = { talmud: [], minor: [], mishna: [], jub: [], other: [] };
    cs.forEach(c => bykind[kind(c.slug)].push(c));
    const sortc = (a, b) => b.r - a.r || plain(a.u.t).length - plain(b.u.t).length; // relevanță, apoi unitatea mai scurtă (mai țintită)
    if (!hasTalmud && bykind.talmud.length) picks.push(bykind.talmud.sort(sortc)[0]);
    if (!hasTalmud && !picks.length && bykind.minor.length) picks.push(bykind.minor.sort(sortc)[0]);
    if (!hasMishna && bykind.mishna.length) picks.push(bykind.mishna.sort(sortc)[0]);
    bykind.jub.sort(sortc).slice(0, 2).forEach(c => picks.push(c));
    const oth = {}; bykind.other.sort(sortc).forEach(c => { oth[c.slug] = (oth[c.slug] || 0) + 1; if (oth[c.slug] <= 2) picks.push(c); });
    const jew = [], other = [];
    for (const c of picks) {
      const text = plain(c.u.t); if (have(text)) continue; usedKeys.add(c.key);
      const row = { author: label(c.slug, c.ch, c.v), text, src: { slug: c.slug, spec: { num: c.ch.num, v: c.v } } };
      if (c.slug === 'jubileele') delete row.src; // Jubilee: butonul se rezolvă din etichetă, ca la rândurile existente
      if (c.slug === 'kab-sefer-habahir' || c.slug === 'kab-zo-zohar-chadash') row.text = String(c.u.t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      (JEW.test(row.author) ? jew : other).push(row); added++; byKind[kind(c.slug) + ':' + c.slug.replace(/^(talmud|mishna)-/, '')] = (byKind[kind(c.slug) + ':' + c.slug.replace(/^(talmud|mishna)-/, '')] || 0) + 1;
      if (LIST) console.log(N + ':' + x.num, '|', row.author, '| r' + c.r, '|', text.slice(0, 90));
    }
    let at = -1; x.commentaries.forEach((c, i) => { if (JEW.test(c.author || '')) at = i; });
    if (at < 0) x.commentaries.forEach((c, i) => { if (/^(Rashi|Targum|Ibn Ezra|Ramban|Sforno|Rashbam|Da'at|Radak|Chizkuni|Bekhor|Or HaChaim)/.test(c.author || '')) at = i; });
    x.commentaries.splice(at + 1, 0, ...jew);
    // restul rândurilor noi (Jubilee) după rândurile existente de același tip nu contează; se pun la sfârșitul blocului evreiesc/apocrif: la sfârșit
    x.commentaries.push(...other);
  }
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'capitole', chapters.join(','), '| rânduri noi', added);
console.log(JSON.stringify(byKind));
