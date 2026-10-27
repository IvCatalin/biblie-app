// Verifică ro/BB-CC.json față de sursă. node verify.js [carte]
const fs = require('fs'); const { sections, EN } = require('./sec.js');
const only = process.argv[2] !== undefined ? +process.argv[2] : null;
let bad = 0, n = 0;
for (const f of fs.readdirSync('ro').filter(f => f.endsWith('.json')).sort()) {
  const [b, c] = f.replace('.json', '').split('-').map(Number); if (only !== null && b !== only) continue;
  const d = JSON.parse(fs.readFileSync('ro/' + f, 'utf8'));
  const e = sections(b, c).secs; const probs = [];
  if (d.verses.length !== e.length) probs.push(`secțiuni ${d.verses.length} != ${e.length}`);
  d.verses.forEach((v, i) => {
    if (!e[i]) return;
    if (v.w !== e[i].w) probs.push(`§${i + 1} w ${v.w} != ${e[i].w}`);
    const r = v.t.length / e[i].t.length;
    if (r < 0.8 || r > 1.5) probs.push(`§${e[i].w} raport ${r.toFixed(2)}`);
    const nums = (e[i].t.match(/\b\d[\d,]*\b/g) || []).filter(x => x.replace(/,/g, '').length > 2);
    const miss = nums.filter(x => !v.t.includes(x.replace(/,/g, '')) && !v.t.includes(x));
    if (miss.length) probs.push(`§${e[i].w} cifre lipsă: ${miss.slice(0, 4).join(' ')}`);
    if (/\b(the|and|which|that|was|were|his|their|unto)\b/.test(v.t)) probs.push(`§${e[i].w} engleză?`);
  });
  n++; if (probs.length) { bad++; console.log(f, probs.join(' | ')); }
}
console.log('fișiere verificate', n, 'cu probleme', bad);
