// node derive.js <capS> <capW> — schiță c<capS>.js din ../retag/c<capW>.js pentru versetele cu același osis; text identic => 'KEEP' (după import-weekly), altfel intrările săptămânale, cu fragmentele negăsite marcate
const fs = require('fs'), path = require('path');
const cs = +process.argv[2], cw = +process.argv[3], p = n => String(n).padStart(2, '0');
const S = JSON.parse(fs.readFileSync(path.join(__dirname, '../haftarot-sarbatori.json'), 'utf8')).chapters.find(c => c.num === cs);
const W = JSON.parse(fs.readFileSync(path.join(__dirname, '../haftarot-ciclu-saptamanal.json'), 'utf8')).chapters.find(c => c.num === cw);
const MS = JSON.parse(fs.readFileSync(path.join(__dirname, '../../_sarbatori_extract/oshb-map-sarbatori.json'), 'utf8'));
const MW = JSON.parse(fs.readFileSync(path.join(__dirname, '../../_haftarot-deuteronom-extract/oshb-map.json'), 'utf8'));
const spec = require('../retag/c' + p(cw) + '.js');
const q = s => JSON.stringify(s).replace(/"/g, "'").replace(/\'/g, "'");
let out = `// ${S.title} — ${S.ref} — derivat din ciclul săptămânal cap. ${cw}\nmodule.exports = {\n  bank: require('./bank-c${p(cs)}.js'),\n  v: {\n`;
const todo = [];
for (const v of S.verses) {
  const o = (MS[cs + '|' + v.v] || {}).osis; const w = W.verses.find(x => MW[cw + '|' + x.v] && MW[cw + '|' + x.v].osis === o);
  if (!w || !spec.v[w.v]) { out += `    '${v.v}': [], // LIPSEȘTE în săptămânal\n`; todo.push(v.v + ' lipsă'); continue; }
  if (w.t === v.t && w.heb === v.heb) { out += `    '${v.v}': 'KEEP',\n`; continue; }
  const items = spec.v[w.v].map(e => { const fr = e[0]; const ok = fr === '' || v.t.includes(fr); if (!ok) todo.push(`${v.v} «${fr}»`); return (ok ? '' : '/*NEGĂSIT*/ ') + JSON.stringify(e).replace(/^\[/, '[').replace(/"/g, "'"); });
  out += `    '${v.v}': [${items.join(', ')}], // text diferit față de ${cw}|${w.v}\n`;
}
out += '  },\n};\n';
fs.writeFileSync(path.join(__dirname, 'c' + p(cs) + '.js.draft'), out);
console.log('scris c' + p(cs) + '.js.draft; de verificat:\n' + todo.join('\n'));
