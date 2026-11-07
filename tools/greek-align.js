// Atribuie `greek` (forma exactă din Rahlfs, din verset) tokenilor unui capitol nou, folosind banca de forme din capitolele 1..N-1 (după Strong's).
// node tools/greek-align.js N [--write]   Ce nu se rezolvă se listează: se completează în tools/gN-fix.js / gN-greek.js ({ 'v|cuvânt': 'formă' }).
const fs = require('fs');
const N = +process.argv[2], WRITE = process.argv.includes('--write');
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ς/g, 'σ').replace(/[^α-ω ]/g, '').trim();
const LX = JSON.parse(fs.readFileSync('data/ref-lxx-rahlfs-gen.json', 'utf8'));
const STOP = new Set('ο η το του της τω τη τον την των τοις ταις τους τας τα οι αι και δε αυτου αυτω αυτον αυτην αυτης αυτων αυτοις αυτοι αυτη μου σου με σε μοι σοι ημιν υμιν ημων υμων εγω συ ο ουτος εκεινος ουν γαρ ου μη ει εαν ινα ως οτι ος η ο ων εν εις εκ επι προς παρα μετα απο κατα υπο περι δια ενωπιον εως αυτος αυτον'.split(' ').map(norm));
const load = (n) => new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
const bank = {}; // strong -> Set(forme normalizate, cuvânt cu cuvânt)
for (let n = 1; n < N; n++) for (const x of load(n)) for (const t of x.tokens) if (t.strong && t.greek) { (bank[t.strong] = bank[t.strong] || new Set()); norm(t.greek).split(' ').forEach((w) => w.length > 1 && !STOP.has(w) && bank[t.strong].add(w)); }
let manual = {}; if (fs.existsSync('tools/g' + N + '-greek.js')) manual = require('./g' + N + '-greek.js');
const stem = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };
const f = 'public/genesis-' + N + '.js'; const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
let ok = 0, miss = [];
for (const x of D) {
  const words = (LX['Gen.' + N + '.' + x.num] || '').split(/\s+/).map((w) => w.replace(/[.,;··]/g, '')).filter(Boolean); const nw = words.map(norm);
  let pos = 0; const occ = {};
  for (const t of x.tokens.filter((t) => t.heb)) {
    const k0 = x.num + '|' + t.w; occ[k0] = (occ[k0] || 0) + 1; const mk = occ[k0] > 1 && manual[k0 + '#' + occ[k0]] !== undefined ? k0 + '#' + occ[k0] : k0; if (manual[mk] !== undefined) { t.greek = manual[mk]; if (t.greek) ok++; continue; }
    if (t.greek) { ok++; continue; }
    const B = bank[t.strong]; let best = -1, score = 0;
    if (B) for (let i = 0; i < nw.length; i++) { if (!nw[i] || nw[i].length < 2 || STOP.has(nw[i])) continue; let s = 0; for (const b of B) { const c = stem(nw[i], b); if (nw[i] === b) s = Math.max(s, 100); else if (c >= 4 && c >= Math.min(nw[i].length, b.length) - 3) s = Math.max(s, c); } if (s && (s > score || (s === score && Math.abs(i - pos) < Math.abs(best - pos)))) { score = s; best = i; } }
    if (best >= 0) { t.greek = words[best]; pos = best; ok++; } else { t.greek = ''; miss.push(x.num + '|' + t.w + ' ' + t.strong + '  ← ' + words.join(' ')); }
  }
}
console.log('Geneza ' + N + ': greacă atribuită ' + ok + ', nerezolvate ' + miss.length);
const by = {}; miss.forEach((m) => { const [a, g] = m.split('  ← '); const v = a.split('|')[0]; (by[v] = by[v] || { g, t: [] }).t.push(a.split('|')[1]); }); for (const v in by) console.log(v + ': ' + by[v].t.join(' ; ') + '\n     ' + by[v].g);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
