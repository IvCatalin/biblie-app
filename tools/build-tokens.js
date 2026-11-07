// Construiește tokenii (w, heb, translit, strong, pos, samaritan) pentru un capitol Geneză din textul Rosen + ebraica OSHB (Strong's, morfologie).
// Intrare: tools/gN-align.txt, câte o linie pe verset: `V: text Rosen cu [fraza|nr] [alta|nr,nr] ...`
//   nr = numărul cuvântului ebraic în verset (1..), exact ca în `node tools/build-tokens.js N --words V`.
//   Un cuvânt Rosen netagat rămâne text simplu. Concatenarea (fără paranteze) trebuie să fie IDENTICĂ cu textul Rosen din capitol.
//   `[fraza|3@H1234]` forțează numărul Strong's. `[fraza|3,4]` = frază cu mai multe cuvinte ebraice (heb se unește, translit la fel).
// node tools/build-tokens.js N [--write] | N --words V (arată cuvintele ebraice ale versetului)
const fs = require('fs'), os = require('os'), path = require('path');
const N = +process.argv[2]; const W = process.argv.includes('--write');
const cache = path.join(os.tmpdir(), 'Gen-oshb.xml');
async function oshb() { if (!fs.existsSync(cache)) fs.writeFileSync(cache, Buffer.from(await (await fetch('https://raw.githubusercontent.com/openscriptures/morphhb/master/wlc/Gen.xml')).arrayBuffer())); return fs.readFileSync(cache, 'utf8'); }
const clean = (s) => s.replace(/\//g, '').replace(/[֑-ֽ֯׀׃ׄ]/g, '');
function parse(xml, ch) {
  const out = {};
  for (const m of xml.matchAll(/<verse osisID="Gen\.(\d+)\.(\d+)">([\s\S]*?)<\/verse>/g)) {
    if (+m[1] !== ch) continue; const words = []; let pendingMaq = false;
    for (const t of m[3].matchAll(/<w ([^>]*)>([^<]*)<\/w>|<seg type="x-maqqef">/g)) {
      if (!t[1]) { pendingMaq = true; continue; }
      const lemma = (/lemma="([^"]*)"/.exec(t[1]) || [])[1] || '', morph = (/morph="([^"]*)"/.exec(t[1]) || [])[1] || '';
      const nums = lemma.split('/').map(p => p.trim().split(' ')[0].replace(/\+$/, '')).filter(p => /^\d+$/.test(p)); // numărul Strong's al cuvântului propriu-zis = ultimul
      words.push({ heb: clean(t[2]), strong: nums.length ? 'H' + nums[nums.length - 1] : '', morph, maqBefore: pendingMaq }); pendingMaq = false;
    }
    out[+m[2]] = words;
  }
  return out;
}
const { translit: tl } = require('./he-translit.js');
const translit = (h, proper) => tl(h, proper);
function pos(morph) {
  const parts = morph.replace(/^H/, '').split('/'); const main = parts.filter(p => !/^(C|Td|R|Ti|Tm)$/.test(p) || parts.length === 1).pop() || parts[parts.length - 1];
  const hasArt = parts.includes('Td'), hasPre = parts.some(p => /^(R|C|Tm)$/.test(p)), hasSuf = parts.some(p => /^S/.test(p));
  let b = ''; const m = main || '';
  if (/^Np/.test(m)) b = 'nume propriu'; else if (/^Ng/.test(m)) b = 'nume propriu, popor'; else if (/^Nc/.test(m)) b = 'substantiv' + (m[3] === 'c' || m[4] === 'c' ? ', stare construită' : '');
  else if (/^N/.test(m)) b = 'substantiv'; else if (/^V/.test(m)) { const t = m[2]; b = 'verb'; if (t === 'v') b += ', imperativ'; else if (t === 'r' || t === 's') b += ', participiu'; else if (t === 'c') b += ' (infinitiv)'; else if (t === 'a') b += ' (infinitiv absolut)'; if (m[1] === 'n') b = b.replace('verb', 'verb (nifal)').replace('(nifal) (', '('); }
  else if (/^A[co]/.test(m)) b = 'numeral'; else if (/^A/.test(m)) b = 'adjectiv'; else if (/^D/.test(m)) b = 'adverb'; else if (/^P/.test(m)) b = 'pronume'; else if (/^R/.test(m)) b = 'prepoziție'; else if (/^C/.test(m)) b = 'conjuncție'; else b = 'particulă';
  if (hasArt && !/cu articol/.test(b)) b += ', cu articol'; if (hasSuf) b += b.includes(',') ? ', cu sufix' : ' cu sufix';
  else if (hasPre && /^(substantiv|adjectiv)$/.test(b)) b += ', cu prefix';
  return b;
}
const skipStrong = (w) => /^H(R|C|Td|To|Ti|Tr|Tm|Tc|Te|Tn|Tj|D)/.test(w.morph) && !/^H(Np|N|V|A)/.test(w.morph);
(async () => {
  const xml = await oshb(); const words = parse(xml, N);
  // sefariaFix: cuvântul ebraic al tokenului urmează Sefaria (unde OSHB are altă grafie)
  { const HE = JSON.parse(fs.readFileSync('data/ref-mt-sefaria-gen.json', 'utf8')); process.argv.push('--lxx=data/ref-lxx-rahlfs-gen.json', '--he=data/ref-mt-sefaria-gen.json'); const { heClean } = require('./audit-g1-5-textcompare.js'); for (const v in words) { const raw = HE['Gen.' + N + '.' + v]; if (!raw || raw.includes('*')) continue; const sf = heClean(raw.replace(/<span class="mam-kq-k">[^<]*<\/span>/g, '')).replace(/יהֹוָה/g, 'יהוָה').split(/[ ־]/).filter(Boolean); const os = words[v].filter(w => w.heb); if (sf.length === os.length) os.forEach((w, i) => { if (w.heb !== sf[i] && w.heb.replace(/[ְ-ׇ]/g, '').replace(/י/g, '') === sf[i].replace(/[ְ-ׇ]/g, '').replace(/י/g, '')) { console.log('  Sefaria: ' + N + ':' + v + ' ' + w.heb + ' → ' + sf[i]); w.heb = sf[i]; } }); } }
  if (process.argv.includes('--words')) { const v = +process.argv[process.argv.indexOf('--words') + 1]; words[v].forEach((w, i) => console.log((i + 1) + ' ' + w.heb + ' ' + w.strong + ' ' + w.morph + ' ' + translit(w.heb))); return; }
  const file = 'public/genesis-' + N + '.js'; const D = new Function('window', fs.readFileSync(file, 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const al = {}; fs.readFileSync('tools/g' + N + '-align.txt', 'utf8').split(/\r?\n/).filter(l => /^\d+:/.test(l)).forEach(l => { const i = l.indexOf(':'); al[+l.slice(0, i)] = l.slice(i + 1).trim(); });
  let errs = 0, ntok = 0, nv = 0;
  for (const x of D) {
    const line = al[x.num]; const ros = x.tokens.map(t => t.t).join('');
    if (!line) { console.log('LIPSĂ aliniere v.' + x.num); errs++; continue; }
    const toks = []; let plain = '', last = 0;
    for (const m of line.matchAll(/\[([^\]|]+)\|([^\]]+)\]/g)) {
      const between = line.slice(last, m.index); if (between) toks.push({ t: between }); last = m.index + m[0].length;
      let spec = m[2], force = ''; const f = /@(H\d+)/.exec(spec); if (f) { force = f[1]; spec = spec.replace(/@H\d+/, ''); }
      const idx = spec.split(',').map(Number); const ws = idx.map(i => words[x.num][i - 1]);
      if (ws.some(w => !w)) { console.log('v.' + x.num + ': cuvânt ebraic inexistent în „' + m[0] + '”'); errs++; continue; }
      let heb = ''; ws.forEach((w, k) => { heb += (k ? (w.maqBefore ? '־' : ' ') : '') + w.heb; });
      const pick = ws.find(w => !skipStrong(w)) || ws[ws.length - 1];
      toks.push({ t: m[1], w: m[1], heb, translit: ws.map((w, k) => translit(w.heb, /^HNp|^HNg/.test(w.morph) && k === 0)).join(ws[1] && ws[1].maqBefore ? '-' : ' '), strong: force || pick.strong, pos: pos(pick.morph), greek: '', samaritan: 'Apropiat de Textul Masoretic la acest cuvânt — neverificat individual, cuvânt cu cuvânt.' });
      ntok++;
    }
    const tail = line.slice(last); if (tail) toks.push({ t: tail });
    const joined = toks.map(t => t.t).join('');
    if (joined !== ros) { console.log('v.' + x.num + ': textul diferă de Rosen\n   Rosen : ' + ros + '\n   aliniat: ' + joined); errs++; continue; }
    x.tokens = toks; nv++;
  }
  console.log('Geneza ' + N + ': versete ' + nv + '/' + D.length + ', tokeni tagați ' + ntok + ', erori ' + errs);
  if (W && !errs) fs.writeFileSync(file, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
})();
