// convertește citările din text (dict_ro, diff_ro, comentarii evreiești) din numerotarea ebraică în EDC100.
// node citeconv.js [--scrie]
const fs = require('fs');
const V = require('./versif.js');
const O = require('C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-deuteronom-extract/oshb');
const base = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/';
const BOOKS = ['Geneza', 'Exod', 'Exodul', 'Levitic', 'Leviticul', 'Numeri', 'Deuteronom', 'Deuteronomul', 'Iosua', 'Judecători', 'Rut', '1 Samuel', '2 Samuel', '1 Împărați', '2 Împărați', '1 Cronici', '2 Cronici', 'Ezra', 'Neemia', 'Estera', 'Iov', 'Psalmul', 'Psalmii', 'Proverbe', 'Pilde', 'Eclesiastul', 'Cântarea cântărilor', 'Isaia', 'Ieremia', 'Plângerile lui Ieremia', 'Plângerile', 'Ezechiel', 'Daniel', 'Osea', 'Ioel', 'Amos', 'Obadia', 'Iona', 'Mica', 'Naum', 'Habacuc', 'Țefania', 'Hagai', 'Zaharia', 'Maleahi'];
const OSIS = { 'Geneza': 'Gen', 'Exodul': 'Exod', 'Leviticul': 'Lev', 'Numeri': 'Num', 'Deuteronomul': 'Deut', '1 Samuel': '1Sam', '2 Samuel': '2Sam', '1 Împărați': '1Kgs', '2 Împărați': '2Kgs', '1 Cronici': '1Chr', '2 Cronici': '2Chr', 'Neemia': 'Neh', 'Iov': 'Job', 'Psalmul': 'Ps', 'Eclesiastul': 'Eccl', 'Cântarea cântărilor': 'Song', 'Isaia': 'Isa', 'Ieremia': 'Jer', 'Ezechiel': 'Ezek', 'Daniel': 'Dan', 'Osea': 'Hos', 'Ioel': 'Joel', 'Iona': 'Jonah', 'Mica': 'Mic', 'Naum': 'Nah', 'Zaharia': 'Zech', 'Maleahi': 'Mal' };
const canon = b => V.ALIAS[b] || b;
const alt = [...BOOKS].sort((a, b) => b.length - a.length).join('|');
// Carte C:V + continuări (-V, -C:V, ,V) + continuări cu capitol (și C:V, ; C:V, , C:V)
const RE = new RegExp('(?<![\\p{L}\\d])(' + alt + ') (\\d{1,3}):(\\d{1,3})((?:[-–]\\d{1,3}(?::\\d{1,3})?|,\\s?\\d{1,3}(?![\\d:]))*)((?:(?: și |; |, )\\d{1,3}:\\d{1,3}(?:[-–]\\d{1,3})?)*)', 'gu');
const JEW = /^(Rashi|Ibn Ezra|Radak|Metzudat|Ralbag|Malbim|Abarbanel|Targum|Șadal|Talmud|Mișna|Midra|Zohar|Ramban|Sforno)/;
const inv = {};
function invOf(b, c, v) {
  const key = b + '|' + c + ':' + v; if (inv[key] !== undefined) return inv[key];
  let found = null;
  for (let hc = Math.max(1, c - 2); hc <= c + 2 && !found; hc++) for (let hv = 1; hv <= 200; hv++) { const r = V.conv(b, hc, hv); if (r && !r.title && r.c === c && r.v === v) { found = [hc, hv]; break; } }
  return inv[key] = found;
}
const hasStrong = (b, c, v, st) => { const o = OSIS[b]; if (!o) return null; return (O.verse(o, c, v) || []).some(x => st.includes(x.strong)); };
const stats = { convertite: {}, deja: 0, titluri: [], lista: [] };
function convertText(text, ctx, strongs) {
  return text.replace(RE, (m, book, c, v, rest, bare) => {
    const b = canon(book);
    const items = [{ c: +c, v: +v, k: 'p' }];
    for (const part of rest.match(/[-–]\d{1,3}(?::\d{1,3})?|,\s?\d{1,3}/g) || []) {
      const last = items[items.length - 1];
      if (part[0] === '-' || part[0] === '–') { const mm = part.slice(1).split(':'); items.push(mm.length === 2 ? { c: +mm[0], v: +mm[1], k: 'r' } : { c: last.c, v: +mm[0], k: 'r' }); }
      else items.push({ c: last.c, v: +part.slice(1).trim(), k: 'l' });
    }
    const bares = [];
    for (const bm of (bare || '').matchAll(/( și |; |, )(\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/g)) bares.push({ sep: bm[1], c: +bm[2], v: +bm[3], v2: bm[4] ? +bm[4] : null });
    if (strongs && OSIS[b] && items.length === 1 && !bares.length) {
      const heb = hasStrong(b, items[0].c, items[0].v, strongs);
      if (heb === false) { const iv = invOf(b, items[0].c, items[0].v); if (iv && hasStrong(b, iv[0], iv[1], strongs)) { stats.deja++; return m; } }
    }
    const cv = (cc, vv) => V.conv(b, cc, vv);
    const all = [...items.map(i => cv(i.c, i.v)), ...bares.flatMap(x => [cv(x.c, x.v), x.v2 ? cv(x.c, x.v2) : null])];
    if (all.every(x => !x)) return m;
    if (all.some(x => x && x.title)) { stats.titluri.push(`${ctx}: ${m}`); return m; }
    const out = items.map(i => { const x = cv(i.c, i.v); return { c: x ? x.c : i.c, v: x ? x.v : i.v, k: i.k }; });
    let s = book + ' ' + out[0].c + ':' + out[0].v; let curC = out[0].c;
    for (let i = 1; i < out.length; i++) {
      const { c: cc, v: vv, k } = out[i];
      if (k === 'r') s += '-' + (cc === curC ? vv : cc + ':' + vv);
      else if (cc === curC) s += ',' + vv;
      else s += '; ' + cc + ':' + vv;
      curC = cc;
    }
    for (const x of bares) {
      const a = cv(x.c, x.v) || { c: x.c, v: x.v };
      s += x.sep + a.c + ':' + a.v;
      if (x.v2) { const bb = cv(x.c, x.v2) || { c: x.c, v: x.v2 }; s += '-' + (bb.c === a.c ? bb.v : bb.c + ':' + bb.v); }
    }
    stats.convertite[b] = (stats.convertite[b] || 0) + 1;
    stats.lista.push(ctx + ': ' + m + ' -> ' + s);
    return s;
  });
}
function run(write) {
  for (const f of ['haftarot-ciclu-saptamanal.json', 'haftarot-sarbatori.json']) {
    const d = JSON.parse(fs.readFileSync(base + f, 'utf8')); let ch = 0;
    const tag = f.startsWith('haftarot-ciclu') ? 'C' : 'S';
    for (const c of d.chapters) for (const v of c.verses) {
      const ctx = `${tag}${c.num} ${v.v}`;
      for (const cm of v.commentaries || []) { if (cm.text && JEW.test(cm.author) && process.env.COM) { const n = convertText(cm.text, ctx + ' ' + cm.author, null); /* doar listare */ } }
      if (process.env.COM) continue;
      for (const t of v.tokens || []) {
        const st =(t.strong || '').split(/[ ,;+]/).filter(Boolean);
        for (const k of ['dict_ro', 'diff_ro', 'def_ro', 'greek_def_ro']) { if (t[k]) { const n = convertText(t[k], ctx + ' ' + k, k === 'dict_ro' ? st : null); if (n !== t[k]) { t[k] = n; ch++; } } }
      }
    }
    console.log(f, 'câmpuri modificate:', ch);
    if (write) { fs.copyFileSync(base + f, base + f + '.bak-citeconv'); fs.writeFileSync(base + f, JSON.stringify(d, null, 1)); }
  }
  console.log('convertite pe cărți:', JSON.stringify(stats.convertite), '| deja EDC100 (sărite):', stats.deja, '| titluri de psalm (nemodificate):', stats.titluri.length);
  const L = stats.lista; const pick = []; for (let i = 0; i < L.length; i += Math.max(1, Math.floor(L.length / 60))) pick.push(L[i]);
  console.log('--- mostre ---\n' + pick.join('\n'));
  console.log('--- titluri ---\n' + stats.titluri.join('\n'));
  fs.writeFileSync('C:/Users/ivcatali/AppData/Local/Temp/claude/C--Users-ivcatali-biblie-app/1b2de2ce-5fde-4d73-ba50-1c613a2c9173/scratchpad/citeconv-lista.txt', L.join('\n'));
}
run(process.argv.includes('--scrie'));
