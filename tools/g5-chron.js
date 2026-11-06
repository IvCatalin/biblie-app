// Geneza 5: dict_ro pentru numerele (anii) din capitol — anul de la creație la nașterea fiului și la moartea fiecărui patriarh, calculat din cifrele capitolului
// (textul masoretic: din textul românesc al tokenului; Septuaginta: din forma grecească). Nimic nu e scris din memorie: totul se obține prin adunare.
const fs = require('fs');
const lex = require('./g5-lex-data.js');
const D = new Function('window', fs.readFileSync('C:/Users/ivcatali/biblie-app/public/genesis-5.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
const num = (v) => lex.numeric.find(n => n[0] === v); // [verset, masoretic, grec]
const P = [ // [nume în text, copil, verset vârstă la naștere, verset ani rămași, verset total]
  ['Adam', 'Șet', 3, 4, 5], ['Șet', 'Enoș', 6, 7, 8], ['Enoș', 'Keinan', 9, 10, 11], ['Keinan', 'Mahalalel', 12, 13, 14], ['Mahalalel', 'Iared', 15, 16, 17],
  ['Iared', 'Enoh', 18, 19, 20], ['Enoh', 'Matusalem', 21, 22, 23], ['Matusalem', 'Lameh', 25, 26, 27], ['Lameh', 'Noe', 28, 30, 31]
];
const out = {}; const W = (v) => D.find(x => x.num === v).tokens.find(t => t.heb && /ἔτη|ἐτῶν/.test(t.greek)).w;
let bm = 0, bg = 0; const table = [];
for (const [name, child, va, vr, vt] of P) {
  const a = num(va), r = num(vr), t = num(vt);
  const cm = bm + a[1], cg = bg + a[2]; // anul nașterii copilului
  const dm = bm + t[1], dg = bg + t[2]; // anul morții
  if (a[1] + r[1] !== t[1]) throw new Error('masoretic: ' + name + ' ' + a[1] + '+' + r[1] + '≠' + t[1]);
  if (a[2] + r[2] !== t[2]) throw new Error('LXX: ' + name + ' ' + a[2] + '+' + r[2] + '≠' + t[2]);
  const lx = (m, g, fmt) => m === g ? fmt(m) + ' (la fel în Septuaginta)' : fmt(m) + ' (în Septuaginta, ' + fmt(g) + ')';
  out[va + '|' + W(va)] = child + ' se naște în anul ' + lx(cm, cg, x => x) + ' de la creație. Anul se obține adunând vârstele patriarhilor la nașterea fiului lor, de la Adam încoace.';
  out[vr + '|' + W(vr)] = name + ' mai trăiește ' + r[1] + ' de ani după nașterea lui ' + child + (r[1] === r[2] ? '' : ' (în Septuaginta, ' + r[2] + ')') + '; împreună cu cei ' + a[1] + ' de dinainte, face ' + t[1] + ' de ani.';
  let tdict = name + (name === 'Enoh' ? '' : ' moare') + ' în anul ' + lx(dm, dg, x => x) + ' de la creație.';
  if (name === 'Enoh') tdict = 'Viața lui Enoh pe pământ, 365 de ani, se încheie în anul ' + lx(dm, dg, x => x) + ' de la creație, când „l-a luat Dumnezeu” (5:24); e cea mai scurtă viață din capitol.';
  out[vt + '|' + W(vt)] = tdict;
  table.push([name, cm, cg, dm, dg]); bm = cm; bg = cg;
}
// Noe: 500 de ani la nașterea fiilor, 600 la potop (7:6)
const nm = bm, ng = bg; const n32 = num(32);
out['32|' + W(32)] = 'Cei trei fii se nasc când Noe are ' + n32[1] + ' de ani, adică în anul ' + (nm + n32[1]) + ' de la creație (în Septuaginta, anul ' + (ng + n32[2]) + '). Potopul vine când Noe are 600 de ani (7:6): în anul ' + (nm + 600) + ' (în Septuaginta, ' + (ng + 600) + ').';
// Matusalem: formulare finală cu valorile calculate
const mat = table.find(r => r[0] === 'Matusalem'); const [_, , , mdm, mdg] = mat;
out['27|' + W(27)] = 'Matusalem moare în anul ' + mdm + ' de la creație' + (mdm === mdg ? '' : ' (în Septuaginta, ' + mdg + ')') + '. După cifrele textului masoretic, acesta e chiar anul potopului (' + (nm + 600) + ', adică Noe la 600 de ani, 7:6); după cifrele Septuagintei, potopul vine în anul ' + (ng + 600) + ', deci Matusalem ar muri la ' + (mdg - (ng + 600)) + ' ani după el.';
module.exports = { dictByVerse: out, table };
if (require.main === module) { console.log(table.map(r => r.join(' | ')).join('\n')); Object.entries(out).forEach(([k, v]) => console.log(k + ' => ' + v)); }
