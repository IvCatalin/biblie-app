// Vaera — Ezechiel 28:25-29:21 (Rahlfs) — LXX pentru FIECARE tag (mod total)
const J = (g, f, def, df) => g + '¦' + f + '¦' + def + (df ? '¦' + df : '');
const Z = df => '0' + (df ? '¦' + df : '');
const AD = 'Ebraica: „Stăpânul meu, Domnul DUMNEZEU” (Adonai YHWH); Septuaginta: „Domnul Domnul” (κύριος κύριος).';
const S = { __tot: true };
S['28:25'] = [J('ὅδε', 'τάδε', 'așa'), J('λέγω', 'λέγει', 'a spune'), J('κύριος', 'κύριος/κύριος', 'Domnul Domnul', AD), J('συνάγω', 'συνάξω', 'a aduna'),
  J('Ἰσραήλ', 'τὸν/Ισραηλ', 'Israel', 'Ebraica: „casa lui Israel” (bet Israel); Septuaginta: „Israel” (τὸν Ισραηλ).'), J('ἔθνος', 'ἐθνῶν', 'neam', 'Ebraica: „popoarele” (haamim); Septuaginta: „neamurile” (ἐκ τῶν ἐθνῶν).'),
  J('διασκορπίζω', 'διεσκορπίσθησαν', 'a împrăștia'), J('ἁγιάζω', 'ἁγιασθήσομαι', 'a se sfinți'),
  J('ἐνώπιον', 'ἐνώπιον/τῶν/λαῶν/καὶ/τῶν/ἐθνῶν', 'înaintea popoarelor și a neamurilor', 'Ebraica: „în ochii neamurilor” (leenei hagoim); Septuaginta: „înaintea popoarelor și a neamurilor” (ἐνώπιον τῶν λαῶν καὶ τῶν ἐθνῶν).'),
  J('κατοικέω', 'κατοικήσουσιν', 'a locui'), J('γῆ', 'γῆς/αὐτῶν', 'pământul lor'), J('δίδωμι', 'δέδωκα', 'a da'), J('δοῦλος', 'δούλῳ', 'slujitor'), J('Ἰακώβ', 'Ιακωβ', 'Iacov')];
S['28:26'] = [J('κατοικέω', 'κατοικήσουσιν', 'a locui'), J('ἐλπίς', 'ἐν/ἐλπίδι', 'în nădejde', 'Ebraica: „în siguranță” (lavetah); Septuaginta: „în nădejde” (ἐν ἐλπίδι).'), J('οἰκοδομέω', 'οἰκοδομήσουσιν', 'a zidi'), J('οἰκία', 'οἰκίας', 'casă'),
  J('φυτεύω', 'φυτεύσουσιν', 'a sădi'), J('ἀμπελών', 'ἀμπελῶνας', 'vie'), J('κατοικέω', 'κατοικήσουσιν', 'a locui'), J('ἐλπίς', 'ἐν/ἐλπίδι', 'în nădejde', 'Ebraica: „în siguranță” (lavetah); Septuaginta: „în nădejde” (ἐν ἐλπίδι).'),
  J('ποιέω', 'ποιήσω', 'a face'), J('κρίμα', 'κρίμα', 'judecată'), J('ἀτιμάζω', 'πᾶσιν/ἀτιμάσασιν', 'cei ce au disprețuit'), J('κύκλῳ', 'κύκλῳ', 'de jur împrejur'), J('γινώσκω', 'γνώσονται', 'a cunoaște'),
  J('ἐγώ', 'ἐγώ', 'eu'), J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('θεός', 'θεός', 'Dumnezeu', 'Septuaginta adaugă „și Dumnezeul părinților lor” (καὶ ὁ θεὸς τῶν πατέρων αὐτῶν).')];
