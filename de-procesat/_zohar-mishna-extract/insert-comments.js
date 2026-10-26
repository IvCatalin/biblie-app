// Inserează comentariile Mișna/Zohar din plan.json în fișierele Geneza (public/genesis-N.js) și în masterele Haftarot.
// Ordinea: după ultimul comentariu din sursă evreiască (Mișna înaintea Zohar-ului), înaintea restului (context, Josephus, patristice, creștini).
// Utilizare: node insert-comments.js <plan.json> [--scrie]
const fs = require('fs');
const [PLAN] = process.argv.slice(2);
const WRITE = process.argv.includes('--scrie');
const R = 'C:/Users/ivcatali/biblie-app/';
const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
const JEW = /^(Metzudat|Rashi|Rashbam|Radak|Ibn Ezra|Ralbag|Talmud|Sforno|Șadal|Ramban|Targum|Malbim|Abarbanel|Mișna|Da'at|Ba'al|Zohar|Bereshit Rabbah|Rav\b)/;
const stat = { added: 0, zohar: 0, mishna: 0, skippedDup: 0, verses: 0 };
function insertInto(v, items) {
  const com = v.commentaries = v.commentaries || [];
  let ins = [];
  for (const it of items) {
    const pref = it.src === 'zohar' ? 'Zohar' : 'Mișna';
    for (let i = com.length - 1; i >= 0; i--) if (com[i].author.startsWith(pref) && !/Ierușalmi/.test(com[i].author)) { com.splice(i, 1); stat.replaced = (stat.replaced || 0) + 1; }
    ins.push({ author: it.author, text: it.text, _src: it.src });
  }
  if (!ins.length) return;
  ins.sort((a, b) => (a._src === 'mishna' ? 0 : 1) - (b._src === 'mishna' ? 0 : 1));
  let last = -1; com.forEach((c, i) => { if (JEW.test(c.author)) last = i; });
  const at = last + 1;
  com.splice(at, 0, ...ins.map(x => ({ author: x.author, text: x.text })));
  stat.added += ins.length; stat.verses++; ins.forEach(x => stat[x._src]++);
}
// ---- Geneza
const gen = {};
for (const rid of Object.keys(plan)) { const p = rid.split('|'); if (p[0] === 'gen') (gen[p[1]] = gen[p[1]] || []).push([+p[2], plan[rid]]); }
for (const file of Object.keys(gen)) {
  const f = R + 'public/genesis-' + file + '.js';
  const raw = fs.readFileSync(f, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const m = raw.match(/^(window\.CHAPTER_DATA\s*=\s*)([\s\S]*?)(;?\s*)$/);
  const ind = (m[2].match(/\[\r?\n( +)\{/) || [])[1]; const n = ind ? ind.length : 1;
  const arr = JSON.parse(m[2]);
  for (const [num, items] of gen[file]) { const v = arr.find(x => x.num === num); if (!v) { console.log('verset lipsă', file, num); continue; } insertInto(v, items); }
  let out = JSON.stringify(arr, null, n); if (eol === '\r\n') out = out.replace(/\n/g, '\r\n');
  if (WRITE) fs.writeFileSync(f, m[1] + out + m[3]);
}
// ---- Haftarot
for (const [kind, file] of [['wk', 'haftarot-ciclu-saptamanal.json'], ['sb', 'haftarot-sarbatori.json']]) {
  const f = R + 'de-procesat/_haftarot-extract/' + file;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const rid of Object.keys(plan)) {
    const p = rid.split('|'); if (p[0] !== kind) continue;
    const ch = d.chapters.find(c => c.num === +p[1]); const v = ch && ch.verses.find(x => x.v === p.slice(2).join('|'));
    if (!v) { console.log('verset lipsă', rid); continue; }
    insertInto(v, plan[rid]);
  }
  if (WRITE) { fs.copyFileSync(f, f + '.bak-zm'); fs.writeFileSync(f, JSON.stringify(d, null, 1)); }
}
console.log(JSON.stringify(stat), WRITE ? '(scris)' : '(simulare)');
