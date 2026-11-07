// Listează tokenii al căror def_ro conține un cuvânt netriat de DOOM3: node tools/doom3-defs.js
const fs = require('fs');
const st = JSON.parse(fs.readFileSync('data/doom3-state.json', 'utf8'));
const allow = fs.existsSync('data/doom3-allow.json') ? JSON.parse(fs.readFileSync('data/doom3-allow.json', 'utf8')) : {};
const seen = new Set();
for (const N of Object.keys(st).map(Number)) {
  const bad = new Set((st[N].netriate || []).filter(w => !allow[w]));
  const D = new Function('window', fs.readFileSync('public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  for (const x of D) for (const t of x.tokens) {
    if (!t.def_ro) continue;
    const ws = (t.def_ro.toLowerCase().match(/[a-zăâîșț]+/g) || []).filter(w => bad.has(w));
    if (!ws.length) continue;
    const k = t.strong + '|' + t.def_ro; if (seen.has(k)) continue; seen.add(k);
    console.log(N + ':' + x.num + ' ' + t.strong + ' ' + (t.w || '') + ' => ' + t.def_ro + '   [' + ws.join(',') + ']');
  }
}
