// Pasul 1 din standard: reutilizează def_ro / greek_def_ro / diff_ro deja făcute în capitolele anterioare (Geneza 1..N-1), apoi listează ce rămâne de scris.
// node tools/reuse-lexicon.js N [--write]  (N = capitolul de completat; sursa = capitolele 1..N-1 deja la standard)
const fs = require('fs');
const N = +process.argv[2], WRITE = process.argv.includes('--write'), FROM = +(process.argv.find(a => /^--from=/.test(a)) || '--from=1').slice(7), TO = +(process.argv.find(a => /^--to=/.test(a)) || '--to=3').slice(5);
const P = 'C:/Users/ivcatali/biblie-app/public/';
const load = (n) => new Function('window', fs.readFileSync(P + 'genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
const byPair = {}, byGreek = {}, byStrong = {};
for (let n = FROM; n <= TO; n++) load(n).forEach(x => x.tokens.filter(t => t.heb).forEach(t => {
  if (t.greek_def_ro) { byPair[t.strong + '|' + t.greek] = { g: t.greek_def_ro, d: t.diff_ro || '' }; byGreek[t.greek] = byGreek[t.greek] || t.greek_def_ro; }
  if (t.def_ro && t.def_ro.length > 12) byStrong[t.strong] = byStrong[t.strong] || t.def_ro;
}));
const D = load(N); const todo = []; let hitP = 0, hitG = 0, hitS = 0, tot = 0;
for (const x of D) for (const t of x.tokens.filter(t => t.heb)) {
  tot++;
  if (byStrong[t.strong] && (!t.def_ro || t.def_ro.length <= 12 || t._old)) { t.def_ro = byStrong[t.strong]; hitS++; }
  const p = byPair[t.strong + '|' + t.greek];
  if (p && !t.greek_def_ro) { t.greek_def_ro = p.g; if (p.d) t.diff_ro = p.d; hitP++; }
  else if (!t.greek_def_ro && byGreek[t.greek] && /^[^ ]/.test(byGreek[t.greek])) { t.greek_def_ro = byGreek[t.greek]; hitG++; }
  if (!t.greek_def_ro || !t.def_ro || t.def_ro.length <= 12) todo.push(x.num + '|' + t.w + '|' + t.heb + '|' + t.strong + '|' + t.greek + '|' + (t.def_ro || ''));
}
console.log((WRITE ? 'SCRIS' : 'PROBĂ') + ' tokeni', tot, '| def_ro reutilizat', hitS, '| greek_def_ro pe pereche', hitP, '| pe formă greacă', hitG, '| rămân', todo.length);
if (process.argv.includes('--list')) todo.forEach(l => console.log(l));
if (WRITE) fs.writeFileSync(P + 'genesis-' + N + '.js', 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
