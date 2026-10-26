// node addtok.js [--scrie] — inserează tag-uri lipsă (spec în addtok-spec.js): { ch, v, frag, occ?, tok:{...} }
const fs = require('fs'), path = require('path');
const WF = path.join(__dirname, '../haftarot-sarbatori.json');
const spec = require('./addtok-spec.js');
const d = JSON.parse(fs.readFileSync(WF, 'utf8')); const errs = []; let n = 0;
for (const s of spec) {
  const vv = d.chapters.find(c => c.num === s.ch).verses.find(x => x.v === s.v); if (!vv) { errs.push(s.ch + ' ' + s.v + ': verset inexistent'); continue; }
  let k = 0, done = false;
  for (let i = 0; i < vv.tokens.length && !done; i++) {
    const t = vv.tokens[i]; if (t.heb) continue;
    let from = 0, idx;
    while ((idx = t.t.indexOf(s.frag, from)) >= 0) {
      k++; if (k === (s.occ || 1)) {
        const before = t.t.slice(0, idx), after = t.t.slice(idx + s.frag.length);
        const rep = [];
        if (before) rep.push({ t: before });
        rep.push(Object.assign({ t: s.frag, w: s.frag }, s.tok));
        if (after) rep.push({ t: after });
        vv.tokens.splice(i, 1, ...rep); done = true; n++; break;
      }
      from = idx + 1;
    }
  }
  if (!done) errs.push(`${s.ch} ${s.v}: fragmentul «${s.frag}» nu a fost găsit în text netagat`);
}
console.log('de inserat', n, 'din', spec.length); if (errs.length) { console.log('ERORI:\n' + errs.join('\n')); process.exit(1); }
if (process.argv.includes('--scrie')) { fs.copyFileSync(WF, WF + '.bak-addtok'); fs.writeFileSync(WF, JSON.stringify(d, null, 1)); console.log('Scris.'); }
