// Audit Geneza 1–5: corecturi la etichetele lexicale (tokens[]) a căror formă greacă/ebraică nu se află în textul versetului.
// Fiecare corectură: [capitol, verset, potrivire({w, heb, greek}), modificare | 'dezeticheteaza']
// 'dezeticheteaza' = cuvântul (de obicei un pronume subînțeles, adăugat de traducere) nu există în ebraică/greacă: rămâne text simplu.
// node tools/audit-g1-5-tokens.js [--write]
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const ADAM = 'Ebraica are cuvântul comun „omul” (ha-adam, cu articol); greaca îl redă ca nume propriu, „Adam”.';
const ADAM_GDR = 'Ἀδάμ (Adam) — Adam, omul.';
const NOT = 'dezeticheteaza';
const DICT_MIN = 'Min, „fel, soi, specie”, apare mai ales cu sufix („după felul lui”, leminehu): în povestea creației (Geneza 1), la Noe (Geneza 6–7) și în listele de animale curate și necurate (Levitic 11, Deuteronom 14). Cuvântul spune că plantele și animalele se înmulțesc „după felul lor”, fiecare după rânduiala primită la creație.';
const DICT_CHAYAH = 'Chayah, „viețuitoare, fiară”, vine din rădăcina chai, „viu”. În Geneza 1 desemnează mai ales animalele sălbatice („chayat ha-arets”, fiarele pământului), deosebite de dobitoacele domestice (behemah) și de târâtoare (remes), cele trei categorii de vietăți ale uscatului. Același cuvânt, ca „viață, ființă vie”, stă în „nefesh chayah”, „suflet viu” (Geneza 2:7).';
const OPS = [
  // ---- Geneza 1 (lemele greacă: forma din Rahlfs trebuie să existe în verset) ----
  [1, 9, { w: 'loc' }, { greek: 'συναγωγή (synagoge, „adunare”)', greek_def_ro: 'συναγωγή (synagoge) — adunare (în ebraică „loc”, aici: „într-o singură adunare”).', diff_ro: 'Ebraicul מָקוֹם („loc”) e redat în greacă prin συναγωγήν („adunare”): „într-o singură adunare”.' }],
  [1, 10, { w: 'adunarea' }, { greek: 'σύστημα (systema, „grup, masă”)', greek_def_ro: 'σύστημα (systema) — grup, masă, ansamblu (aici: „mase de ape”).', diff_ro: 'Ebraicul מִקְוֵה („adunare de ape”) e redat prin συστήματα („mase, grupări de ape”); în versetul 9, pentru „loc”, greaca are συναγωγήν.' }],
  [1, 11, { w: 'soiul', heb: 'מִין' }, { heb: 'לְמִינוֹ', translit: 'lemino' }],
  [1, 12, { w: 'a produs' }, { greek: 'ἐκφέρω (ekphero, „a scoate afară”)', greek_def_ro: 'ἐκφέρω (ekphero) — a scoate afară, a da (roade).', diff_ro: 'Greaca folosește ἐξήνεγκεν (de la ἐκφέρω, „a scoate afară”), nu verbul ἐξάγω din versetul 24.' }],
  [1, 15, { w: 'luminători' }, { greek: 'φαῦσις (phausis, „luminare”)', greek_def_ro: 'φαῦσις (phausis) — luminare, strălucire (εἰς φαῦσιν: „spre luminare”).', diff_ro: 'Septuaginta redă „luminători” prin εἰς φαῦσιν („spre luminare”); cuvântul φωστῆρες („luminători”) apare în versetul 14.' }],
  [1, 16, { w: 'mic' }, { greek: 'ἐλάσσων (elasson, „mai mic”)', greek_def_ro: 'ἐλάσσων (elasson) — mai mic, mai puțin.', diff_ro: 'Greaca folosește comparativul τὸν ἐλάσσω („cel mai mic”), nu simplu „mic”.' }],
  [1, 20, { w: 'fața' }, { greek: null, greek_def_ro: null, diff_ro: 'Septuaginta nu are un cuvânt pentru „fața” (פְּנֵי): expresia ebraică e redată prin prepoziția κατά („după, pe lângă”) — „κατὰ τὸ στερέωμα τοῦ οὐρανοῦ”.' }],
  [1, 24, { w: 'dobitoc' }, { greek: 'τετράπους (tetrapous, „cu patru picioare”)', greek_def_ro: 'τετράπους (tetrapous) — cu patru picioare, patruped.', diff_ro: 'În acest verset Septuaginta redă בְּהֵמָה („dobitoc”) prin τετράποδα („patrupede”), nu prin κτήνη, cuvântul obișnuit pentru „dobitoace”, folosit în versetul 25.' }],
  [1, 28, { w: 'vietățile' }, { greek: null, greek_def_ro: null, diff_ro: 'Septuaginta nu are un cuvânt pentru „vietățile” (חַיָּה) în acest verset: enumeră „dobitoacele, tot pământul și toate târâtoarele”.' }],
  [1, 29, { w: 'fața' }, { greek: null, greek_def_ro: null, diff_ro: 'Septuaginta spune „deasupra întregului pământ” (ἐπάνω πάσης τῆς γῆς), fără un cuvânt pentru „fața” (פְּנֵי).' }],
  // ---- Geneza 1: dict_ro lipsă („Vezi mai sus.” nu trimitea la nimic) ----
  [1, 7, { w: 'sub' }, { dict_ro: 'Tachat, „sub, dedesubt, în locul”, e o prepoziție foarte frecventă. În Geneza 1:7 desparte apele de sub tărie de cele de deasupra ei; în alte locuri înseamnă „în locul cuiva”, ca în Geneza 4:25 („în locul lui Abel”), pornind de la ideea de „ceea ce se află dedesubt”.' }],
  // ---- Geneza 2 ----
  [2, 1, { w: 'astfel' }, NOT], [2, 1, { w: 'fost' }, NOT],
  [2, 3, { w: 'binecuvântat' }, { greek: 'ηὐλόγησεν' }],
  [2, 3, { w: 'crease' }, { greek: 'ἤρξατο', greek_def_ro: 'ἄρχω (archo) — a începe (la mediu: „a început”).', diff_ro: 'Septuaginta nu redă „a crea” prin ποιέω sau κτίζω, ci prin ἤρξατο, „a început”: „pe care Dumnezeu a început să le facă”. Verbul ebraic ברא, cu subiect numai divin, nu are aici un corespondent direct în greacă.' }],
  [2, 4, { w: 'DOMNUL Dumnezeu' }, { greek: 'ὁ Θεός', greek_def_ro: 'ὁ Θεός (ho Theos) — Dumnezeu.', diff_ro: 'Septuaginta are aici doar ὁ Θεός („Dumnezeu”), fără „Domnul”: numele YHVH, pus în ebraică lângă Elohim, nu apare în greacă la acest verset.' }],
  [2, 5, { w: 'DOMNUL Dumnezeu' }, { greek: 'ὁ Θεός', greek_def_ro: 'ὁ Θεός (ho Theos) — Dumnezeu.', diff_ro: 'Septuaginta are aici doar ὁ Θεός („Dumnezeu”), fără „Domnul”: numele YHVH, pus în ebraică lângă Elohim, nu apare în greacă la acest verset.' }],
  [2, 5, { w: 'câmpului' }, { greek: 'ἀγροῦ' }],
  [2, 9, { w: 'Pomul Cunoașterii Binelui și Răului' }, { greek: 'τὸ ξύλον τοῦ εἰδέναι γνωστὸν καλοῦ καὶ πονηροῦ', greek_def_ro: 'εἰδέναι (eidenai) — a ști (infinitiv); γνωστός (gnostos) — cunoscut, ce poate fi cunoscut.', diff_ro: 'Septuaginta citește aici „pomul de a ști cunoscutul binelui și al răului”, cu γνωστόν („cunoscut”) în plus față de ebraicul „pomul cunoașterii binelui și răului”; la 2:17 formularea greacă e „pomul de a cunoaște binele și răul”.' }],
  [2, 10, { w: 'devine' }, { greek: null, greek_def_ro: null, diff_ro: 'Septuaginta nu are un verb corespunzător lui וְהָיָה („și devine”): „de acolo se desparte în patru începuturi” (ἀφορίζεται εἰς τέσσαρας ἀρχάς).' }],
  [2, 12, { w: 'aurul' }, { heb: 'וּזְהַב', greek: 'χρυσίον' }],
  [2, 15, { w: 'Edenului' }, { greek: null, greek_def_ro: null, diff_ro: 'În Septuaginta numele Eden lipsește la acest verset: grădina e numită simplu „paradisul” (ἐν τῷ παραδείσῳ).' }],
  [2, 17, { w: 'din', heb: 'מִן' }, { heb: 'וּמֵ-', translit: 'u-min', pos: 'prepoziție (prefix)' }],
  [2, 17, { w: 'ziua' }, { greek: 'ἡμέρᾳ' }],
  [2, 17, { w: 'care' }, NOT],
  [2, 20, { w: 'omul' }, { greek: 'Ἀδάμ', greek_def_ro: ADAM_GDR, diff_ro: ADAM }],
  [2, 20, { w: 'potriva' }, { greek: 'ὅμοιος αὐτῷ', greek_def_ro: 'ὅμοιος (homoios) — asemenea, la fel; „asemenea lui”.', diff_ro: 'Pentru „potrivit lui” (כְּנֶגְדּוֹ) Septuaginta are aici ὅμοιος αὐτῷ, „asemenea lui”; la 2:18 același cuvânt ebraic e redat prin κατ᾿ αὐτόν.' }],
  [2, 21, { w: 'el' }, NOT],
  [2, 25, { w: 'omul' }, { greek: 'Ἀδάμ', greek_def_ro: ADAM_GDR, diff_ro: ADAM }],
  // ---- Geneza 3 ----
  [3, 1, { w: 'câmpului' }, { greek: 'ἐπὶ τῆς γῆς', greek_def_ro: 'γῆ (ge) — pământ.', diff_ro: 'Septuaginta spune „fiarele de pe pământ” (τῶν θηρίων τῶν ἐπὶ τῆς γῆς), nu „fiarele câmpului” ca în ebraică.' }],
  [3, 1, { w: 'El' }, NOT],
  [3, 1, { w: 'grădinii' }, { greek: 'τῷ παραδείσῳ' }],
  [3, 2, { w: 'rodul' }, { greek: 'καρποῦ' }],
  [3, 5, { w: 'știe' }, { greek: 'ᾔδει', greek_def_ro: 'οἶδα (oida) — a ști (aici la imperfect: „știa”).' }],
  [3, 5, { w: 'ziua' }, { greek: 'ἡμέρᾳ' }],
  [3, 6, { w: 'înțelepciune' }, { greek: 'τοῦ κατανοῆσαι', greek_def_ro: 'κατανοέω (katanoeo) — a observa, a înțelege deplin (infinitiv).' }],
  [3, 6, { w: 'luat' }, { greek: 'λαβοῦσα', greek_def_ro: 'λαμβάνω (lambano) — a lua (aici participiu: „luând”).' }],
  [3, 6, { w: 'el' }, NOT],
  [3, 8, { w: 'omul' }, { greek: 'Ἀδάμ', greek_def_ro: ADAM_GDR, diff_ro: ADAM }],
  // 3:9 „Unde ești” (אַיֶּכָּה) e împărțit în אַיֶּה + כָּה: analiză clasică, păstrată
  [3, 10, { w: 'omul' }, NOT],
  [3, 11, { w: 'DOMNUL Dumnezeu' }, NOT],
  [3, 14, { w: 'pântecul' }, { greek: 'τῷ στήθει σου καὶ τῇ κοιλίᾳ', greek_def_ro: 'τὸ στῆθος (to stethos) — piept; ἡ κοιλία (he koilia) — pântece.', diff_ro: 'Septuaginta are două cuvinte, „pe pieptul tău și pe pântece” (ἐπὶ τῷ στήθει σου καὶ τῇ κοιλίᾳ), acolo unde ebraica are unul singur, גָּחוֹן („pântece”).' }],
  [3, 17, { w: 'spunând' }, { greek: null, greek_def_ro: null, diff_ro: 'Septuaginta nu redă ebraicul לֵאמֹר („spunând”).' }],
  [3, 19, { w: 'întoarce' }, { greek: 'ἀποστρέψαι', greek_def_ro: 'ἀποστρέφω (apostrepho) — a (se) întoarce (aici infinitiv: „până la întoarcerea ta”).' }],
  [3, 20, { w: 'Omul' }, { greek: 'Ἀδάμ', greek_def_ro: ADAM_GDR, diff_ro: ADAM }],
  [3, 22, { w: 'omul' }, { greek: 'Ἀδάμ', greek_def_ro: ADAM_GDR, diff_ro: ADAM }],
  // ---- Geneza 4 ----
  [4, 1, { w: 'omul' }, { greek: 'Ἀδάμ', greek_def_ro: ADAM_GDR }],
  [4, 1, { w: 'ea' }, NOT],
  [4, 1, { w: 'zămislit' }, { greek: 'συλλαβοῦσα', greek_def_ro: 'συλλαμβάνω (syllambano) — a prinde, a zămisli (aici participiu: „zămislind”).' }],
  [4, 7, { w: 'bine' }, { heb: 'תֵּיטִיב', translit: 'teitiv', pos: 'verb (hifil)' }],
  [4, 7, { w: 'păcatul' }, { greek: 'ἥμαρτες', greek_def_ro: 'ἁμαρτάνω (hamartano) — a păcătui (aici: „ai păcătuit”).', diff_ro: 'Ebraicul חַטָּאת este un substantiv („păcatul”); Septuaginta are verbul ἥμαρτες („ai păcătuit”).' }],
  [4, 7, { w: 'pândește' }, { greek: 'ἡσύχασον', greek_def_ro: 'ἡσυχάζω (hesychazo) — a se liniști, a sta liniștit (aici imperativ: „liniștește-te”).' }],
  [4, 9, { w: 'El' }, NOT],
  [4, 9, { w: 'știu' }, { greek: 'γινώσκω', greek_def_ro: 'γινώσκω (ginosko) — a cunoaște, a ști.' }],
  [4, 12, { w: 'el' }, NOT],
  [4, 14, { w: 'izgonit' }, { greek: 'ἐκβάλλεις' }],
  [4, 15, { w: 'răzbunat' }, { greek: 'ἐκδικούμενα', greek_def_ro: 'ἐκδικέω (ekdikeo) — a răzbuna (aici participiu: „răzbunate”).' }],
  [4, 15, { w: 'înșeptit' }, { greek: 'ἑπτὰ', greek_def_ro: 'ἑπτά (hepta) — șapte.' }],
  [4, 15, { w: 'întâlnește' }, { greek: 'εὑρίσκοντα αὐτόν', greek_def_ro: 'εὑρίσκω (heurisko) — a găsi („pe cel care îl găsește”).' }],
  [4, 17, { w: 'ea' }, NOT],
  [4, 17, { w: 'El' }, NOT],
  [4, 17, { w: 'zămislit' }, { greek: 'συλλαβοῦσα', greek_def_ro: 'συλλαμβάνω (syllambano) — a prinde, a zămisli (aici participiu: „zămislind”).' }],
  [4, 17, { w: 'construia' }, { greek: 'οἰκοδομῶν', greek_def_ro: 'οἰκοδομέω (oikodomeo) — a zidi, a construi (aici participiu: „zidind”).' }],
  [4, 17, { w: 'dat' }, { greek: 'ἐπωνόμασεν', greek_def_ro: 'ἐπονομάζω (eponomazo) — a pune nume, a numi.' }],
  [4, 17, { w: 'nume' }, { greek: 'ἐπὶ τῷ ὀνόματι', greek_def_ro: 'ὄνομα (onoma) — nume (ἐπὶ τῷ ὀνόματι: „după numele”).' }],
  [4, 18, { w: 'născut' }, { greek: 'ἐγενήθη', greek_def_ro: 'γίνομαι (ginomai) — a deveni, a se naște (aici: „s-a născut”).' }],
  [4, 21, { w: 'mânuiesc' }, { greek: 'καταδείξας', greek_def_ro: 'καταδείκνυμι (katadeiknymi) — a arăta, a face cunoscut (aici participiu: „cel ce a arătat”).' }],
  [4, 21, { w: 'lira' }, { greek: 'ψαλτήριον', greek_def_ro: 'ψαλτήριον (psalterion) — instrument cu coarde, psalterion.' }],
  [4, 21, { w: 'fluierul' }, { greek: 'κιθάραν', greek_def_ro: 'κιθάρα (kithara) — chitară, liră.', diff_ro: 'Septuaginta (Rahlfs) are „psalterion și liră” (ψαλτήριον καὶ κιθάραν) acolo unde ebraica are „liră și fluier” (כִּנּוֹר וְעוּגָב); instrumentele nu se suprapun cuvânt cu cuvânt.' }],
  [4, 22, { w: 'uneltele' }, { heb: 'חֹרֵשׁ', translit: 'choresh', strong: 'H2790', pos: 'participiu (substantiv)', def_ro: 'a grava, a ara, a prelucra cu unelte; la participiu: meșteșugar, făurar.' }],
  [4, 23, { w: 'glasul' }, { greek: 'τῆς φωνῆς' }],
  [4, 23, { w: 'vorba' }, { greek: 'τοὺς λόγους' }],
  [4, 25, { w: 'ea' }, NOT],
  [4, 26, { w: 'lui' }, { greek: 'καὶ', greek_def_ro: 'καί (kai) — și.', diff_ro: 'Septuaginta nu redă pronumele הוּא („el”): „și lui Set i s-a născut un fiu”, fără „și el”.', dict_ro: 'Gam hu, „și el”: întărește paralelismul cu linia lui Cain, ale cărei nașteri tocmai au fost înșirate; și Set, ca și Cain, are urmași.' }],
];
// Geneza 5: numerele din Rahlfs au „καὶ” între sute și unități; 5:8 are δώδεκα
const NUM5 = (g) => g.replace(/^(\S+) /, '$1 καὶ ');

