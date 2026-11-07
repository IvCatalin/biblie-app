// Leagă unitățile din Jubilee / Cartea Dreptului / Josephus de versetele Genezei (capitolele din ferestre fixate), după suprapunerea de cuvinte cu textul Rosen al versetului.
// node tools/add-context-auto.js [--write] [--min=N] [--show]   Textul rândului = unitatea întreagă, cuvânt cu cuvânt; `src` ascuns pentru „Citește pasajul”.
const fs = require('fs');
const WRITE = process.argv.includes('--write'), SHOW = process.argv.includes('--show');
const MIN = +((process.argv.find(a => a.startsWith('--min=')) || '--min=7').split('=')[1]);
const ZW = /[⁠​‌]/g;
const L = (() => { const s = fs.readFileSync('public/library-data.js', 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); })();
const plain = (t) => String(t).replace(ZW, '').replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const book = (slug) => { let b = null; (function f(o) { if (!o || b) return; if (Array.isArray(o)) return o.forEach(f); if (typeof o !== 'object') return; if (o.slug === slug && !o.isHeader && o.available) { b = o; return; } Object.values(o).forEach(f); })(L); return b; };
const josW = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/josephus/antichitati-01.js', 'utf8'))(josW);
const units = {
  jubileele: (c) => (book('jubileele').chapters.find(x => x.num === c) || { verses: [] }).verses.map(v => ({ v: v.v, t: plain(v.t) })),
  'cartea-dreptului': (c) => (book('cartea-dreptului').chapters.find(x => x.num === c) || { verses: [] }).verses.map(v => ({ v: v.v, t: plain(v.t) })),
  'josephus-antichitati-cartea1': (c) => (josW.LIB_LAZY['josephus-antichitati-cartea1#' + (c + 1)] || []).map(v => ({ v: v.v, t: plain(v.t) }))
};
units['apocalipsa-avraam'] = (c) => ((book('apocalipsa-avraam').chapters.find(x => x.num === c) || { verses: [] }).verses || []).map(v => ({ v: v.v, t: plain(v.t) }));
const label = { 'apocalipsa-avraam': (c) => 'Apocalipsa lui Avraam ' + c + ' — comparație', jubileele: (c) => 'Cartea Jubileelor ' + c + ' — comparație', 'cartea-dreptului': (c) => 'Cartea Dreptului ' + c + ' — comparație', 'josephus-antichitati-cartea1': (c) => 'Josephus Flavius, Antichitățile Iudaice, Cartea I, cap. ' + c };
// slug -> { capitolul lucrării: [gen_de_la, gen_până_la] }
const W = {
  'apocalipsa-avraam': { 1: [11, 28, 12, 4], 2: [11, 28, 12, 4], 3: [11, 28, 12, 4], 4: [11, 28, 12, 4], 5: [11, 28, 12, 4], 6: [11, 28, 12, 4], 7: [11, 28, 12, 4], 8: [11, 28, 12, 4], 9: [15, 15], 10: [15, 15], 11: [15, 15], 12: [15, 15], 13: [15, 15], 14: [15, 15], 15: [15, 15], 16: [15, 15], 17: [15, 15] },
  jubileele: { 2: [1, 2], 3: [2, 3], 4: [3, 5], 5: [5, 7], 6: [8, 9], 7: [9, 9], 8: [10, 1, 11, 26], 9: [10, 10], 10: [11, 1, 11, 9], 11: [11, 10, 11, 32], 12: [11, 26, 12, 9], 13: [12, 5, 13, 18], 14: [15, 16], 15: [17, 17], 16: [18, 19], 17: [21, 21], 18: [22, 22], 19: [23, 25], 20: [25, 25], 23: [25, 7, 25, 11], 24: [25, 11, 26, 33] },
  'cartea-dreptului': { 1: [1, 1], 2: [4, 5], 3: [5, 5], 4: [5, 5], 5: [6, 7], 6: [7, 8], 7: [9, 10], 8: [11, 11], 9: [11, 11], 10: [11, 11], 11: [11, 12], 12: [11, 12], 13: [11, 12], 14: [11, 12], 15: [12, 12], 16: [14, 14], 17: [14, 14], 18: [15, 15], 19: [18, 19], 20: [20, 20], 21: [21, 21], 22: [21, 21], 23: [22, 22], 24: [23, 23], 25: [25, 25], 26: [25, 25], 27: [25, 26] },
  'josephus-antichitati-cartea1': { 1: [1, 2], 2: [3, 5], 3: [6, 9], 4: [11, 11], 5: [10, 11], 6: [10, 10], 7: [11, 12], 8: [12, 13], 9: [14, 14], 10: [14, 14], 11: [18, 19], 12: [20, 21], 13: [21, 22], 14: [22, 23], 15: [23, 25], 16: [25, 25], 17: [24, 24], 18: [25, 25] }
};
const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const stems = (s) => [...new Set((strip(s).match(/[a-z0-9]{4,}/g) || []).map(w => w.slice(0, 5)))];
const GEN = {}; const all = {};
for (let n = 1; n <= 26; n++) { const f = 'public/genesis-' + n + '.js'; GEN[n] = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA; }
const df = {}; let nv = 0;
for (const n in GEN) for (const x of GEN[n]) { nv++; x._st = new Set(stems(x.tokens.map(t => t.t).join(''))); x._st.forEach(w => df[w] = (df[w] || 0) + 1); }
const idf = (w) => Math.log(nv / (1 + (df[w] || 0)));
const existing = new Set(); for (const n in GEN) for (const x of GEN[n]) for (const c of x.commentaries || []) if (c.text) existing.add(plain(c.text));
const added = {}; let tot = 0, skipLow = 0, dup = 0; const report = [];
for (const slug in W) for (const c in W[slug]) {
  if (slug === 'josephus-antichitati-cartea1') continue; // Josephus: potrivire manuală mai jos
  const win = W[slug][c]; const lo = win[0], hi = win.length === 4 ? win[2] : win[1]; const us = units[slug](+c); const MINS = slug === 'jubileele' ? MIN + 4 : MIN;
  const vs = []; for (let n = lo; n <= hi; n++) for (const x of GEN[n]) { if (win.length === 4 && ((n === lo && x.num < win[1]) || (n === hi && x.num > win[3]))) continue; vs.push({ n, x }); }
  // scor unitate x verset
  const S = us.map(u => { const st = stems(u.t); return vs.map(({ x }) => { let s = 0, k = 0; for (const w of st) if (x._st.has(w)) { s += idf(w); k++; } return k >= 4 && s >= MINS ? s : 0; }); });
  // alinierea monotonă (versetul poate primi mai multe unități consecutive; unitățile fără scor se sar)
  const U = us.length, V = vs.length; const dp = Array.from({ length: U + 1 }, () => new Array(V + 1).fill(0)); const bk = Array.from({ length: U + 1 }, () => new Array(V + 1).fill(null));
  for (let i = 1; i <= U; i++) for (let j = 1; j <= V; j++) {
    let best = dp[i - 1][j], from = 'u'; // unitatea i sărită, rămâne j
    if (dp[i][j - 1] > best) { best = dp[i][j - 1]; from = 'j'; }
    const sc = S[i - 1][j - 1]; if (sc > 0 && dp[i - 1][j] + sc > best) { best = dp[i - 1][j] + sc; from = 'm'; }
    dp[i][j] = best; bk[i][j] = from;
  }
  let i = U, j = V; const asg = [];
  while (i > 0 && j > 0) { const f = bk[i][j]; if (f === 'm') { asg.push([i - 1, j - 1]); i--; } else if (f === 'u') i--; else j--; }
  const asgSet = new Set(asg.map(a => a[0]));
  for (const [ui, vj] of asg.reverse()) {
    const u = us[ui], { n, x } = vs[vj];
    if (existing.has(u.t)) { dup++; continue; }
    (added[n] = added[n] || []).push({ x, row: { author: label[slug](+c), text: u.t, src: { slug, spec: { num: +c, v: u.v } } } }); existing.add(u.t); tot++;
    if (SHOW) report.push('  + ' + slug + ' ' + c + ':' + u.v + ' → Gen ' + n + ':' + x.num + ' (' + S[ui][vj].toFixed(1) + ') ' + u.t.slice(0, 60));
  }
  skipLow += U - asgSet.size;
}
// Josephus: potrivire manuală [cap. titlu, unitate, capitol Geneza, verset]
const JOS = [[1,1,1,1],[1,2,2,2],[1,3,2,8],[1,4,3,1],[2,1,4,1],[2,2,4,17],[2,3,5,5],[3,1,5,6],[3,2,6,9],[3,3,7,11],[3,4,5,3],[3,5,7,12],[3,6,8,4],[3,7,8,20],[3,8,9,11],[3,9,9,29],[4,1,11,1],[4,2,11,4],[4,3,11,4],[5,1,11,8],[6,1,10,2],[6,2,10,6],[6,3,10,1],[6,4,10,22],[6,5,11,26],[7,1,11,31],[7,2,11,28],[8,1,12,10],[8,2,12,11],[8,3,13,1],[9,1,14,1],[10,1,14,14],[10,2,14,17],[10,3,15,1],[10,4,18,1],[11,1,18,20],[11,2,18,17],[11,3,18,23],[11,4,19,1],[11,5,19,31],[12,1,20,1],[12,2,21,2],[12,3,21,9],[12,4,21,21],[13,1,22,2],[13,2,22,3],[13,3,22,9],[13,4,22,12],[14,1,23,1],[15,1,25,1],[16,1,24,2],[16,2,24,17],[16,3,24,32],[17,1,25,8],[18,1,25,21],[18,2,26,1],[18,3,26,12]];
for (const [cap, un, gn, gv] of JOS) {
  const slug = 'josephus-antichitati-cartea1'; const u = units[slug](cap).find(q => q.v === un); if (!u) continue; if (existing.has(u.t)) { dup++; continue; }
  const x = GEN[gn] && GEN[gn].find(q => q.num === gv); if (!x) continue;
  (added[gn] = added[gn] || []).push({ x, row: { author: label[slug](cap), text: u.t, src: { slug, spec: { num: cap + 1, v: u.v } } } }); existing.add(u.t); tot++;
  if (SHOW) report.push('  + josephus ' + cap + ':' + un + ' → Gen ' + gn + ':' + gv + ' ' + u.t.slice(0, 60));
}
if (SHOW) console.log(report.join('\n'));
console.log((WRITE ? 'SCRIS' : 'PROBĂ') + ' | rânduri noi ' + tot + ' | unități nelegate ' + skipLow + ' | existau ' + dup);
if (WRITE) for (const n in added) {
  added[n].forEach(a => a.x.commentaries.push(a.row));
  for (const x of GEN[n]) { delete x._st; }
  fs.writeFileSync('public/genesis-' + n + '.js', 'window.CHAPTER_DATA = ' + JSON.stringify(GEN[n], null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
