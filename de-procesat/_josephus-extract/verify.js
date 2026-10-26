// Verifică fișierele ro/BB-CC.json față de sursa en.json: același număr de secțiuni, raport lungime, cifre păstrate, fără rămășițe englezești.
// node verify.js <en.json> [carte]
const fs = require('fs');
const en = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const only = process.argv[3] ? +process.argv[3] : null;
const raw = fs.readFileSync('C:/Users/ivcatali/biblie-app/de-procesat/THE ANTIQUITIES OF THE JEWS.txt', 'utf8').replace(/\r/g, '');
const pre = raw.slice(raw.indexOf('PREFACE.') + 8, raw.indexOf('\nBOOK I', raw.indexOf('PREFACE.')));
const secs = t => t.replace(/\[\d+\]/g, '').split(/\n\s*\n(?=\d+\. )/).map(p => p.trim()).filter(Boolean);
let bad = 0, n = 0;
for (const f of fs.readdirSync('ro').filter(f => f.endsWith('.json')).sort()) {
  const [b, c] = f.replace('.json', '').split('-').map(Number); if (only && b !== only) continue;
  const d = JSON.parse(fs.readFileSync('ro/' + f, 'utf8'));
  const e = c === 0 ? secs(pre) : secs(en[b][c].text);
  const probs = [];
  if (d.verses.length !== e.length) probs.push(`secțiuni ${d.verses.length} != ${e.length}`);
  d.verses.forEach((v, i) => {
    if (!e[i]) return;
    const r = v.t.length / e[i].length;
    if (r < 0.8 || r > 1.45) probs.push(`§${i + 1} raport ${r.toFixed(2)}`);
    const nums = (e[i].replace(/^\d+\.\s/, '').match(/\b\d[\d,]*\b/g) || []).filter(x => x.replace(/,/g, '').length > 1 && !/^\d+\.$/.test(x));
    const miss = nums.filter(x => !v.t.includes(x.replace(/,/g, '')) && !v.t.includes(x));
    if (miss.length) probs.push(`§${i + 1} cifre lipsă: ${miss.slice(0, 4).join(' ')}`);
    if (/\b(the|and|which|that|was|were|his|their)\b/.test(v.t)) probs.push(`§${i + 1} engleză?`);
  });
  n++; if (probs.length) { bad++; console.log(f, probs.join(' | ')); }
}
console.log('fișiere verificate', n, 'cu probleme', bad);
