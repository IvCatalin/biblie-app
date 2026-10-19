// Vaigaș — Ezechiel 37:15-28 (Rahlfs „Iezechiil”) — LXX pentru FIECARE tag (mod total)
const D = {
  'λόγος': 'cuvânt', 'κύριος': 'Domn; DOMNUL', 'γίνομαι': 'a fi, a se petrece', 'λέγω': 'a spune', 'υἱὸς ἀνθρώπου': 'fiul omului', 'λαμβάνω': 'a lua', 'ῥάβδος': 'toiag, vargă', 'γράφω': 'a scrie',
  'Ἰούδας': 'Iuda', 'υἱοὶ Ἰσραήλ': 'fiii lui Israel', 'προσκεῖμαι': 'a fi alipit', 'Ἰωσήφ': 'Iosif', 'Ἐφράιμ': 'Efraim', 'πᾶς υἱὸς Ἰσραήλ': 'toți fiii lui Israel', 'προστίθημι': 'a adăuga',
  'συνάπτω': 'a uni, a lega laolaltă', 'ἀλλήλων': 'unii altora', 'ῥάβδος μία': 'un singur toiag', 'εἰμί': 'a fi', 'δέω': 'a lega', 'χείρ': 'mână',
  'υἱός': 'fiu', 'λαός': 'popor', 'ἀναγγέλλω': 'a vesti, a face cunoscut', 'οὗτος': 'acesta',
  'ἐρῶ': 'a spune (viitor)', 'ὅδε': 'acesta (așa)', 'φυλή': 'trib', 'δίδωμι': 'a da', 'ἐνώπιον': 'înaintea', 'πᾶς οἶκος Ἰσραήλ': 'toată casa lui Israel',
  'ἔθνος': 'neam', 'εἰσέρχομαι': 'a intra', 'συνάγω': 'a aduna', 'περικύκλῳ': 'de jur împrejur', 'εἰσάγω': 'a aduce înăuntru', 'γῆ': 'pământ, țară', 'ἐγώ': 'eu',
  'ὄρος': 'munte', 'ἄρχων': 'căpetenie, conducător', 'οὐκέτι': 'nu mai', 'διαιρέω': 'a împărți', 'δύο ἔθνος': 'două neamuri', 'βασιλεία': 'regat',
  'μιαίνω': 'a pângări', 'εἴδωλον': 'idol', 'ἀνομία': 'fărădelege', 'ῥύομαι': 'a scăpa, a elibera', 'ἁμαρτάνω': 'a păcătui', 'καθαρίζω': 'a curăța', 'θεός': 'Dumnezeu',
  'δοῦλος': 'slujitor', 'Δαυίδ': 'David', 'ποιμήν': 'păstor', 'πᾶς': 'tot, toți', 'κρίμα': 'judecată', 'πορεύομαι': 'a merge, a umbla', 'πρόσταγμα': 'poruncă, rânduială', 'φυλάσσω': 'a păzi', 'ποιέω': 'a face',
  'κατοικέω': 'a locui', 'Ἰακώβ': 'Iacov', 'πατήρ': 'tată, strămoș', 'αὐτός': 'el, ei', 'αἰών': 'veac, eternitate',
  'διατίθημι': 'a încheia (un legământ)', 'διαθήκη': 'legământ', 'εἰρήνη': 'pace', 'αἰώνιος': 'veșnic', 'τίθημι': 'a pune', 'ἅγιος': 'sfânt', 'μέσος': 'mijloc',
  'κατασκήνωσις': 'sălășluire, locuință', 'γινώσκω': 'a cunoaște', 'ἁγιάζω': 'a sfinți'
};
const I = (g, f, df) => { if (!D[g]) throw new Error('fără definiție: ' + g); return g + '¦' + f + '¦' + D[g] + (df ? '¦' + df : ''); };
const Z = df => '0' + (df ? '¦' + df : '');
const S = { __tot: true };
S['37:15'] = [I('λόγος', 'λόγος'), I('κύριος', 'Κυρίου'), I('γίνομαι', 'ἐγένετο'), I('λέγω', 'λέγων')];
S['37:16'] = [Z('Septuaginta nu are pronumele separat „tu” (veata).'), I('υἱὸς ἀνθρώπου', 'Υἱὲ/ἀνθρώπου'), I('λαμβάνω', 'λάβε'),
  I('ῥάβδος', 'ῥάβδον', 'Ebraica: „lemn” (ets); Septuaginta: „toiag” (ῥάβδος).'), I('γράφω', 'γράψον'), I('Ἰούδας', 'Ἰούδαν'), I('υἱοὶ Ἰσραήλ', 'υἱοὺς/Ἰσραὴλ'),
  I('προσκεῖμαι', 'προσκειμένους', 'Ebraica: „tovarășii săi” (haverav); Septuaginta: „cei alipiți de el” (τοὺς προσκειμένους ἐπ᾽ αὐτόν).'),
  I('λαμβάνω', 'λήμψῃ', 'Ebraica: „ia” (imperativ, ulkah); Septuaginta: „vei lua” (viitor), cu „un al doilea toiag”.'),
  I('ῥάβδος', 'ῥάβδον/δευτέραν', 'Ebraica: „un lemn” (ets ehad); Septuaginta: „un al doilea toiag” (ῥάβδον δευτέραν).'),
  I('γράφω', 'γράψεις'), I('Ἰωσήφ', 'Ἰωσήφ'), I('ῥάβδος', 'ῥάβδον'), I('Ἐφράιμ', 'Ἐφράιμ'),
  I('πᾶς υἱὸς Ἰσραήλ', 'πάντας/υἱοὺς/Ἰσραὴλ', 'Ebraica: „toată casa lui Israel” (kol bet Israel); Septuaginta: „toți fiii lui Israel”.'),
  I('προστίθημι', 'προστεθέντας', 'Ebraica: „tovarășii săi” (haverav); Septuaginta: „cei adăugați la el” (τοὺς προστεθέντας πρὸς αὐτόν).')];
