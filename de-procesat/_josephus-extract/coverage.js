// Acoperirea traducerii române față de textul Whiston, pe secțiuni (paragrafe numerotate). Utilizare: node coverage.js <en.json> <dir-json-ro>
const fs = require('fs');
const [ENJ, RD] = process.argv.slice(2);
const en = JSON.parse(fs.readFileSync(ENJ, 'utf8'));
const secs = t => t.split(/\n\s*\n(?=\d+\. )/).map(p => p.trim()).filter(Boolean);
const tot = { en: 0, present: 0, complete: 0, trunc: 0, enChars: 0, roChars: 0 };
const rows = [], miss = {};
for (let n = 11; n <= 20; n++) {
  const d = JSON.parse(fs.readFileSync(RD + '/josephus-antichitati-' + n + '.json', 'utf8'));
  let s = 0, pr = 0, cp = 0, tr = 0, ec = 0, rc = 0; miss[n] = [];
  for (const c of Object.keys(en[n])) {
    const e = secs(en[n][c].text); const ro = (d.chapters.find(x => x.num === +c) || { verses: [] }).verses;
    e.forEach((sec, i) => {
      s++; ec += sec.length;
      const r = ro[i];
      if (!r) { miss[n].push(c + '.' + (i + 1)); return; }
      pr++; rc += r.t.length;
      const ratio = r.t.length / sec.length;
      if (ratio >= 0.75) cp++; else { tr++; miss[n].push(c + '.' + (i + 1) + '(trunchiat ' + Math.round(ratio * 100) + '%)'); }
    });
  }
  rows.push([n, s, pr, cp, tr, ec, rc]);
  tot.en += s; tot.present += pr; tot.complete += cp; tot.trunc += tr; tot.enChars += ec; tot.roChars += rc;
}
console.log('Cartea | secțiuni EN | prezente RO | complete (≥75%) | trunchiate | caractere EN | caractere RO | acoperire');
for (const r of rows) console.log(`${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]} | ${r[6]} | ${Math.round(r[3] / r[1] * 100)}% secțiuni complete`);
console.log('TOTAL', JSON.stringify(tot), Math.round(tot.complete / tot.en * 100) + '% secțiuni complete');
fs.writeFileSync(process.argv[4] || 'coverage-miss.json', JSON.stringify(miss, null, 1));
