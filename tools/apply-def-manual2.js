// Înlocuiește def_ro scurt/ecou cu intrarea din tools/def-manual2.js. node tools/apply-def-manual2.js N... [--write]
const fs = require('fs'); const M = require('./def-manual2.js');
const stub = (t) => !t.def_ro || t.def_ro.replace(/[ .]/g, '').toLowerCase() === (t.w || '').replace(/[ .]/g, '').toLowerCase() || (t.def_ro.length < 14 && !/ /.test(t.def_ro.trim()));
const W = process.argv.includes('--write'); const miss = new Set();
for (const N of process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number)) {
  const file = 'public/genesis-' + N + '.js'; const D = new Function('window', fs.readFileSync(file, 'utf8') + ';return window;')({}).CHAPTER_DATA; let n = 0;
  for (const x of D) for (const t of x.tokens.filter(t => t.heb && stub(t))) { if (M[t.strong]) { t.def_ro = M[t.strong]; n++; } else miss.add(N + ':' + x.num + ' ' + t.strong + ' ' + t.w); }
  console.log('Geneza ' + N + ': înlocuite ' + n); if (W && n) fs.writeFileSync(file, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
console.log('fără definiție:', [...miss].join('; '));