S['37:17'] = [I('συνάπτω', 'συνάψεις', 'Ebraica: „apropie-le” (vekarav); Septuaginta: „le vei uni” (συνάψεις).'), I('ἀλλήλων', 'πρὸς/ἀλλήλας'), I('ῥάβδος μία', 'ῥάβδον/μίαν'), I('εἰμί', 'ἔσονται'),
  I('δέω', 'δῆσαι', 'Ebraica: „unite” (laahadim); Septuaginta: „ca să le legi” (τοῦ δῆσαι), un adaos explicativ.'), I('χείρ', 'ἐν/χειρί')];
S['37:18'] = [I('υἱός', 'υἱοὶ'), I('λαός', 'λαοῦ'), I('λέγω', 'λέγωσιν'), Z('Septuaginta nu are „spunând” (lemor); verbul λέγωσιν este deja în fraza precedentă.'), I('ἀναγγέλλω', 'ἀναγγέλλεις'), I('οὗτος', 'ταῦτά')];
S['37:19'] = [I('ἐρῶ', 'ἐρεῖς', 'Ebraica: „vorbește-le” (imperativ); Septuaginta: „le vei spune” (viitor).'), I('ὅδε', 'Τάδε'), I('λέγω', 'λέγει'),
  I('κύριος', 'Κύριος', 'Ebraica: „Stăpânul DOMNUL” (Adonai YHWH); Septuaginta: un singur „Κύριος”.'), I('ἐγώ', 'ἐγὼ'), I('λαμβάνω', 'λήμψομαι'),
  I('φυλή', 'φυλήν/Ἰωσὴφ', 'Ebraica: „lemnul lui Iosef” (ets Iosef); Septuaginta: „tribul lui Iosif” (τὴν φυλὴν Ἰωσήφ).'), I('χείρ', 'διὰ/χειρὸς/Ἐφράιμ'), I('φυλή', 'φυλὰς/Ἰσραὴγ'),
  I('προσκεῖμαι', 'προσκειμένας', 'Ebraica: „tovarășii săi” (haverav); Septuaginta: „cele alipite de el” (τὰς προσκειμένας πρὸς αὐτόν).'), I('δίδωμι', 'δώσω'),
  I('φυλή', 'φυλὴν/Ἰούδα', 'Ebraica: „lemnul lui Iuda” (ets Iehuda); Septuaginta: „tribul lui Iuda” (τὴν φυλὴν Ἰούδα).'),
  Z('Septuaginta nu are verbul separat „le voi face” (vaasitim); „εἰς ῥάβδον μίαν” cuprinde ideea.'), I('ῥάβδος μία', 'ῥάβδον/μίαν'), I('εἰμί', 'ἔσονται'),
  Z('Septuaginta are „un singur toiag” o singură dată; „una” (ehad) nu se repetă.'),
  I('χείρ', 'τῇ/χειρὶ/Ἰούδα', 'Ebraica: „în mâna Mea” (beiadi); Septuaginta: „în mâna lui Iuda” (τῇ χειρὶ Ἰούδα).')];
