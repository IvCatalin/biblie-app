const fs = require('fs');
const d = JSON.parse(fs.readFileSync('de-procesat/_haftarot-extract/haftarot-sarbatori.json','utf8'));

// carte OSIS implicita per capitol; pentru cap.22 (Iona->Mica) se trateaza separat
const BOOK = {
  1: '1Sam', 2: 'Isa', 3: 'Zech', 4: '1Kgs', 5: '2Kgs', 6: '1Sam', 7: 'Ezek', 8: 'Ezek', 9: 'Mal',
  10: 'Josh', 11: '2Kgs', 12: 'Ezek', 13: '2Sam', 14: 'Isa', 15: 'Ezek', 16: 'Hab', 17: 'Jer',
  18: 'Isa', 19: '1Sam', 20: 'Jer', 21: 'Isa', 22: 'Jonah', 23: 'Zech', 24: '1Kgs', 25: 'Ezek',
  26: '1Kgs', 27: 'Josh'
};

const map = {};
let skipped = [];
d.chapters.forEach(c => {
  c.verses.forEach(v => {
    const key = c.num + '|' + v.v;
    let label = v.v;
    let book = BOOK[c.num];
    if (c.num === 22 && /^7:/.test(v.v)) book = 'Mic'; // switch la Mica 7:18-20
    if (c.num === 2 && (v.v === '20:18' || v.v === '20:42')) book = '1Sam'; // versete adaugate din 1 Samuel
    if (label === 'yetiv_pitgam') { skipped.push(key); return; }
    const isRepeat = /b$/.test(label);
    if (isRepeat) label = label.slice(0, -1);
    const [ch, vs] = label.split(':');
    map[key] = { osis: book + '.' + ch + '.' + vs, score: 1 };
  });
});
fs.writeFileSync('de-procesat/_sarbatori_extract/oshb-map-sarbatori.json', JSON.stringify(map));
console.log('intrari map:', Object.keys(map).length, '| omise (fara OSIS):', skipped.length, skipped);
