// Repară def_ro cu resturi englezești (venite din lexicon-ro prin auto-def): păstrează segmentele românești de la început; ce rămâne gol se listează pentru scris manual.
// node tools/fix-english-defs.js N... [--write]
const fs = require('fs'); const { rospell } = require('./lib-ro.js');
(async () => {
  const ROS = await rospell(); const en = new Set(JSON.parse(fs.readFileSync(require('os').tmpdir() + '/en.json', 'utf8')));
  const LX = {}; for (const g of fs.readdirSync('sources/lexicon-ro')) for (const f of fs.readdirSync('sources/lexicon-ro/' + g)) { const j = JSON.parse(fs.readFileSync('sources/lexicon-ro/' + g + '/' + f, 'utf8')); for (const [k, v] of (Array.isArray(j) ? j : Object.entries(j))) LX[k] = LX[k] || v; }
  const isEn = (s) => (s.match(/[A-Za-zăâîșțĂÂÎȘȚ]+/g) || []).some(v => { v = v.toLowerCase(); return v.length > 2 && en.has(v) && !ROS.has(v); });
  const W = process.argv.includes('--write'); const manual = {}; const bank = {};
  for (let n = 1; n <= 23; n++) { const DD = new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA; for (const x of DD) for (const t of x.tokens) if (t.heb && t.strong && t.def_ro && t.def_ro.length > 3 && t.def_ro.replace(/[ .]/g, '').toLowerCase() !== (t.w || '').replace(/[ .]/g, '').toLowerCase() && !isEn(t.def_ro) && !/^d+ de ani —/.test(t.def_ro)) { const b = bank[t.strong]; if (!b || (n <= 11 && !b.early)) bank[t.strong] = { d: t.def_ro, early: n <= 11 }; } }
  for (const N of process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number)) {
    const file = 'public/genesis-' + N + '.js'; const D = new Function('window', fs.readFileSync(file, 'utf8') + ';return window;')({}).CHAPTER_DATA; let fixed = 0, man = 0;
    for (const x of D) for (const t of x.tokens.filter(t => t.heb && t.def_ro && isEn(t.def_ro))) {
      const e = LX[t.strong]; let ro = '';
      if (e && e.def_ro) { const segs = e.def_ro.replace(/\s+/g, ' ').split(/(?<=[,;])\s*/); const keep = []; for (const sg of segs) { if (isEn(sg)) break; keep.push(sg); } ro = keep.join(' ').replace(/[,;]\s*$/, '').trim(); }
      if (ro.length >= 3 && !isEn(ro)) { t.def_ro = ro.charAt(0).toLowerCase() + ro.slice(1) + '.'; fixed++; } else { man++; manual[t.strong] = manual[t.strong] || (t.w + ' | ' + t.heb + ' | ' + (e ? e.def_ro : '-')); }
    }
    console.log('Geneza ' + N + ': reparate ' + fixed + ', de scris manual ' + man);
    if (W) fs.writeFileSync(file, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
  }
  console.log('Strong\'s de scris manual:', Object.keys(manual).length); Object.entries(manual).forEach(([k, v]) => console.log('  ' + k + ' ' + v.slice(0, 150)));
})();
