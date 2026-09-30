// Textul ebraic OSHB (openscriptures/morphhb, CC-BY 4.0) cuvânt cu cuvânt: formă, Strong, morfologie → pos în română, transliterare
// Folosire: const O = require('./oshb'); O.verse('Isa', 42, 5) → [{i, heb, strong, lemma, morph, pos, translit}]
const fs = require('fs'); const path = require('path');
const cache = {};
function book(b) {
  if (cache[b]) return cache[b];
  const x = fs.readFileSync(path.join(__dirname, 'oshb', b + '.xml'), 'utf8');
  const out = {};
  const re = /<verse osisID="([^"]+)">([\s\S]*?)<\/verse>/g; let m;
  while ((m = re.exec(x))) {
    const words = []; const wr = /<w ([^>]*)>([^<]*)<\/w>/g; let w;
    while ((w = wr.exec(m[2]))) {
      if (/x-ketiv/.test(w[1])) continue;
      const lemma = (w[1].match(/lemma="([^"]*)"/) || [])[1] || '';
      const morph = (w[1].match(/morph="([^"]*)"/) || [])[1] || '';
      words.push(mk(words.length, w[2], lemma, morph));
    }
    out[m[1]] = words;
  }
  return (cache[b] = out);
}
const strip = s => s.replace(/[֑-ֽ֯׀׃-׆]/g, '').replace(/\//g, '');
function mainLemma(lemma) {
  const parts = lemma.split('/').map(p => p.trim());
  for (let i = parts.length - 1; i >= 0; i--) { const n = parts[i].match(/^(\d+)/); if (n) return 'H' + n[1]; }
  return '';
}
const STEM = { q: 'qal', N: 'nifal', p: 'piel', P: 'pual', h: 'hifil', H: 'hofal', t: 'hitpael', o: 'polel', O: 'polal', r: 'hitpolel', m: 'poel', M: 'poal', k: 'palel', K: 'pulal', Q: 'qal pasiv', l: 'pilpel', L: 'polpal', f: 'hitpalpel', D: 'nitpael', j: 'pealal', i: 'pilel', u: 'hotpaal', c: 'tifil', v: 'hiștafel', w: 'nitpalel', y: 'nitpoel', z: 'hitpoel' };
const AST = { q: 'peal', Q: 'peil', u: 'hitpeel', N: 'nifal', p: 'pael', P: 'pual', M: 'hitpaal', a: 'afel', h: 'hafel', s: 'safel', e: 'șafel', H: 'hofal', i: 'itpeel', t: 'hitpaal', v: 'iștafal', w: 'hiștafal', o: 'itpaal', z: 'hitpeel', m: 'itpeel', y: 'itpaal', r: 'hitpolel', f: 'hitpalpel', b: 'hitpaal', c: 'tifil', d: 'itpaal', l: 'pilpel' };
const VT = { p: 'perfect', q: 'perfect consecutiv', i: 'imperfect', w: 'imperfect consecutiv', h: 'cohortativ', j: 'jusiv', v: 'imperativ', r: 'participiu', s: 'participiu pasiv', a: 'infinitiv absolut', c: 'infinitiv' };
const GEN = { m: 'masculin', f: 'feminin', b: 'masculin și feminin', c: 'comun' };
const NUM = { s: 'singular', p: 'plural', d: 'dual' };
function posRo(morph) {
  const lang = morph[0]; const segs = morph.slice(1).split('/');
  // ultimul segment care nu e prefix (R prepoziție, C conjuncție, Td articol) e cuvântul principal
  let main = segs.find((s, i) => !(i < segs.length - 1 && /^(R|C|Td|Ti)/.test(s) && !/^S/.test(segs[i + 1] || ''))) || segs[0];
  const suf = segs.some(s => /^S[php]/.test(s));
  const c = main[0]; let r;
  if (c === 'V') {
    const st = (lang === 'A' ? AST : STEM)[main[1]] || ''; const ty = VT[main[2]] || '';
    r = 'verb, ' + (st + ' ' + ty).trim();
  } else if (c === 'N') {
    if (main[1] === 'p') r = 'nume propriu';
    else if (main[1] === 'g') r = 'nume de neam';
    else {
      const g = GEN[main[2]] || '', n = NUM[main[3]] || '';
      r = 'substantiv' + (g || n ? ', ' + [g, n].filter(Boolean).join(' ') : '') + (main[4] === 'c' ? ' construct' : '');
    }
  } else if (c === 'A') {
    r = main[1] === 'c' ? 'numeral' : main[1] === 'o' ? 'numeral ordinal' : main[1] === 'g' ? 'nume de neam' : 'adjectiv';
    const g = GEN[main[2]] || '', n = NUM[main[3]] || ''; if (r === 'adjectiv' && (g || n)) r += ', ' + [g, n].filter(Boolean).join(' ');
  } else if (c === 'P') r = { d: 'pronume demonstrativ', f: 'pronume nehotărât', i: 'pronume interogativ', p: 'pronume personal', r: 'pronume relativ' }[main[1]] || 'pronume';
  else if (c === 'D') r = 'adverb';
  else if (c === 'R') r = 'prepoziție';
  else if (c === 'C') r = 'conjuncție';
  else if (c === 'T') r = { a: 'particulă afirmativă', d: 'articol', e: 'interjecție', i: 'particulă interogativă', j: 'interjecție', m: 'particulă demonstrativă', n: 'particulă negativă', o: 'marcă a complementului direct', r: 'particulă relativă' }[main[1]] || 'particulă';
  else r = 'cuvânt';
  if (lang === 'A') r += ' (aramaică)';
  return r + (suf ? ' + sufix' : '');
}
// Transliterare după convenția deja folosită în aplicație: ș, ț, h pentru ח/כ, ē pentru țere, i pentru yod
function translit(hebRaw) {
  const w = strip(hebRaw).replace(/־/g, '-');
  if (/^[ְ-ׇ]*י[ְ-ׇ]*ה[ְ-ׇ]*ו[ְ-ׇ]*ה[ְ-ׇ]*$/.test(w.replace(/^[וּבְּלַכַּמֵ]+(?=י)/, ''))) {
    const pre = w.replace(/י[\s\S]*$/, ''); return translit(pre || '') + (pre ? "'" : '') + 'Adonai';
  }
  const letters = []; // [{c, marks}]
  for (const ch of w) { if (/[א-ת-]/.test(ch)) letters.push({ c: ch, m: '' }); else if (letters.length) letters[letters.length - 1].m += ch; }
  let out = '';
  const V = m => m.includes('ַ') || m.includes('ָ') || m.includes('ֲ') ? 'a' : m.includes('ֵ') ? 'ē' : m.includes('ֶ') || m.includes('ֱ') ? 'e' : m.includes('ִ') ? 'i' : m.includes('ֹ') || m.includes('ֺ') || m.includes('ֳ') ? 'o' : m.includes('ֻ') ? 'u' : '';
  for (let i = 0; i < letters.length; i++) {
    const { c, m } = letters[i]; const dag = m.includes('ּ'); const prev = letters[i - 1]; const next = letters[i + 1];
    const atStart = i === 0 || (prev && prev.c === '-');
    if (c === '-') { out += '-'; continue; }
    let cons = '';
    switch (c) {
      case 'א': case 'ע': cons = ''; break;
      case 'ב': cons = dag ? 'b' : 'v'; break;
      case 'ג': cons = 'g'; break; case 'ד': cons = 'd'; break;
      case 'ה': cons = (i === letters.length - 1 || (next && next.c === '-')) && !dag && !V(m) ? '' : 'h'; break;
      case 'ו':
        if (m.includes('ֹ') && !V(m.replace('ֹ', ''))) { out += 'o'; continue; }
        if (dag && !V(m) && !(atStart)) { out += 'u'; continue; }
        if (dag && atStart && !V(m)) { out += 'u'; continue; }
        cons = 'v'; break;
      case 'ז': cons = 'z'; break; case 'ח': cons = 'h'; break; case 'ט': cons = 't'; break;
      case 'י': if (!V(m) && !m.includes('ְ') && prev && /[ieē]$/.test(out) && !dag) { continue; } cons = 'i'; break;
      case 'כ': case 'ך': cons = dag ? 'k' : 'h'; break;
      case 'ל': cons = 'l'; break; case 'מ': case 'ם': cons = 'm'; break; case 'נ': case 'ן': cons = 'n'; break;
      case 'ס': cons = 's'; break; case 'פ': case 'ף': cons = dag ? 'p' : 'f'; break;
      case 'צ': case 'ץ': cons = 'ț'; break; case 'ק': cons = 'k'; break; case 'ר': cons = 'r'; break;
      case 'ש': cons = m.includes('ׂ') ? 's' : 'ș'; break; case 'ת': cons = 't'; break;
    }
    // dagesh forte: consoană dublată între vocale (nu la început) — convenția aplicației nu dublează, se păstrează simplă
    let vow = V(m);
    if (!vow && m.includes('ְ')) vow = atStart || (prev && prev.m.includes('ְ')) ? 'e' : '';
    if (c === 'ח' && m.includes('ַ') && (i === letters.length - 1)) { out += 'a' + cons; continue; } // patah furtiv
    if (c === 'י' && cons === 'i' && vow) cons = 'i';
    out += cons + vow;
  }
  return out.replace(/ii+/g, 'i').replace(/^-|-$/g, '');
}
function mk(i, raw, lemma, morph) {
  return { i, heb: strip(raw), strong: mainLemma(lemma), lemma, morph, pos: posRo(morph), translit: translit(raw) };
}
function verse(b, c, v) { return book(b)[`${b}.${c}.${v}`] || null; }
// Cuvintele ebraice ale unui verset din Haftarot (după oshb-map.json), cu excepțiile de împărțire diferită a versetelor
const SPLIT = { '13|27:10': [['Isa', 27, 10, 0, 8]], '13|27:11': [['Isa', 27, 10, 8, 99], ['Isa', 27, 11, 0, 99]] };
let MAP = null;
function haftWords(chNum, vLabel) {
  const key = chNum + '|' + vLabel;
  const spec = SPLIT[key] || (() => { MAP = MAP || JSON.parse(fs.readFileSync(path.join(__dirname, 'oshb-map.json'), 'utf8')); const [b, c, v] = MAP[key].osis.split('.'); return [[b, +c, +v, 0, 999]]; })();
  const out = []; for (const [b, c, v, a, z] of spec) for (const w of verse(b, c, v).slice(a, z)) out.push(Object.assign({}, w, { i: out.length, osis: b + '.' + c + '.' + v }));
  return out;
}
const cons = s => s.replace(/[^א-ת]/g, '').replace(/[ךםןףץ]/g, x => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' })[x]);
module.exports = { haftWords, verse, book, translit, posRo, strip, cons };
if (require.main === module) {
  const [b, c, v] = process.argv.slice(2); for (const w of verse(b, +c, +v)) console.log(w.i, w.heb, w.strong, w.morph, '|', w.pos, '|', w.translit);
}
