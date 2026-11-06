// Aliniază comparația de texte a capitolului N cu sursele: greaca după Rahlfs (cuvinte lipsă/diferite se corectează păstrând punctuația noastră), ebraica după Sefaria (punctare și cuvinte).
// node tools/textcompare-fix.js N [--write]
process.argv.push('--lxx=data/ref-lxx-rahlfs-gen.json', '--he=data/ref-mt-sefaria-gen.json');
const { patch, nk, heClean } = require('./audit-g1-5-textcompare.js');
const fs = require('fs');
const N = +process.argv[2], WRITE = process.argv.includes('--write');
const LX = JSON.parse(fs.readFileSync('data/ref-lxx-rahlfs-gen.json', 'utf8')), HE = JSON.parse(fs.readFileSync('data/ref-mt-sefaria-gen.json', 'utf8'));
const f = 'public/genesis-' + N + '.js';
const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
let nl = 0, nm = 0;
for (const x of D) {
  const k = 'Gen.' + N + '.' + x.num, g = x.textCompare.find(c => c.greek), m = x.textCompare[0];
  if (nk(g.original) !== nk(LX[k])) { const nw = patch(g.original, LX[k]); if (nk(nw) !== nk(LX[k])) throw new Error('patch ' + k); console.log(k, 'LXX\n  -', g.original, '\n  +', nw); g.original = nw; nl++; }
  const raw = HE[k]; if (raw.includes('*')) continue;
  const a = m.original.normalize('NFC').split(' '), b = heClean(raw).split(' ');
  if (a.length === b.length) { const nw = a.map((w, i) => (w === b[i] || /יהֹוָה|עֲוֺ|לֻקֳחָה/.test(w + b[i])) ? w : b[i]); if (nw.join(' ') !== a.join(' ')) { console.log(k, 'MT', a.map((w, i) => nw[i] !== w ? w + '→' + nw[i] : null).filter(Boolean).join(' ; ')); m.original = nw.join(' '); nm++; } }
  else if (a.length < b.length && b.slice(0, a.length).join(' ') === a.join(' ')) { console.log(k, 'MT + ', b.slice(a.length).join(' ')); m.original = b.join(' '); nm++; }
  else console.log(k, 'MT lungimi diferite — de văzut manual', a.length, b.length);
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| LXX', nl, '| MT', nm);
if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
