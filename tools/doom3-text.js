// Textul românesc al unui capitol Geneză care TREBUIE să respecte DOOM3 (câmpurile scrise/traduse de noi): tokeni, definiții, dicționar, diferențe, comparații, rândurile Părinților/modernilor traduși.
// Rândurile preluate din Bibliotecă (Tanakh, Talmud, Zohar, Jubilee, Josephus) nu intră aici: au propria verificare la Bibliotecă.
// Folosit de doom3-check.js (care scrie data/doom3-state.json) și de audit-full.js (care dă EROARE dacă verificarea lipsește, e veche sau are cuvinte netriate).
const fs = require('fs'), crypto = require('crypto');
const OWN = /(Beda|Ieronim|Augustin|Ambrozie|Gură de Aur|Origen|Efrem|Clement|Chiril|Filon|Calvin|Wesley|Jamieson|Clarke|Gill|Henry|Irineu|Ioan Cassian|Vasile|Grigorie|Hipolit|Isidor|Metodiu|Tertulian|Teodoret|Eusebiu din Cezareea, |Iustin|Keil|Context cultural|Fericitul|Sfântul|Sfinții|Philon|Filon|Ipolit|Chiril|Teodoret)/;
function parts(N) {
  const D = new Function('window', fs.readFileSync('public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const txt = [];
  for (const x of D) {
    for (const t of x.tokens) for (const f of ['t', 'def_ro', 'dict_ro', 'greek_def_ro', 'diff_ro']) if (t[f]) txt.push(f === 'greek_def_ro' ? t[f].replace(/(?<=[Ͱ-Ͽἀ-῿])\s*\([a-z’' ,/-]+\)/g, '') : t[f]);
    for (const c of x.textCompare || []) txt.push(c.translation || '', c.note || '');
    for (const c of x.commentaries || []) if (c.text && !c.src && OWN.test(c.author || '')) txt.push(c.text);
    if (x.fidela) txt.push(String(x.fidela));
  }
  return txt.join('\n').replace(/<[^>]*>/g, ' ');
}
function words(N) {
  const out = {}; // cuvânt (minuscule) -> { n, low, cap }
  for (const m of parts(N).matchAll(/[\p{L}̀-ͯ]+(?:-[\p{L}̀-ͯ]+)*/gu)) for (const p of m[0].split('-')) {
    const k = p.toLowerCase(); if (k.length < 2 || !/^[a-zăâîșț]+$/.test(k)) continue; // cuvintele cu litere din alte alfabete/accente (translit. grecești, ebraice) nu se verifică
    const o = out[k] = out[k] || { n: 0, low: 0, cap: 0 }; o.n++; if (p[0] === p[0].toUpperCase() && p[0] !== p[0].toLowerCase()) o.cap++; else o.low++;
  }
  return out;
}
const hash = (N) => crypto.createHash('sha1').update(parts(N)).digest('hex').slice(0, 16);
module.exports = { parts, words, hash };
