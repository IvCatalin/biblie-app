// Geneza 5: greek_def_ro (pe forma grecească din text) și diff_ro (diferențe reale ebraică / Septuaginta).
// Numerele (anii) se calculează din cuvinte: valoarea masoretică din textul românesc al tokenului, cea greacă din forma grecească; diferența apare doar când valorile diferă.
// Format ca în Geneza 1–4: „lemă (transliterare) — sens în română”. Se aplică cu tools/apply-lex.js 5 tools/g5-lex-data.js
const fs = require('fs');
const strip = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// ---- numere grecești ----
const GR = {
  'εκατον': [100, 'ἑκατόν', 'hekaton'], 'διακοσια': [200, 'διακόσια', 'diakosia'], 'τριακοσια': [300, 'τριακόσια', 'triakosia'],
  'πεντακοσια': [500, 'πεντακόσια', 'pentakosia'], 'επτακοσια': [700, 'ἑπτακόσια', 'heptakosia'], 'οκτακοσια': [800, 'ὀκτακόσια', 'oktakosia'],
  'εννακοσια': [900, 'ἐννακόσια', 'ennakosia'], 'πεντακοσιων': [500, 'πεντακοσίων', 'pentakosiōn'],
  'δεκα': [10, 'δέκα', 'deka'], 'δωδεκα': [12, 'δώδεκα', 'dōdeka'], 'τριακοντα': [30, 'τριάκοντα', 'triakonta'], 'τεσσαρακοντα': [40, 'τεσσαράκοντα', 'tessarakonta'],
  'πεντηκοντα': [50, 'πεντήκοντα', 'pentēkonta'], 'εξηκοντα': [60, 'ἑξήκοντα', 'hexēkonta'], 'εβδομηκοντα': [70, 'ἑβδομήκοντα', 'hebdomēkonta'],
  'ογδοηκοντα': [80, 'ὀγδοήκοντα', 'ogdoēkonta'], 'ενενηκοντα': [90, 'ἐνενήκοντα', 'enenēkonta'],
  'δυο': [2, 'δύο', 'dyo'], 'τρια': [3, 'τρία', 'tria'], 'πεντε': [5, 'πέντε', 'pente'], 'επτα': [7, 'ἑπτά', 'hepta'], 'οκτω': [8, 'ὀκτώ', 'oktō'], 'εννεα': [9, 'ἐννέα', 'ennea']
};
function greekValue(g){ let v = 0; const parts = []; for(const w of strip(g).replace(/[᾿’']/g, '').split(/\s+/)){ if(w === 'και' || w === 'ετη' || w === 'ετων') continue; if(!GR[w]) throw new Error('număr grecesc necunoscut: ' + w + ' în ' + g); v += GR[w][0]; parts.push(GR[w][1] + ' (' + GR[w][2] + ')'); } return { v, parts }; }

// ---- numere românești ----
const R = { sute: { 'o suta': 100, 'doua sute': 200, 'trei sute': 300, 'patru sute': 400, 'cinci sute': 500, 'sase sute': 600, 'sapte sute': 700, 'opt sute': 800, 'noua sute': 900 },
  word: { zece: 10, unsprezece: 11, doisprezece: 12, cincisprezece: 15, douazeci: 20, treizeci: 30, patruzeci: 40, cincizeci: 50, saizeci: 60, saptezeci: 70, optzeci: 80, nouazeci: 90, doi: 2, cinci: 5, sapte: 7, noua: 9 } };
function roValue(w){ let s = strip(w).replace(/ de ani$/, '').replace(/ ani$/, ''); let v = 0;
  for(const k of Object.keys(R.sute)) if(s.startsWith(k + ' ') || s === k){ v += R.sute[k]; s = s.slice(k.length).trim(); break; }
  for(const t of s.split(/\s+/).filter(x => x && x !== 'si' && x !== 'de')){ if(R.word[t] === undefined) throw new Error('număr românesc necunoscut: ' + t + ' în ' + w); v += R.word[t]; } return v; }
function numToRo(n){ const H = { 100: 'o sută', 200: 'două sute', 300: 'trei sute', 400: 'patru sute', 500: 'cinci sute', 600: 'șase sute', 700: 'șapte sute', 800: 'opt sute', 900: 'nouă sute' };
  const T = { 10: 'zece', 11: 'unsprezece', 12: 'doisprezece', 15: 'cincisprezece', 20: 'douăzeci', 30: 'treizeci', 40: 'patruzeci', 50: 'cincizeci', 60: 'șaizeci', 70: 'șaptezeci', 80: 'optzeci', 90: 'nouăzeci' };
  const U = { 2: 'doi', 3: 'trei', 5: 'cinci', 7: 'șapte', 8: 'opt', 9: 'nouă' };
  const h = Math.floor(n / 100) * 100, r = n - h; const out = []; if(h) out.push(H[h]);
  if(r){ if(T[r]) out.push(T[r]); else if(r < 10) out.push(U[r]); else { const t = Math.floor(r / 10) * 10, u = r - t; out.push(T[t] + (u ? ' și ' + U[u] : '')); } }
  const text = out.join(' '); return text + (n % 100 >= 20 || n % 100 === 0 ? ' de ani' : ' ani'); }

const D = new Function('window', fs.readFileSync('C:/Users/ivcatali/biblie-app/public/genesis-5.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;

const greek = {
  'ἡ βίβλος': 'βίβλος (biblos) — carte, sul scris; aici, „cartea” genealogiei.',
  'ἀνθρώπων': 'ἄνθρωπος (anthrōpos) — om, ființă omenească; la genitiv plural, „ale oamenilor”.',
  'κατ᾿ εἰκόνα': 'εἰκών (eikōn) — chip, imagine; „după chipul”.',
  'ἄρσεν': 'ἄρσην (arsēn) — de parte bărbătească, bărbat.',
  'θῆλυ': 'θῆλυς (thēlys) — de parte femeiască, femeie.',
  'ἐποίησεν αὐτούς': 'ποιέω (poieō) — a face, a făptui; „i-a făcut”.',
  'τὸ ὄνομα αὐτῶν': 'ὄνομα (onoma) — nume; „numele lor”.',
  'ἔζησεν': 'ζάω (zaō) — a trăi, a fi în viață.',
  'κατὰ τὴν ἰδέαν αὐτοῦ': 'ἰδέα (idea) — înfățișare, formă văzută; „după înfățișarea lui”.',
  'κατὰ τὴν εἰκόνα αὐτοῦ': 'εἰκών (eikōn) — chip, imagine; „după chipul lui”.',
  'αἱ ἡμέραι': 'ἡμέρα (hēmera) — zi; la plural, „zilele”.',
  'τὸ γεννῆσαι αὐτὸν': 'γεννάω (gennaō) — a naște, a zămisli; „după ce l-a născut” (infinitiv cu articol).',
  'τὸν Σήθ': 'Σήθ (Sēth) — Set, nume propriu (la acuzativ).',
  'Σὴθ': 'Σήθ (Sēth) — Set, nume propriu.',
  'υἱοὺς καὶ θυγατέρας': 'υἱός (huios) — fiu, și θυγάτηρ (thygatēr) — fiică; „fii și fiice”.',
  'πᾶσαι αἱ ἡμέραι': 'πᾶς (pas) — tot, toți, și ἡμέρα (hēmera) — zi; „toate zilele”.',
  'ἃς ἔζησεν': 'ζάω (zaō) — a trăi; „pe care le-a trăit”.',
  'ἀπέθανεν': 'ἀποθνῄσκω (apothnēskō) — a muri.',
  'Ἐνώς': 'Ἐνώς (Enōs) — Enoș, nume propriu.',
  'Ἐνὼς': 'Ἐνώς (Enōs) — Enoș, nume propriu.',
  'τὸν Ἐνὼς': 'Ἐνώς (Enōs) — Enoș, nume propriu (la acuzativ).',
  'Καϊνάν': 'Καϊνάν (Kainan) — Cainan, adică Keinan, nume propriu.',
  'Καϊνὰν': 'Καϊνάν (Kainan) — Cainan, adică Keinan, nume propriu.',
  'τὸν Καϊνὰν': 'Καϊνάν (Kainan) — Cainan, adică Keinan, nume propriu (la acuzativ).',
  'Μαλελεήλ': 'Μαλελεήλ (Maleleēl) — Maleleel, adică Mahalalel, nume propriu.',
  'Μαλελεὴλ': 'Μαλελεήλ (Maleleēl) — Maleleel, adică Mahalalel, nume propriu.',
  'τὸν Μαλελεὴλ': 'Μαλελεήλ (Maleleēl) — Maleleel, adică Mahalalel, nume propriu (la acuzativ).',
  'Ἰάρεδ': 'Ἰάρεδ (Iared) — Iared, nume propriu.',
  'τὸν Ἰάρεδ': 'Ἰάρεδ (Iared) — Iared, nume propriu (la acuzativ).',
  'τὸν Ενωχ': 'Ἑνώχ (Henōch) — Enoh, nume propriu (la acuzativ).',
  'εὐηρέστησεν... τῷ Θεῷ': 'εὐαρεστέω (euaresteō) — a plăcea, a fi plăcut; „a plăcut lui Dumnezeu”.',
  'τὸν Μαθουσάλα': 'Μαθουσάλα (Mathousala) — Matusalem, nume propriu (la acuzativ).',
  'οὐχ ηὑρίσκετο': 'εὑρίσκω (heuriskō) — a găsi; „nu se mai găsea”.',
  'μετέθηκεν': 'μετατίθημι (metatithēmi) — a muta, a strămuta dintr-un loc în altul.',
  'τὸν Λάμεχ': 'Λάμεχ (Lamech) — Lameh, nume propriu (la acuzativ).',
  'Νῶε': 'Νῶε (Nōe) — Noe, nume propriu.',
  'τὸν Νῶε': 'Νῶε (Nōe) — Noe, nume propriu (la acuzativ).',
  'διαναπαύσει ἡμᾶς': 'διαναπαύω (dianapauō) — a da odihnă, a liniști; „ne va da odihnă”.',
  'τῶν ἔργων ἡμῶν': 'ἔργον (ergon) — lucrare, faptă; „lucrările noastre”.',
  'τῶν λυπῶν': 'λύπη (lypē) — durere, întristare.',
  'κατηράσατο': 'καταράομαι (kataraomai) — a blestema.',
  'Κύριος ὁ Θεός': 'κύριος (kyrios) — domn, și Θεός (Theos) — Dumnezeu; „Domnul Dumnezeu”.',
  'τὸν Σήμ': 'Σήμ (Sēm) — Șem, nume propriu (la acuzativ).',
  'τὸν Χάμ': 'Χάμ (Cham) — Ham, nume propriu (la acuzativ).',
  'τὸν Ιάφεθ': 'Ἰάφεθ (Iapheth) — Iafet, nume propriu (la acuzativ).'
};

const diff = []; const numeric = [];
const seen = new Set();
for(const x of D) for(const t of x.tokens.filter(t => t.heb && t.greek && /ἔτη|ἐτῶν/.test(t.greek))){
  const g = greekValue(t.greek), mt = roValue(t.w);
  const key = t.greek; if(!greek[key]){ greek[key] = g.parts.join(', ') + ' — ' + numToRo(g.v) + '.'; }
  if(g.v !== mt) diff.push([x.num, t.w, 'Septuaginta dă aici ' + numToRo(g.v) + ' (' + g.v + '), nu ' + numToRo(mt) + ' (' + mt + ') ca în textul masoretic.']);
  numeric.push([x.num, mt, g.v]);
}
// diferențe de sens
diff.push([1, 'Adam', 'Ebraica are adam, care poate fi numele propriu „Adam” sau cuvântul „om”; greaca îl citește ca plural colectiv: „cartea nașterii oamenilor”.']);
diff.push([1, 'după asemănarea', 'Ebraica spune „după asemănarea” (demut); greaca are „după chipul” (eikōn), cuvântul pe care Septuaginta îl folosește de obicei pentru ebraicul tselem, „chip”.']);
diff.push([3, 'asemănarea', 'Ebraica are demut, „asemănare”; greaca o redă prin ἰδέα, „înfățișare, formă”, nu prin εἰκών, ca la 5:1.']);
diff.push([22, 'mers cu Dumnezeu', 'Ebraica spune că Enoh „a mers cu Dumnezeu” (hithalekh); greaca spune că „a plăcut lui Dumnezeu” (euērestēsen), formularea pe care o citează Evrei 11:5.']);
diff.push([24, 'mers cu Dumnezeu', 'Ebraica spune că Enoh „a mers cu Dumnezeu” (hithalekh); greaca spune că „a plăcut lui Dumnezeu” (euērestēsen), formularea pe care o citează Evrei 11:5.']);
diff.push([24, 'fost', 'Ebraica spune „nu mai este” (enennu); greaca spune „nu se mai găsea”.']);
diff.push([24, 'luat', 'Ebraica are laqach, „a luat”; greaca are μετέθηκεν, „a mutat, a strămutat” — verbul din Evrei 11:5 (metetethē, „a fost mutat”).']);
diff.push([29, 'aduce odihnă', 'Ebraica are yenachamenu, „ne va mângâia, ne va alina” (de la nacham, în joc de sunete cu numele Noach); greaca are „ne va da odihnă”, mai aproape de sensul numelui Noe, „odihnă”.']);
diff.push([29, 'truda', 'Ebraica are itstsavon, „trudă, durere de muncă” (același cuvânt ca în 3:16–17); greaca are λύπη, „durere, întristare”, cu accentul pe suferință, nu pe efortul muncii.']);
diff.push([29, 'DOMNUL', 'Ebraica are doar Numele YHWH; greaca are „Domnul Dumnezeu” (Kyrios ho Theos).']);

module.exports = { greek, diff, numeric };
if(require.main === module){ console.log('forme grecești:', Object.keys(greek).length, '| diferențe:', diff.length); diff.forEach(d => console.log(JSON.stringify(d))); }
