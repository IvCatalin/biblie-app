// aplică conversia doar pentru citările din comentarii decise ca fiind în numerotarea ebraică (Y)
const fs = require('fs');
const D = 'C:/Users/ivcatali/AppData/Local/Temp/claude/C--Users-ivcatali-biblie-app/1b2de2ce-5fde-4d73-ba50-1c613a2c9173/scratchpad/';
const base = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/';
const dec = JSON.parse(fs.readFileSync(D + 'comdecide.json', 'utf8'));
const MANUAL_Y = new Set([1, 9, 10, 23, 27, 33, 52, 53, 56, 58, 60, 62, 66, 71, 74, 81, 82, 85, 91, 100, 101, 111, 112, 116, 118, 119, 122, 124, 127, 129, 130, 131, 133, 134, 135, 136, 137, 138, 140]);
const files = { C: 'haftarot-ciclu-saptamanal.json', S: 'haftarot-sarbatori.json' };
const data = {}; for (const k in files) data[k] = JSON.parse(fs.readFileSync(base + files[k], 'utf8'));
let n = 0; const errs = [];
for (const x of dec) {
  const isY = x.choice === 'Y' || (x.choice === 'manual' && MANUAL_Y.has(x.i));
  if (!isY) continue;
  const ch = data[x.tag].chapters.find(c => c.num === x.n); const v = ch.verses.find(w => w.v === x.vk);
  const cm = v && (v.commentaries || []).find(c => c.author === x.auth && c.text.includes(x.from));
  if (!cm) { errs.push(`#${x.i}: nu găsesc ${x.from} în ${x.tag}${x.n} ${x.vk} ${x.auth}`); continue; }
  cm.text = cm.text.split(x.from).join(x.to); n++;
}
// titluri de psalm (citări la titlul necifrat din EDC100)
const edits = [
  ['S', 16, '3:1', 'dict', 'Psalmul 7:1 poartă același titlu', 'Psalmul 7, în titlu, poartă același cuvânt'],
];
console.log('înlocuiri în comentarii:', n, errs.length ? '\nERORI:\n' + errs.join('\n') : '');
if (process.argv.includes('--scrie')) { for (const k in files) { fs.copyFileSync(base + files[k], base + files[k] + '.bak-comapply'); fs.writeFileSync(base + files[k], JSON.stringify(data[k], null, 1)); } console.log('scris'); }
