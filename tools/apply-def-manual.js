// Înlocuiește def_ro-urile cu resturi englezești cu cele din tools/def-manual.js. node tools/apply-def-manual.js N... [--write]
const fs = require('fs'); const { rospell } = require('./lib-ro.js'); const M = require('./def-manual.js');
(async () => {
  const ROS = await rospell(); const en = new Set(JSON.parse(fs.readFileSync(require('os').tmpdir() + '/en.json', 'utf8')));
  const isEn = (s) => (s.match(/[A-Za-zăâîșțĂÂÎȘȚ]+/g) || []).some(v => { v = v.toLowerCase(); return v.length > 2 && en.has(v) && !ROS.has(v); });
  const W = process.argv.includes('--write'); const miss = new Set();
  for (const N of process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number)) {
    const file = 'public/genesis-' + N + '.js'; const D = new Function('window', fs.readFileSync(file, 'utf8') + ';return window;')({}).CHAPTER_DATA; let n = 0;
    for (const x of D) for (const t of x.tokens.filter(t => t.heb && t.def_ro && isEn(t.def_ro))) { if (M[t.strong]) { t.def_ro = M[t.strong]; n++; } else miss.add(t.strong + ' ' + t.w); }
    console.log('Geneza ' + N + ': înlocuite ' + n); if (W) fs.writeFileSync(file, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
  }
  console.log('fără definiție manuală:', [...miss].join('; '));
})();
