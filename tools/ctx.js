// Arată contextul unui cuvânt în capitolele Genezei: node tools/ctx.js cuvânt[,cuvânt...] [N-M]
const fs = require('fs');
const words = process.argv[2].split(','); const [a, b] = (process.argv[3] || '1-23').split('-').map(Number);
for (let n = a; n <= b; n++) {
  const D = new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  for (const x of D) { const items = [];
    for (const t of x.tokens) for (const f of ['t', 'def_ro', 'dict_ro', 'greek_def_ro', 'diff_ro']) if (t[f]) items.push([f, t[f]]);
    for (const c of x.textCompare) { items.push(['tc', c.translation || '']); items.push(['tcn', c.note || '']); }
    for (const c of x.commentaries) items.push(['c:' + c.author.slice(0, 18), c.text || '']);
    if (x.fidela) items.push(['fidela', JSON.stringify(x.fidela)]);
    for (const [f, t] of items) for (const w of words) { const m = String(t).replace(/<[^>]+>/g, ' ').match(new RegExp('.{0,45}(?<![A-Za-zăâîșț])' + w + '(?![A-Za-zăâîșț]).{0,40}', 'i')); if (m) console.log(w + ' | ' + n + ':' + x.num + ' ' + f + ' | ' + m[0].replace(/\s+/g, ' ')); }
  }
}
