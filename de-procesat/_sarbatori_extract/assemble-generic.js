// node assemble-generic.js <chIdx(0-based)> <dataFile> <extraFile> <lxxtrFile> <lxxFile1[,osisChapterPrefix1]> [<lxxFile2>...] [--scrie]
// lxxFile poate fi listat de mai multe ori (capitole diferite din aceeasi carte); se detecteaza automat ce capitol OSIS acopera fiecare fisier
const fs = require('fs');
const O = require('../_haftarot-deuteronom-extract/oshb');
const master = JSON.parse(fs.readFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json','utf8'));
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const [chIdxStr, dataFile, extraFile, lxxtrFile, ...lxxFiles] = args;
const chIdx = +chIdxStr;
const ch = master.chapters[chIdx];
const data = require('./' + dataFile);
const extra = require('./' + extraFile);
const lxxtr = require('./' + lxxtrFile);
const MAP = JSON.parse(fs.readFileSync('de-procesat/_sarbatori_extract/oshb-map-sarbatori.json','utf8'));
// lxxByOsisChapter: "Book.Chapter" -> {verse: text}, detectat din numele fisierelor lxx-<Book>-<Chapter>.json
const lxxByOsisChapter = {};
for (const f of lxxFiles) {
  const m = f.match(/^lxx-([A-Za-z0-9]+)-(\d+)\.json$/);
  if (!m) throw new Error('nume fisier lxx neconform: ' + f);
  lxxByOsisChapter[m[1] + '.' + m[2]] = require('./' + f);
}
function lxxFor(osis, vOverride) {
  const parts = osis.split('.'); const chapKey = parts[0] + '.' + parts[1];
  const verseNum = vOverride || parts[2];
  const d = lxxByOsisChapter[chapKey];
  return d ? (d[verseNum] || '') : '';
}

const norm = s => s.normalize('NFD').replace(/[̀-ͯ᾽᾿῾ͅ]/g, '').toLowerCase().replace(/ς/g, 'σ');
const GTR = { α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'e', θ: 'th', ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', φ: 'ph', χ: 'ch', ψ: 'ps', ω: 'o' };
function gtr(g) {
  return g.split(/(\s+|\/)/).map(w => {
    const rough = /[̔]/.test(w.normalize('NFD').slice(0, 3));
    let n = norm(w); let o = '';
    for (let i = 0; i < n.length; i++) { const c = n[i], nx = n[i + 1];
      if (c === 'γ' && /[γκξχ]/.test(nx || '')) { o += 'n'; continue; }
      if (c === 'υ' && /[αεοη]/.test(n[i - 1] || '')) { o += 'u'; continue; }
      o += GTR[c] !== undefined ? GTR[c] : c; }
    if (rough && /^[aeiouy]/.test(o)) o = 'h' + o; if (/^r/.test(o) && rough) o = 'rh' + o.slice(1);
    return /[Α-Ω]/.test(w.normalize('NFD')[0]) ? o.charAt(0).toUpperCase() + o.slice(1) : o;
  }).join('');
}

const errs = [];
const byV = {}; data.forEach(d => byV[d.v] = d);
const chNum = ch.num;

const newVerses = ch.verses.map(v => {
  const d = byV[v.v];
  if (!d) { errs.push(v.v + ': lipsește din ' + dataFile); return v; }
  const mapEntry = MAP[chNum + '|' + v.v];
  if (!mapEntry) { errs.push(v.v + ': fara mapare OSIS'); return v; }

  const placed = []; let pos = 0;
  for (const [w, hi, f] of d.tok) {
    const osisStr = f.osisVerse || mapEntry.osis;
    const [bk, c, vs] = osisStr.split('.');
    const ws = O.verse(bk, +c, +vs);
    const L = /[A-Za-zĂÂÎȘȚăâîșțŞşŢţ]/;
    const findW = from => { let i = v.t.indexOf(w, from); while (i >= 0 && ((i > 0 && L.test(v.t[i-1])) || L.test(v.t[i+w.length]||''))) i = v.t.indexOf(w, i+1); return i; };
    let at = findW(pos); if (at < 0) at = findW(0);
    if (at < 0) { errs.push(v.v + ' «' + w + '»: nu apare în text'); continue; }
    const idxs = [].concat(hi); const hw = idxs.map(i => ws[i]);
    if (hw.some(x => !x)) { errs.push(v.v + ' «' + w + '»: indice ebraic greșit ' + hi); continue; }
    const strong = hw[hw.length-1].strong;
    const tok = { t: w, w, heb: hw.map(x=>x.heb).join(' '), translit: hw.map(x=>x.translit).join(' '), strong, pos: hw.map(x=>x.pos).join(' + '), def_ro: f.d, dict_ro: f.x };
    if (f.g) {
      tok.greek = f.g + ' (' + gtr(f.g) + ')';
      tok.greek_def_ro = f.g + ' (' + gtr(f.g) + ') — ' + f.gd;
      const lxxText = lxxFor(mapEntry.osis, f.gVerse);
      const firstWord = f.g.split(/\s+/)[0];
      const stem = firstWord.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^Ͱ-Ͽ]/g,'').slice(0,4).toLowerCase();
      const normT = lxxText.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
      if (stem && !normT.includes(stem)) errs.push(v.v + ' «' + w + '»: grecescul «' + f.g + '» nu apare clar in LXX: ' + lxxText.slice(0,100));
    }
    if (f.df) tok.diff_ro = f.df;
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

  const [translation, note] = lxxtr[v.v] || [];
  if (!translation) errs.push(v.v + ': lipseste traducere LXX in ' + lxxtrFile);
  const textCompare = [
    { source: "Textul Masoretic (ebraică)", original: v.heb, translation: v.t + " — traducerea rabinului Rosen.", note: "" },
    { source: "Septuaginta (greacă, sec. III-II î.Hr.)", original: d.lxxOsis ? lxxFor(d.lxxOsis) : lxxFor(mapEntry.osis), greek: true, translation, note: note || "" }
  ];

  const commentaries = (extra.C[v.v] && extra.C[v.v].comm) || [];
  const refs = d.refs || [];

  return Object.assign({}, v, { tokens, textCompare, refs, commentaries });
});

const totTok = newVerses.reduce((s,v)=>s+v.tokens.filter(t=>t.w).length,0);
const totComm = newVerses.reduce((s,v)=>s+v.commentaries.length,0);
const totRefs = newVerses.reduce((s,v)=>s+v.refs.length,0);
console.log('Capitolul ' + chNum + ' (' + ch.title + '):', newVerses.length, 'versete,', totTok, 'cuvinte tagate,', totComm, 'comentarii,', totRefs, 'trimiteri');
if (errs.length) { console.log('ERORI (' + errs.length + '):\n' + errs.join('\n')); process.exit(1); }

if (process.argv.includes('--scrie')) {
  master.chapters[chIdx].verses = newVerses;
  fs.writeFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json', JSON.stringify(master, null, 1));
  console.log('Scris in fisierul de lucru.');
}
