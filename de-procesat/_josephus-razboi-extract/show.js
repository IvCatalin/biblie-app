// Afișează secțiunile Whiston ale unui capitol din Războiul iudeilor: node show.js <carte> <capitol>   (0 0 = prefață)
const fs = require('fs');
const [B, C] = process.argv.slice(2);
const en = JSON.parse(fs.readFileSync('en-war.json', 'utf8'));
const SECRE = /\n\s*\n(?=\d{1,3}\.? [A-Za-z“"'(\[])/;
console.log('TITLU:', en[B][C].title);
en[B][C].text.split(SECRE).map(p => p.trim()).filter(Boolean).forEach(p => console.log('\n§' + p.replace(/\n/g, ' ').replace(/^(\d+)\.? /, '$1. ')));
