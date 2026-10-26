// Verifică ro/BB-CC.json față de en-war.json: număr de secțiuni, raport lungime, cifre păstrate, fără rămășițe englezești. node verify.js [carte]
const fs = require('fs');
const en = JSON.parse(fs.readFileSync('en-war.json', 'utf8'));
const only = process.argv[2] !== undefined ? +process.argv[2] : null;
const SECRE = /\n\s*\n(?=\d{1,3}\.? [A-Za-z“"'(\[])/;
const secs = t => t.split(SECRE).map(p => p.trim()).filter(Boolean);
let bad = 0, n = 0;
for (const f of fs.readdirSync('ro').filter(f => f.endsWith('.json')).sort()) {
  const [b, c] = f.replace('.json', '').split('-').map(Number); if (only !== null && b !== only) continue;
  const d = JSON.parse(fs.readFileSync('ro/' + f, 'utf8'));
  const e = secs(en[b][c].text);
  const probs = [];
  if (d.verses.length !== e.length) probs.push(`secțiuni ${d.verses.length} != ${e.length}`);
  d.verses.forEach((v, i) => {
    if (!e[i]) return;
    const r = v.t.length / e[i].length;
    if (r < 0.8 || r > 1.45) probs.push(`§${i + 1} raport ${r.toFixed(2)}`);
    const nums = (e[i].replace(/^\d+\.?\s/, '').match(/\b\d[\d,]*\b/g) || []).filter(x => x.replace(/,/g, '').length > 2);
    const miss = nums.filter(x => !v.t.includes(x.replace(/,/g, '')) && !v.t.includes(x) && !v.t.includes(x.replace(/,/g, '.')));
    if (miss.length) probs.push(`§${i + 1} cifre lipsă: ${miss.slice(0, 4).join(' ')}`);
    if (/\b(the|and|which|that|was|were|his|their)\b/.test(v.t)) probs.push(`§${i + 1} engleză?`);
  });
  n++; if (probs.length) { bad++; console.log(f, probs.join(' | ')); }
}
console.log('fișiere verificate', n, 'cu probleme', bad);
