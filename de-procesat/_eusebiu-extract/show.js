// node show.js <carte> <capitol>
const { sections } = require('./sec.js');
const [B, C] = process.argv.slice(2).map(Number);
const r = sections(B, C);
console.log('TITLU:', r.title);
r.secs.forEach(s => console.log('\n§' + s.w + '. ' + s.t));