S['29:1'] = [J('ἔτος', 'ἔτει', 'an'), J('δέκατος', 'δεκάτῳ', 'al zecelea'), J('δέκατος', 'δεκάτῳ', 'al zecelea (luna)'), J('εἷς', 'μιᾷ', 'una, prima', 'Ebraica: „a douăsprezecea [zi]” (bișnem asar); Septuaginta: „în ziua întâi” (μιᾷ τοῦ μηνός).'),
  J('μήν', 'μηνός', 'lună'), J('λόγος', 'λόγος', 'cuvânt'), J('κύριος', 'κυρίου', 'Domn; DOMNUL'), J('γίνομαι', 'ἐγένετο', 'a fi, a veni'), J('λέγω', 'λέγων', 'a spune')];
S['29:2'] = [J('υἱὸς ἀνθρώπου', 'υἱὲ/ἀνθρώπου', 'fiul omului'), J('στηρίζω', 'στήρισον', 'a fixa, a întări', 'Ebraica: „îndreaptă-ți” (sim, „pune”); Septuaginta: „fixează” (στήρισον).'), J('πρόσωπον', 'πρόσωπόν', 'față'),
  J('Φαραώ', 'Φαραὼ', 'Faraon'), J('βασιλεύς', 'βασιλέα', 'rege'), J('Αἴγυπτος', 'Αἰγύπτου', 'Egipt'), J('προφητεύω', 'προφήτευσον', 'a profeți'), J('Αἴγυπτος', 'Αἴγυπτον/ὅλην', 'tot Egiptul')];
S['29:3'] = [Z('Septuaginta nu are „vorbește” (dabeir) separat.'), J('λέγω', 'εἰπόν', 'a spune'), J('ὅδε', 'τάδε', 'așa'), J('λέγω', 'λέγει', 'a spune'), J('κύριος', 'Κύριος', 'Domn; DOMNUL', 'Ebraica: „Stăpânul meu, Domnul DUMNEZEU” (Adonai YHWH); Septuaginta: „Domnul” (Κύριος).'),
  J('Φαραώ', 'Φαραώ', 'Faraon'), Z('Septuaginta nu are „rege” aici.'), Z('Septuaginta nu are „al Egiptului” aici.'), J('μέγας', 'μέγαν', 'mare'), J('δράκων', 'δράκοντα', 'balaur', 'Ebraica: „monstru marin” (hatanim); Septuaginta: „balaur” (τὸν δράκοντα).'),
  J('ἐγκάθημαι', 'ἐγκαθήμενον', 'a ședea', 'Ebraica: „care se cuibărește” (harovets); Septuaginta: „care șade” (ἐγκαθήμενον).'), J('ποταμός', 'ἐν/μέσῳ/ποταμῶν', 'în mijlocul râurilor'), J('λέγω', 'λέγοντα', 'a spune'),
  J('ποταμός', 'οἱ/ποταμοί', 'râuri', 'Ebraica: „râul” (ieori, singular); Septuaginta: „râurile” (οἱ ποταμοί, plural).'), J('ἐγώ', 'ἐγὼ', 'eu'), J('ποιέω', 'ἐποίησα', 'a face', 'Ebraica: „m-am creat” (asitini); Septuaginta: „le-am făcut” (ἐποίησα αὐτούς).')];
S['29:4'] = [J('δίδωμι', 'δώσω', 'a da, a pune'), J('παγίς', 'παγίδας', 'lațuri', 'Ebraica: „cârlige” (hahim); Septuaginta: „lațuri” (παγίδας).'), J('σιαγών', 'σιαγόνας', 'falcă'), J('ἰχθύς', 'ἰχθῦς', 'pește'), J('ποταμός', 'ποταμοῦ', 'râu'),
  J('προσκολλάω', 'προσκολλήσω', 'a lipi'), J('πτέρυξ', 'πτέρυγάς', 'aripioară', 'Ebraica: „solzi” (kaskesot); Septuaginta: „aripioare” (πτέρυγάς).'), J('ἀνάγω', 'ἀνάξω', 'a scoate'),
  J('μέσος', 'ἐκ/μέσου/ποταμοῦ', 'din mijlocul râului'), J('ἰχθύς', 'πάντας/ἰχθύας', 'toți peștii'), J('ποταμός', 'ποταμοῦ', 'râu'), Z('Septuaginta nu repetă „ți se vor lipi” (tidbak).'), Z('Septuaginta nu repetă „solzi”.')];
