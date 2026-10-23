// node retag/retag.js <cap> [--scrie]  — retagare per cuvânt (Standard Davar) a unui capitol din haftarot-ciclu-saptamanal.json
// Intrare: retag/c<NN>.js = { bank: { "H1234": {d, x}, "H1+H2": {d, x} }, v: { "40:28": [ [fragmentRO, idxEbraic | [idx,idx], {opțiuni}], ... ] } }
//   fragmentRO = subșir exact din textul Rosen; '' = cuvânt ebraic lăsat conștient fără tag (marcat în raport).
//   opțiuni: d (def_ro), x (dict_ro), s (Strong), k (cheie bank), pos, tr (transliterare), at (subșir de dezambiguizare), fn (fragment permis să fie doar cuvinte de legătură)
// Fără --scrie doar validează și raportează. Cu --scrie: salvează capitolul (banca capitolului bank-cNN.js rămâne separată; retag/bank.json = intrări generale reutilizabile) (copie de siguranță .bak-retag).
const fs = require('fs'), path = require('path');
const X = path.join(__dirname, '../../_haftarot-deuteronom-extract');
const O = require(path.join(X, 'oshb.js'));
const WF = path.join(__dirname, '../haftarot-ciclu-saptamanal.json');
const BANKF = path.join(__dirname, 'bank.json');
const cn = +process.argv[2]; const WRITE = process.argv.includes('--scrie');
const d = JSON.parse(fs.readFileSync(WF, 'utf8'));
const ch = d.chapters.find(c => c.num === cn);
if (!ch) throw new Error('capitol inexistent ' + cn);
const spec = require('./c' + String(cn).padStart(2, '0') + '.js');
const bank = fs.existsSync(BANKF) ? JSON.parse(fs.readFileSync(BANKF, 'utf8')) : {};
Object.assign(bank, spec.bank || {});

// ---- verificări de trimiteri din dict_ro (preluate din lex/apply.js)
const src = fs.readFileSync(path.join(X, 'lex/apply.js'), 'utf8');
const a = src.indexOf('// ---------- trimiteri din dict_ro'), b = src.indexOf('// ---------- construire');
const { fixBooks, unknownBooks, checkRefs } = new Function('O', src.slice(a, b) + '\nreturn {fixBooks, unknownBooks, checkRefs};')(O);

const FUNC = /^(C|Td|R|Ti|Tn|To|Tr|Tc|Ta|Te|Tj|Tm)/;
const isFunc = m => { const g = m.slice(1).split('/'); return g.some(s => FUNC.test(s)) && g.every(s => FUNC.test(s) || /^S[php]/.test(s)); };
const STOP = new Set('și sau de din la în pe cu a al ale ai alor să că iar dar ci nu un o i îl le l-a s-a v-a ne vă te se mi ți îi au este sunt pentru ca ce care cum când dacă dar însă decât mai prin spre către'.split(' '));
const onlyStop = s => s.toLowerCase().split(/[^a-zăâîșțşţ-]+/).filter(Boolean).every(w => STOP.has(w));
const L = /[A-Za-zĂÂÎȘȚăâîșțŞşŢţ]/;
const errs = [], warns = [];
const stats = { verses: 0, tags: 0, skipped: 0, pairs: 0, lxxCarried: 0, lxxLost: 0, missing: new Set() };
const cons = s => O.cons(s || '');