// toate cuvintele din Geneza 1 care au doar „Vezi mai sus.”: textul se pune la fiecare
const VEZI = { H4327: DICT_MIN, H2416: DICT_CHAYAH };
const nk = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[ʼ᾿’'·,.;:··?!]/g, '').replace(/ς/g, 'σ').replace(/\s+/g, ' ').toLowerCase();
let applied = 0, missing = 0, byCh = {};
const load = (n) => new Function('window', fs.readFileSync('public/genesis-' + n + '.js', 'utf8') + ';return window;')({}).CHAPTER_DATA;
for (let n = 1; n <= 5; n++) {
  const D = load(n);
  for (const [c, v, m, patch] of OPS.filter(o => o[0] === n)) {
    const x = D.find(q => q.num === v);
    const hit = x.tokens.filter(t => t.w !== undefined && (m.w === undefined || t.w === m.w) && (m.heb === undefined || t.heb === m.heb));
    const old = (t) => (patch === NOT ? !!t.heb : Object.keys(patch).some(k => (patch[k] === null ? t[k] !== undefined : t[k] !== patch[k])));
    const todo = hit.filter(old);
    if (!hit.length) { console.log('NU GĂSESC', c + ':' + v, JSON.stringify(m)); missing++; continue; }
    for (const t of todo) {
      if (patch === NOT) { for (const k of Object.keys(t)) if (k !== 't') delete t[k]; }
      else for (const [k, val] of Object.entries(patch)) { if (val === null) delete t[k]; else t[k] = val; }
      applied++; byCh[n] = (byCh[n] || 0) + 1;
    }
  }
  if (n === 1) for (const x of D) for (const t of x.tokens) if (t.dict_ro && /^Vezi mai sus/.test(t.dict_ro.trim()) && VEZI[t.strong]) { t.dict_ro = VEZI[t.strong]; applied++; byCh[1] = (byCh[1] || 0) + 1; }
  if (n === 5) { // numerale
    for (const x of D) { const g = x.textCompare.find(q => q.greek); const L = ' ' + nk(g.original) + ' ';
      for (const t of x.tokens) if (t.greek && /ἔτη$/.test(t.greek) && !L.includes(nk(t.greek))) {
        let ng = x.num === 8 ? 'ἐννακόσια καὶ δώδεκα ἔτη' : NUM5(t.greek);
        if (!L.includes(nk(ng))) { console.log('NUMERAL NEREZOLVAT', x.num, t.greek, ng); missing++; continue; }
        t.greek = ng; if (x.num === 8) t.greek_def_ro = 'ἐννακόσια (ennakosia), δώδεκα (dodeka) — nouă sute doisprezece ani.'; applied++; byCh[5] = (byCh[5] || 0) + 1; } }
  }
  if (WRITE) fs.writeFileSync('public/genesis-' + n + '.js', 'window.CHAPTER_DATA = ' + JSON.stringify(D, null, 1).replace(/\n/g, '\r\n') + ';\r\n', 'utf8');
}
console.log(WRITE ? 'SCRIS' : 'PROBĂ', '| etichete corectate:', applied, JSON.stringify(byCh), '| neîntâlnite:', missing);