S['29:5'] = [J('καταβάλλω', 'καταβαλῶ', 'a doborî'), J('τάχος', 'ἐν/τάχει', 'repede', 'Ebraica: „deșert” (hamidbara); Septuaginta: „repede” (ἐν τάχει).'), J('ἰχθύς', 'πάντας/ἰχθύας', 'toți peștii'), J('ποταμός', 'ποταμοῦ', 'râu'),
  J('πεδίον', 'ἐπὶ/πρόσωπον/τοῦ/πεδίου', 'fața câmpiei'), J('πίπτω', 'πεσῇ', 'a cădea'), J('συνάγω', 'συναχθῇς', 'a fi adunat'), J('περιστέλλω', 'περισταλῇς', 'a fi înfășurat', 'Ebraica: „adunat” (tikavets); Septuaginta: „înfășurat” (περισταλῇς), pentru îngropare.'),
  J('θηρίον', 'τοῖς/θηρίοις/τῆς/γῆς', 'fiarele pământului'), J('πετεινόν', 'τοῖς/πετεινοῖς/τοῦ/οὐρανοῦ', 'păsările cerului'), J('δίδωμι', 'δέδωκά', 'a da'), J('κατάβρωμα', 'κατάβρωμα', 'hrană, mâncare')];
S['29:6'] = [J('κατοικέω', 'πάντες/οἱ/κατοικοῦντες', 'toți locuitorii'), J('Αἴγυπτος', 'Αἴγυπτον', 'Egipt'), J('γινώσκω', 'γνώσονται', 'a cunoaște'), J('ἐγώ', 'ἐγώ', 'eu'), J('κύριος', 'Κύριος', 'Domn; DOMNUL'), J('γίνομαι', 'ἐγενήθης', 'a fi'),
  J('ῥάβδος', 'ῥάβδος', 'toiag', 'Ebraica: „sprijin” (mișenet); Septuaginta: „toiag” (ῥάβδος).'), J('καλάμινος', 'καλαμίνη', 'de trestie'), J('οἶκος', 'τῷ/οἴκῳ/Ἰσραήλ', 'casa lui Israel')];
S['29:7'] = [J('ἐπιλαμβάνομαι', 'ἐπελάβοντό', 'a apuca'), J('χείρ', 'χειρὶ', 'mână'), J('θλάω', 'ἐθλάσθης', 'a fi frânt'), J('συγκλάω', 'συνέκλασας', 'a frânge', 'Ebraica: „le vei străpunge” (uvakata); Septuaginta: „le-ai frânt” (συνέκλασας).'),
  J('χείρ', 'πᾶσα/χεὶρ', 'toată mâna', 'Ebraica: „orice umăr” (kol katef); Septuaginta: „toată mâna” (πᾶσα χεὶρ).'), J('ἐπαναπαύομαι', 'ἐπανεπαύσαντο', 'a se sprijini'), J('συντρίβω', 'συνετρίβης', 'a fi zdrobit'),
  J('ὀσφύς', 'πᾶσαν/ὀσφύν', 'tot mijlocul'), Z('Septuaginta nu are „să stea drept” (vehaamadta).')];
