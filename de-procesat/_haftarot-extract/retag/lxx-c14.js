// Șemot (sefard) — Ieremia 1:1-2:3 (Rahlfs) — LXX pentru FIECARE tag (mod total)
const J = (g, f, def, df) => g + '¦' + f + '¦' + def + (df ? '¦' + df : '');
const Z = df => '0' + (df ? '¦' + df : '');
const S = { __tot: true };
S['1:1'] = [J('ῥῆμα', 'ῥῆμα', 'cuvânt', 'Ebraica: „cuvintele” (divrei, plural) „lui Ieremia”; Septuaginta: „cuvântul lui Dumnezeu” (τὸ ῥῆμα τοῦ θεοῦ), singular.'), J('Ἱερεμίας', 'Ιερεμιαν', 'Ieremia'),
  J('Χελκίας', 'τὸν/τοῦ/Χελκιου', 'Hilchia'), J('ἱερεύς', 'ἱερέων', 'preot'), J('Ἀναθώθ', 'Αναθωθ', 'Anatot'), J('γῆ', 'γῇ', 'țară, ținut'), J('Βενιαμίν', 'Βενιαμιν', 'Beniamin')];
S['1:2'] = [J('γίνομαι', 'ἐγενήθη', 'a fi, a veni'), J('λόγος', 'λόγος', 'cuvânt'), J('θεός', 'τοῦ/θεοῦ', 'Dumnezeu', 'Ebraica: „DOMNULUI”; Septuaginta: „al lui Dumnezeu” (τοῦ θεοῦ).'), J('ἡμέρα', 'ἡμέραις', 'zi'),
  J('Ἰωσίας', 'Ιωσια', 'Iosia'), J('υἱός', 'υἱοῦ/Αμως', 'fiul lui Amos', 'Ebraica: „fiul lui Amon” (Amon); Septuaginta: „fiul lui Amos” (Αμως).'), J('βασιλεύς', 'βασιλέως', 'rege'),
  J('Ἰούδας', 'Ιουδα', 'Iuda'), J('ἔτος', 'ἔτους/τρισκαιδεκάτου', 'al treisprezecelea an'), J('βασιλεία', 'βασιλείᾳ', 'domnie')];
S['1:3'] = [J('γίνομαι', 'ἐγένετο', 'a fi'), J('ἡμέρα', 'ἡμέραις', 'zi'), J('Ἰωακείμ', 'Ιωακιμ', 'Ioachim'), J('υἱός', 'υἱοῦ/Ιωσια', 'fiul lui Iosia'), J('βασιλεύς', 'βασιλέως', 'rege'), J('Ἰούδας', 'Ιουδα', 'Iuda'),
  J('ἕως', 'ἕως', 'până la', 'Ebraica: „sfârșitul” (tom, „a se încheia”); Septuaginta: „până la” (ἕως).'), J('ἔτος', 'ἑνδεκάτου/ἔτους', 'al unsprezecelea an'), J('Σεδεκίας', 'Σεδεκια', 'Sedechia'),
  J('υἱός', 'υἱοῦ/Ιωσια', 'fiul lui Iosia'), J('βασιλεύς', 'βασιλέως', 'rege'), J('Ἰούδας', 'Ιουδα', 'Iuda'), J('Ἱερουσαλήμ', 'Ιερουσαλημ', 'Ierusalim'),
  J('αἰχμαλωσία', 'αἰχμαλωσίας', 'robie', 'Ebraica: „a fost exilat” (gelot, verb); Septuaginta: „robia” (αἰχμαλωσίας), substantiv.'), J('μήν', 'πέμπτῳ/μηνί', 'luna a cincea')];
