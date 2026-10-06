const fs = require('fs');
const O = require('../_haftarot-deuteronom-extract/oshb');
const master = JSON.parse(fs.readFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json','utf8'));
const chIdx = 1; // capitol 2 (index 1)
const ch = master.chapters[chIdx];
const data = require('./ch02-data.js');
const extra = require('./ch02-extra.js');
const lxxtr = require('./ch02-lxxtr.js');
const lxx = require('./lxx-Isa-66.json');
const MAP = JSON.parse(fs.readFileSync('de-procesat/_sarbatori_extract/oshb-map-sarbatori.json','utf8'));
const ch1master = require('./ch01-final-cache.js'); // verses deja complete din capitolul 1, pentru reutilizare 20:18 / 20:42

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

const newVerses = ch.verses.map(v => {
  // versete reutilizate direct din capitolul 1 (identice)
  if (v.v === '20:18' || v.v === '20:42') {
    const src = ch1master.find(x => x.v === v.v);
    if (!src) { errs.push(v.v + ': nu gasesc sursa din capitolul 1'); return v; }
    return Object.assign({}, v, { tokens: src.tokens, textCompare: src.textCompare, refs: src.refs, commentaries: src.commentaries });
  }
  if (v.v === '66:23b') {
    const src = null; // se trateaza mai jos, dupa ce 66:23 e construit
    return v; // placeholder, completat in a doua trecere
  }
  const d = byV[v.v];
  if (!d) { errs.push(v.v + ': lipsește din ch02-data.js'); return v; }
  const mapEntry = MAP['2|' + v.v];
  const [bk, c, vs] = mapEntry.osis.split('.');
  const ws = O.verse(bk, +c, +vs);

  const placed = []; let pos = 0;
  for (const [w, hi, f] of d.tok) {
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
      const lxxText = (f.gVerse ? lxx[f.gVerse] : lxx[v.v.split(':')[1]]) || '';
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
  if (!translation) errs.push(v.v + ': lipseste traducere LXX in ch02-lxxtr.js');
  const textCompare = [
    { source: "Textul Masoretic (ebraică)", original: v.heb, translation: v.t + " — traducerea rabinului Rosen.", note: "" },
    { source: "Septuaginta (greacă, sec. III-II î.Hr.)", original: lxx[v.v.split(':')[1]] || '', greek: true, translation, note: note || "" }
  ];

  const commentaries = (extra.C[v.v] && extra.C[v.v].comm) || [];
  const refs = d.refs || [];

  return Object.assign({}, v, { tokens, textCompare, refs, commentaries });
});

// a doua trecere: completeaza 66:23b ca o copie a lui 66:23
const v23 = newVerses.find(v => v.v === '66:23');
const idx23b = newVerses.findIndex(v => v.v === '66:23b');
if (v23 && idx23b >= 0) {
  newVerses[idx23b] = Object.assign({}, newVerses[idx23b], { tokens: v23.tokens, textCompare: v23.textCompare, refs: v23.refs, commentaries: v23.commentaries });
} else errs.push('66:23b: nu am putut copia din 66:23');

const totTok = newVerses.reduce((s,v)=>s+v.tokens.filter(t=>t.w).length,0);
const totComm = newVerses.reduce((s,v)=>s+v.commentaries.length,0);
const totRefs = newVerses.reduce((s,v)=>s+v.refs.length,0);
console.log('Capitolul 2:', newVerses.length, 'versete,', totTok, 'cuvinte tagate (' + (totTok/newVerses.length).toFixed(2) + '/verset),', totComm, 'comentarii,', totRefs, 'trimiteri');
if (errs.length) { console.log('ERORI (' + errs.length + '):\n' + errs.join('\n')); process.exit(1); }

if (process.argv.includes('--scrie')) {
  master.chapters[chIdx].verses = newVerses;
  fs.writeFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json', JSON.stringify(master, null, 1));
  console.log('Scris in fisierul de lucru.');
}
