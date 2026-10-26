// Aplică corecturile din fixes-w1-12.js pe masterul săptămânal (t + tokens), cu verificare join(tokens) == t.
// Utilizare: node apply-fixes.js [--scrie]
const fs = require('fs');
const M = 'C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/haftarot-ciclu-saptamanal.json';
const d = JSON.parse(fs.readFileSync(M, 'utf8'));
const fixes = require('./fixes-w1-12.js');
const warns = [];
let applied = 0;

function applyToTokens(v, ctx, off, oldTxt, newTxt) {
  // înlocuiește [off, off+oldTxt.length) cu newTxt în tokens
  const toks = v.tokens;
  let pos = 0; const spans = toks.map(t => { const s = pos; pos += t.t.length; return [s, pos]; });
  const end = off + oldTxt.length;
  if (oldTxt.length === 0) { // inserție pură la off
    let k = spans.findIndex(([s, e]) => e === off && s < e); // token care se termină la off
    if (k >= 0 && !toks[k].w) { toks[k].t += newTxt; return; }
    k = spans.findIndex(([s, e]) => s === off && s < e);
    if (k >= 0 && !toks[k].w) { toks[k].t = newTxt + toks[k].t; return; }
    k = spans.findIndex(([s, e]) => s < off && off < e); // în interiorul unui token
    if (k >= 0) { const o = off - spans[k][0]; const tk = toks[k]; const same = tk.w !== undefined && tk.w === tk.t.trim(); if (tk.w) warns.push(`${ctx}: inserție în interiorul tokenului etichetat «${tk.t}»${same ? '' : ' [w != t.trim() — de verificat]'}`); tk.t = tk.t.slice(0, o) + newTxt + tk.t.slice(o); if (same) tk.w = tk.t.trim(); return; }
    // la început/sfârșit absolut
    toks.splice(off === 0 ? 0 : toks.length, 0, { t: newTxt }); return;
  }
  const idx = []; spans.forEach(([s, e], i) => { if (s < end && e > off) idx.push(i); });
  let first = true;
  for (const i of idx) {
    const [s, e] = spans[i], a = Math.max(off, s) - s, b = Math.min(end, e) - s;
    const t0 = toks[i];
    const same = t0.w !== undefined && t0.w === t0.t.trim();
    if (t0.w) warns.push(`${ctx}: modifică tokenul etichetat «${t0.t}» (w=«${t0.w}», strong=${t0.strong || '-'})${same ? '' : ' [w != t.trim() — de verificat]'}`);
    t0.t = t0.t.slice(0, a) + (first ? newTxt : '') + t0.t.slice(b);
    if (same && t0.t.trim()) t0.w = t0.t.trim();
    first = false;
  }
  for (let i = idx.length - 1; i >= 0; i--) { if (toks[idx[i]].t === '' ) { if (toks[idx[i]].w) warns.push(`${ctx}: token etichetat șters complet («${toks[idx[i]].w}»)`); toks.splice(idx[i], 1); } }
}

for (const f of fixes) {
  const [cn, vk, oldS, newS, opt] = f; const all = opt && opt.all;
  const ch = d.chapters.find(c => c.num === cn); const v = ch && ch.verses.find(x => x.v === vk);
  const ctx = `c${cn} ${vk}`;
  if (!v) { warns.push(`${ctx}: verset negăsit`); continue; }
  const n = v.t.split(oldS).length - 1;
  if (n === 0 || (n > 1 && !all)) { warns.push(`${ctx}: «${oldS}» apare de ${n} ori`); continue; }
  // regiunea minimă schimbată (prefix/sufix comun)
  let p = 0; while (p < oldS.length && p < newS.length && oldS[p] === newS[p]) p++;
  let sfx = 0; while (sfx < oldS.length - p && sfx < newS.length - p && oldS[oldS.length - 1 - sfx] === newS[newS.length - 1 - sfx]) sfx++;
  const oldCore = oldS.slice(p, oldS.length - sfx), newCore = newS.slice(p, newS.length - sfx);
  // poziții (de la sfârșit spre început)
  const poss = []; let i = -1; while ((i = v.t.indexOf(oldS, i + 1)) >= 0) poss.push(i);
  for (const at of poss.reverse()) {
    applyToTokens(v, ctx, at + p, oldCore, newCore);
    v.t = v.t.slice(0, at) + newS + v.t.slice(at + oldS.length);
  }
  const joined = v.tokens.map(t => t.t).join('');
  if (joined !== v.t) warns.push(`${ctx}: join(tokens) != t\n   t   : ${v.t}\n   join: ${joined}`);
  applied++;
}
console.log('corecturi aplicate:', applied, 'din', fixes.length);
console.log(warns.length ? 'AVERTISMENTE (' + warns.length + '):\n' + warns.join('\n') : 'fără avertismente');
if (process.argv.includes('--scrie')) {
  fs.copyFileSync(M, M + '.bak-poze');
  fs.writeFileSync(M, JSON.stringify(d, null, 1));
  console.log('scris');
}
