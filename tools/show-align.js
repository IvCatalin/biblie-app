// Arată pentru capitolul N, versetele a..b: textul Rosen și cuvintele ebraice numerotate. node tools/show-align.js N a b
const fs = require('fs'), os = require('os'), path = require('path');
const [N, a, b] = process.argv.slice(2).map(Number);
const xml = fs.readFileSync(path.join(os.tmpdir(), 'Gen-oshb.xml'), 'utf8');
const D = new Function('window', fs.readFileSync('public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
const clean = (s) => s.replace(/\//g, '').replace(/[֑-ֽ֯׀׃ׄ]/g, '');
for (const x of D) {
  if (x.num < a || x.num > b) continue;
  const m = new RegExp('<verse osisID="Gen\\.' + N + '\\.' + x.num + '">([\\s\\S]*?)</verse>').exec(xml);
  const ws = [...m[1].matchAll(/<w ([^>]*)>([^<]*)<\/w>/g)].map((t, i) => (i + 1) + ':' + clean(t[2]) + '(' + ((/lemma="([^"]*)"/.exec(t[1]) || [])[1] || '').replace(/ [a-z]$/, '').split('/').pop() + ')');
  console.log(x.num + ': ' + x.tokens.map(t => t.t).join('') + '\n   ' + ws.join(' '));
}
