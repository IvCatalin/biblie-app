// Scoate textele candidate (engleză) pentru versetele indicate din capitolul N. node tools/ocd-dump.js N v1,v2 [maxLen]
const fs = require('fs');
const D = 'C:/Users/ivcatali/biblie-app/tora-openchristiandata/';
const N = +process.argv[2], VS = process.argv[3].split(',').map(Number), MAX = +(process.argv[4] || 1300);
const cm = ['adam-clarke', 'calvin', 'jamieson-fausset-brown', 'john-gill', 'keil-delitzsch', 'matthew-henry', 'wesley'];
const cov = (r, v) => { const m = String(r).match(/^(\d+)(?:\s*[-–]\s*(\d+))?/); if (!m) return false; const a = +m[1], b = m[2] ? +m[2] : a; return v >= a && v <= b; };
for (const v of VS) {
  console.log('\n######## Geneza ' + N + ':' + v);
  for (const a of cm) { const d = JSON.parse(fs.readFileSync(D + 'commentaries/' + a + '-genesis.json', 'utf8')).data; d.filter(e => e.chapter === N && cov(e.verse_range, v) && e.commentary_text.length <= MAX).forEach(e => console.log('[' + a + ' ' + e.verse_range + ' len' + e.commentary_text.length + ']\n' + e.commentary_text.trim() + '\n')); }
  for (const f of fs.readdirSync(D + 'church_fathers_filtered')) {
    const d = JSON.parse(fs.readFileSync(D + 'church_fathers_filtered/' + f, 'utf8'));
    (d.by_book.Gen || []).forEach(e => { const raw = e.anchor_ref && e.anchor_ref.raw || ''; const m = raw.match(/Genesis\s+(\d+):(\d+)(?:-(\d+))?$/); if (!m || +m[1] !== N) return; const x = +m[2], y = m[3] ? +m[3] : x; if (v < x || v > y) return; const q = String(e.quote); if (q.length > MAX) return; console.log('[' + f.replace('.json', '') + ' ' + raw + ' | ' + (e.source_title || '') + ' | ' + e.entry_id + ' len' + q.length + ']\n' + q.trim() + '\n'); });
  }
}
