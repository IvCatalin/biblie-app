// node fetch-comm.js <SefariaBook> <chapter> <v1> <v2> <outfile>
// Fetches Rashi, Metzudat David, Metzudat Tzion, Radak via Sefaria API for a verse range
const { execSync } = require('child_process');
const fs = require('fs');
const [book, cn, v1, v2, outfile] = process.argv.slice(2);
const COMMENTATORS = [
  ['rashi', 'Rashi_on_' + book],
  ['metzudat_david', 'Metzudat_David_on_' + book],
  ['metzudat_zion', 'Metzudat_Zion_on_' + book],
  ['radak', 'Radak_on_' + book],
];
let out = {};
for (const [key, prefix] of COMMENTATORS) {
  out[key] = {};
  for (let v = +v1; v <= +v2; v++) {
    const url = `https://www.sefaria.org/api/texts/${prefix}.${cn}.${v}?lang=he&commentary=0`;
    let res;
    try {
      res = execSync(`curl -s -m 20 "${url}"`).toString('utf8');
      const j = JSON.parse(res);
      if (j.error) continue;
      out[key][v] = j.he || [];
    } catch (e) { /* skip missing */ }
  }
}
fs.writeFileSync(outfile, JSON.stringify(out, null, 1));
console.log('scris', outfile);
for (const k of Object.keys(out)) console.log(k, Object.keys(out[k]).length, 'versete cu comentariu');
