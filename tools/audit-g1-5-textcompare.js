// Audit Geneza 1–5: comparația de texte (Masoretic / Septuaginta) față de surse externe.
// Septuaginta = Rahlfs 1935 (CCAT, prelucrare E. Wong, CC BY-NC-SA), Masoretic = Sefaria (fără cantilație).
// node tools/audit-g1-5-textcompare.js [--write]   (surse: --lxx=<json> --he=<json>)
const fs = require('fs');
const arg = (k) => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const WRITE = process.argv.includes('--write');
const LX = JSON.parse(fs.readFileSync(arg('lxx'), 'utf8')), HE = JSON.parse(fs.readFileSync(arg('he'), 'utf8'));
const nk = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u02bc\u1fbf\u2019'\u00b7,.;:·\u0387?!]/g, '').replace(/ς/g, 'σ').replace(/\s+/g, ' ').trim().toLowerCase();
const heClean = s => String(s).replace(/<\/?(?:small|big)>/g, '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\([^)]*\)/g, '').replace(/[\[\]]/g, '').replace(/\{[^}]*\}/g, '').normalize('NFC').replace(/[\u0591-\u05AF\u05BD\u05C0\u05C3\u05C4\u05C5]/g, '').replace(/\u05C7/g, '\u05B8').replace(/\u05BA/g, '\u05B9').replace(/[׃]/g, '').replace(/יְהֹוָה/g, 'יְהוָה').replace(/\s+/g, ' ').trim();
// LCS pe cuvinte normalizate: păstrează cuvintele noastre (cu punctuație), scoate ce nu e în Rahlfs, adaugă ce lipsește
function patch(ours, rahlfs) {
  const a = ours.split(/\s+/), b = rahlfs.split(/\s+/);
  const na = a.map(nk), nb = b.map(nk);
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) L[i][j] = na[i] === nb[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = []; let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && na[i] === nb[j]) { out.push(a[i]); i++; j++; }
    else if (j < b.length && (i >= a.length || L[i][j + 1] >= L[i + 1][j])) { out.push(b[j]); j++; }
    else { i++; }
  }
  let r = out.join(' ');
  const endP = (ours.match(/[.;·]$/) || [''])[0];
  if (endP && !/[.;·]$/.test(r)) r += endP;
  return r;
}
// formă finală (punctuație și nume ca în restul textului) pentru versetele unde completarea cade în mijlocul frazei
const FINAL = {
  'Gen.1.26': 'καὶ εἶπεν ὁ Θεός Ποιήσωμεν ἄνθρωπον κατ᾿ εἰκόνα ἡμετέραν καὶ καθ᾿ ὁμοίωσιν, καὶ ἀρχέτωσαν τῶν ἰχθύων τῆς θαλάσσης καὶ τῶν πετεινῶν τοῦ οὐρανοῦ καὶ τῶν κτηνῶν καὶ πάσης τῆς γῆς καὶ πάντων τῶν ἑρπετῶν τῶν ἑρπόντων ἐπὶ τῆς γῆς.',
  'Gen.1.28': 'καὶ ηὐλόγησεν αὐτοὺς ὁ Θεὸς λέγων Αὐξάνεσθε καὶ πληθύνεσθε καὶ πληρώσατε τὴν γῆν καὶ κατακυριεύσατε αὐτῆς καὶ ἄρχετε τῶν ἰχθύων τῆς θαλάσσης καὶ τῶν πετεινῶν τοῦ οὐρανοῦ καὶ πάντων τῶν κτηνῶν καὶ πάσης τῆς γῆς καὶ πάντων τῶν ἑρπετῶν τῶν ἑρπόντων ἐπὶ τῆς γῆς.',
  'Gen.2.19': 'καὶ ἔπλασεν ὁ Θεὸς ἔτι ἐκ τῆς γῆς πάντα τὰ θηρία τοῦ ἀγροῦ καὶ πάντα τὰ πετεινὰ τοῦ οὐρανοῦ, καὶ ἤγαγεν αὐτὰ πρὸς τὸν Ἀδὰμ ἰδεῖν τί καλέσει αὐτά, καὶ πᾶν ὃ ἐὰν ἐκάλεσεν αὐτὸ Ἀδὰμ ψυχὴν ζῶσαν, τοῦτο ὄνομα αὐτοῦ.',
  'Gen.5.32': 'καὶ ἦν Νῶε ἐτῶν πεντακοσίων, καὶ ἐγέννησεν Νῶε τρεῖς υἱούς, τὸν Σήμ, τὸν Χάμ, τὸν Ιάφεθ.',
};
module.exports = { patch, nk, heClean };
if (require.main === module) {
  let nL = 0, nM = 0, nT = 0;
  const must = (s, a) => { if (!s.includes(a)) throw new Error('nu găsesc: ' + a); };
  // traduceri/note românești care urmează completarea textului grecesc
  const TR = {
    'Gen.1.6': { tr: ['apă!»”', 'apă!» Și a fost așa.”'], note: [null, ' Septuaginta adaugă la sfârșitul versetului „Și a fost așa”, formulă care în textul masoretic apare doar la versetul 7.'] },
    'Gen.1.9': { tr: ['Și a fost așa.”', 'Și a fost așa. Și s-a adunat apa de sub cer în adunările ei și s-a arătat uscatul.”'], note: ['Traducere aproape cuvânt cu cuvânt identică cu textul ebraic.', 'Septuaginta are în plus, după „Și a fost așa”, o frază fără corespondent în textul masoretic: „Și s-a adunat apa de sub cer în adunările ei și s-a arătat uscatul”, care repetă porunca.'] },
    'Gen.1.20': { tr: ['cerului.»”', 'cerului.» Și a fost așa.”'], note: [null, ' Septuaginta adaugă la sfârșit „Și a fost așa”, formulă pe care textul masoretic n-o are la acest verset.'] },
    'Gen.1.26': { tr: ['după asemănare!»”', 'după asemănare, și să stăpânească peste peștii mării și peste păsările cerului și peste dobitoace și peste tot pământul și peste toate târâtoarele care se târăsc pe pământ!»”'] },
    'Gen.1.28': { tr: ['peste tot pământul.»”', 'peste tot pământul și peste toate târâtoarele care se târăsc pe pământ.»”'] },
  };
  const HK = (k) => heClean(HE[k]).split(' ');
  for (let n = 1; n <= 5; n++) {
    const f = 'public/genesis-' + n + '.js';
    const D = new Function('window', fs.readFileSync(f, 'utf8') + ';return window;')({}).CHAPTER_DATA;
    for (const x of D) {
      const k = 'Gen.' + n + '.' + x.num;
      const g = x.textCompare.find(c => c.greek), m = x.textCompare[0];
      if (nk(g.original) !== nk(LX[k])) { const nw = FINAL[k] || patch(g.original, LX[k]); if (nk(nw) !== nk(LX[k])) throw new Error('patch ' + k); g.original = nw; nL++; }
      if (TR[k]) { const r = TR[k]; must(g.translation, r.tr[0]); g.translation = g.translation.replace(r.tr[0], r.tr[1]);
        if (r.note) { if (r.note[0]) { must(g.note, r.note[0]); g.note = g.note.replace(r.note[0], r.note[1]); } else g.note += r.note[1]; } nT++; }
      // masoretic: completare (versete trunchiate) sau cuvinte cu punctare greșită
      const mine = m.original.split(' '), ref = HK(k).map(w => w.replace('לֻקְח', 'לֻקֳח')); // 2:23: hataf-qamats (Tanach cu Ta'amei Hamikra), nu shva
      if (mine.length < ref.length && ['Gen.1.26', 'Gen.2.19'].includes(k)) { m.original = mine.concat(ref.slice(mine.length)).join(' '); nM++; console.log(k, 'MT +', ref.slice(mine.length).join(' ')); }
      else if (mine.length === ref.length && ['Gen.1.6', 'Gen.2.12', 'Gen.2.18', 'Gen.2.23', 'Gen.4.18'].includes(k)) {
        const nw = mine.map((w, i) => (w.normalize('NFC').replace(/ׇ/g, 'ָ') === ref[i] ? w : ref[i]));
        const ch = mine.map((w, i) => nw[i] !== w ? w + ' → ' + nw[i] : null).filter(Boolean); if (ch.length) { m.original = nw.join(' '); nM++; console.log(k, 'MT', ch.join(' ; ')); } }
    }
    if (WRITE) fs.writeFileSync(f, 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
  }
  console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| LXX corectate:', nL, '| MT corectate:', nM, '| traduceri/note:', nT);
}