S['1:4'] = [J('λόγος', 'λόγος', 'cuvânt'), J('κύριος', 'κυρίου', 'Domn; DOMNUL'), J('γίνομαι', 'ἐγένετο', 'a fi, a veni'), J('λέγω', 'λέγων', 'a spune')];
S['1:5'] = [J('πρό', 'πρὸ', 'înainte de'), J('πλάσσω', 'πλάσαι', 'a plăsmui'), J('κοιλία', 'κοιλίᾳ', 'pântece'), J('ἐπίσταμαι', 'ἐπίσταμαί', 'a cunoaște', 'Ebraica: „te-am cunoscut” (iedatiha, trecut); Septuaginta: „te cunosc” (ἐπίσταμαί, prezent).'),
  J('πρό', 'πρὸ', 'înainte de'), J('ἐξέρχομαι', 'ἐξελθεῖν', 'a ieși'), J('μήτρα', 'μήτρας', 'pântec'), J('ἁγιάζω', 'ἡγίακά', 'a sfinți'), J('προφήτης', 'προφήτην', 'profet'), J('τίθημι', 'τέθεικά', 'a pune'), J('ἔθνος', 'ἔθνη', 'neam')];
S['1:6'] = [J('λέγω', 'εἶπα', 'a spune'), J('δεσπότης', 'ὦ/δέσποτα/Κύριε', 'o, Stăpâne Doamne', 'Ebraica: „Stăpâne, Doamne DUMNEZEULE” (Adonai YHWH); Septuaginta: „o, Stăpâne Doamne” (ὦ δέσποτα Κύριε).'),
  J('ἐπίσταμαι', 'οὐκ/ἐπίσταμαι', 'a ști'), J('λαλέω', 'λαλεῖν', 'a vorbi'), J('εἰμί', 'εἰμι', 'a fi'), J('νεώτερος', 'νεώτερος', 'mai tânăr', 'Ebraica: „tânăr” (naar); Septuaginta: „mai tânăr” (νεώτερος), comparativ.')];
S['1:7'] = [J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('λέγω', 'εἶπεν', 'a spune'), J('λέγω', 'μὴ/λέγε', 'a spune'), J('ἐγώ', 'ἐγώ', 'eu'), J('νεώτερος', 'νεώτερος', 'mai tânăr', 'Ebraica: „tânăr” (naar); Septuaginta: „mai tânăr” (νεώτερος).'),
  J('πᾶς', 'πάντας', 'toți'), J('ἐξαποστέλλω', 'ἐξαποστείλω', 'a trimite'), J('πορεύομαι', 'πορεύσῃ', 'a merge'), J('πᾶς', 'κατὰ/πάντα/ὅσα', 'tot ce'), J('ἐντέλλομαι', 'ἐντείλωμαί', 'a porunci'), J('λαλέω', 'λαλήσεις', 'a vorbi')];
S['1:8'] = [J('φοβέομαι', 'φοβηθῇς', 'a se teme'), J('πρόσωπον', 'ἀπὸ/προσώπου', 'față'), J('ἐγώ', 'ἐγώ', 'eu'), J('ἐξαιρέω', 'ἐξαιρεῖσθαι', 'a scoate, a izbăvi'),
  J('λέγω', 'λέγει', 'a spune', 'Ebraica: „rostirea” (neum, substantiv); Septuaginta: „zice” (λέγει, verb).'), J('κύριος', 'Κύριος', 'Domn; DOMNUL')];
S['1:9'] = [J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('ἐκτείνω', 'ἐξέτεινεν', 'a întinde', 'Ebraica: „a trimis” (vaișlah, mâna); Septuaginta: „a întins” (ἐξέτεινεν).'), J('χείρ', 'χεῖρα', 'mână'), J('ἅπτω', 'ἥψατο', 'a atinge'),
  J('στόμα', 'στόματός', 'gură'), J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('λέγω', 'εἶπεν', 'a spune'), J('δίδωμι', 'δέδωκα', 'a da'), J('λόγος', 'λόγους', 'cuvânt'), J('στόμα', 'εἰς/τὸ/στόμα', 'gură')];
