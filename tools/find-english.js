// Găsește în câmpurile românești (def_ro, dict_ro, greek_def_ro, diff_ro) cuvinte englezești (din en_US, dar nu din ro_RO). node tools/find-english.js N... [--fix-list]
const fs = require('fs'); const { rospell } = require('./lib-ro.js');
(async () => {
  const ROS = await rospell(); const en = new Set(JSON.parse(fs.readFileSync(require('os').tmpdir() + '/en.json', 'utf8')));
  let tot = 0;
  for (const N of process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number)) {
    const D = new Function('window', fs.readFileSync('public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA; const rows = [];
    for (const x of D) for (const t of x.tokens) for (const f of ['def_ro', 'dict_ro', 'greek_def_ro', 'diff_ro']) {
      if (!t[f]) continue; const w = (t[f].replace(/\([^)]*\)/g, ' ').match(/[A-Za-zăâîșțĂÂÎȘȚ]+/g) || []).map(v => v.toLowerCase()).filter(v => v.length > 2 && en.has(v) && !ROS.has(v));
      if (w.length) rows.push(x.num + ':' + (t.w || '') + ':' + f + ' → ' + [...new Set(w)].slice(0, 6).join(','));
    }
    tot += rows.length; console.log('Geneza ' + N + ': ' + rows.length); rows.slice(0, 400).forEach(r => console.log('  ' + r));
  }
})();
