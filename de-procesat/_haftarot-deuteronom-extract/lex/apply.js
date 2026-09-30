// node lex/apply.js <cap> [--scrie] — construiește tokenii capitolului din lex/cNN.js + lex/hlex*.js și verifică tot
// Fără --scrie doar raportează. Cu --scrie actualizează fișierul de lucru (cu copie de siguranță).
const fs = require('fs'); const path = require('path'); const O = require('../oshb');
const WF = path.join(__dirname, '../../_haftarot-extract/haftarot-ciclu-saptamanal.json');
const d = JSON.parse(fs.readFileSync(WF, 'utf8'));
const GIDX = JSON.parse(fs.readFileSync(path.join(__dirname, 'gen-idx.json'), 'utf8'));
const HLEX = require('./hlex-all');
const cn = +process.argv[2]; const WRITE = process.argv.includes('--scrie');
const ch = d.chapters[cn - 1];
const spec = require('./c' + String(cn).padStart(2, '0'));

// ---------- greacă: normalizare și transliterare
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
    o = o.replace(/ou/g, 'ou');
    if (rough && /^[aeiouy]/.test(o)) o = 'h' + o; if (/^r/.test(o) && rough) o = 'rh' + o.slice(1);
    return /[Α-Ω]/.test(w.normalize('NFD')[0]) ? o.charAt(0).toUpperCase() + o.slice(1) : o;
  }).join('');
}
// potrivire în textul LXX: rădăcina (primele n litere) trebuie să apară într-un cuvânt al versetului
function inLxx(forms, lxx) {
  const words = norm(lxx).replace(/[^α-ω\s]/g, ' ').split(/\s+/).filter(Boolean);
  return forms.every(f => { const n = norm(f).replace(/[^α-ω]/g, ''); if (!n) return true;
    const stem = n.length <= 2 ? n : n.slice(0, Math.max(2, Math.min(5, n.length - 2)));
    return words.some(w => w.includes(stem)); });
}

// cuvântul LXX găsit (pentru tabelul de control)
function matchLxx(forms, lxx) {
  const raw = lxx.split(/\s+/); const f = norm(forms[0]).replace(/[^α-ω]/g, '');
  const stem = f.length <= 2 ? f : f.slice(0, Math.max(2, Math.min(5, f.length - 2)));
  return raw.filter(w => norm(w).replace(/[^α-ω]/g, '').includes(stem)).join(' ');
}
// ---------- trimiteri din dict_ro: există în OSHB și conțin același Strong?
const BOOKS = { 'Geneza': 'Gen', 'Exodul': 'Exod', 'Leviticul': 'Lev', 'Numeri': 'Num', 'Deuteronomul': 'Deut', 'Iosua': 'Josh', 'Judecători': 'Judg', 'Rut': 'Ruth', '1 Samuel': '1Sam', '2 Samuel': '2Sam', '1 Împărați': '1Kgs', '2 Împărați': '2Kgs', '1 Cronici': '1Chr', '2 Cronici': '2Chr', 'Ezra': 'Ezra', 'Neemia': 'Neh', 'Estera': 'Esth', 'Iov': 'Job', 'Psalmul': 'Ps', 'Proverbe': 'Prov', 'Eclesiastul': 'Eccl', 'Cântarea cântărilor': 'Song', 'Isaia': 'Isa', 'Ieremia': 'Jer', 'Plângerile lui Ieremia': 'Lam', 'Ezechiel': 'Ezek', 'Daniel': 'Dan', 'Osea': 'Hos', 'Ioel': 'Joel', 'Amos': 'Amos', 'Obadia': 'Obad', 'Iona': 'Jonah', 'Mica': 'Mic', 'Naum': 'Nah', 'Habacuc': 'Hab', 'Țefania': 'Zeph', 'Hagai': 'Hag', 'Zaharia': 'Zech', 'Maleahi': 'Mal' };
const NTB = ['Matei', 'Marcu', 'Luca', 'Ioan', 'Faptele apostolilor', 'Romani', '1 Corinteni', '2 Corinteni', 'Galateni', 'Efeseni', 'Filipeni', 'Coloseni', '1 Tesaloniceni', '2 Tesaloniceni', '1 Timotei', '2 Timotei', 'Tit', 'Filimon', 'Evrei', 'Iacov', '1 Petru', '2 Petru', '1 Ioan', '2 Ioan', '3 Ioan', 'Iuda', 'Apocalipsa'];
const NT = new RegExp('(' + NTB.join('|') + ')\\s+\\d+:\\d+');
// nume de cărți neuniforme → forma EDC100
const FIXB = { 'Exod': 'Exodul', 'Psalmii': 'Psalmul', 'Psalmi': 'Psalmul', 'Ps': 'Psalmul', 'Gen': 'Geneza', 'Deut': 'Deuteronomul', 'Lev': 'Leviticul', 'Num': 'Numeri', 'Is': 'Isaia', 'Ier': 'Ieremia', 'Ezec': 'Ezechiel', 'Proverbele': 'Proverbe', 'Levitic': 'Leviticul', 'Deuteronom': 'Deuteronomul' };
const fixBooks = t => t.replace(/(^|[^A-Za-zĂÂÎȘȚăâîșț])(Exod|Psalmii|Psalmi|Ps|Gen|Deut|Lev|Num|Is|Ier|Ezec|Proverbele|Levitic|Deuteronom)\s+(\d+:\d+)/g, (m, p, b, r) => p + FIXB[b] + ' ' + r).replace(/Cântarea Cântărilor/g, 'Cântarea cântărilor');
// orice cuvânt cu majusculă urmat de „c:v” trebuie să fie o carte cunoscută
function unknownBooks(t) {
  const known = Object.keys(BOOKS).concat(NTB); const out = [];
  const re = /([A-ZĂÂÎȘȚ][a-zăâîșț]+)\s+\d+:\d+/g; let m;
  while ((m = re.exec(t))) { const before = t.slice(0, m.index + m[1].length); if (m[1] === 'În' || known.some(b => before.endsWith(b))) continue; out.push(m[0]); }
  return out;
}
const refRe = new RegExp('(' + Object.keys(BOOKS).sort((a, b) => b.length - a.length).join('|') + ')\\s+(\\d+):(\\d+)', 'g');
function checkRefs(text, strong) {
  const warn = []; let m; refRe.lastIndex = 0;
  while ((m = refRe.exec(text))) {
    const b = BOOKS[m[1]], c = +m[2], v = +m[3];
    const has = vv => { const ws = O.verse(b, c, vv); return ws && ws.some(w => w.strong === strong || w.lemma.split('/').some(l => 'H' + parseInt(l) === strong)); };
    if (!O.verse(b, c, v)) warn.push(`${m[0]}: nu există în ebraică (numerotare?)`);
    else if (!has(v)) warn.push(`${m[0]}: nu conține ${strong}` + ([v - 1, v + 1].some(has) ? ' (dar versetul vecin da — numerotare EDC100?)' : ''));
  }
  if (NT.test(text)) warn.push('trimitere NT (' + text.match(NT)[0] + ') — de verificat separat');
  return warn;
}

