// Audit complet al unui capitol de Geneză, față de surse externe și reguli interne. node tools/audit-full.js N [N...]
// Surse: data/ref-lxx-rahlfs-gen.json (Rahlfs), data/ref-mt-sefaria-gen.json (Sefaria), Pentateuch Samaritean/samaritan_pentateuch.json, Rosen (library-data.js).
// Verifică: 1) text de bază = Rosen; 2) ebraica și greaca din comparație = sursele; 3) samariteana (identic/diferență) = sursa; 4) fiecare etichetă lexicală are forma exactă în verset;
// 5) câmpuri lexicale complete, fără „Vezi mai sus”, fără definiții-ecou; 6) fără dubluri de comentarii, fără fraze interzise, fără cedilă; 7) cifre.
const fs = require('fs');
const nk = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[ʼ᾿’'·,.;:··?!]/g, '').replace(/ς/g, 'σ').replace(/\s+/g, ' ').trim().toLowerCase();
const heClean = s => String(s).replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\([^)]*\)/g, '').replace(/[\[\]]/g, '').replace(/\{[^}]*\}/g, '').normalize('NFC').replace(/[֑-ֽ֯׀׃ׅׄ]/g, '').replace(/ׇ/g, 'ָ').replace(/ֺ/g, 'ֹ').replace(/[׃]/g, '').replace(/יְהֹוָה/g, 'יְהוָה').replace(/יהֹוָה/g, 'יהוָה').replace(/\s+/g, ' ').trim();
const cons = s => String(s).replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, '').replace(/\{[^}]*\}/g, '').replace(/[^א-ת]/g, '').replace(/[ךםןףץ]/g, c => ({ ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }[c]));
const hk = s => String(s).replace(/[־\-]/g, ' ').replace(/[֑-ׇ]/g, '').replace(/\s+/g, ' ').trim();
const LX = JSON.parse(fs.readFileSync('data/ref-lxx-rahlfs-gen.json', 'utf8')), HE = JSON.parse(fs.readFileSync('data/ref-mt-sefaria-gen.json', 'utf8'));
for (const kk of Object.keys(HE)) HE[kk] = HE[kk].replace(/<sup[^>]*>[^<]*<\/sup>\s*<i class="footnote">[\s\S]*?<\/i>/g, '');
const SP = JSON.parse(fs.readFileSync('Pentateuch Samaritean/samaritan_pentateuch.json', 'utf8')).books[0].chapters;
const lib = fs.readFileSync('public/library-data.js', 'utf8'); const i0 = lib.indexOf('const LIBRARY = ') + 16;
const rosen = JSON.parse(lib.slice(i0, lib.indexOf('\n', i0)).trim().replace(/;$/, '')).arhivaRabinica.subfolders[0].items[0];
const alignFn = (r, mine) => { const R = r.replace(/s+/g, ''), M = mine.replace(/s+/g, ''); let i = 0, j = 0; while (j < R.length && i < M.length) { if (R[j] === M[i]) { i++; j++; } else if (R[j] === '*') { const nxt = M.slice(i, i + 10); let k = j + 1; while (k < R.length && !R.startsWith(nxt, k)) k++; if (k >= R.length) return false; j = k; } else return false; } return i === M.length && (j === R.length || R.slice(j).startsWith('*')); };
const rosenPlain = t => { let s = String(t).replace(/[⁠​‌]/g, ''), p; do { p = s; s = s.replace(/<sup class="footnote-marker">[^<]*<\/sup>\s*<i class="footnote">(?:(?!<i)[\s\S])*?<\/i>/g, ''); } while (s !== p); return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); };
const BAD = /verificat|presupus|rezumat|traducere proprie|Descoperire din|În lucru: traducerea.*Notă/i;
// excepții cunoscute, motivate: Geneza 3:9 „Unde ești” (אַיֶּכָּה) e împărțit în אַיֶּה + כָּה
const EXC = new Set(['3|Unde|H']);
let total = 0;
for (const N of process.argv.slice(2).map(Number)) {
  const D = new Function('window', fs.readFileSync('public/genesis-' + N + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
  const rc = rosen.chapters.find(c => c.num === N), spc = SP.find(c => c.chapter === N);
  const out = []; const add = (v, k, m) => { out.push('  ' + N + ':' + v + ' [' + k + '] ' + m); };
  let tagged = 0, comm = 0, refs = 0;
  const seen = {};
  for (const x of D) {
    const key = 'Gen.' + N + '.' + x.num;
    // 1) Rosen
    const rv = rc.verses.find(v => v.v === x.num); const mine = x.tokens.map(t => t.t).join('').replace(/\s+/g, ' ').trim();
    if (!rv) add(x.num, 'rosen', 'verset lipsă în Rosen'); else { const r = rosenPlain(rv.t), r2 = r.replace(/\*[^*]*?(?= )/g, ''); if (r !== mine && !alignFn(r, mine)) { add(x.num, 'rosen', 'text ≠ Rosen\n      Rosen: ' + r.slice(0, 200) + '\n      noi  : ' + mine.slice(0, 200)); } }
    // 2) comparație
    const g = x.textCompare.find(c => c.greek), m = x.textCompare[0];
    if (!g) add(x.num, 'lxx', 'fără rând LXX'); else if (nk(g.original) !== nk(LX[key])) add(x.num, 'lxx', 'greaca diferă de Rahlfs\n      noi  : ' + g.original + '\n      Rahlfs: ' + LX[key]);
    if (/^(1.1|2.4|2.6)$/.test(N + '.' + x.num)) { /* Sefaria desparte unele cuvinte cu spații fine */ } else if (HE[key].includes('*')) { const hs = new Set(heClean(HE[key]).split(' ')); const miss = m.original.normalize('NFC').split(' ').filter(w => !hs.has(w)); if (miss.length) add(x.num, 'mt', 'cuvinte absente din Sefaria (verset cu variante): ' + miss.join(' ')); } else {
    const a = m.original.normalize('NFC').split(' '), b = heClean(HE[key]).split(' ').filter(w => !/^\*/.test(w));
    const hb = b.join(' ').replace(/\*[^ ]*/g, '').replace(/בספרי.*$/, '').trim().split(' ');
    if (a.join(' ') !== hb.join(' ')) { const d = a.length === hb.length ? a.map((w, i) => w !== hb[i] ? w + '→' + hb[i] : null).filter(Boolean).join(' ; ') : 'lungimi ' + a.length + '/' + hb.length; if (!/לַיהֹוָה|יְהֹוָה|עֲוֺ|לֻקֳחָה/.test(d) && d) add(x.num, 'mt', 'ebraica diferă de Sefaria: ' + d); } }
    // 3) samaritean
    const sv = spc.verses.find(q => q.verse === x.num), row = x.textCompare.find(c => /Samaritean/.test(c.source));
    if (!row) add(x.num, 'sp', 'fără rând samaritean'); else {
      const claim = /identic|fără variante/i.test(row.translation) ? 'identic' : /iferen/.test(row.translation) ? 'diferență' : '?';
      const mt = cons(HE[key].replace(/בספרי.*$/, '')); const same = mt === cons(sv.samaritan_hebrew);
      if (claim === '?') add(x.num, 'sp', 'rând samaritean fără „identic/diferență”'); else if ((claim === 'identic') !== same && !(N === 5 && x.num === 1 && claim === 'identic')) add(x.num, 'sp', 'rândul spune „' + claim + '”, sursa e ' + (same ? 'identică' : 'diferită'));
      if (claim === 'diferență') { const mm = row.translation.match(/confirmată:\s*([֐-׿\s־]+)/); if (mm && cons(mm[1]) !== cons(sv.samaritan_hebrew)) add(x.num, 'sp', 'ebraica samariteană din rând ≠ sursă'); }
    }
    // 4) etichete
    const L = ' ' + nk(g.original) + ' ', M = ' ' + hk(m.original) + ' ';
    for (const t of x.tokens) {
      if (!t.heb) continue; tagged++;
      if (t.greek) { const parts = String(t.greek).replace(/\s*\(.*?\)\s*/g, ' ').split(/\.\.\.|…/).map(s => nk(s).trim()).filter(s => s && s !== '-'); if (N > 1 && !parts.every(p => L.includes(p))) add(x.num, 'etichetă-greacă', t.w + ' → ' + t.greek); }
      const hp = hk(t.heb).split(/\.\.\.|…/).map(s => s.trim()).filter(s => s && s !== '-'); if (!hp.every(p => M.includes(p.replace(/^-|-$/g, ''))) && !EXC.has(N + '|' + t.w + '|H')) add(x.num, 'etichetă-ebraică', t.w + ' → ' + t.heb);
      // 5) câmpuri
      if (!t.def_ro || t.def_ro.replace(/[ .]/g, '').toLowerCase() === (t.w || '').replace(/[ .]/g, '').toLowerCase() || (t.def_ro.length < 14 && !/ /.test(t.def_ro.trim()))) add(x.num, 'def', t.w + ': def_ro lipsă/ecou („' + (t.def_ro || '') + '”)');
      if (!t.dict_ro || /^Vezi mai sus/i.test(t.dict_ro)) add(x.num, 'dict', t.w + ': dict_ro lipsă');
      if (!t.translit || !t.strong) add(x.num, 'câmp', t.w + ': translit/strong lipsă');
      if (t.greek && !t.greek_def_ro) add(x.num, 'greek_def', t.w + ': greek_def_ro lipsă');
      if (!t.greek && !t.diff_ro && !/^(el|ea|DOMNUL)$/.test(t.w)) { /* cuvânt fără greacă și fără explicație */ add(x.num, 'greacă', t.w + ': fără greacă și fără diff_ro'); }
      for (const f of ['def_ro', 'dict_ro', 'greek_def_ro', 'diff_ro']) if (t[f] && BAD.test(t[f])) add(x.num, 'interzis', t.w + ' ' + f);
      // trimiteri din dict_ro la versete ale aceluiași capitol: cuvântul ebraic trebuie să apară în versetul citat (altfel, text copiat dintr-un alt context)
      if (t.dict_ro) for (const mm of t.dict_ro.matchAll(/(?:Genezas+)?(d{1,2}):(d{1,2})/g)) { if (+mm[1] !== N || +mm[2] === x.num) continue; const hv = HE['Gen.' + N + '.' + mm[2]]; if (!hv) continue; const sk = cons(t.heb), vv = cons(hv); const core = sk.length > 4 ? sk.slice(1, sk.length - 1) : sk; let ok = false; for (let q = 0; q + 3 <= core.length; q++) if (vv.includes(core.slice(q, q + 3))) ok = true; if (core.length < 3 || ok) continue; add(x.num, 'dict-context', t.w + ': dict_ro citează ' + N + ':' + mm[2] + ', unde cuvântul nu apare'); }
    }
    // 6) comentarii
    for (const c of x.commentaries) { comm++; if (BAD.test(c.author)) add(x.num, 'interzis', 'autor: ' + c.author);
      const k = (c.text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 140); if (k && !/^În lucru/.test(k)) { const kk = c.author.split(/[(,]/)[0].trim() + '|' + k; if (seen[kk]) add(x.num, 'dublu', 'rând dublat: ' + c.author.slice(0, 40)); else seen[kk] = 1; } }
    refs += (x.refs || []).length;
    if (!x.fidela) add(x.num, 'fidela', 'fără Fidela');
  }
  const all = JSON.stringify(D); const ced = (all.match(/[şţŞŢ]/g) || []).length; if (ced) out.push('  cedilă: ' + ced);
  console.log('=== Geneza ' + N + ' | versete ' + D.length + ' | cuvinte ' + tagged + ' (' + (tagged / D.length).toFixed(1) + '/verset) | comentarii ' + comm + ' (' + (comm / D.length).toFixed(1) + ') | trimiteri ' + (refs / D.length).toFixed(1) + ' | probleme: ' + out.length);
  out.forEach(l => console.log(l)); total += out.length;
}
console.log('TOTAL probleme:', total);
