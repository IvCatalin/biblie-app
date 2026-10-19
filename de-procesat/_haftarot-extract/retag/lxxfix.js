// node retag/lxxfix.js <cap>            — arată versetele al căror text LXX din textCompare e incomplet față de Rahlfs 1935 (acoperă <90%) sau fără corespondent
// node retag/lxxfix.js <cap> --scrie    — aplică retag/lxxtr-cNN.js: { "4:1": { tr: "traducere RO a textului grecesc complet", note: "(opțional) nota despre diferența TM–LXX" }, ... }
//                                          înlocuiește `original` cu textul Rahlfs și `translation` cu traducerea nouă; pentru versetele fără corespondent în Rahlfs, specificația are { none: "nota" }
const fs = require('fs'), path = require('path');
const WF = path.join(__dirname, '../haftarot-ciclu-saptamanal.json');
const cn = +process.argv[2]; const WRITE = process.argv.includes('--scrie');
const d = JSON.parse(fs.readFileSync(WF, 'utf8')); const ch = d.chapters.find(c => c.num === cn);
const RH = JSON.parse(fs.readFileSync(path.join(__dirname, 'rahlfs-haftarot.json'), 'utf8'));
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ς/g, 'σ').replace(/[^α-ω\s]/g, ' ').split(/\s+/).filter(Boolean);
function lcs(a, b) { const n = a.length, m = b.length; const dp = Array.from({ length: n + 1 }, () => new Int16Array(m + 1)); for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]); return dp[n][m]; }
const status = v => {
  const r = RH[cn + '|' + v.v]; const e = (v.textCompare || []).find(t => t.greek);
  if (!r || !r.text) return { st: 'fara', r, e };
  if (!e) return { st: 'lipseste', r, e };
  const ex = norm(e.original), rh = norm(r.text); const L = lcs(ex, rh);
  return { st: L / rh.length < +(process.env.LXXTH || 0.9) ? 'inlocuieste' : 'ok', cov: L / rh.length, r, e };
};
if (!WRITE) {
  let n = 0;
  for (const v of ch.verses) { const s = status(v); if (s.st === 'ok') continue; n++;
    console.log(`\n[${v.v}] ${s.st.toUpperCase()}${s.cov !== undefined ? ' (acoperire ' + (100 * s.cov).toFixed(0) + '%)' : ''}  Rahlfs: ${s.r && s.r.rk}${s.r && s.r.mapped ? ' (mapat prin căutare)' : ''}`);
    console.log('TM-RO : ' + v.t);
    console.log('NOU   : ' + (s.r && s.r.text));
    console.log('VECHI : ' + (s.e && s.e.original));
    console.log('TRAD  : ' + (s.e && s.e.translation));
    console.log('NOTA  : ' + (s.e && s.e.note));
  }
  console.log(`\n# cap. ${cn}: ${n} versete de tratat din ${ch.verses.length}`); process.exit(0);
}
const spec = require('./lxxtr-c' + String(cn).padStart(2, '0') + '.js'); const errs = [];
for (const v of ch.verses) {
  const s = status(v); if (s.st === 'ok') continue; const sp = spec[v.v];
  if (!sp) { errs.push(`${v.v}: lipsește din specificație (${s.st})`); continue; }
  if (s.st === 'fara') {
    if (!sp.none) { errs.push(`${v.v}: fără corespondent în Rahlfs — cere { none: "nota" }`); continue; }
    v.textCompare = (v.textCompare || []).filter(t => !t.greek);
    v.textCompare.push({ source: 'Septuaginta (greacă, sec. III-II î.Hr.)', original: '', greek: true, translation: 'Septuaginta nu are acest verset.', note: sp.none });
    continue;
  }
  if (!sp.tr || sp.tr.length < 10) { errs.push(`${v.v}: lipsește traducerea`); continue; }
  const e = s.e || (() => { const x = { source: 'Septuaginta (greacă, sec. III-II î.Hr.)', greek: true }; v.textCompare.push(x); return x; })();
  e.original = s.r.text; e.translation = sp.tr; if (sp.note) e.note = sp.note;
}
if (errs.length) { console.log('ERORI (' + errs.length + '):\n' + errs.join('\n')); process.exit(1); }
fs.copyFileSync(WF, WF + '.bak-lxxfix'); fs.writeFileSync(WF, JSON.stringify(d, null, 1)); console.log('Scris: textCompare LXX actualizat în cap. ' + cn);
