// Arată contextul cuvintelor netriate din data/doom3-state.json: node tools/doom3-ctx.js [N...] [--max=3]
const fs = require('fs'), T = require('./doom3-text.js');
const st = JSON.parse(fs.readFileSync('data/doom3-state.json', 'utf8'));
const args = process.argv.slice(2);
const max = +((args.find(a => a.startsWith('--max=')) || '--max=2').split('=')[1]);
const Ns = args.filter(a => /^\d+$/.test(a)).map(Number);
const allow = fs.existsSync('data/doom3-allow.json') ? JSON.parse(fs.readFileSync('data/doom3-allow.json', 'utf8')) : {};
const seen = {};
for (const N of (Ns.length ? Ns : Object.keys(st).map(Number))) {
  const s = st[N]; if (!s) continue;
  const p = T.parts(N).replace(/\n/g, ' | ');
  for (const w of s.netriate || []) {
    if (allow[w]) continue;
    seen[w] = seen[w] || 0; if (seen[w] >= max) continue;
    const m = new RegExp('.{0,45}(?<![A-Za-zăâîșțĂÂÎȘȚ])' + w + '(?![A-Za-zăâîșț]).{0,30}', 'i').exec(p);
    if (m) { seen[w]++; console.log(w + ' [' + N + '] ' + m[0]); }
  }
}