// ---------- construire
const errs = []; const warns = []; const stats = { verses: 0, tok: 0, greek: 0, diff: 0 };
const pick = (...xs) => xs.find(x => x !== undefined && x !== null && x !== '');
const newVerses = ch.verses.map((v, k) => {
  const ent = spec[v.v]; if (!ent) { errs.push(`${v.v}: lipsește din specificație`); return v; }
  const ws = O.haftWords(ch.num, v.v); const lxxO = (v.textCompare || []).find(t => t.greek); const lxx = lxxO ? lxxO.original : '';
  const old = (v.tokens || []).filter(t => t.w);
  const placed = []; let pos = 0;
  for (const e of ent) {
    const [w, hi, f = {}] = e; const label = `${v.v} «${w}»`;
    const L = /[A-Za-zĂÂÎȘȚăâîșțŞşŢţ]/;
    const findW = from => { let i = v.t.indexOf(w, from); while (i >= 0 && ((i > 0 && L.test(v.t[i - 1])) || L.test(v.t[i + w.length] || ''))) i = v.t.indexOf(w, i + 1); return i; };
    let at = findW(pos); if (at < 0) at = findW(0); if (f.at) at = findW(v.t.indexOf(f.at));
    if (at < 0) { errs.push(`${label}: nu apare în textul Rosen`); continue; }
    const idxs = [].concat(hi); const hw = idxs.map(i => ws[i]); if (hw.some(x => !x)) { errs.push(`${label}: indice ebraic greșit ${hi}`); continue; }
    const strong = f.s || hw[hw.length - 1].strong || hw[0].strong;
    const H = HLEX[strong + (f.k ? '#' + f.k : '')] || HLEX[strong] || {}; const G = GIDX[strong] || {};
    const oldT = f.ow ? old.find(t => t.w === f.ow) : old.find(t => t.strong === strong && (t.w === w || w.includes(t.w) || t.w.includes(w)));
    if (f.ow && !oldT) errs.push(`${label}: cuvântul vechi «${f.ow}» nu există`);
    const tok = { t: w, w, heb: hw.map(x => x.heb).join(' '), translit: f.tr || hw.map(x => x.translit).join(' '), strong, pos: f.pos || hw.map(x => x.pos).join(' + '),
      def_ro: pick(f.d, oldT && oldT.def_ro, H.d) };
    const g = pick(f.g, f.g === '' ? '' : H.g);
    if (g && !f.gx) {
      const forms = f.gf ? [].concat(f.gf) : g.split(/\s*\/\s*/).slice(0, 1).map(x => x.replace(/^(ὁ|ἡ|τό|τὸ|οἱ|αἱ|τά|τὰ)\s+/, ''));
      if (!inLxx(forms, lxx)) errs.push(`${label}: grecescul «${f.gf || g}» nu apare în LXX: ${lxx.slice(0, 90)}…`);
      tok.greek = `${g} (${gtr(g)})`; const gd0 = f.g ? f.gd : pick(f.gd, H.gd); tok.greek_def_ro = gd0 ? `${g} (${gtr(g)}) — ${gd0}` : '';
      if (!tok.greek_def_ro) errs.push(`${label}: lipsește greek_def_ro`);
      stats.greek++;
    }
    const diff = f.df === '-' ? '' : pick(f.df, oldT && oldT.diff_ro, (!f.g && g && !f.gx) ? H.df : undefined); if (diff) { tok.diff_ro = diff; stats.diff++; }
    tok.dict_ro = pick(f.x, oldT && oldT.dict_ro, H.x);
    if (tok.dict_ro) { tok.dict_ro = fixBooks(tok.dict_ro); unknownBooks(tok.dict_ro).forEach(x => errs.push(`${label}: nume de carte necunoscut în dict_ro: «${x}»`)); }
    if (tok.def_ro) tok.def_ro = fixBooks(tok.def_ro);
    if (g && !f.gx) tok.lxxMatch = matchLxx(f.gf ? [].concat(f.gf) : [g.replace(/^(ὁ|ἡ|τό|τὸ|οἱ|αἱ|τά|τὰ)\s+/, '')], lxx);
    if (!tok.def_ro) errs.push(`${label}: lipsește def_ro (${strong})`);
    if (!tok.dict_ro) errs.push(`${label}: lipsește dict_ro (${strong})`);
    else checkRefs(tok.dict_ro, strong).forEach(x => warns.push(`${label} dict_ro → ${x}`));
    if (placed.some(p => at < p.at + p.len && p.at < at + w.length)) { errs.push(`${label}: se suprapune cu alt cuvânt`); continue; }
    placed.push({ at, len: w.length, tok }); pos = at + w.length;
  }
  placed.sort((a, b) => a.at - b.at);
  const tokens = []; let cur = 0;
  for (const p of placed) { if (p.at > cur) tokens.push({ t: v.t.slice(cur, p.at) }); tokens.push(p.tok); cur = p.at + p.len; }
  if (cur < v.t.length) tokens.push({ t: v.t.slice(cur) });
  if (tokens.map(t => t.t).join('') !== v.t) errs.push(`${v.v}: tokenii nu refac textul`);
  // cuvinte vechi pierdute
  for (const o of old) if (!placed.some(p => p.tok.strong === o.strong)) warns.push(`${v.v}: cuvântul vechi «${o.w}» (${o.strong}) nu mai e explicat`);
  stats.verses++; stats.tok += placed.length;
  return Object.assign({}, v, { tokens });
});
console.log(`Capitolul ${ch.num} ${ch.title}: ${stats.verses} versete, ${stats.tok} cuvinte explicate (${(stats.tok / stats.verses).toFixed(2)}/verset), cu greacă ${stats.greek}, cu diff_ro ${stats.diff}`);
if (warns.length) console.log('ATENȚIONĂRI (' + warns.length + '):\n' + warns.join('\n'));
// tabel de control: fiecare cuvânt cu greacă → forma găsită efectiv în versetul LXX
if (process.argv.includes('--rev')) for (const v of newVerses) for (const t of v.tokens) if (t.greek) console.log(`${v.v}\t${t.w}\t${t.heb}\t${t.greek}\t→ ${t.lxxMatch}`);
for (const v of newVerses) for (const t of v.tokens) delete t.lxxMatch;
if (errs.length) { console.log('ERORI (' + errs.length + '):\n' + errs.join('\n')); process.exit(1); }
if (WRITE) {
  fs.copyFileSync(WF, WF + '.bak-lex');
  ch.verses = newVerses; fs.writeFileSync(WF, JSON.stringify(d, null, 1));
  console.log('Scris în fișierul de lucru.');
}
