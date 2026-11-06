// Pregătește panoul lexical al capitolului N reutilizând ce există în Geneza 1..N-1 (doar texte generale, fără trimiteri la versete) și listează ce rămâne de scris.
// node tools/lexbank-apply.js N [--write]   → apoi se scriu tools/gN-data.js (def/dict) și tools/gN-lex-data.js (greek/diff) și se rulează tools/gen-apply.js N
const fs = require('fs');
const N = +process.argv[2], WRITE = process.argv.includes('--write');
const load = n => new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
const ctx = d => /\b\d{1,2}:\d{1,2}\b|Geneza \d|\baici\b|\bcapitol|\bverset/i.test(d || '');
const dict = {}, def = {}, gdr = {}, diff = {};
for (let n = 1; n < N; n++) load(n).forEach(x => x.tokens.filter(t => t.heb).forEach(t => {
  if (t.dict_ro && !/^Vezi mai sus/.test(t.dict_ro) && !ctx(t.dict_ro) && t.pos !== 'numeral' && !dict[t.strong]) dict[t.strong] = t.dict_ro;
  if (t.def_ro && t.def_ro.length > 20 && / — |; |, /.test(t.def_ro) && !ctx(t.def_ro) && !/ani — numeral/.test(t.def_ro) && !def[t.strong]) def[t.strong] = t.def_ro;
  if (t.greek && t.greek_def_ro && !/^—/.test(t.greek_def_ro) && !ctx(t.greek_def_ro) && !gdr[t.greek]) gdr[t.greek] = t.greek_def_ro;
}));
const D = load(N); let nd = 0, nk = 0, ng = 0;
const needDef = new Map(), needDict = new Map(), needG = new Map();
for (const x of D) for (const t of x.tokens.filter(t => t.heb)) {
  const echo = !t.def_ro || t.def_ro.replace(/[ .!]/g, '').toLowerCase() === (t.w || '').replace(/[ .!]/g, '').toLowerCase() || t.def_ro.length <= 24;
  if (echo) { if (def[t.strong]) { t.def_ro = def[t.strong]; nd++; } else needDef.set(t.strong, (needDef.get(t.strong) || '') + (needDef.get(t.strong) ? '; ' : '') + x.num + ':' + t.w + '=' + t.heb); }
  if (!t.dict_ro || /^Vezi mai sus/.test(t.dict_ro) || ctx(t.dict_ro)) { if (dict[t.strong]) { t.dict_ro = dict[t.strong]; nk++; } else needDict.set(t.strong, (needDict.get(t.strong) || '') + (needDict.get(t.strong) ? '; ' : '') + x.num + ':' + t.w + '=' + t.heb); }
  if (t.greek && (!t.greek_def_ro || /^—/.test(t.greek_def_ro))) { if (gdr[t.greek]) { t.greek_def_ro = gdr[t.greek]; ng++; } else needG.set(t.greek, (needG.get(t.greek) || '') + x.num + ':' + t.w + ' '); }
}
console.log((WRITE ? 'SCRIS' : 'PROBĂ'), '| def reutilizate', nd, '| dict reutilizate', nk, '| greek reutilizate', ng);
console.log('RĂMÂN: def', needDef.size, '| dict', needDict.size, '| greacă', needG.size);
if (process.argv.includes('--list')) { console.log('--- DEF'); needDef.forEach((v, k) => console.log(k, v.slice(0, 90))); console.log('--- DICT'); needDict.forEach((v, k) => console.log(k, v.slice(0, 90))); console.log('--- GREACĂ'); needG.forEach((v, k) => console.log(k, '<' + v.trim() + '>')); }
if (WRITE) fs.writeFileSync('public/genesis-' + N + '.js', 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
