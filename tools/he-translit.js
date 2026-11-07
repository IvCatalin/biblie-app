// Transliterare simplă a ebraicii cu punctuație (stilul din aplicație: vayomer, hamizbe'ach, Beit-El). exports.translit(heb, proper)
const C = { 'א': '', 'ב': 'v', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z', 'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'kh', 'ך': 'kh', 'ל': 'l', 'מ': 'm', 'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': '', 'פ': 'f', 'ף': 'f', 'צ': 'ts', 'ץ': 'ts', 'ק': 'q', 'ר': 'r', 'ש': 'sh', 'ת': 't' };
const VOW = { '\u05B7': 'a', '\u05B8': 'a', '\u05B2': 'a', '\u05B3': 'o', '\u05B5': 'e', '\u05B6': 'e', '\u05B1': 'e', '\u05B4': 'i', '\u05B9': 'o', '\u05BA': 'o', '\u05BB': 'u' };
const LONG = new Set(['a:\u05B8', 'e:\u05B5', 'o:\u05B9']);
function letters(h) {
  const out = []; for (const ch of h) {
    if (/[\u05D0-\u05EA]/.test(ch)) out.push({ c: ch, m: new Set() }); else if (ch === '־') out.push({ sep: '-' }); else if (ch === ' ') out.push({ sep: ' ' });
    else if (/[\u05B0-\u05C7]/.test(ch) && out.length && out[out.length - 1].m) out[out.length - 1].m.add(ch);
  } return out;
}
function word(ls, proper) {
  let out = '';
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i], m = l.m, prev = ls[i - 1], next = ls[i + 1];
    const vm = [...m].find(x => VOW[x]); const v = vm ? VOW[vm] : '', hasDag = m.has('\u05BC'), shva = m.has('\u05B0');
    const first = i === 0, last = i === ls.length - 1;
    if (l.c === 'ו') {
      if (m.has('\u05B9') && !prev.hasOwnProperty('x')) { out += 'o'; continue; }            // holam male
      if (hasDag && !vm && !shva && i > 0) { out += 'u'; continue; }                        // shuruk
      if (!vm && !shva && i > 0 && last) { out += 'v'; continue; }
    }
    if (l.c === 'י' && !vm && !shva && i > 0) {                                               // yod mută după vocală
      const pv = prev && [...prev.m].find(x => VOW[x]); const pvv = pv ? VOW[pv] : '';
      if (pvv === 'i') continue; if (pvv === 'e') { out += 'i'; continue; } if (pvv === 'a') { out += 'i'; continue; } if (pvv === 'o') { out += 'i'; continue; }
    }
    if (l.c === 'ה' && last && !hasDag) { const pv = prev && [...prev.m].find(x => VOW[x]); const pvv = pv ? VOW[pv] : ''; if (pvv === 'a' || pvv === 'e') out += pvv === 'a' ? 'h' : 'h'; continue; }
    let cons = C[l.c];
    if (l.c === 'ש' && m.has('\u05C2')) cons = 's';
    if (hasDag) { if (l.c === 'ב') cons = 'b'; else if (l.c === 'כ' || l.c === 'ך') cons = 'k'; else if (l.c === 'פ' || l.c === 'ף') cons = 'p'; }
    if (l.c === 'ע' || l.c === 'א') cons = (i > 0 && vm && /[aeiou]$/.test(out)) ? "'" : '';
    let piece = cons + (vm ? v : '');
    if (shva && !vm) {
      const pv = prev && [...prev.m].find(x => VOW[x]); const longPrev = pv && (pv === '\u05B8' || pv === '\u05B5' || pv === '\u05B9' || pv === '\u05B4') && !(next && next.c === l.c);
      if (first) piece = cons + 'e'; else if (prev && prev.m.has('\u05B0') ) piece = cons + 'e'; else if (longPrev && !last) piece = cons + 'e'; else piece = cons;
    }
    if (hasDag && !'בכךפף'.includes(l.c) && i > 0 && prev && [...prev.m].some(x => VOW[x]) && vm) piece = cons + piece; // dagesh forte
    out += piece;
  }
  return out;
}
function translit(heb, proper) {
  const parts = []; let cur = []; let seps = [];
  for (const l of letters(heb)) { if (l.sep) { parts.push(cur); seps.push(l.sep); cur = []; } else cur.push(l); }
  parts.push(cur);
  let r = ''; parts.forEach((p, i) => { const js = p.map(x => x.c).join(''); let w = js.endsWith('יהוה') ? word(p.slice(0, -4), proper) + 'YHVH' : word(p, proper); r += (i ? seps[i - 1] : '') + w; });
  if (proper && r) r = r[0].toUpperCase() + r.slice(1);
  return r;
}
module.exports = { translit };
if (require.main === module) for (const h of process.argv.slice(2)) console.log(h, translit(h));
