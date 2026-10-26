// Parsează „The Wars of the Jews” (Whiston, Gutenberg #2850) în prefață/cărți/capitole. node parse-war.js
const fs = require('fs');
const TXT = 'C:/Users/ivcatali/biblie-app/de-procesat/razboiul iudeilor J.F.txt';
const raw = fs.readFileSync(TXT, 'utf8').replace(/\r/g, '');
const lines = raw.split('\n');
const ROM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };
const out = { 0: { 0: { title: 'Prefață', text: '' } } };
// prefața: de la linia „PREFACE” (după cuprins) până la „WAR PREFACE FOOTNOTES”
const pStart = lines.findIndex((l, i) => i > 250 && /^PREFACE\s*$/.test(l));
const pEnd = lines.findIndex(l => /^WAR PREFACE FOOTNOTES/.test(l));
out[0][0].text = lines.slice(pStart + 1, pEnd).join('\n');
let b = null, ch = null, last = 0, inFoot = false;
for (let i = pEnd; i < lines.length; i++) {
  const L = lines[i];
  if (/^\*\*\* END OF/.test(L)) break;
  let m = L.match(/^BOOK ([IVX0-9]+)\./);
  if (m) { b = ROM[m[1]] || +m[1]; out[b] = {}; ch = null; last = 0; inFoot = false; continue; }
  if (/^WAR BOOK \d FOOTNOTES/.test(L)) { inFoot = true; ch = null; continue; }
  if (inFoot || !b) continue;
  m = L.match(/^CHAPTER ([0-9IVX]+)\./);
  if (m) {
    let n = /^\d+$/.test(m[1]) ? +m[1] : ({ V: 5 }[m[1]] || 0);
    if (n !== last + 1) { console.log(`număr capitol corectat: cartea ${b}, „${m[1]}” → ${last + 1}`); n = last + 1; }
    ch = n; last = n;
    const t = []; let j = i + 1; while (j < lines.length && lines[j].trim() === '') j++;
    while (j < lines.length && lines[j].trim() !== '') { t.push(lines[j].trim()); j++; }
    out[b][ch] = { title: t.join(' '), text: '' }; i = j - 1; continue;
  }
  if (ch) out[b][ch].text += L + '\n';
}
for (const bk of Object.keys(out)) for (const c of Object.keys(out[bk])) out[bk][c].len = out[bk][c].text.length;
fs.writeFileSync('en-war.json', JSON.stringify(out));
const SECRE = /\n\s*\n(?=\d{1,3}\.? [A-Za-z“"'(\[])/;
let tot = 0;
for (const bk of Object.keys(out)) {
  let chars = 0, secs = 0; const odd = [];
  for (const c of Object.keys(out[bk])) {
    chars += out[bk][c].len;
    const ps = out[bk][c].text.split(SECRE).map(p => p.trim()).filter(Boolean);
    secs += ps.length;
    const nums = ps.map(p => +((p.match(/^(\d{1,3})\.? /) || [])[1] || 0));
    if (nums.some((x, i) => x !== i + 1)) odd.push(`${c}:[${nums.join(',')}]`);
  }
  tot += chars;
  console.log(`Cartea ${bk}: ${Object.keys(out[bk]).length} capitole, ${secs} secțiuni, ${chars} caractere${odd.length ? ' | NESECVENȚIAL ' + odd.join(' ') : ''}`);
}
console.log('total caractere', tot);
