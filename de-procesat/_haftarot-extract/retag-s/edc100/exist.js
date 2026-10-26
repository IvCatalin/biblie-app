// verifică că toate citările din text (cărți cu numerotare diferită) există în EDC100 (v <= numărul de versete al capitolului)
const fs = require('fs');
const { execSync } = require('child_process');
const D = 'C:/Users/ivcatali/AppData/Local/Temp/claude/C--Users-ivcatali-biblie-app/1b2de2ce-5fde-4d73-ba50-1c613a2c9173/scratchpad/';
const base = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/';
const NUM = { 'Geneza': 1, 'Exod': 2, 'Exodul': 2, 'Leviticul': 3, 'Levitic': 3, 'Numeri': 4, 'Deuteronomul': 5, 'Deuteronom': 5, 'Iosua': 6, 'Judecători': 7, 'Rut': 8, '1 Samuel': 9, '2 Samuel': 10, '1 Împărați': 11, '2 Împărați': 12, '1 Cronici': 13, '2 Cronici': 14, 'Ezra': 15, 'Neemia': 16, 'Estera': 17, 'Iov': 18, 'Psalmul': 19, 'Psalmii': 19, 'Proverbe': 20, 'Pilde': 20, 'Eclesiastul': 21, 'Cântarea cântărilor': 22, 'Isaia': 23, 'Ieremia': 24, 'Plângerile lui Ieremia': 25, 'Plângerile': 25, 'Ezechiel': 26, 'Daniel': 27, 'Osea': 28, 'Ioel': 29, 'Amos': 30, 'Obadia': 31, 'Iona': 32, 'Mica': 33, 'Naum': 34, 'Habacuc': 35, 'Țefania': 36, 'Hagai': 37, 'Zaharia': 38, 'Maleahi': 39 };
const alt = Object.keys(NUM).sort((a, b) => b.length - a.length).join('|');
const RE = new RegExp('(?<![\\p{L}\\d])(' + alt + ') (\\d{1,3}):(\\d{1,3})', 'gu');
const cf = D + 'edc-counts.json'; let counts = {}; try { counts = JSON.parse(fs.readFileSync(cf, 'utf8')); } catch (e) { }
function count(b, c) {
  const k = NUM[b] + ':' + c; if (counts[k] !== undefined) return counts[k];
  const p = x => String(x).padStart(3, '0'), bb = String(NUM[b]).padStart(2, '0');
  try { const j = JSON.parse(execSync(`curl -s --compressed -m 30 "https://a1.ebiblia.net/range/ebvdcc:${bb}:${p(c)}:001/${bb}:${p(c)}:200"`, { maxBuffer: 1e7 }).toString()); return counts[k] = Object.keys(j).filter(x => /^\d\d:/.test(x)).length; } catch (e) { return counts[k] = -1; }
}
const bad = {}; let tot = 0;
for (const f of ['haftarot-ciclu-saptamanal.json', 'haftarot-sarbatori.json']) {
  const d = JSON.parse(fs.readFileSync(base + f, 'utf8'));
  for (const c of d.chapters) for (const v of c.verses) {
    const strs = []; (v.commentaries || []).forEach(x => strs.push(x.text)); (v.textCompare || []).forEach(t => strs.push(t.note)); (v.tokens || []).forEach(t => { strs.push(t.dict_ro); strs.push(t.diff_ro); });
    for (const s of strs) { if (!s) continue; for (const m of s.matchAll(RE)) { tot++; const n = count(m[1], +m[2]); if (n >= 0 && +m[3] > n) { const key = m[0] + ' (cap. are ' + n + ')'; bad[key] = (bad[key] || 0) + 1; } if (n === 0) { const key = m[0] + ' (capitol inexistent)'; bad[key] = (bad[key] || 0) + 1; } } }
  }
}
fs.writeFileSync(cf, JSON.stringify(counts));
console.log('citări verificate', tot, '| probleme', Object.keys(bad).length);
console.log(Object.entries(bad).map(e => e.join(' ×')).join('\n'));