S['37:20'] = [I('ῥάβδος', 'ῥάβδοι'), I('γράφω', 'ἔγραψας'), I('εἰμί', 'ἔσονται'), I('χείρ', 'ἐν/τῇ/χειρί'), I('ἐνώπιον', 'ἐνώπιον', 'Ebraica: „în ochii lor” (leenehem); Septuaginta: „înaintea lor” (ἐνώπιον αὐτῶν).')];
S['37:21'] = [I('ἐρῶ', 'ἐρεῖς', 'Ebraica: „vorbește-le” (imperativ); Septuaginta: „le vei spune” (viitor).'), I('ὅδε', 'Τάδε'), I('λέγω', 'λέγει'), I('κύριος', 'κύριος/Κύριος'), I('ἐγώ', 'ἐγὼ'), I('λαμβάνω', 'λαμβάνω'),
  I('πᾶς οἶκος Ἰσραήλ', 'πάντα/οἶκον/Ἰσραὴλ', 'Ebraica: „copiii lui Israel” (benei Israel); Septuaginta: „toată casa lui Israel”.'), I('ἔθνος', 'ἐθνῶν'),
  I('εἰσέρχομαι', 'εἰσήλθοσαν', 'Ebraica: „au mers” (halchu); Septuaginta: „au intrat” (εἰσήλθοσαν).'), I('συνάγω', 'συνάξω'),
  I('περικύκλῳ', 'ἀπὸ/πάντων/τῶν/περικύκλῳ', 'Ebraica: „de jur împrejur” (misaviv); Septuaginta: „de la toți cei dimprejurul lor” (ἀπὸ πάντων τῶν περικύκλῳ αὐτῶν).'),
  I('εἰσάγω', 'εἰσάξω'), I('γῆ', 'γῆν/Ἰσραήλ', 'Ebraica: „pământul lor” (admatam); Septuaginta: „pământul lui Israel” (τὴν γῆν τοῦ Ἰσραήλ).')];
S['37:22'] = [I('δίδωμι', 'δώσω', 'Ebraica: „îi voi face” (veasiti); Septuaginta: „îi voi da” (δώσω).'),
  I('ἔθνος', 'εἰς/ἔθνος', 'Ebraica: „un singur neam” (goi ehad); Septuaginta: „ca neam” (εἰς ἔθνος), fără „singur”.'),
  I('γῆ', 'ἐν/τῇ/γῇ', 'Ebraica: „pe pământ” (baaretz); Septuaginta: „în pământul Meu” (ἐν τῇ γῇ μου).'), I('ὄρος', 'ὄρεσιν/Ἰσραήλ'),
  I('ἄρχων', 'ἄρχων/εἷς', 'Ebraica: „un singur rege” (melech ehad); Septuaginta: „o singură căpetenie” (ἄρχων εἷς).'), I('εἰμί', 'ἔσται'),
  I('αὐτός', 'αὐτῶν', 'Ebraica: „pentru toți” (lehulam); Septuaginta: „al lor” (αὐτῶν), fără „toți”.'), Z('Septuaginta nu are „ca rege” (lemelech).'),
  I('εἰμί', 'ἔσονται/ἔτι'), I('διαιρέω', 'διαιρεθῶσιν'), I('δύο ἔθνος', 'δύο/ἔθνη'), I('οὐκέτι', 'οὐκέτι'), I('βασιλεία', 'δύο/βασιλείας')];
S['37:23'] = [I('μιαίνω', 'μιαίνωνται'), I('εἴδωλον', 'εἰδώλοις'),
  Z('Septuaginta are un singur termen pentru idoli; „scârboșeniile lor” (shikutsehem) nu apare separat.'),
  I('ἀνομία', 'πασῶν/ἀνομιῶν'), I('ῥύομαι', 'ῥύσομαι', 'Ebraica: „îi voi izbăvi” (vehoshati); Septuaginta: „îi voi scăpa” (ῥύσομαι).'),
  Z('Septuaginta nu are „sălașurile lor” (moshvotehem); „toate nelegiuirile lor” reunește ambele expresii.'),
  I('ἁμαρτάνω', 'ἡμάρτοσαν'), I('καθαρίζω', 'καθαριῶ'), I('εἰμί', 'ἔσονταί'), I('λαός', 'εἰς/λαόν'), I('ἐγώ', 'ἐγὼ'), I('εἰμί', 'ἔσομαι'), I('θεός', 'εἰς/θεόν')];
