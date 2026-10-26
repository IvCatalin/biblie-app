// Afișează secțiunile Whiston ale unui capitol: node show.js <en.json> <carte> <capitol|0=prefață>
const fs = require('fs');
const [ENJ, B, C] = process.argv.slice(2);
const en = JSON.parse(fs.readFileSync(ENJ, 'utf8'));
let t;
if (+C === 0) { const raw = fs.readFileSync('C:/Users/ivcatali/biblie-app/de-procesat/THE ANTIQUITIES OF THE JEWS.txt', 'utf8').replace(/\r/g, ''); const a = raw.indexOf('PREFACE.'); const z = raw.indexOf('\nBOOK I', a); t = raw.slice(a + 8, z); console.log('TITLU: Prefață'); }
else { console.log('TITLU:', en[B][C].title.replace(/^CHAPTER [0-9]+.s*/, '')); t = en[B][C].text; }
t.replace(/\[\d+\]/g, '').split(/\n\s*\n(?=\d+\. )/).map(p => p.trim()).filter(Boolean).forEach(p => console.log('\n§' + p.replace(/\n/g, ' ')));
