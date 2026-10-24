// node gen-spec.js N > cNN.js — schiță de specificație din tag-urile existente (ebraică potrivită prin consoane cu OSHB)
process.env.OSHBMAP = process.env.OSHBMAP || require('path').join(__dirname, '../../_sarbatori_extract/oshb-map-sarbatori.json');
process.env.SPLITF = process.env.SPLITF || require('path').join(__dirname, 'split-sarb.json');
const fs = require('fs'), path = require('path');
const O = require(path.join(__dirname, '../../_haftarot-deuteronom-extract/oshb.js'));
const cn = +process.argv[2], p = String(cn).padStart(2, '0');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../haftarot-sarbatori.json'), 'utf8')); const ch = d.chapters.find(c => c.num === cn);
const B = String.fromCharCode(92); const q = s => "'" + String(s).split(B).join(B+B).split("'").join(B+"'") + "'";
let out = `// ${ch.title} — ${ch.ref} — retagare per cuvânt\nmodule.exports = {\n  bank: require('./bank-c${p}.js'),\n  v: {\n`;
for (const v of ch.verses) {
  const ws = O.haftWords(cn, v.v); let ptr = 0; const items = [];
  for (const t of v.tokens) {
    if (!t.heb) continue;
    const hs = t.heb.split(/\s+/).map(O.cons); const idx = [];
    let j = ptr;
    for (const h of hs) { let k = ws.findIndex((w, i) => i >= j && O.cons(w.heb) === h); if (k < 0) k = ws.findIndex(w => O.cons(w.heb) === h); if (k < 0) { idx.length = 0; break; } idx.push(k); j = k + 1; }
    const gl = (t.def_ro || '').replace(/\s*\([^)]*\)\s*$/, '');
    if (!idx.length) { items.push(`/*NEPOTRIVIT ${t.heb}*/ [${q(t.t)}, -1, ${q(gl)}]`); continue; }
    ptr = idx[idx.length - 1] + 1;
    items.push(`[${q(t.t)}, ${idx.length > 1 ? '[' + idx.join(', ') + ']' : idx[0]}, ${q(gl)}]`);
  }
  out += `    '${v.v}': [${items.join(', ')}],\n`;
}
out += '  },\n};\n';
process.stdout.write(out);