S['37:24'] = [I('δοῦλος', 'δοῦλός'), I('Δαυίδ', 'Δαυιδ'), I('ἄρχων', 'ἄρχων', 'Ebraica: „rege” (melech); Septuaginta: „căpetenie” (ἄρχων).'), I('ποιμήν', 'ποιμὴν/εἷς'), I('εἰμί', 'ἔσται'), I('πᾶς', 'πάντων'),
  I('κρίμα', 'κρίματά', 'Ebraica: „în judecățile Mele vor merge” (mishpatai); Septuaginta: „judecățile Mele vor fi păzite” (τὰ κρίματά μου φυλάξονται).'), I('πορεύομαι', 'πορεύσονται'),
  I('πρόσταγμα', 'προστάγμασίν', 'Ebraica: „decretele Mele” (chukotai) sunt păzite; Septuaginta: „în poruncile Mele” (ἐν τοῖς προστάγμασίν μου) vor umbla.'),
  I('φυλάσσω', 'φυλάξονται', 'Ebraica: „vor păzi” (activ); Septuaginta: „vor fi păzite” (pasiv).'), I('ποιέω', 'ποιήσουσιν')];
S['37:25'] = [I('κατοικέω', 'κατοικήσουσιν'), I('γῆ', 'γῆς', 'Ebraica: „pământul” (haaretz); Septuaginta: „pământul lor” (τῆς γῆς αὐτῶν).'), I('δίδωμι', 'δέδωκα'), I('δοῦλος', 'δούλῳ'), I('Ἰακώβ', 'Ἰακώβ'), I('κατοικέω', 'κατῴκησαν'),
  I('πατήρ', 'πατέρες', 'Ebraica: „strămoșii tăi” (avoteichem); Septuaginta: „părinții lor” (οἱ πατέρες αὐτῶν).'), I('κατοικέω', 'κατοικήσουσιν'), I('αὐτός', 'αὐτοί'),
  Z('Septuaginta nu are „copiii lor” (uvnehem).'), Z('Septuaginta nu are „copiii copiilor lor” (uvnei venehem).'),
  Z('Septuaginta are „pe veci” o singură dată, la sfârșitul versetului; primul „ad olam” lipsește.'),
  I('δοῦλος', 'δοῦλός'), I('Δαυίδ', 'Δαυεὶδ'), I('ἄρχων', 'ἄρχων', 'Ebraica: „prinț” (nasi); Septuaginta: „căpetenie” (ἄρχων), același cuvânt ca pentru „rege” la v. 24.'), I('αἰών', 'εἰς/τὸν/αἰῶνα')];
S['37:26'] = [I('διατίθημι', 'διαθήσομαι', 'Ebraica: „voi tăia” (veharati, legământ); Septuaginta: „voi așeza” (διαθήσομαι).'), I('διαθήκη', 'διαθήκην/εἰρήνης'), I('διαθήκη', 'διαθήκη/αἰωνία'), I('εἰμί', 'ἔσται'),
  Z('Septuaginta nu are „îi voi așeza” (untatim).'), Z('Septuaginta nu are „îi voi înmulți” (vehirbeti).'), I('τίθημι', 'θήσω'),
  I('ἅγιος', 'τὰ/ἅγιά', 'Ebraica: „Sanctuarul Meu” (mikdashi); Septuaginta: „cele sfinte ale Mele” (τὰ ἅγιά μου).'), I('μέσος', 'ἐν/μέσῳ/αὐτῶν'), I('αἰών', 'εἰς/τὸν/αἰῶνα')];
S['37:27'] = [I('κατασκήνωσις', 'κατασκήνωσίς', 'Ebraica: „asupra lor” (alehem); Septuaginta: „în ei” (ἐν αὐτοῖς).'), I('εἰμί', 'ἔσται'), I('εἰμί', 'ἔσομαι'), I('θεός', 'θεός'), I('αὐτός', 'αὐτοὶ'), I('εἰμί', 'ἔσονται'), I('λαός', 'λαός')];
S['37:28'] = [I('ἔθνος', 'ἔθνη'), I('γινώσκω', 'γνώσονται'), I('ἐγώ', 'ἐγὼ'), I('κύριος', 'Κύριος'),
  I('ἁγιάζω', 'ἁγιάζων', 'Ebraica: „care îl sfințește pe Israel” (mekadesh et Israel); Septuaginta: „care îi sfințește pe ei” (ὁ ἁγιάζων αὐτούς).'),
  Z('Septuaginta nu are „Israel”; are doar pronumele „ei” (αὐτούς).'), I('ἅγιος', 'τὰ/ἅγιά', 'Ebraica: „Sanctuarul Meu” (mikdashi); Septuaginta: „cele sfinte ale Mele” (τὰ ἅγιά μου).'),
  I('εἰμί', 'εἶναι'), I('μέσος', 'ἐν/μέσῳ/αὐτῶν'), I('αἰών', 'εἰς/τὸν/αἰῶνα')];
module.exports = S;
