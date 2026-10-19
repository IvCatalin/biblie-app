// node retag/comm-add.js <cap> <fisier-spec> "<Autor (ani)>" [--scrie] — adaugă un comentariu per verset (spec: { "42:5": "text", ... }), imediat după Rashi (sau primul dintre cei evrei)
const fs = require('fs'), path = require('path');
const WF = path.join(__dirname, '../haftarot-ciclu-saptamanal.json');
const cn = +process.argv[2], spec = require(path.resolve(process.argv[3])), author = process.argv[4];
const d = JSON.parse(fs.readFileSync(WF, 'utf8')); const ch = d.chapters.find(c => c.num === cn);
const JEW = /^(Rashi|Ibn Ezra|Radak|Metzudat|Șadal|Ramban|Sforno|Malbim|Talmud|Zohar|Midra|Mișna)/;
const errs = []; let added = 0;
for (const [v, text] of Object.entries(spec)) {
  const vv = ch.verses.find(x => x.v === v); if (!vv) { errs.push(`${v}: verset inexistent`); continue; }
  vv.commentaries = vv.commentaries || [];
  if (vv.commentaries.some(c => c.author === author)) { errs.push(`${v}: ${author} există deja`); continue; }
  if (!text || text.length < 20) { errs.push(`${v}: text prea scurt`); continue; }
  let at = vv.commentaries.findIndex(c => /^Rashi/.test(c.author)) + 1; if (at === 0) at = 0;
  vv.commentaries.splice(at, 0, { author, text }); added++;
}
// ordinea: evreii înaintea celorlalți
let bad = 0; for (const v of ch.verses) { let seenNon = false; for (const c of v.commentaries || []) { if (!JEW.test(c.author)) seenNon = true; else if (seenNon) bad++; } }
const tot = ch.verses.reduce((s, v) => s + (v.commentaries || []).length, 0);
console.log(`Cap. ${cn}: adăugate ${added}; total comentarii ${tot} = ${(tot / ch.verses.length).toFixed(2)}/verset; ordine evrei→creștini încălcată în ${bad} cazuri`);
if (errs.length) { console.log('ERORI:\n' + errs.join('\n')); process.exit(1); }
if (process.argv.includes('--scrie')) { fs.copyFileSync(WF, WF + '.bak-comm'); fs.writeFileSync(WF, JSON.stringify(d, null, 1)); console.log('Scris.'); }
