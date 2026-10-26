// node lxxnote.js <cap> [--scrie] — aplică lxxnote-cNN.js: { "20:26": "nota nouă" | { note, tr } } peste textCompare LXX (nota și, opțional, traducerea)
const fs = require('fs'), path = require('path');
const WF = path.join(__dirname, '../haftarot-sarbatori.json');
const cn = +process.argv[2];
const spec = require('./lxxnote-c' + String(cn).padStart(2, '0') + '.js');
const d = JSON.parse(fs.readFileSync(WF, 'utf8')); const ch = d.chapters.find(c => c.num === cn);
const errs = []; let n = 0;
for (const [v, s] of Object.entries(spec)) {
  const vv = ch.verses.find(x => x.v === v); if (!vv) { errs.push(v + ': verset inexistent'); continue; }
  const e = (vv.textCompare || []).find(t => /Septuag/.test(t.source)); if (!e) { errs.push(v + ': fără LXX'); continue; }
  const note = typeof s === 'string' ? s : s.note, tr = typeof s === 'string' ? null : s.tr;
  if (note) { if (note.length < 20) { errs.push(v + ': notă prea scurtă'); continue; } e.note = note; }
  if (tr) e.translation = tr; n++;
}
console.log(`cap. ${cn}: ${n} versete de actualizat`);
if (errs.length) { console.log('ERORI:\n' + errs.join('\n')); process.exit(1); }
if (process.argv.includes('--scrie')) { fs.copyFileSync(WF, WF + '.bak-lxxnote'); fs.writeFileSync(WF, JSON.stringify(d, null, 1)); console.log('Scris.'); }
