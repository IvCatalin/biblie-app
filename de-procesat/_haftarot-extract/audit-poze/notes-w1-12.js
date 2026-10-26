// note MT (textCompare[0]) pentru diferențele dintre ediția Rosen tipărită și ebraică, găsite la recitirea după poze
const fs = require('fs');
const M = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/haftarot-ciclu-saptamanal.json';
const d = JSON.parse(fs.readFileSync(M, 'utf8'));
const E = [
  [3, '41:2', 'Vezi explicația din dicționar de la primul cuvânt, mai sus, pentru dezbaterea reală asupra identității celui „stârnit de la răsărit”.',
    'Vezi explicația din dicționar de la primul cuvânt, mai sus, pentru dezbaterea reală asupra identității celui „stârnit de la răsărit”. Traducerea Rosen tipărită are „și în pleavă să îi prefacă arcul”, fără echivalent pentru participiul ebraic «nidaf» („purtată de vânt”).'],
  [7, '13:8', 'Fără divergențe structurale majore față de LXX la acest verset.',
    'Fără divergențe structurale majore față de LXX la acest verset. Ediția Rosen tipărită nu redă a doua jumătate a versetului, „Îi voi mânca acolo ca un leu; fiara câmpului îi va sfâșia” (ebr. וְאֹכְלֵם שָׁם כְּלָבִיא חַיַּת הַשָּׂדֶה תְּבַקְּעֵם), prezentă în textul ebraic și în LXX.'],
];
let n = 0;
for (const [c, vk, a, b] of E) {
  const v = d.chapters.find(x => x.num === c).verses.find(x => x.v === vk);
  const t0 = v.textCompare[0];
  if (t0.note !== a) { console.log('NOTĂ NEPOTRIVITĂ', c, vk, JSON.stringify(t0.note)); continue; }
  t0.note = b; n++;
}
console.log('note actualizate', n);
if (process.argv.includes('--scrie')) { fs.writeFileSync(M, JSON.stringify(d, null, 1)); console.log('scris'); }