const newVerses = ch.verses.map(v => {
  const ent = spec.v[v.v];
  if (!ent) { errs.push(`${v.v}: lipsește din specificație`); return v; }
  if (ent === 'KEEP') return v; // verset copiat dintr-un capitol identic, deja la Standardul Davar
  const ws = O.haftWords(cn, v.v);
  // verificare: ebraica OSHB a versetului trebuie să corespundă ebraicii Rosen din fișier
  const c1 = ws.map(w => cons(w.heb)).join(''), c2 = cons(v.heb || '');
  const big = s => { const m = new Map(); for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) || 0) + 1); return m; };
  const A = big(c1), B = big(c2); let x = 0, n = 0; for (const [k, c] of A) { n += c; x += Math.min(c, B.get(k) || 0); } for (const c of B.values()) n += c;
  const dice = n ? 2 * x / n : 0; if (dice < 0.9) warns.push(`${v.v}: ebraica OSHB vs Rosen potrivire doar ${dice.toFixed(2)}`);
  const old = (v.tokens || []).filter(t => t.heb);
  const placed = []; let pos = 0; const covered = new Set();
  for (const e of ent) {
    const [ro, hi, o0 = {}, o1 = {}] = e; const o = typeof o0 === 'string' ? Object.assign({ d: o0 }, o1) : o0; const label = `${v.v} «${ro}»`;
    const idxs = [].concat(hi);
    if (idxs.some(i => !ws[i])) { errs.push(`${label}: indice ebraic inexistent ${hi}`); continue; }
    if (idxs.some(i => covered.has(i))) { errs.push(`${label}: cuvânt ebraic deja folosit ${hi}`); continue; }
    idxs.forEach(i => covered.add(i));
    if (ro === '') { stats.skipped += idxs.length; continue; }
    if (idxs.length > 2 && !o.ok3) errs.push(`${label}: tag cu ${idxs.length} cuvinte ebraice (maxim 2; ok3 doar pentru expresii strânse)`);
    for (let k = 1; k < idxs.length; k++) if (idxs[k] !== idxs[k - 1] + 1) errs.push(`${label}: cuvintele ebraice nu sunt alăturate`);
    if (onlyStop(ro) && !o.fn) errs.push(`${label}: fragment format numai din cuvinte de legătură`);
    const findW = from => { let i = v.t.indexOf(ro, from); while (i >= 0 && ((i > 0 && L.test(v.t[i - 1]) && L.test(ro[0])) || (L.test(v.t[i + ro.length] || '') && L.test(ro[ro.length - 1])))) i = v.t.indexOf(ro, i + 1); return i; };
    let at = o.at ? findW(Math.max(0, v.t.indexOf(o.at))) : findW(pos); if (at < 0) at = findW(0);
    if (at < 0) { errs.push(`${label}: nu apare în textul Rosen`); continue; }
    if (placed.some(p => at < p.at + p.len && p.at < at + ro.length)) { errs.push(`${label}: se suprapune cu alt fragment (folosește {at:'...'})`); continue; }
    const hw = idxs.map(i => ws[i]);
    const contentW = hw.filter(w => !isFunc(w.morph));
    const cS = contentW.map(w => w.strong).filter(Boolean); const strong = o.s || cS[0] || hw.map(w => w.strong).filter(Boolean)[0];
    const key = o.k || (cS.length > 1 ? cS.join('+') : strong);
    const B0 = bank[key] || {};
    const def = o.d !== undefined ? o.d : B0.d, dict = o.x !== undefined ? o.x : B0.x;
    if (!def) { errs.push(`${label}: lipsește def_ro (bank ${key})`); stats.missing.add(key); }
    if (!dict) { errs.push(`${label}: lipsește dict_ro (bank ${key})`); stats.missing.add(key); }
    const tok = { t: ro, w: ro, heb: hw.map(w => w.heb).join(' '), translit: o.tr || hw.map(w => w.translit).join(' '), strong, pos: o.pos || hw.map(w => w.pos).join(' + '), def_ro: def ? fixBooks(def) : def };
    if (/\([^)]*\)\s*$/.test(tok.def_ro || '')) warns.push(`${label}: def_ro se termină cu paranteză`);
    if (dict) { tok.dict_ro = fixBooks(dict); unknownBooks(tok.dict_ro).forEach(z => errs.push(`${label}: nume de carte necunoscut în dict_ro: «${z}»`)); checkRefs(tok.dict_ro, strong).forEach(z => warns.push(`${label} dict_ro → ${z}`)); }
    // LXX existent: se păstrează doar dacă tagul vechi are același Strong, e scurt și se suprapune pe cuvintele ebraice noi
    const nc = new Set(hw.map(w => cons(w.heb)));
    const carry = old.find(t => t.greek && t.strong === strong && t.heb.split(/\s+/).length <= 2 && t.heb.split(/\s+/).some(h => nc.has(cons(h))));
    if (carry) { tok.greek = carry.greek; tok.greek_def_ro = carry.greek_def_ro; if (carry.diff_ro) tok.diff_ro = carry.diff_ro; carry._used = true; stats.lxxCarried++; }
    placed.push({ at, len: ro.length, tok, idxs }); pos = at + ro.length;
    if (idxs.length > 1) stats.pairs++;
  }
  // acoperire: fiecare cuvânt ebraic de conținut trebuie fie tagat, fie lăsat conștient (ro '')
  const unc = ws.filter(w => !covered.has(w.i) && !isFunc(w.morph));
  if (unc.length) errs.push(`${v.v}: cuvinte ebraice de conținut fără tag și fără marcaj de omitere: ` + unc.map(w => `${w.i}:${w.translit}`).join(', '));
  for (const o of old) if (o.greek && !o._used) stats.lxxLost++;
  placed.sort((p, q) => p.at - q.at);
  // ordinea ebraică vs ordinea textului: doar informativ
  const tokens = []; let cur = 0;
  for (const p of placed) { if (p.at > cur) tokens.push({ t: v.t.slice(cur, p.at) }); tokens.push(p.tok); cur = p.at + p.len; }
  if (cur < v.t.length) tokens.push({ t: v.t.slice(cur) });
  if (tokens.map(t => t.t).join('') !== v.t) errs.push(`${v.v}: tokenii nu refac textul`);
  // dict_ro identic la strong-uri diferite în același verset
  const seen = new Map();
  for (const p of placed) { const k2 = p.tok.dict_ro; if (!k2) continue; if (seen.has(k2) && seen.get(k2) !== p.tok.strong) errs.push(`${v.v}: același dict_ro la două cuvinte diferite («${p.tok.w}»)`); seen.set(k2, p.tok.strong); }
  stats.verses++; stats.tags += placed.length;
  return Object.assign({}, v, { tokens });
});
const mean = (stats.tags / stats.verses).toFixed(2);
console.log(`Cap. ${cn} ${ch.title}: ${stats.verses} versete, ${stats.tags} tag-uri (${mean}/verset), din care ${stats.pairs} perechi; omise conștient ${stats.skipped} cuvinte ebraice; LXX păstrat ${stats.lxxCarried}, de refăcut ${stats.lxxLost}`);
if (warns.length) console.log('ATENȚIONĂRI (' + warns.length + '):\n' + warns.join('\n'));
if (errs.length) { console.log('ERORI (' + errs.length + '):\n' + errs.join('\n')); if (stats.missing.size) console.log('CHEI LIPSĂ DIN BANK: ' + [...stats.missing].join(' ')); process.exit(1); }
console.log('0 erori.');
if (WRITE) {
  fs.copyFileSync(WF, WF + '.bak-retag');
  ch.verses = newVerses; fs.writeFileSync(WF, JSON.stringify(d, null, 1));
  console.log('Scris: capitolul.');
}
