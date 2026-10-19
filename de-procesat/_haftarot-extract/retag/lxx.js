// node retag/lxx.js <cap> [vers]            — arată, pentru fiecare verset, textul LXX și tag-urile (cele fără greacă marcate cu «-»)
// node retag/lxx.js <cap> --verifica [--scrie] — aplică retag/lxx-cNN.js: { "4:1": [ item, ... ] } cu un item pentru FIECARE tag al versetului, în ordine
//   item = null            → păstrează grecescul existent al tag-ului (dacă are)
//        = 0               → LXX nu are corespondent pentru acest cuvânt (rămâne fără greacă, onest)
//        = [g, gf, gd, df] → g: lemă (cu articol dacă e substantiv), gf: forma/formele din versetul LXX (verificate în text), gd: definiția în română, df: diferența ebraică/greacă (opțional)
const fs = require('fs'), path = require('path');
const WF = path.join(__dirname, '../haftarot-ciclu-saptamanal.json');
const cn = +process.argv[2]; const d = JSON.parse(fs.readFileSync(WF, 'utf8'));
const ch = d.chapters.find(c => c.num === cn);
const norm = s => s.normalize('NFD').replace(/[̀-ͯ᾽᾿῾ͅ]/g, '').toLowerCase().replace(/ς/g, 'σ');
const GTR = { α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'e', θ: 'th', ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', π: 'p', ρ: 'r', σ: 's', τ: 't', υ: 'y', φ: 'ph', χ: 'ch', ψ: 'ps', ω: 'o' };
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
function inLxx(forms, lxx) {
  const words = norm(lxx).replace(/[^α-ω\s]/g, ' ').split(/\s+/).filter(Boolean);
  return forms.every(f => { const n = norm(f).replace(/[^α-ω]/g, ''); if (!n) return true;
    const stem = n.length <= 2 ? n : n.slice(0, Math.max(2, Math.min(5, n.length - 2)));
    return words.some(w => w.includes(stem)); });
}
const lxxOf = v => { const o = (v.textCompare || []).find(t => t.greek); return o ? o.original : ''; };
const tagsOf = v => (v.tokens || []).filter(t => t.heb);

if (!process.argv.includes('--verifica')) {
  const TOT = process.argv.includes('--tot'); const only = /^--/.test(process.argv[3] || '') ? '' : process.argv[3]; let miss = 0, all = 0;
  for (const v of ch.verses) {
    if (only && v.v !== only) continue;
    const tg = tagsOf(v); const m = tg.filter(t => TOT || !t.greek).length; all += tg.length; miss += m;
    if (!only && !m) continue;
    console.log(`\n[${v.v}] ${v.t}\nLXX: ${lxxOf(v)}`);
    console.log(tg.map((t, i) => `${i}${t.greek ? '+' : '-'}:${t.t}|${t.heb}${t.greek ? '|' + t.greek.replace(/ \(.*/, '') : ''}`).join('  '));
  }
  console.log(`\n# cap. ${cn}: ${all} tag-uri, ${miss} fără greacă`); process.exit(0);
}
const spec = require('./lxx-c' + String(cn).padStart(2, '0') + '.js');
const GL = require('./lxx-gl.js'); const miss = new Set();
const errs = [], warns = []; const st = { greek: 0, kept: 0, none: 0, diff: 0 };
for (const v of ch.verses) {
  const tg = tagsOf(v); const sp = spec[v.v]; if (spec.__tot && sp) tg.forEach(t => { delete t.greek; delete t.greek_def_ro; delete t.diff_ro; });
  if (!sp) { if (tg.some(t => !t.greek)) errs.push(`${v.v}: lipsește din specificație (${tg.filter(t => !t.greek).length} tag-uri fără greacă)`); continue; }
  if (sp.length !== tg.length) { errs.push(`${v.v}: ${sp.length} itemi pentru ${tg.length} tag-uri`); continue; }
  const lxx = lxxOf(v); if (!lxx) { errs.push(`${v.v}: versetul nu are text LXX`); continue; }
  tg.forEach((t, i) => {
    let it = sp[i]; if (typeof it === 'string') { const p = it.split('¦'); it = p[0] === '0' ? [0, p[1] || ''] : [p[0], (p[1] || '').split('/').filter(Boolean), p[2] || '', p[3] || '']; if (!Array.isArray(it) || (it[0] !== 0 && !it[1].length)) it[1] = undefined; } const label = `${v.v} #${i} «${t.t}»`;
    if (it === null || it === undefined) { if (spec.__tot) { errs.push(`${label}: decizie lipsă (mod total: fiecare tag cere item sau 0)`); return; } if (t.greek) st.kept++; else errs.push(`${label}: fără greacă și fără decizie (folosește 0 pentru «LXX nu are corespondent»)`); return; }
    if (it === 0 || (Array.isArray(it) && it[0] === 0)) { delete t.greek; delete t.greek_def_ro; delete t.diff_ro; if (Array.isArray(it) && it[1]) { t.diff_ro = it[1]; st.diff++; } st.none++; return; }
    const [g, gf, gd0, df] = it; const gd = gd0 || GL[g];
    if (!g) { errs.push(`${label}: lipsește g`); return; }
    if (!gd) { miss.add(g); errs.push(`${label}: lipsește definiția pentru «${g}» (adaug-o în lxx-gl.js sau ca al treilea element)`); return; }
    const forms = [].concat(gf || g.replace(/^(ὁ|ἡ|τό|τὸ|οἱ|αἱ|τά|τὰ)\s+/, ''));
    if (!inLxx(forms, lxx)) errs.push(`${label}: grecescul «${forms.join(', ')}» nu apare în LXX: ${lxx.slice(0, 80)}…`);
    t.greek = `${g} (${gtr(g)})`; t.greek_def_ro = `${g} (${gtr(g)}) — ${gd}`; st.greek++;
    if (df) { t.diff_ro = df; st.diff++; } else if (df === '') delete t.diff_ro;
  });
}
let tt = 0, tgk = 0, td = 0; for (const v of ch.verses) for (const t of tagsOf(v)) { tt++; if (t.greek) tgk++; if (t.diff_ro) td++; }
console.log(`Cap. ${cn} ${ch.title}: ${tt} tag-uri, cu greacă ${tgk} (${(100 * tgk / tt).toFixed(0)}%), cu diferență ebraică/greacă ${td}; noi ${st.greek}, păstrate ${st.kept}, fără corespondent ${st.none}`);
if (warns.length) console.log('ATENȚIONĂRI:\n' + warns.join('\n'));
if (errs.length) { console.log('ERORI (' + errs.length + '):\n' + errs.join('\n')); if (miss.size) console.log('LEME FĂRĂ DEFINIȚIE: ' + [...miss].join(' ')); process.exit(1); }
console.log('0 erori.');
if (process.argv.includes('--scrie')) { fs.copyFileSync(WF, WF + '.bak-lxx'); fs.writeFileSync(WF, JSON.stringify(d, null, 1)); console.log('Scris: capitolul.'); }
