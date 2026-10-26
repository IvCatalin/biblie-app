// Parsează „THE ANTIQUITIES OF THE JEWS” (Whiston) în cărți/capitole/paragrafe și compară cu traducerea română.
// Utilizare: node parse-en.js <txt> <dir-json-ro>
const fs = require('fs');
const [TXT, RD] = process.argv.slice(2);
const raw = fs.readFileSync(TXT, 'utf8').replace(/\r/g, '');
const lines = raw.split('\n');
const ROM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15, XVI: 16, XVII: 17, XVIII: 18, XIX: 19, XX: 20 };
const books = {}; let b = null, ch = null, pos = [];
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  let m = L.match(/^BOOK ([IVX]+)\b/);
  if (m && ROM[m[1]]) { b = ROM[m[1]]; books[b] = books[b] || { chapters: {} }; ch = null; pos.push(['book', b, i]); continue; }
  m = L.match(/^CHAPTER (\d+)\./);
  if (m && b) { ch = +m[1]; books[b].chapters[ch] = books[b].chapters[ch] || { title: '', text: [] }; // titlul urmează
    let t = []; let j = i + 1; while (j < lines.length && lines[j].trim() === '') j++; while (j < lines.length && lines[j].trim() !== '') { t.push(lines[j].trim()); j++; }
    books[b].chapters[ch].title = t.join(' '); i = j - 1; continue; }
  if (b && ch) books[b].chapters[ch].text.push(L);
}
const out = {};
for (const bk of Object.keys(books)) { out[bk] = {}; for (const c of Object.keys(books[bk].chapters)) { const t = books[bk].chapters[c].text.join('\n'); out[bk][c] = { title: books[bk].chapters[c].title, len: t.length, text: t }; } }
fs.writeFileSync(process.argv[4] || 'en.json', JSON.stringify(out));
console.log('cărți găsite:', Object.keys(out).join(','));
for (const bk of Object.keys(out)) console.log('Cartea', bk, 'capitole', Object.keys(out[bk]).length, 'caractere EN', Object.values(out[bk]).reduce((a, x) => a + x.len, 0));
if (RD) for (const n of [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
  const d = JSON.parse(fs.readFileSync(RD + '/josephus-antichitati-' + n + '.json', 'utf8'));
  const ro = d.chapters.reduce((a, c) => a + c.verses.reduce((x, v) => x + v.t.length, 0), 0);
  const en = Object.values(out[n] || {}).reduce((a, x) => a + x.len, 0);
  console.log(`Cartea ${n}: RO ${ro} caractere în ${d.chapters.length} capitole | EN ${en} în ${Object.keys(out[n] || {}).length} capitole | raport RO/EN ${(ro / en).toFixed(2)}`);
}