S['29:8'] = [J('διά', 'διὰ/τοῦτο', 'de aceea'), J('ὅδε', 'τάδε', 'așa'), J('λέγω', 'λέγει', 'a spune'), J('κύριος', 'κύριος', 'Domn; DOMNUL', 'Ebraica: „Stăpânul meu, Domnul DUMNEZEU” (Adonai YHWH); Septuaginta: „Domnul” (κύριος).'),
  J('ἐπάγω', 'ἐπάγω', 'a aduce asupra'), J('ῥομφαία', 'ῥομφαίαν', 'sabie'), J('ἀπόλλυμι', 'ἀπολῶ', 'a nimici'), J('ἄνθρωπος', 'ἀνθρώπους', 'om'), J('κτῆνος', 'κτήνη', 'dobitoc')];
S['29:9'] = [J('γῆ', 'γῆ', 'țară'), J('Αἴγυπτος', 'Αἰγύπτου', 'Egipt'), J('εἰμί', 'ἔσται', 'a fi'), J('ἀπώλεια', 'ἀπώλεια', 'pieire', 'Ebraica: „pustietate” (șemama); Septuaginta: „pieire” (ἀπώλεια).'),
  J('ἔρημος', 'ἔρημος', 'pustiu', 'Ebraica: „ruină” (horba); Septuaginta: „pustiu” (ἔρημος).'), J('γινώσκω', 'γνώσονται', 'a cunoaște'), J('ἐγώ', 'ἐγώ', 'eu'), J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('λέγω', 'λέγειν', 'a spune'),
  J('ποταμός', 'οἱ/ποταμοὶ', 'râuri', 'Ebraica: „râul” (ieor, singular); Septuaginta: „râurile” (οἱ ποταμοὶ, plural).'), J('ἐγώ', 'ἐγὼ', 'eu'), J('ποιέω', 'ἐποίησα', 'a face')];
S['29:10'] = [J('διά', 'διὰ/τοῦτο', 'de aceea'), J('ποταμός', 'ποταμούς', 'râu'), J('δίδωμι', 'δώσω', 'a da, a preface'), J('γῆ', 'γῆν', 'țară'), J('Αἴγυπτος', 'Αἰγύπτου', 'Egipt'),
  J('ἔρημος', 'ἔρημον', 'pustiu', 'Ebraica: „ruină” (leharvot); Septuaginta: „pustiu” (ἔρημον).'), J('ῥομφαία', 'ρομφαίαν', 'sabie', 'Ebraica: „pustietate” (horev, joc de cuvinte cu „sabie” — hereb); Septuaginta: „sabie” (ρομφαίαν).'),
  J('ἀπώλεια', 'ἀπώλειαν', 'pieire', 'Ebraica: „dezolantă” (șemama); Septuaginta: „pieire” (ἀπώλειαν).'), J('Μάγδωλος', 'ἀπὸ/Μαγδώλου/καὶ/Συήνης', 'Magdol și Siene'), J('ὅριον', 'ὁρίων', 'hotar'), J('Αἰθίοψ', 'Αἰθιόπων', 'Etiopia', 'Ebraica: „Cuș” (kuș); Septuaginta: „etiopieni” (Αἰθιόπων).')];
S['29:11'] = [J('διέρχομαι', 'διέλθῃ', 'a trece'), J('πούς', 'ποὺς', 'picior'), J('ἄνθρωπος', 'ἀνθρώπου', 'om'), J('πούς', 'ποὺς', 'picior'), J('κτῆνος', 'κτήνους', 'dobitoc'), J('διέρχομαι', 'διέλθῃ', 'a trece'),
  J('κατοικέω', 'κατοικηθήσεται', 'a fi locuit'), J('τεσσαράκοντα', 'τεσσαράκοντα/ἔτη', 'patruzeci de ani')];
