// Validează candidatele (textul ebraic/aramaic din Sefaria trebuie să conțină cuvinte din versetul ancoră) și alege 1 Zohar + 1 Mișna per verset.
// Utilizare: node pick-links.js <cands.json> <dir-cache> <plan.json>
const fs = require('fs');
const { execFile } = require('child_process');
const [CJ, CD, OUT] = process.argv.slice(2);
const O = require('C:/Users/ivcatali/biblie-app/de-procesat/_haftarot-deuteronom-extract/oshb');
const cands = JSON.parse(fs.readFileSync(CJ, 'utf8'));
fs.mkdirSync(CD + '/he', { recursive: true });
const OSIS = { Genesis: 'Gen', Exodus: 'Exod', Leviticus: 'Lev', Numbers: 'Num', Deuteronomy: 'Deut', Joshua: 'Josh', Judges: 'Judg', 'I Samuel': '1Sam', 'II Samuel': '2Sam', 'I Kings': '1Kgs', 'II Kings': '2Kgs', Isaiah: 'Isa', Jeremiah: 'Jer', Ezekiel: 'Ezek', Hosea: 'Hos', Joel: 'Joel', Amos: 'Amos', Obadiah: 'Obad', Jonah: 'Jonah', Micah: 'Mic', Nahum: 'Nah', Habakkuk: 'Hab', Zephaniah: 'Zeph', Haggai: 'Hag', Zechariah: 'Zech', Malachi: 'Mal' };
const FIN = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const cons = s => s.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/[\u0591-\u05C7]/g, '').replace(/\u05BE/g, ' ').replace(/[ךםןףץ]/g, c => FIN[c]).replace(/[^\u05D0-\u05EA ]+/g, ' ').replace(/\s+/g, ' ').trim();
const verseWords = anchor => {
  const m = anchor.match(/^(.*) (\d+):(\d+)$/); const os = OSIS[m[1]]; if (!os) return null;
  const ws = O.verse(os, +m[2], +m[3]) || [];
  return ws.map(w => cons(w.heb)).join(' ').split(' ').filter(w => w.length >= 3);
};
function sefUrl(ref) {
  const m = ref.match(/^(.*) (\d+):(\d+)$/);
  const name = m[1].replace(/, /g, ',_').replace(/ /g, '_');
  return 'https://www.sefaria.org/api/texts/' + encodeURIComponent(name + '.' + m[2] + '.' + m[3]) + '?lang=he&context=0';
}
const flat = x => Array.isArray(x) ? x.map(flat).join(' ') : (x == null ? '' : String(x));
const heCache = {};
function fetchHe(ref) {
  if (heCache[ref]) return heCache[ref];
  const f = CD + '/he/' + ref.replace(/[^A-Za-z0-9]+/g, '_') + '.txt';
  if (fs.existsSync(f)) return heCache[ref] = Promise.resolve(fs.readFileSync(f, 'utf8'));
  return heCache[ref] = new Promise(res => {
    const go = n => execFile('curl', ['-s', '--compressed', '-m', '60', sefUrl(ref)], { maxBuffer: 5e7 }, (e, out) => {
      let t = null; try { const j = JSON.parse(out); t = flat(j.he); } catch (x) { }
      if (t === null) { if (n < 3) return setTimeout(() => go(n + 1), 1500); return res(null); }
      fs.writeFileSync(f, t); res(t);
    });
    go(1);
  });
}
function matchCount(words, text) {
  const seg = ' ' + cons(text) + ' ';
  let c = 0;
  for (const w of words) { const stems = [w, w.slice(1), w.slice(2)].filter(x => x.length >= 3); if (stems.some(s => seg.includes(s))) c++; }
  return c;
}
const pool = (items, n, fn) => { let i = 0; return Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const it = items[i++]; await fn(it); } })); };

(async () => {
  const rids = Object.keys(cands);
  // faza A: validare (top 4 Zohar + top 4 Mișna per verset)
  const jobs = []; const seen = new Set();
  for (const rid of rids) { const c = cands[rid]; for (const arr of [c.z.slice(0, 4), c.m.slice(0, 4)]) for (const x of arr) { const k = c.anchor + '||' + x.sef; if (!seen.has(k)) { seen.add(k); jobs.push([c.anchor, x.sef]); } } }
  console.log('validări de făcut:', jobs.length);
  const ver = {}; let done = 0;
  await pool(jobs, 8, async ([anchor, ref]) => {
    const words = verseWords(anchor); const t = await fetchHe(ref);
    ver[anchor + '||' + ref] = (words && t != null) ? { n: words.length, m: matchCount(words, t), len: t.length } : { n: 0, m: 0, len: 0, err: true };
    if (++done % 500 === 0) console.log('validate', done);
  });
  const passes = v => v && !v.err && v.m >= (v.n < 4 ? v.n : Math.max(3, Math.ceil(v.n * 0.6)));
  // faza B: alegere greedy cu diversificare
  const plan = {}; const used = {}; let nz = 0, nm = 0, failedAll = [];
  const excerpt = t => { if (t.length <= 1000) return t; const cut = t.slice(0, 900); const mm = [...cut.matchAll(/[.!?”»)]\s/g)].pop(); return (mm ? cut.slice(0, mm.index + 1) : cut.replace(/\s+\S*$/, '')) + ' […]'; };
  for (const rid of rids) {
    const c = cands[rid]; const out = [];
    for (const [arr, src] of [[c.z.slice(0, 4), 'zohar'], [c.m.slice(0, 4), 'mishna']]) {
      let best = null;
      for (const x of arr) {
        const v = ver[c.anchor + '||' + x.sef]; if (!passes(v)) continue;
        const s = x.base - 40 * (used[x.id] || 0) + Math.min(v.m, 6);
        if (!best || s > best.s) best = { ...x, s, v };
      }
      if (best) { used[best.id] = (used[best.id] || 0) + 1; out.push({ author: best.author, text: excerpt(best.text), src, sef: best.sef, fam: best.fam || 0, m: best.v.m, n: best.v.n }); src === 'zohar' ? nz++ : nm++; }
      else if (arr.length) failedAll.push(rid + ' ' + src);
    }
    if (out.length) plan[rid] = out;
  }
  fs.writeFileSync(OUT, JSON.stringify(plan));
  const tot = Object.values(ver); const okN = tot.filter(passes).length;
  console.log('candidate validate:', tot.length, '| trec:', okN, '| nu trec:', tot.length - okN, '(erori de rețea:', tot.filter(v => v.err).length + ')');
  console.log('versete cu comentariu nou:', Object.keys(plan).length, '| Zohar', nz, '| Mișna', nm, '| fără niciun candidat valid:', failedAll.length);
  const byKind = {}; for (const k of Object.keys(plan)) { const t = k.split('|')[0]; byKind[t] = (byKind[t] || 0) + 1; } console.log(JSON.stringify(byKind));
})();
