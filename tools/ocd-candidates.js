// Candidați din tora-openchristiandata pentru un capitol de Geneză. node tools/ocd-candidates.js N [--fathers]
const fs = require('fs');
const D = 'C:/Users/ivcatali/biblie-app/tora-openchristiandata/';
const N = +process.argv[2];
const out = {};
for (const f of fs.readdirSync(D + 'church_fathers_filtered')) {
  const d = JSON.parse(fs.readFileSync(D + 'church_fathers_filtered/' + f, 'utf8'));
  (d.by_book.Gen || []).forEach(e => {
    const raw = e.anchor_ref && e.anchor_ref.raw || ''; const m = raw.match(/Genesis\s+(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?/); if (!m || +m[1] !== N) return;
    const a = +m[2], b = m[4] ? +m[4] : a;
    for (let v = a; v <= b && v <= 60; v++) (out[v] = out[v] || []).push({ a: f.replace('.json', ''), id: e.entry_id, ref: raw, title: e.source_title || '', len: String(e.quote).length });
  });
}
for (let v = 1; v <= 60; v++) if (out[v]) console.log(v + ' | ' + out[v].map(x => x.a.slice(0, 10) + ' ' + x.ref.replace('Genesis ', '') + ' [' + x.len + ']').join(' ; '));