S['29:12'] = [J('δίδωμι', 'δώσω', 'a da'), J('γῆ', 'γῆν', 'țară'), Z('Septuaginta nu are „Egiptului” aici; are „țara ei” (τὴν γῆν αὐτῆς).'), J('ἀπώλεια', 'ἀπώλειαν', 'pieire', 'Ebraica: „pustiită” (șemama); Septuaginta: „pieire” (ἀπώλειαν).'),
  J('μέσος', 'ἐν/μέσῳ', 'în mijloc'), J('γῆ', 'γῆς', 'țară'), J('ἐρημόω', 'ἠρημωμένης', 'a fi pustiit'), J('πόλις', 'πόλεις', 'cetate'), J('εἰμί', 'ἔσονται', 'a fi'), J('μέσος', 'ἐν/μέσῳ', 'în mijloc'),
  J('πόλις', 'πόλεων/ἠρημωμένων', 'cetăți pustiite'), Z('Septuaginta nu repetă „pustiită va rămâne”.'), J('τεσσαράκοντα', 'τεσσαράκοντα/ἔτη', 'patruzeci de ani'), J('διασπείρω', 'διασπερῶ', 'a risipi'),
  J('Αἴγυπτος', 'Αἴγυπτον', 'Egipt'), J('ἔθνος', 'ἔθνεσιν', 'neam'), J('λικμάω', 'λικμήσω', 'a vântura', 'Ebraica: „îi voi risipi” (vezeritim); Septuaginta: „îi voi vântura” (λικμήσω).'), J('χώρα', 'χώρας', 'țară')];
S['29:13'] = [J('ὅδε', 'τάδε', 'așa'), J('λέγω', 'λέγει', 'a spune'), J('κύριος', 'κύριος', 'Domn; DOMNUL', 'Ebraica: „Stăpânul meu, Domnul DUMNEZEU” (Adonai YHWH); Septuaginta: „Domnul” (κύριος).'),
  J('μετά', 'μετὰ', 'după', 'Ebraica: „la capătul” (mikets); Septuaginta: „după” (μετὰ).'), J('τεσσαράκοντα', 'τεσσαράκοντα/ἔτη', 'patruzeci de ani'), J('συνάγω', 'συνάξω', 'a aduna'), J('Αἰγύπτιος', 'Αἰγυπτίους', 'egiptean'),
  J('ἔθνος', 'ἐθνῶν', 'neam', 'Ebraica: „popoarele” (haamim); Septuaginta: „neamurile” (ἐθνῶν).'), J('ἐκεῖ', 'ἐκεῖ', 'acolo'), J('διασκορπίζω', 'διεσκορπίσθησαν', 'a împrăștia')];
S['29:14'] = [J('ἀποστρέφω', 'ἀποστρέψω', 'a întoarce'), J('αἰχμαλωσία', 'αἰχμαλωσίαν', 'captivitate'), J('Αἰγύπτιος', 'Αἰγυπτίων', 'egiptean'), J('κατοικίζω', 'κατοικίσω', 'a așeza', 'Ebraica: „îi voi aduce înapoi” (vahașivoti); Septuaginta: „îi voi așeza” (κατοικίσω).'),
  J('Παθουρής', 'Παθουρης', 'Patros', 'Ebraica: „Patros”; Septuaginta: „Fathores” (Παθουρης).'), J('γῆ', 'ἐν/τῇ/γῇ/ὅθεν/ἐλήμφθησαν', 'țara de unde au fost luați', 'Ebraica: „țara sălașluirilor lor” (mehuratam); Septuaginta: „țara de unde au fost luați” (ὅθεν ἐλήμφθησαν).'),
  J('εἰμί', 'ἔσται', 'a fi'), Z('Septuaginta nu are „acolo” (șam).'), J('ἀρχή', 'ἀρχὴ', 'stăpânire'), J('ταπεινός', 'ταπεινή', 'smerit')];
