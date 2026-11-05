// Completează trimiterile la 6 pe verset din TSK (în ordinea TSK), doar unde TSK are mai multe decât fișierul. node fill-refs.js --ch=1,2,3 [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const chs = (process.argv.find(a => /^--ch=/.test(a)) || '--ch=1,2,3').slice(5).split(',').map(Number);
const TSK = 'C:/Users/ivcatali/biblie-app/sources/tsk/tskxref.txt';
const P = 'C:/Users/ivcatali/biblie-app/public/';
const BM = { ge: 'Geneza', ex: 'Exodul', le: 'Leviticul', nu: 'Numeri', de: 'Deuteronomul', jos: 'Iosua', jdg: 'Judecători', ru: 'Rut', '1sa': '1 Samuel', '2sa': '2 Samuel', '1ki': '1 Împărați', '2ki': '2 Împărați', '1ch': '1 Cronici', '2ch': '2 Cronici', ezr: 'Ezra', ne: 'Neemia', es: 'Estera', job: 'Iov', ps: 'Psalmul', pr: 'Proverbe', ec: 'Eclesiastul', so: 'Cântarea Cântărilor', isa: 'Isaia', jer: 'Ieremia', la: 'Plângerile lui Ieremia', eze: 'Ezechiel', da: 'Daniel', ho: 'Osea', joe: 'Ioel', am: 'Amos', ob: 'Obadia', jon: 'Iona', mic: 'Mica', na: 'Naum', hab: 'Habacuc', zep: 'Țefania', hag: 'Hagai', zec: 'Zaharia', mal: 'Maleahi', mt: 'Matei', mr: 'Marcu', lu: 'Luca', joh: 'Ioan', ac: 'Faptele Apostolilor', ro: 'Romani', '1co': '1 Corinteni', '2co': '2 Corinteni', ga: 'Galateni', eph: 'Efeseni', php: 'Filipeni', col: 'Coloseni', '1th': '1 Tesaloniceni', '2th': '2 Tesaloniceni', '1ti': '1 Timotei', '2ti': '2 Timotei', tit: 'Tit', phm: 'Filimon', heb: 'Evrei', jas: 'Iacov', '1pe': '1 Petru', '2pe': '2 Petru', '1jo': '1 Ioan', '2jo': '2 Ioan', '3jo': '3 Ioan', jude: 'Iuda', re: 'Apocalipsa' };
const per = {};
for (const l of fs.readFileSync(TSK, 'utf8').split('\n')) { const p = l.split('\t'); if (p.length < 6 || p[0] !== '1') continue; const k = p[1] + ':' + p[2]; (per[k] = per[k] || []); p[5].split(';').forEach(r => { r = r.trim(); const m = r.match(/^(\d?[a-z]+)\s+(.*)$/); if (!m || !BM[m[1]]) return; const ref = BM[m[1]] + ' ' + m[2]; if (!per[k].includes(ref)) per[k].push(ref); }); }
let added = 0; const rep = [];
for (const N of chs) {
  const f = P + 'genesis-' + N + '.js'; const w = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}); const D = w.CHAPTER_DATA;
  for (const x of D) {
    const have = x.refs || []; if (have.length >= 6) continue;
    const self = 'Geneza ' + N + ':' + x.num;
    const pool = (per[N + ':' + x.num] || []).filter(r => !have.includes(r) && r !== self && !r.startsWith('Geneza ' + N + ':' + x.num + '-'));
    if (!pool.length) continue;
    const take = pool.slice(0, 6 - have.length); x.refs = have.concat(take); added += take.length; rep.push(N + ':' + x.num + ' +' + take.length + ' (' + have.length + '→' + x.refs.length + ')');
  }
  if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', 'trimiteri adăugate:', added, '|', rep.join(', '));
