// Construiește secțiunile unui capitol din en-eus.json: număr sursă (McGiffert) -> text.
// Reguli: paragraf numerotat = secțiune; paragraf nenumerotat se lipește de secțiunea precedentă;
// capitol fără niciun paragraf numerotat = fiecare paragraf e secțiune (1..N); titlu intermediar (h) se lipește în fața paragrafului următor.
const fs = require('fs');
const EN = JSON.parse(fs.readFileSync(__dirname + '/en-eus.json', 'utf8'));
function sections(book, ch) {
  const c = EN.find(x => x.book === book && x.ch === ch);
  if (!c) throw new Error('capitol inexistent ' + book + '.' + ch);
  const anyNum = c.blocks.some(k => k.kind === 'p' && k.n != null);
  const out = []; let pre = '';
  for (const k of c.blocks) {
    if (k.kind === 'h') { pre += (pre ? ' ' : '') + k.t.replace(/[.:]$/, '') + ':'; continue; }
    const t = (pre ? pre + ' ' : '') + k.t; pre = '';
    if (!anyNum) { out.push({ w: out.length + 1, t }); continue; }
    if (k.n != null) out.push({ w: k.n, t });
    else if (out.length) out[out.length - 1].t += ' ' + t;
    else out.push({ w: 1, t, pend: true });
  }
  // dacă primul bloc era nenumerotat și urmat de „1.”, îl lipim în fața secțiunii 1
  if (out.length > 1 && out[0].pend) { out[1].t = out[0].t + ' ' + out[1].t; out.shift(); }
  return { title: c.title, secs: out };
}
module.exports = { sections, EN };