S['1:10'] = [J('ἰδού', 'ἰδοὺ', 'iată'), J('καθίστημι', 'κατέστακά', 'a pune'), J('σήμερον', 'σήμερον', 'astăzi'), J('ἔθνος', 'ἔθνη', 'neam'), J('βασιλεία', 'βασιλείας', 'regat'), J('ἐκριζόω', 'ἐκριζοῦν', 'a dezrădăcina'),
  J('κατασκάπτω', 'κατασκάπτειν', 'a surpa'), J('ἀπόλλυμι', 'ἀπολλύειν', 'a nimici'), Z('Septuaginta are doar trei verbe de distrugere; al patrulea („să nimicești”, haros) lipsește.'), J('οἰκοδομέω', 'ἀνοικοδομεῖν', 'a zidi'), J('φυτεύω', 'καταφυτεύειν', 'a sădi')];
S['1:11'] = [J('λόγος', 'λόγος', 'cuvânt'), J('κύριος', 'κυρίου', 'Domn; DOMNUL'), J('γίνομαι', 'ἐγένετο', 'a fi, a veni'), J('λέγω', 'λέγων', 'a spune'), J('ὁράω', 'τί/σὺ/ὁρᾷς', 'a vedea'), J('Ἱερεμίας', 'Ιερεμια', 'Ieremia'),
  J('λέγω', 'εἶπα', 'a spune'), Z('Septuaginta nu are „văd” (ani roe); răspunsul este doar „toiag de nuc”.'), J('βακτηρία', 'βακτηρίαν', 'toiag', 'Ebraica: „nuia” (maqel); Septuaginta: „toiag” (βακτηρίαν).'),
  J('καρύϊνος', 'καρυΐνην', 'de nuc', 'Ebraica: „de migdal” (shaqed); Septuaginta: „de nuc” (καρυΐνην).')];
S['1:12'] = [J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('λέγω', 'εἶπεν', 'a spune'), J('ὁράω', 'καλῶς/ἑώρακας', 'a vedea bine'), J('γρηγορέω', 'ἐγρήγορα', 'a veghea', 'Ebraica: „zoresc” (shoked, „veghez”); Septuaginta: „am vegheat” (ἐγρήγορα).'),
  J('ποιέω', 'ποιῆσαι', 'a face, a împlini'), J('λόγος', 'λόγους', 'cuvânt')];
S['1:13'] = [J('λόγος', 'λόγος', 'cuvânt'), J('κύριος', 'κυρίου', 'Domn; DOMNUL'), J('γίνομαι', 'ἐγένετο', 'a fi, a veni'), J('δεύτερος', 'ἐκ/δευτέρου', 'a doua oară'), J('λέγω', 'λέγων', 'a spune'), J('ὁράω', 'τί/σὺ/ὁρᾷς', 'a vedea'),
  J('λέγω', 'εἶπα', 'a spune'), Z('Septuaginta nu are „văd” (ani roe).'), J('λέβης', 'λέβητα', 'cazan'), J('ὑποκαίω', 'ὑποκαιόμενον', 'a arde dedesubt', 'Ebraica: „clocotind” (nafuah, „suflat”); Septuaginta: „ars dedesubt” (ὑποκαιόμενον).'),
  J('πρόσωπον', 'πρόσωπον', 'față'), J('βορρᾶς', 'ἀπὸ/προσώπου/βορρᾶ', 'miazănoapte')];
S['1:14'] = [J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('λέγω', 'εἶπεν', 'a spune'), J('βορρᾶς', 'βορρᾶ', 'miazănoapte'), J('κακός', 'κακὰ', 'rău'),
  J('ἐκκαίω', 'ἐκκαυθήσεται', 'a se aprinde', 'Ebraica: „va fi slobozit” (tipatah, „se va deschide”); Septuaginta: „se va aprinde” (ἐκκαυθήσεται).'), J('κατοικέω', 'πάντας/τοὺς/κατοικοῦντας', 'toți locuitorii'), J('γῆ', 'γῆν', 'pământ')];
