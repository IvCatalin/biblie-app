// Audit Standard Davar pe haftarot-sarbatori.json. Utilizare: node audit.js <cap> [--verse]
const d = require('C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-extract/haftarot-sarbatori.json');
const cn = +process.argv[2]; const c = d.chapters.find(x => x.num === cn);
const BAN = [/verificat direct/i, /presupus/i, /presupunere/i, /\(rezumat/i, /\(verificat\)/i, /domeniu liber CC0/i, /\bTODO\b/, /\bîn lucru\b/i, /neverificat individual/i];
const JEWISH = /rashi|ibn ezra|ramban|sforno|radak|metzudat|ralbag|abarbanel|talmud|mi[sș]na|zohar|midra[sș]|targum|rabbi|saadia|rasag|malbim|kli yakar|or hachaim|seforno|bereshit rabba|șadal|luzzatto|samson raphael hirsch|hirsch/i;
const out = []; const add = (v, m) => out.push(`${c.num}:${v} ${m}`);
let tags = 0, comm = 0, refs = 0;
for (const v of c.verses) {
  const toks = v.tokens || [];
  const joined = toks.map(t => t.t).join('');
  if (joined !== v.t) add(v.v, 'tokens != textul verset (text de bază alterat sau tokens incomplete)');
  const tg = toks.filter(t => t.heb);
  tags += tg.length;
  if (!tg.length) add(v.v, 'NICIUN tag');
  for (const t of tg) {
    const L = `«${t.t}»`;
    for (const f of ['heb', 'translit', 'strong', 'pos', 'def_ro', 'dict_ro']) if (!t[f]) add(v.v, `${L} lipsește ${f}`);
    if (t.dict_ro && t.dict_ro.length < 80) add(v.v, `${L} dict_ro prea scurt (${t.dict_ro.length})`);
    if (!t.greek && !t.diff_ro) add(v.v, `${L} fără LXX și fără notă de absență`);
    if (t.greek && !t.greek_def_ro) add(v.v, `${L} greek fără greek_def_ro`);
    if (t.greek_def_ro && !/—/.test(t.greek_def_ro)) add(v.v, `${L} greek_def_ro fără glosă`);
    if (t.diff_ro && t.greek_def_ro && t.diff_ro.includes(t.greek_def_ro.split('—').pop().trim())&&t.diff_ro.length<60) add(v.v, `${L} diff_ro doar repetă glosa`);
    for (const k of ['def_ro', 'dict_ro', 'diff_ro', 'greek_def_ro']) for (const b of BAN) if (t[k] && b.test(t[k])) add(v.v, `${L} ${k} conține frază interzisă ${b}`);
  }
  const tc = v.textCompare || [];
  const mt = tc.find(x => /Masoretic/.test(x.source)), lx = tc.find(x => x.greek);
  if (!mt || !mt.original) add(v.v, 'textCompare: lipsește MT'); else if (!mt.note) add(v.v, 'MT fără notă');
  if (!lx) add(v.v, 'textCompare: lipsește LXX'); else { if (!lx.translation || lx.translation.length < 8) add(v.v, 'LXX fără traducere'); if (!lx.note) add(v.v, 'LXX fără notă'); if (!lx.original && !/nu are/i.test(lx.translation||'')) add(v.v, 'LXX fără text grecesc'); if (mt && lx.note && mt.note === lx.note) add(v.v, 'notă MT == notă LXX'); }
  for (const x of tc) for (const k of ['note', 'translation']) for (const b of BAN) if (x[k] && b.test(x[k])) add(v.v, `textCompare ${k} frază interzisă ${b}`);
  const r = v.refs || []; refs += r.length;
  if (!r.length) add(v.v, 'fără trimiteri (OK doar dacă nu există legătură reală)');
  if (r.length > 6) add(v.v, `trimiteri ${r.length} > 6`);
  const cm = v.commentaries || []; comm += cm.length;
  if (!cm.length) add(v.v, 'fără comentarii');
  let seenChr = false, bad = false;
  for (const x of cm) { const j = JEWISH.test(x.author); if (!j) seenChr = true; else if (seenChr) bad = true; for (const b of BAN) if (b.test(x.text) || b.test(x.author)) add(v.v, `comentariu ${x.author} frază interzisă ${b}`); if (!x.text || x.text.length < 40) add(v.v, `comentariu ${x.author} prea scurt`); }
  if (bad) add(v.v, 'ordine comentarii: creștin înaintea unui evreu');
  if (cm.length && !/rashi/i.test(cm[0].author) && cm.some(x => /rashi/i.test(x.author))) add(v.v, 'Rashi nu e primul');
}
const nv = c.verses.length;
console.log(`# cap ${c.num} ${c.title}: ${nv} versete, ${tags} tag-uri (${(tags / nv).toFixed(2)}/v), comentarii ${(comm / nv).toFixed(2)}/v, trimiteri ${(refs / nv).toFixed(2)}/v, probleme ${out.length}`);
const sum = {}; for (const o of out) { const k = o.replace(/^[^ ]+ /, '').replace(/«[^»]*»/g, '«…»').replace(/\(\d+\)/, ''); sum[k] = (sum[k] || 0) + 1; }
for (const [k, n] of Object.entries(sum).sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(4), k);
if (process.argv.includes('--verse')) console.log(out.join('\n'));
