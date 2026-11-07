// Pune la rândurile Josephus eticheta „cap. N” exactă (după titlul din Bibliotecă: capitolul N = numărul din listă − 1) și ținta `src` corectă, potrivind textul rândului cu unitatea. node tools/fix-josephus-labels.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const ZW = /[⁠​‌]/g;
const plain = (t) => String(t).replace(ZW, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const w = { LIB_LAZY: {} }; new Function('window', fs.readFileSync('public/josephus/antichitati-01.js', 'utf8'))(w);
const idx = {}; for (const k in w.LIB_LAZY) { const m = /#(\d+)$/.exec(k); if (!m) continue; for (const u of w.LIB_LAZY[k]) idx[plain(u.t)] = { num: +m[1], v: u.v }; }
let fixed = 0, unk = 0;
for (let n = 1; n <= 50; n++) {
  const f = 'public/genesis-' + n + '.js'; if (!fs.existsSync(f)) continue;
  const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA; let ch = 0;
  for (const x of D) for (const c of x.commentaries || []) if (/^Josephus Flavius, Antichit/.test(c.author || '')) {
    const pt = plain(c.text); let u = idx[pt]; if (!u) { const k = Object.keys(idx).find(t => t.includes(pt.slice(0, 80))); if (k) u = idx[k]; } if (!u) { unk++; console.log('nepotrivit', n + ':' + x.num, c.author); continue; }
    const lab = 'Josephus Flavius, Antichitățile Iudaice, Cartea I, cap. ' + (u.num - 1);
    const src = { slug: 'josephus-antichitati-cartea1', spec: { num: u.num, v: u.v } };
    if (c.author !== lab || !c.src || c.src.spec.num !== u.num || c.src.spec.v !== u.v) { c.author = lab; c.src = src; ch++; }
  }
  if (ch) { fixed += ch; console.log('Geneza ' + n + ': ' + ch); if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8'); }
}
console.log((WRITE ? 'SCRIS' : 'PROBĂ') + ' | rânduri corectate ' + fixed + ' | nepotrivite ' + unk);