S['1:15'] = [J('συγκαλέω', 'συγκαλῶ', 'a chema laolaltă'), Z('Septuaginta nu are „familiile” (mișpehot).'), J('βασιλεία', 'πάσας/τὰς/βασιλείας', 'toate regatele'), J('βορρᾶς', 'βορρᾶ', 'miazănoapte'),
  J('λέγω', 'λέγει', 'a spune', 'Ebraica: „rostirea” (neum); Septuaginta: „zice” (λέγει).'), J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('ἕκαστος', 'ἕκαστος', 'fiecare'), J('ἥκω', 'ἥξουσιν', 'a veni'), J('τίθημι', 'θήσουσιν', 'a pune'),
  J('θρόνος', 'θρόνον', 'tron'), J('πρόθυρον', 'πρόθυρα', 'intrare'), J('πύλη', 'πυλῶν', 'poartă'), J('Ἱερουσαλήμ', 'Ιερουσαλημ', 'Ierusalim'), J('κύκλῳ', 'κύκλῳ', 'de jur împrejur'),
  J('τεῖχος', 'πάντα/τὰ/τείχη', 'ziduri'), J('πόλις', 'πάσας/τὰς/πόλεις', 'toate cetățile'), J('Ἰούδας', 'Ιουδα', 'Iuda')];
S['1:16'] = [J('λαλέω', 'λαλήσω', 'a vorbi'), J('κρίσις', 'κρίσεως', 'judecată'), J('κακία', 'πάσης/τῆς/κακίας', 'toată răutatea'), J('ἐγκαταλείπω', 'ἐγκατέλιπόν', 'a părăsi'),
  J('θύω', 'ἔθυσαν', 'a jertfi', 'Ebraica: „au ars tămâie” (vaikatru); Septuaginta: „au jertfit” (ἔθυσαν).'), J('θεός', 'θεοῖς/ἀλλοτρίοις', 'dumnezei străini'), J('προσκυνέω', 'προσεκύνησαν', 'a se închina'),
  J('ἔργον', 'ἔργοις', 'lucrare'), J('χείρ', 'χειρῶν', 'mână')];
S['1:17'] = [J('σύ', 'σὺ', 'tu'), J('περιζώννυμι', 'περίζωσαι', 'a se încinge'), J('ὀσφύς', 'ὀσφύν', 'coapse'), J('ἀνίστημι', 'ἀνάστηθι', 'a se ridica'), J('λέγω', 'εἰπὸν', 'a spune'), J('πᾶς', 'πάντα/ὅσα', 'tot ce'),
  J('ἐντέλλομαι', 'ἐντείλωμαί', 'a porunci'), J('ἐγώ', 'ἐγώ', 'eu', 'Septuaginta adaugă la sfârșit „căci cu tine sunt Eu ca să te scot” (ὅτι μετὰ σοῦ ἐγώ εἰμι), repetiție din v. 8.'),
  J('φοβέομαι', 'φοβηθῇς', 'a se teme'), J('πρόσωπον', 'ἀπὸ/προσώπου', 'față'), J('πτοέω', 'πτοηθῇς', 'a se înspăimânta', 'Ebraica: „ca nu cumva să te fac să te înspăimânți” (pen ahitha); Septuaginta: „nici să nu te înspăimânți” (μηδὲ πτοηθῇς).'),
  J('ἐναντίον', 'ἐναντίον', 'înaintea')];
