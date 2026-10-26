// Audit suplimentar al unei cărți traduse (ro/BB-*.json): ghilimele echilibrate, spații duble, sedile, rămășițe de proces/engleză, nume inconsecvente.
// node audit.js <carte>
const fs = require('fs');
const B = +process.argv[2];
const files = fs.readdirSync('ro').filter(f => f.startsWith(String(B).padStart(2, '0') + '-')).sort();
let bad = 0, chars = 0, verses = 0;
const names = {};
for (const f of files) {
  const d = JSON.parse(fs.readFileSync('ro/' + f, 'utf8'));
  if (!d.title || /^Cartea|^CHAPTER/.test(d.title)) { console.log(f, 'titlu suspect'); bad++; }
  for (const v of d.verses) {
    const t = v.t; chars += t.length; verses++;
    const p = [];
    if (/[ \t]{2,}/.test(t)) p.push('spații duble');
    if (/[şţŞŢ]/.test(t)) p.push('sedilă');
    if (/\s[,.;:!?]/.test(t)) p.push('spațiu înainte de punctuație');
    const o = (t.match(/„/g) || []).length, c = (t.match(/”/g) || []).length;
    if (o !== c) p.push(`ghilimele „${o} ”${c}`);
    const ob = (t.match(/\[/g) || []).length, cb = (t.match(/\]/g) || []).length;
    if (ob !== cb) p.push(`paranteze drepte ${ob}/${cb}`);
    const op = (t.match(/\(/g) || []).length, cp = (t.match(/\)/g) || []).length;
    if (op !== cp) p.push(`paranteze ${op}/${cp}`);
    if (/Whiston|\[GREEK\]|\[GREACĂ\]|TODO|\?\?\?|traducere proprie|nu s-a inventat/i.test(t)) p.push('notă de proces / marcaj');
    if (/\b(the|of|and|which|thou|thee|hath|unto)\b/.test(t)) p.push('engleză');
    if (/[^\u0000-ɏ‐-‧„”«»’‘–—…]/.test(t)) p.push('caracter neobișnuit');
    if (p.length) { bad++; console.log(`${f} §${v.w}: ${p.join('; ')}`); }
    for (const m of t.matchAll(/\b[A-ZĂÂÎȘȚ][a-zăâîșț]{3,}\b/g)) names[m[0]] = (names[m[0]] || 0) + 1;
  }
}
console.log(`Cartea ${B}: ${files.length} fișiere, ${verses} secțiuni, ${chars} caractere, probleme: ${bad}`);
if (process.argv[3] === 'nume') console.log(Object.entries(names).sort((a, b) => b[1] - a[1]).map(e => e[0] + ' ' + e[1]).join(', '));
