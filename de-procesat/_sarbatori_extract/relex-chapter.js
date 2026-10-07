// node relex-chapter.js <chIdx(0-based)> <dataFile> [--scrie]
// Reconstruieste DOAR campul `tokens` (panoul lexical) al unui capitol deja
// existent in haftarot-sarbatori.json, pe baza unui fisier de date nou, cu
// densitate mult mai mare de cuvinte tagate - pastreaza neschimbate
// textCompare/refs/commentaries ale fiecarui verset (acelea nu sunt problema).
const fs = require('fs');
const O = require('../_haftarot-deuteronom-extract/oshb');
const master = JSON.parse(fs.readFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json', 'utf8'));
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const [chIdxStr, dataFile] = args;
const chIdx = +chIdxStr;
const ch = master.chapters[chIdx];
const data = require('./' + dataFile);
const MAP = JSON.parse(fs.readFileSync('de-procesat/_sarbatori_extract/oshb-map-sarbatori.json', 'utf8'));
const chNum = ch.num;

const errs = [];
const byV = {}; data.forEach(d => byV[d.v] = d);

const newVerses = ch.verses.map(v => {
  const d = byV[v.v];
  if (!d) { errs.push(v.v + ': lipseste din ' + dataFile); return v; }
  const mapEntry = MAP[chNum + '|' + v.v];
  if (!mapEntry) {
    if (!d.tok || !d.tok.length) return v;
    errs.push(v.v + ': fara mapare OSIS'); return v;
  }

  const placed = []; let pos = 0;
  for (const [w, hi, f] of d.tok) {
    const osisStr = f.osisVerse || mapEntry.osis;
    const [bk, c, vs] = osisStr.split('.');
    const ws = O.verse(bk, +c, +vs);
    const L = /[A-Za-zĂÂÎȘȚăâîșțŞşŢţ]/;
    const findW = from => { let i = v.t.indexOf(w, from); while (i >= 0 && ((i > 0 && L.test(v.t[i-1])) || L.test(v.t[i+w.length]||''))) i = v.t.indexOf(w, i+1); return i; };
    let at = findW(pos); if (at < 0) at = findW(0);
    if (at < 0) { errs.push(v.v + ' «' + w + '»: nu apare in text'); continue; }
    const idxs = [].concat(hi); const hw = idxs.map(i => ws[i]);
    if (hw.some(x => !x)) { errs.push(v.v + ' «' + w + '»: indice ebraic gresit ' + hi); continue; }
    const strong = hw[hw.length-1].strong;
    const tok = { t: w, w, heb: hw.map(x=>x.heb).join(' '), translit: hw.map(x=>x.translit).join(' '), strong, pos: hw.map(x=>x.pos).join(' + '), def_ro: f.d, dict_ro: f.x };
    if (!tok.def_ro) errs.push(v.v + ' «' + w + '»: lipseste def_ro');
    if (!tok.dict_ro) errs.push(v.v + ' «' + w + '»: lipseste dict_ro');
    if (placed.some(p => at < p.at + p.len && p.at < at + w.length)) { errs.push(v.v + ' «' + w + '»: se suprapune'); continue; }
    placed.push({ at, len: w.length, tok }); pos = at + w.length;
  }
  placed.sort((a,b)=>a.at-b.at);
  const tokens = []; let cur = 0;
  for (const p of placed) { if (p.at > cur) tokens.push({t: v.t.slice(cur,p.at)}); tokens.push(p.tok); cur = p.at + p.len; }
  if (cur < v.t.length) tokens.push({t: v.t.slice(cur)});
  if (tokens.map(t=>t.t).join('') !== v.t) errs.push(v.v + ': tokenii nu refac textul exact');

  return Object.assign({}, v, { tokens });
});

const totTok = newVerses.reduce((s,v)=>s+v.tokens.filter(t=>t.w).length,0);
const totWords = newVerses.reduce((s,v)=>s + v.t.split(/\s+/).filter(Boolean).length, 0);
console.log('Capitolul ' + chNum + ' (' + ch.title + '):', newVerses.length, 'versete,', totTok, 'cuvinte/fraze tagate, densitate:', (totTok/newVerses.length).toFixed(2), '/verset');
if (errs.length) { console.log('ERORI (' + errs.length + '):\n' + errs.join('\n')); process.exit(1); }

if (process.argv.includes('--scrie')) {
  master.chapters[chIdx].verses = newVerses;
  fs.writeFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json', JSON.stringify(master, null, 1));
  console.log('Scris in fisierul de lucru.');
}
