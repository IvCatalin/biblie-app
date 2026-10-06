// Masa de lucru pentru Haftarot Sarbatori: node wb-sarb.js <cap> [de la] [până la]
const fs = require('fs'); const path = require('path');
const O = require('../_haftarot-deuteronom-extract/oshb');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../_haftarot-extract/haftarot-sarbatori.json'), 'utf8'));
const S = (() => { const s = fs.readFileSync(path.join(__dirname, '../_haftarot-deuteronom-extract/strongs-heb.js'), 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); })();
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'oshb-map-sarbatori.json'), 'utf8'));
const [cn, a, b] = process.argv.slice(2).map(Number);
const ch = d.chapters[cn - 1];
console.log(`# ${ch.num} ${ch.title} — ${ch.ref} (${ch.verses.length} versete)`);
ch.verses.forEach((v, k) => {
  if (a && (k + 1 < a || k + 1 > b)) return;
  console.log(`\n== [${k + 1}] ${v.v}\nRO: ${v.t}`);
  const key = cn + '|' + v.v;
  const entry = MAP[key];
  if (!entry) { console.log('(fara mapare OSIS - text liturgic)'); return; }
  const [bk, c, vs] = entry.osis.split('.');
  const words = O.verse(bk, +c, +vs);
  console.log('OSIS: ' + entry.osis);
  console.log(words.map(w => {
    const e = S[w.strong];
    return `${w.i} ${w.heb} ${w.strong} ${w.translit} [${w.pos}] ${e ? (e.strongs_def || '').replace(/\s+/g, ' ').slice(0, 60) : ''}`;
  }).join('\n'));
});
