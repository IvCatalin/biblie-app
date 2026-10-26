// Descarcă din Sefaria legăturile (api/links) către capitolele din targets.json și păstrează doar cele către Zohar și Mișna,
// ancorate pe UN SINGUR verset. Cache: <dir>/sef/<Carte>_<cap>.json
// Utilizare: node fetch-links.js <targets.json> <dir-cache>
const fs = require('fs');
const { execFile } = require('child_process');
const [TG, DIR] = process.argv.slice(2);
const targets = JSON.parse(fs.readFileSync(TG, 'utf8'));
fs.mkdirSync(DIR + '/sef', { recursive: true });
const chs = [...new Set(Object.keys(targets).map(k => k.replace(/:\d+$/, '')))];
const todo = chs.filter(c => !fs.existsSync(DIR + '/sef/' + c.replace(/ /g, '_') + '.json'));
console.log('capitole:', chs.length, '| de descărcat:', todo.length);
let i = 0, ok = 0, fail = [];
function one(c) {
  return new Promise(res => {
    const url = 'https://www.sefaria.org/api/links/' + encodeURIComponent(c.replace(/ (\d+)$/, '.$1').replace(/ /g, '_')) + '?with_text=0';
    const tmp = DIR + '/sef/_tmp_' + c.replace(/ /g, '_');
    const attempt = n => execFile('curl', ['-s', '--compressed', '-m', '240', '-o', tmp, '-w', '%{http_code}', url], { maxBuffer: 1e6 }, (e, out) => {
      let L = null;
      try { if (out.trim() === '200') L = JSON.parse(fs.readFileSync(tmp, 'utf8')); } catch (x) { }
      if (!L || !Array.isArray(L)) { if (n < 3) return setTimeout(() => attempt(n + 1), 2000); fail.push(c + ' (' + out + ')'); return res(); }
      const keep = [];
      for (const l of L) {
        if (!(/^Zohar,/.test(l.ref) || /^Mishnah /.test(l.ref))) continue;
        if (!/^[A-Za-z' ]+ \d+:\d+$/.test(l.anchorRef)) continue; // doar ancorare pe un singur verset
        if (/-/.test(l.ref)) continue; // doar legături către o singură unitate
        keep.push({ ref: l.ref, anchor: l.anchorRef, type: l.type || '' });
      }
      fs.writeFileSync(DIR + '/sef/' + c.replace(/ /g, '_') + '.json', JSON.stringify(keep));
      try { fs.unlinkSync(tmp); } catch (x) { }
      ok++; res();
    });
    attempt(1);
  });
}
async function worker() { while (i < todo.length) { const c = todo[i++]; await one(c); if (ok % 10 === 0) console.log('descărcate', ok); } }
(async () => { await Promise.all([worker(), worker(), worker()]); console.log('gata:', ok, 'eșuate:', fail.length, fail.join('; ')); })();
