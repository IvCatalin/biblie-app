// relabel: etichetele versetelor din Sărbători (numerotare Rosen/ebraică -> EDC100) pentru S3, S5, S9, S17, S20, S22
const fs = require('fs');
const f = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/haftarot-sarbatori.json';
const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const MAP = {
  3: { ref: 'Zaharia 2:10-4:7', fn: (c, v) => (c === 2 ? [2, v - 4] : [c, v]) },
  5: { ref: '2 Împărați 11:17-12:16', fn: (c, v) => (c === 12 ? (v === 1 ? [11, 21] : [12, v - 1]) : [c, v]) },
  9: { ref: 'Maleahi 3:4-4:6', fn: (c, v) => (c === 3 && v >= 19 ? [4, v - 18] : [c, v]) },
  17: { ref: 'Ieremia 8:13-9:24', fn: (c, v) => (c === 8 && v === 23 ? [9, 1] : (c === 9 ? [9, v + 1] : [c, v])) },
  20: { ref: 'Ieremia 31:2-20', fn: (c, v) => [c, v + 1] },
  22: { ref: 'Iona 1:1-4:11; Mica 7:18-20', fn: (c, v, book) => (book === 'Iona' && c === 2 ? (v === 1 ? [1, 17] : [2, v - 1]) : [c, v]) },
};
const log = [];
for (const [n, m] of Object.entries(MAP)) {
  const ch = d.chapters.find(c => c.num === +n);
  for (const v of ch.verses) {
    const mm = String(v.v).match(/^(?:(.*\D) )?(\d+):(\d+)(.*)$/);
    if (!mm) { log.push(`S${n} ${v.v}: neschimbat (format)`); continue; }
    const book = mm[1] || (+n === 22 ? 'Iona' : '');
    const [c2, v2] = m.fn(+mm[2], +mm[3], book);
    const nv = (mm[1] ? mm[1] + ' ' : '') + c2 + ':' + v2 + mm[4];
    if (nv !== v.v) { log.push(`S${n} ${v.v} -> ${nv}`); v.v = nv; }
  }
  if (ch.ref !== m.ref) { log.push(`S${n} ref «${ch.ref}» -> «${m.ref}»`); ch.ref = m.ref; }
}
console.log(log.join('\n'));
if (process.argv.includes('--scrie')) { fs.copyFileSync(f, f + '.bak-relabel'); fs.writeFileSync(f, JSON.stringify(d, null, 1)); console.log('Scris.'); }