S['1:18'] = [Z('Septuaginta nu are „Eu” (vaani).'), J('τίθημι', 'τέθεικά', 'a pune'), J('σήμερον', 'ἐν/τῇ/σήμερον/ἡμέρᾳ', 'astăzi'), J('πόλις', 'πόλιν', 'cetate'), J('ὀχυρός', 'ὀχυρὰν', 'întărit'),
  Z('Septuaginta nu are „stâlp” (amud).'), Z('Septuaginta nu are „de fier” (barzel).'), J('τεῖχος', 'τεῖχος', 'zid'), J('χαλκοῦς', 'χαλκοῦν', 'de aramă'),
  J('πᾶς', 'ἅπασιν', 'toți', 'Ebraica: „împotriva întregii țări” (al kol haaretz); Septuaginta: „împotriva tuturor regilor” (ἅπασιν τοῖς βασιλεῦσιν).'), J('βασιλεύς', 'βασιλεῦσιν', 'rege'), J('Ἰούδας', 'Ιουδα', 'Iuda'),
  J('ἄρχων', 'ἄρχουσιν', 'conducător'), Z('Septuaginta nu are „preoților săi” (lehohaneha).'), J('λαός', 'λαῷ', 'popor'), J('γῆ', 'γῆς', 'țară')];
S['1:19'] = [J('πολεμέω', 'πολεμήσουσιν', 'a se război'), J('δύναμαι', 'δύνωνται', 'a putea'), J('ἐγώ', 'ἐγώ', 'eu'), J('λέγω', 'εἶπεν', 'a spune', 'Ebraica: „rostirea” (neum); Septuaginta: „a zis” (εἶπεν).'), J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('ἐξαιρέω', 'ἐξαιρεῖσθαι', 'a scoate, a izbăvi')];
S['2:1'] = [Z('Septuaginta nu are 2:1 ca verset separat; textul grecesc trece direct la „Și a zis: Așa zice Domnul” (corespunzând lui 2:2).'), Z(), Z(), Z()];
S['2:2'] = [Z('Septuaginta nu are „du-te” (haloh).'), Z('Septuaginta nu are „vestește” (vekarata).'), Z('Septuaginta nu are „în auzul” (veaznei).'), Z('Septuaginta nu are „Ierusalimului” ca destinatar.'),
  J('λέγω', 'εἶπεν', 'a spune', 'Ebraica: „spunând” (lemor); Septuaginta: „și a zis: așa zice Domnul” (εἶπεν· τάδε λέγει κύριος), formulă pe care textul lui Rosen nu o conține.'),
  J('μιμνήσκομαι', 'ἐμνήσθην', 'a-și aduce aminte'), J('ἔλεος', 'ἐλέους', 'milă, bunătate'), J('νεότης', 'νεότητός', 'tinerețe'), J('ἀγάπη', 'ἀγάπης', 'dragoste'),
  J('τελείωσις', 'τελειώσεώς', 'desăvârșire', 'Ebraica: „ritualurilor tale nupțiale” (kelulotaih, „logodnă”); Septuaginta: „desăvârșirii tale” (τελειώσεώς σου).'),
  J('ἐξακολουθέω', 'ἐξακολουθῆσαι', 'a urma', 'Ebraica: „m-ai urmat în deșert” (lehtech aharai bamidbar); Septuaginta: „ca să urmezi pe Sfântul lui Israel” (τῷ ἁγίῳ Ισραηλ).'),
  Z('Septuaginta nu are „deșert” (midbar).'), Z('Septuaginta nu are „pământ” (eretz).'), Z('Septuaginta nu are „nesemănat” (zerua).')];
S['2:3'] = [J('Ἰσραήλ', 'Ισραηλ', 'Israel'), J('ἅγιος', 'ἅγιος', 'sfânt'), J('κύριος', 'τῷ/κυρίῳ', 'Domn; DOMNUL'), J('ἀρχή', 'ἀρχὴ', 'început, primul rod'), J('γέννημα', 'γενημάτων', 'roadă'), J('πᾶς', 'πάντες', 'toți'),
  J('ἐσθίω', 'ἔσθοντες', 'a mânca'), J('πλημμελέω', 'πλημμελήσουσιν', 'a greși, a fi vinovat'), J('κακός', 'κακὰ', 'rău'), J('ἥκω', 'ἥξει', 'a veni'), J('φημί', 'φησὶν', 'a zice', 'Ebraica: „rostirea” (neum); Septuaginta: „zice” (φησὶν).'),
  J('κύριος', 'κύριος', 'Domn; DOMNUL')];
module.exports = S;