S['29:15'] = [J('ἀρχή', 'παρὰ/πάσας/τὰς/ἀρχάς', 'mai presus de toate stăpânirile', 'Ebraica: „dintre regate” (min hamamlahot); Septuaginta: „mai [smerită] decât toate stăpânirile” (παρὰ πάσας τὰς ἀρχάς).'),
  Z('Septuaginta nu are „va fi” (tihie) aici; „smerită” stă în v. 14.'), Z('Septuaginta nu are „neînsemnat” (șefala) în acest verset; apare ca „smerită” în v. 14.'), J('ὑψόω', 'ὑψωθῇ', 'a se înălța'), J('ἔτι', 'ἔτι', 'încă'),
  J('ἔθνος', 'ἔθνη', 'neam'), J('ὀλιγοστός', 'ὀλιγοστοὺς', 'puțini'), J('πλείων', 'πλείονας', 'mai mulți', 'Ebraica: „să mai domine” (redot); Septuaginta: „să fie mai mulți” (πλείονας).'), J('ἔθνος', 'ἔθνεσιν', 'neam')];
S['29:16'] = [J('εἰμί', 'οὐκέτι/ἔσονται', 'nu vor mai fi'), J('ἐλπίς', 'ἐλπίδα', 'nădejde', 'Ebraica: „sprijin” (mivtah); Septuaginta: „nădejde” (ἐλπίδα).'), J('οἶκος', 'τῷ/οἴκῳ/Ισραηλ', 'casa lui Israel'),
  J('ἀναμιμνῄσκω', 'ἀναμιμνῄσκουσαν', 'a aduce aminte'), J('ἀνομία', 'ἀνομίαν', 'fărădelege'), J('ἀκολουθέω', 'ἀκολουθῆσαι', 'a urma', 'Ebraica: „se întorceau” (bifnotam); Septuaginta: „a umbla după” (ἀκολουθῆσαι ὀπίσω αὐτῶν).'),
  J('γινώσκω', 'γνώσονται', 'a cunoaște'), J('ἐγώ', 'ἐγώ', 'eu'), J('κύριος', 'κύριος', 'Domn; DOMNUL', 'Ebraica: „Stăpânul, Domnul DUMNEZEU” (Adonai YHWH); Septuaginta: „Domnul” (κύριος).')];
S['29:17'] = [J('γίνομαι', 'ἐγένετο', 'a fi'), J('ἔτος', 'ἔτει', 'an'), J('ἕβδομος', 'ἑβδόμῳ/εἰκοστῷ', 'al douăzeci și șaptelea'), J('πρῶτος', 'πρώτου', 'primul'), J('εἷς', 'μιᾷ', 'una, prima'), J('μήν', 'μηνός', 'lună'),
  J('γίνομαι', 'ἐγένετο', 'a fi'), J('λόγος', 'λόγος', 'cuvânt'), J('κύριος', 'Κυρίου', 'Domn; DOMNUL'), J('λέγω', 'λέγων', 'a spune')];
S['29:18'] = [J('υἱὸς ἀνθρώπου', 'υἱὲ/ἀνθρώπου', 'fiul omului'), J('Ναβουχοδονοσόρ', 'Ναβουχοδονοσορ', 'Nabucodonosor'), J('βασιλεύς', 'βασιλεὺς', 'rege'), J('Βαβυλών', 'Βαβυλῶνος', 'Babilon'),
  J('καταδουλόω', 'κατεδουλώσατο', 'a supune la muncă', 'Ebraica: „și-a pus” (heevid, „a pus la muncă”); Septuaginta: „a supus la robie” (κατεδουλώσατο).'), J('δύναμις', 'δύναμιν', 'oaste, putere'),
  J('δουλεία', 'δουλείᾳ', 'robie, muncă', 'Ebraica: „un lucru” (avoda); Septuaginta: „robie” (δουλείᾳ).'), J('μέγας', 'μεγάλῃ', 'mare'), J('Τύρος', 'Τύρου', 'Tir'), J('κεφαλή', 'πᾶσα/κεφαλὴ', 'tot capul'),
  J('φαλακρός', 'φαλακρὰ', 'chel'), J('ὦμος', 'πᾶς/ὦμος', 'tot umărul'), J('μαδάω', 'μαδῶν', 'jupuit, golit', 'Ebraica: „zdrelit” (meruța); Septuaginta: „jupuit” (μαδῶν).'),
  J('δύναμις', 'δυνάμει', 'oaste'), J('γίνομαι', 'οὐκ/ἐγενήθη', 'nu a fost'), J('μισθός', 'μισθὸς', 'răsplată'), J('Τύρος', 'Τύρου', 'Tir'), J('δουλεία', 'δουλείας', 'robie'), J('δουλεύω', 'ἐδούλευσαν', 'a sluji')];
