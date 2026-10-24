// node cfetch.js <Carte> <cap> <v1> <v2> <out.json> [autori...] — descarcă comentarii Sefaria (he + en) pe versete
const { execSync } = require('child_process'); const fs = require('fs');
const [book, c, v1, v2, outf, ...auth] = process.argv.slice(2);
const A = auth.length ? auth : ['Rashi', 'Ibn_Ezra', 'Radak', 'Metzudat_David', 'Metzudat_Zion'];
const strip = s => String(s).replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<i class="footnote">.*?<\/i>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&thinsp;/g, '').replace(/\s+/g, ' ').trim();
const flat = x => Array.isArray(x) ? x.flatMap(flat) : (x ? [strip(x)] : []);
let out = {}; try { out = JSON.parse(fs.readFileSync(outf, 'utf8')); } catch (e) {}
for (const a of A) {
  const url = `https://www.sefaria.org/api/texts/${a}_on_${book}.${c}.${v1}-${v2}?context=0&pad=0`;
  let j; try { j = JSON.parse(execSync(`curl -s -m 60 "${url}"`, { maxBuffer: 5e7 }).toString('utf8')); } catch (e) { console.log(a, 'eroare'); continue; }
  if (j.error) { console.log(a, 'lipsă'); continue; }
  const en = Array.isArray(j.text) ? j.text : [], he = Array.isArray(j.he) ? j.he : [];
  const n = Math.max(en.length, he.length);
  for (let i = 0; i < n; i++) {
    const v = c + ':' + (+v1 + i); const e = flat(en[i]).filter(Boolean), h = flat(he[i]).filter(Boolean);
    if (!e.length && !h.length) continue;
    (out[v] = out[v] || {})[a] = { en: e, he: h };
  }
  console.log(a, 'ok');
}
fs.writeFileSync(outf, JSON.stringify(out, null, 1));
