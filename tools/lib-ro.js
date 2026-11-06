// Lista de forme românești din dicționarul Hunspell ro_RO (LibreOffice, rospell), descărcată o dată în %TEMP%/ro-dict. Folosită ca filtru înaintea interogării DOOM3.
const fs = require('fs'), os = require('os'), path = require('path');
const dir = path.join(os.tmpdir(), 'ro-dict');
function expand(aff, dic) {
  const R = {};
  for (const l of aff.split('\n')) {
    const p = l.trim().split(/\s+/);
    if (p[0] !== 'SFX' && p[0] !== 'PFX') continue;
    if (p.length === 4 && /^[YN]$/.test(p[2])) { R[p[0] + p[1]] = { type: p[0], rules: [] }; continue; }
    if (p.length >= 5 && R[p[0] + p[1]]) {
      const r = R[p[0] + p[1]]; const add = p[3].split('/')[0];
      r.rules.push({ strip: p[2] === '0' ? '' : p[2], add: add === '0' ? '' : add, cond: new RegExp(r.type === 'SFX' ? '(?:' + p[4] + ')$' : '^(?:' + p[4] + ')') });
    }
  }
  const out = new Set();
  for (const line of dic.split('\n').slice(1)) {
    if (!line) continue;
    const i = line.indexOf('/'); const w = (i < 0 ? line : line.slice(0, i)).trim(); const fl = i < 0 ? '' : line.slice(i + 1).trim();
    out.add(w.toLowerCase());
    for (const f of fl) for (const r of [R['SFX' + f], R['PFX' + f]]) {
      if (!r) continue;
      for (const ru of r.rules) {
        if (!ru.cond.test(w)) continue;
        if (r.type === 'SFX') { if (ru.strip && !w.endsWith(ru.strip)) continue; out.add((w.slice(0, w.length - ru.strip.length) + ru.add).toLowerCase()); }
        else { if (ru.strip && !w.startsWith(ru.strip)) continue; out.add((ru.add + w.slice(ru.strip.length)).toLowerCase()); }
      }
    }
  }
  return out;
}
async function get(f) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) fs.writeFileSync(p, Buffer.from(await (await fetch('https://raw.githubusercontent.com/LibreOffice/dictionaries/master/ro/' + f)).arrayBuffer()));
  return fs.readFileSync(p, 'utf8');
}
async function rospell() { return expand(await get('ro_RO.aff'), await get('ro_RO.dic')); }
module.exports = { rospell };