S['29:19'] = [Z('Septuaginta nu are „de aceea” (lahen).'), J('λέγω', 'λέγει', 'a spune'), J('κύριος', 'κύριος/κύριος', 'Domnul Domnul', AD), J('δίδωμι', 'δίδωμι', 'a da'), J('γῆ', 'γῆν', 'țară'), J('Αἴγυπτος', 'Αἰγύπτου', 'Egipt'),
  J('Ναβουχοδονοσόρ', 'Ναβουχοδονοσορ', 'Nabucodonosor'), J('βασιλεύς', 'βασιλεῖ', 'rege'), J('Βαβυλών', 'Βαβυλῶνος', 'Babilon'), Z('Septuaginta nu are „îi va duce” (venasa).'), Z('Septuaginta nu are „populația” (hamona).'),
  J('προνομεύω', 'προνομεύσει', 'a prăda', 'Ebraica: „va lua pradă” (veșalal); Septuaginta: „va prăda prada ei” (προνομεύσει τὴν προνομήν).'), J('προνομή', 'προνομὴν', 'pradă'), J('σκυλεύω', 'σκυλεύσει', 'a jefui'), J('σκῦλον', 'σκῦλα', 'jaf, pradă'),
  J('εἰμί', 'ἔσται', 'a fi'), J('μισθός', 'μισθὸς', 'răsplată'), J('δύναμις', 'δυνάμει', 'oaste')];
S['29:20'] = [J('λειτουργία', 'λειτουργίας', 'slujire', 'Ebraica: „lucrarea sa” (peulato); Septuaginta: „slujirea lui” (λειτουργίας).'), J('δουλεύω', 'ἐδούλευσεν', 'a sluji'), J('δίδωμι', 'δέδωκα', 'a da'), J('γῆ', 'γῆν', 'țară'),
  J('Αἴγυπτος', 'Αἰγύπτου', 'Egipt'), Z('Septuaginta nu are „pentru ceea ce au făcut pentru Mine” (așer asu li).'), J('λέγω', 'λέγει', 'a spune', 'Ebraica: „rostirea” (neum); Septuaginta: „așa zice” (τάδε λέγει).'),
  J('κύριος', 'Κύριος/Κύριος', 'Domnul Domnul', AD)];
S['29:21'] = [J('ἡμέρα', 'ἡμέρᾳ/ἐκείνῃ', 'în ziua aceea'), J('ἀνατέλλω', 'ἀνατελεῖ', 'a răsări'), J('κέρας', 'κέρας', 'corn', 'Ebraica: „puterea” (keren, „corn”); Septuaginta: „corn” (κέρας).'), J('οἶκος', 'παντὶ/τῷ/οἴκῳ/Ἰσραήλ', 'toată casa lui Israel'),
  J('στόμα', 'δώσω/στόμα/ἀνεῳγμένον', 'gură deschisă', 'Ebraica: „te voi răzbuna” / „îți voi da deschiderea gurii” (etén pițhon pe); Septuaginta: „îți voi da gură deschisă” (σοὶ δώσω στόμα ἀνεῳγμένον).'),
  J('μέσος', 'ἐν/μέσῳ/αὐτῶν', 'în mijlocul lor'), J('γινώσκω', 'γνώσονται', 'a cunoaște'), J('ἐγώ', 'ἐγώ', 'eu'), J('κύριος', 'Κύριος', 'Domn; DOMNUL')];
module.exports = S;
