// Noah — Isaia 54:1-55:5 (Rahlfs) — LXX pentru FIECARE tag (mod total)
const J = (g, f, def, df) => g + '¦' + f + '¦' + def + (df ? '¦' + df : '');
const Z = df => '0' + (df ? '¦' + df : '');
const S = { __tot: true };
S['54:1'] = [J('εὐφραίνω', 'εὐφράνθητι', 'a se veseli'), J('στεῖρα', 'στεῖρα', 'stearpă'), J('τίκτω', 'οὐ/τίκτουσα', 'care nu naște'), J('ῥήγνυμι', 'ῥῆξον', 'a izbucni'),
  Z('Septuaginta nu are „strigăt de bucurie” (rina) ca substantiv separat.'), J('βοάω', 'βόησον', 'a striga', 'Ebraica: „fii veselă” (vețahali); Septuaginta: „strigă” (βόησον).'), J('ὠδίνω', 'οὐκ/ὠδίνουσα', 'care nu are dureri de naștere'),
  J('τέκνον', 'τὰ/τέκνα', 'copii'), J('ἔρημος', 'τῆς/ἐρήμου', 'pustie', 'Ebraica: „părăsite” (șomema); Septuaginta: „pustie” (τῆς ἐρήμου).'), J('πολύς', 'πολλὰ/μᾶλλον', 'mulți, mai mulți'),
  Z('Septuaginta nu repetă „copiii” (mibnei).'), J('ἔχω', 'τῆς/ἐχούσης/τὸν/ἄνδρα', 'cea care are bărbat', 'Ebraica: „locuite” (beula, „măritate”); Septuaginta: „cea care are bărbat” (τῆς ἐχούσης τὸν ἄνδρα).'),
  J('λέγω', 'εἶπεν', 'a spune'), J('κύριος', 'κύριος', 'Domn; DOMNUL')];
S['54:2'] = [J('πλατύνω', 'πλάτυνον', 'a lărgi'), J('τόπος', 'τόπον', 'loc'), J('σκηνή', 'τῆς/σκηνῆς', 'cort'), J('πήγνυμι', 'πῆξον', 'a fixa, a înțepeni'), J('αὐλαία', 'αὐλαιῶν', 'perdea'),
  Z('Septuaginta nu are „locuințelor” (mișkenotayikh) ca termen separat; „perdelele” (αὐλαιῶν) apar o singură dată.'), J('φείδομαι', 'μὴ/φείσῃ', 'a se cruța'), J('μακρύνω', 'μάκρυνον', 'a lungi'),
  J('σχοίνισμα', 'σχοινίσματά', 'funie de măsurat'), J('κατισχύω', 'κατίσχυσον', 'a întări'), J('πάσσαλος', 'πασσάλους', 'țăruș')];
S['54:3'] = [J('δεξιός', 'τὰ/δεξιὰ', 'dreapta'), J('ἀριστερός', 'τὰ/ἀριστερὰ', 'stânga'), J('ἐκπετάννυμι', 'ἐκπέτασον', 'a întinde', 'Ebraica: „te vei întinde” (viitor); Septuaginta: „întinde-te” (ἐκπέτασον), imperativ.'),
  J('σπέρμα', 'σπέρμα', 'sămânță'), J('κληρονομέω', 'κληρονομήσει', 'a moșteni'), J('ἔθνος', 'ἔθνη', 'neam'), J('κατοικίζω', 'κατοικιεῖς', 'a așeza', 'Ebraica: „vor locui” (ioșivu); Septuaginta: „vei așeza” (κατοικιεῖς), la persoana a doua.'),
  J('πόλις', 'πόλεις', 'cetate'), J('ἐρημόω', 'ἠρημωμένας', 'a pustii')];
S['54:4'] = [J('φοβέομαι', 'μὴ/φοβοῦ', 'a se teme'), J('καταισχύνω', 'κατῃσχύνθης', 'a se rușina', 'Ebraica: „nu vei fi rușinat” (viitor); Septuaginta: „ai fost rușinat” (κατῃσχύνθης), trecut.'), J('ἐντρέπω', 'ἐντραπῇς', 'a se umili'),
  J('ὀνειδίζω', 'ὠνειδίσθης', 'a fi ocărât', 'Ebraica: „nu vei fi înjosit” (viitor); Septuaginta: „ai fost ocărât” (ὠνειδίσθης), trecut.'), J('αἰσχύνη', 'αἰσχύνην', 'rușine'),
  J('αἰώνιος', 'αἰώνιον', 'veșnic', 'Ebraica: „tinereții tale” (alumayikh); Septuaginta: „veșnică” (αἰσχύνην αἰώνιον).'), J('ἐπιλανθάνομαι', 'ἐπιλήσῃ', 'a uita'), J('ὄνειδος', 'ὄνειδος', 'ocară'),
  J('χηρεία', 'τῆς/χηρείας', 'văduvie'), J('μιμνήσκομαι', 'οὐ/μὴ/μνησθήσῃ', 'a-și aminti')];
S['54:5'] = [Z('Septuaginta nu are „stăpânul tău” (boalayikh); are „Domnul, Cel ce te-a făcut”.'), J('ποιέω', 'ὁ/ποιῶν/σε', 'cel ce te-a făcut'), J('κύριος σαβαώθ', 'Κύριος/σαβαὼθ', 'Domnul Savaot', 'Ebraica: „DOMNUL Oștirilor”; Septuaginta păstrează „Savaot” transliterat (σαβαὼθ).'),
  J('ὄνομα', 'ὄνομα', 'nume'), J('ῥύομαι', 'ῥυσάμενός', 'a scăpa, a izbăvi'), Z('Septuaginta nu are „Sfântul” (kedoș) în acest verset; are „Dumnezeu al lui Israel”.'), J('Ἰσραήλ', 'Ἰσραήλ', 'Israel'),
  J('θεός', 'Θεὸς', 'Dumnezeu'), J('γῆ', 'πάσῃ/τῇ/γῇ', 'întreg pământul'), J('καλέω', 'κληθήσεται', 'a fi chemat')];
S['54:6'] = [J('γυνή', 'γυναῖκα', 'femeie', 'Septuaginta pune versetul la negativ: „nu ca pe o femeie părăsită … te-a chemat Domnul” (οὐχ ὡς γυναῖκα … κέκληκέν σε κύριος).'), J('καταλείπω', 'καταλελειμμένην', 'a părăsi'),
  J('ὀλιγόψυχος', 'ὀλιγόψυχον', 'slab la suflet', 'Ebraica: „duhul” (ruah) „întristat” (atsuvat); Septuaginta: „slab la suflet” (ὀλιγόψυχον), într-un singur cuvânt.'), Z('Septuaginta nu are „întristat” (atsuvat) separat; „slab la suflet” (ὀλιγόψυχον) acoperă ambele cuvinte.'),
  J('κύριος', 'κύριος', 'Domn; DOMNUL'), J('καλέω', 'κέκληκέν', 'a chema', 'Ebraica: „te va chema” (viitor); Septuaginta: „te-a chemat” (κέκληκέν), perfect.'), J('γυνή', 'γυναῖκα', 'femeie'), J('νεότης', 'νεότητος', 'tinerețe'),
  J('μισέω', 'μεμισημένην', 'a urî', 'Ebraica: „izgonită” (timaes, „respinsă”); Septuaginta: „urâtă” (μεμισημένην).'), J('λέγω', 'εἶπεν', 'a spune'), J('θεός', 'ὁ/θεός', 'Dumnezeu')];
S['54:7'] = [J('χρόνος', 'χρόνον/μικρὸν', 'timp scurt', 'Ebraica: „o clipă” (bereg katon); Septuaginta: „timp scurt” (χρόνον μικρόν).'), J('καταλείπω', 'κατέλιπόν', 'a părăsi'), J('ἔλεος', 'ἐλέους', 'milă'), J('μέγας', 'μεγάλου', 'mare'),
  J('ἐλεέω', 'ἐλεήσω', 'a milui', 'Ebraica: „te voi aduna” (akabtsekh); Septuaginta: „te voi milui” (ἐλεήσω).')];
S['54:8'] = [J('θυμός', 'θυμῷ', 'mânie'), J('μικρός', 'μικρῷ', 'mic'), J('ἀποστρέφω', 'ἀπέστρεψα', 'a întoarce', 'Ebraica: „Mi-am ascuns” (histarti); Septuaginta: „am întors” (ἀπέστρεψα), fața.'), J('πρόσωπον', 'πρόσωπόν', 'față'),
  J('ἔλεος', 'ἐλέει/αἰωνίῳ', 'milă veșnică'), J('ἐλεέω', 'ἐλεήσω', 'a milui'), J('λέγω', 'εἶπεν', 'a spune'), J('ῥύομαι', 'ῥυσάμενός', 'a izbăvi'), J('κύριος', 'Κύριος', 'Domn; DOMNUL')];
S['54:9'] = [J('ὕδωρ', 'ὕδατος', 'apă'), J('Νῶε', 'Νῶε', 'Noe'), J('οὗτος', 'τοῦτό', 'acesta'), J('ὄμνυμι', 'ὤμοσα', 'a jura'), Z('Septuaginta nu are „să treacă” (mēavor).'), J('ἔτι', 'ἔτι', 'încă, mai'),
  Z('Septuaginta nu repetă „apele lui Noe”.'), J('γῆ', 'τῇ/γῇ', 'pământ'), Z('Septuaginta nu are „așa” (ken).'), Z('Septuaginta are „am jurat” o singură dată (ὤμοσα).'), J('θυμόω', 'θυμωθήσεσθαι', 'a se mânia'),
  J('ἀπειλή', 'ἐν/ἀπειλῇ', 'amenințare', 'Ebraica: „te mai cert” (umigar, „a mustra”); Septuaginta: „în amenințare” (ἐν ἀπειλῇ σου).')];
S['54:10'] = [J('ὄρος', 'τὰ/ὄρη', 'munte'), J('μεθίστημι', 'μεταστήσεσθαι', 'a se muta'), J('βουνός', 'βουνοί', 'deal'), J('μετακινέω', 'μετακινηθήσονται', 'a se clinti'), J('ἔλεος', 'ἔλεος', 'milă'),
  J('ἐκλείπω', 'ἐκλείψει', 'a lipsi', 'Ebraica: „se va îndepărta” (iamuș); Septuaginta: „va lipsi” (ἐκλείψει).'), J('διαθήκη', 'διαθήκη', 'legământ'), J('εἰρήνη', 'τῆς/εἰρήνης', 'pace'), J('μεθίστημι', 'οὐ/μὴ/μεταστῇ', 'a se muta'),
  J('λέγω', 'εἶπεν', 'a spune'), J('ἵλεως', 'ἵλεώς', 'milostiv', 'Ebraica: „Cel ce îți arată milă” (merahamekh); Septuaginta: „milostiv îți sunt” (ἵλεώς σοι).'), J('κύριος', 'κύριος', 'Domn; DOMNUL')];
S['54:11'] = [J('ταπεινός', 'Ταπεινὴ', 'smerit'), J('ἀκατάστατος', 'ἀκατάστατος', 'neașezat, zbuciumat'), J('παρακαλέω', 'οὐ/παρεκλήθης', 'a fi mângâiat'), J('ἐγώ', 'ἐγώ', 'eu'),
  J('ἑτοιμάζω', 'ἑτοιμάζω', 'a pregăti', 'Ebraica: „voi pune” (marbits, „a culca”); Septuaginta: „pregătesc” (ἑτοιμάζω).'), J('λίθος', 'τὸν/λίθον', 'piatră'),
  J('ἄνθραξ', 'ἄνθρακα', 'cărbune, rubin', 'Ebraica: „perle” (bapuh, „în antimoniu”); Septuaginta: „cărbune” (ἄνθρακα), piatră roșie.'), J('σάπφειρος', 'σάπφειρον', 'safir'), J('θεμέλιον', 'θεμέλιά', 'temelie')];
S['54:12'] = [J('τίθημι', 'θήσω', 'a pune'), J('ἴασπις', 'Ἴασπιν', 'iaspis', 'Ebraica: kadkod, piatră scumpă redată de obicei „rubin”; Septuaginta: ἴασπις, „iaspis”, o piatră cu alt nume și altă culoare.'), J('ἔπαλξις', 'ἐπάλξεις', 'creneluri'), J('πύλη', 'πύλας', 'poartă'),
  J('κρύσταλλος', 'λίθους/κρυστάλλου', 'pietre de cristal', 'Ebraica: „pietre de carbuncul” (avnei ekdah); Septuaginta: „pietre de cristal” (λίθους κρυστάλλου).'), J('περίβολος', 'περίβολόν', 'zid de împrejmuire'), J('ἐκλεκτός', 'λίθους/ἐκλεκτούς', 'pietre alese')];
S['54:13'] = [J('υἱός', 'πάντας/τοὺς/υἱούς', 'toți fiii'), J('διδακτός', 'διδακτοὺς', 'învățați'), J('θεός', 'Θεοῦ', 'Dumnezeu', 'Ebraica: „DOMNULUI” (YHWH); Septuaginta: „ai lui Dumnezeu” (Θεοῦ).'), J('πολύς', 'ἐν/πολλῇ', 'multă'), J('εἰρήνη', 'εἰρήνῃ', 'pace'), J('τέκνον', 'τὰ/τέκνα', 'copii')];
S['54:14'] = [J('δικαιοσύνη', 'δικαιοσύνῃ', 'dreptate'), J('οἰκοδομέω', 'οἰκοδομηθήσῃ', 'a fi zidit'), J('ἀπέχω', 'ἀπέχου', 'a se ține departe'), J('ἄδικος', 'ἀδίκου', 'nedrept', 'Ebraica: „oprimare” (oșek); Septuaginta: „nedreptate” (ἀδίκου).'),
  J('φοβέομαι', 'οὐ/φοβηθήσῃ', 'a se teme'), J('τρόμος', 'τρόμος', 'tremur, spaimă'), J('ἐγγίζω', 'οὐκ/ἐγγιεῖ', 'a se apropia')];
S['54:15'] = [J('προσήλυτος', 'προσήλυτοι', 'prozelit', 'Ebraica: „cineva trebuie să se teamă” (gor iagur, „a se aduna, a locui ca străin”); Septuaginta: „prozeliții” (προσήλυτοι).'),
  Z('Septuaginta nu are „nimic” (efes).'), J('προσέρχομαι', 'προσελεύσονταί', 'a veni la', 'Ebraica: „te va înfrunta” (gar itakh); Septuaginta: „vor veni la tine” (προσελεύσονταί σοι).'),
  J('καταφεύγω', 'καταφεύξονται', 'a-și căuta scăpare', 'Ebraica: „îți va cădea înainte” (ipol); Septuaginta: „își vor căuta scăpare” (ἐπὶ σὲ καταφεύξονται).')];
S['54:16'] = [J('ἐγώ', 'ἐγώ', 'eu'), J('κτίζω', 'κτίζω', 'a crea', 'Ebraica: „am creat” (barati, trecut); Septuaginta: „creez” (κτίζω σε), prezent, cu obiectul „te”.'), J('χαλκεύς', 'χαλκεὺς', 'făurar'), J('φυσάω', 'φυσῶν', 'a sufla'),
  Z('Septuaginta nu are „în foc” (beesh) separat.'), J('ἄνθραξ', 'ἄνθρακας', 'cărbuni'), J('ἐκφέρω', 'ἐκφέρων', 'a scoate'), J('σκεῦος', 'σκεῦος', 'unealtă'), J('ἔργον', 'εἰς/ἔργον', 'pentru lucru'),
  J('ἐγώ', 'ἐγὼ', 'eu'), J('κτίζω', 'ἔκτισά', 'a crea'), J('ἀπώλεια', 'εἰς/ἀπώλειαν', 'spre pieire', 'Ebraica: „distrugătorul” (mașhit); Septuaginta: „spre pieire” (εἰς ἀπώλειαν).'), J('φθείρω', 'φθεῖραι', 'a distruge')];
S['54:17'] = [J('σκεῦος', 'πᾶν/σκεῦος', 'orice unealtă'), J('φθαρτός', 'φθαρτόν', 'pieritor', 'Ebraica: „ascuțită” (iuțar, „făcută”); Septuaginta: „pieritoare” (φθαρτόν).'),
  J('εὐοδόω', 'οὐκ/εὐοδώσω', 'a face să izbândească', 'Ebraica: „nu va izbândi” (3 sg.); Septuaginta: „nu o voi lăsa să izbândească” (εὐοδώσω), persoana I.'), J('φωνή', 'πᾶσα/φωνὴ', 'orice glas', 'Ebraica: „orice limbă” (kol lașon); Septuaginta: „orice glas” (πᾶσα φωνή).'),
  J('ἀνίστημι', 'ἀναστήσεται', 'a se ridica'), J('κρίσις', 'εἰς/κρίσιν', 'la judecată'), J('ἡττάω', 'ἡττήσεις', 'a birui', 'Ebraica: „o voi condamna” (tarșii); Septuaginta: „vei birui” (ἡττήσεις), „pe toți îi vei birui”.'),
  Z('Septuaginta nu are „aceasta” (zot) separat.'), J('κληρονομία', 'κληρονομία', 'moștenire'), J('θεραπεύω', 'τοῖς/θεραπεύουσιν', 'cei ce slujesc', 'Ebraica: „slujitorilor” (avdei, substantiv); Septuaginta: „celor ce slujesc” (θεραπεύουσιν), participiu.'),
  J('κύριος', 'κύριον', 'Domn; DOMNUL'), J('δίκαιος', 'ἔσεσθέ/μοι/δίκαιοι', 'drepți', 'Ebraica: „dreptatea lor vine de la Mine”; Septuaginta: „voi Îmi veți fi drepți” (ὑμεῖς ἔσεσθέ μοι δίκαιοι).'), J('λέγω', 'λέγει', 'a spune'), J('κύριος', 'κύριος', 'Domn; DOMNUL')];
S['55:1'] = [J('διψάω', 'οἱ/διψῶντες', 'cei însetați'), J('πορεύομαι', 'πορεύεσθε', 'a merge'), J('ὕδωρ', 'ὕδωρ', 'apă'), J('ἀργύριον', 'ἀργύριον', 'argint'), J('βαδίζω', 'βαδίσαντες', 'a merge'), J('ἀγοράζω', 'ἀγοράσατε', 'a cumpăra'),
  J('πίνω', 'πίετε', 'a bea', 'Ebraica: „mâncați” (ukhlu); Septuaginta: „beți” (πίετε).'), Z('Septuaginta nu repetă „să cumpărați”.'), J('ἀργύριον', 'ἀργυρίου', 'argint'), J('τιμή', 'τιμῆς', 'preț'), J('οἶνος', 'οἴνου', 'vin'),
  J('στέαρ', 'στέαρ', 'grăsime', 'Ebraica: halav, „lapte”; Septuaginta: στέαρ, „grăsime”, cuvânt grecesc folosit și pentru grăsimea jertfelor.')];
S['55:2'] = [J('τιμάω', 'τιμᾶσθε', 'a prețui'), J('ἀργύριον', 'ἀργυρίου', 'argint'), Z('Septuaginta nu are „pâine” (lehem).'), J('μόχθος', 'μόχθον', 'osteneală'), J('πλησμονή', 'οὐκ/εἰς/πλησμονήν', 'spre săturare'),
  J('ἀκούω', 'ἀκούσατέ', 'a asculta'), Z('Septuaginta nu are „atent” (șamoa, infinitiv absolut).'), J('ἐσθίω', 'φάγεσθε', 'a mânca'), J('ἀγαθός', 'ἀγαθά', 'bun'), J('ψυχή', 'ψυχὴ', 'suflet'), J('ἐντρυφάω', 'ἐντρυφήσει', 'a se desfăta'),
  J('ἀγαθός', 'ἐν/ἀγαθοῖς', 'întru cele bune', 'Ebraica: „plenitudine” (deșen, „grăsime”); Septuaginta: „întru cele bune” (ἐν ἀγαθοῖς).')];
S['55:3'] = [J('προσέχω', 'προσέχετε', 'a lua aminte'), J('οὖς', 'ὠτίοις/ὑμῶν', 'urechi'), J('ἐπακολουθέω', 'ἐπακολουθήσατε', 'a urma', 'Ebraica: „veniți la Mine” (ulhu elai); Septuaginta: „urmați căile Mele” (ἐπακολουθήσατε ταῖς ὁδοῖς μου).'),
  J('ἐπακούω', 'ἐπακούσατέ', 'a asculta'), J('ψυχή', 'ψυχὴ', 'suflet'), J('ζάω', 'ζήσεται', 'a trăi'), J('διατίθημι', 'διαθήσομαι', 'a încheia (legământ)'), J('διαθήκη', 'διαθήκην/αἰώνιον', 'legământ veșnic'),
  J('ὅσιος', 'ὅσια', 'cele sfinte', 'Ebraica: „îndurările” (hasdei); Septuaginta: „cele sfinte” (τὰ ὅσια).'), J('Δαυίδ', 'Δαυιδ', 'David'), J('πιστός', 'πιστά', 'credincios')];
S['55:4'] = [J('δίδωμι', 'δέδωκα', 'a da', 'Ebraica: „l-am numit” (netativ, „l-am dat”); Septuaginta: „l-am dat” (δέδωκα), perfect.'), J('μαρτύριον', 'μαρτύριον', 'mărturie', 'Ebraica: „martor” (ed); Septuaginta: „mărturie” (μαρτύριον).'), J('ἔθνος', 'ἔθνεσιν', 'neam'),
  J('ἄρχων', 'ἄρχοντα', 'conducător'), J('προστάσσω', 'προστάσσοντα', 'a porunci'), J('ἔθνος', 'ἔθνεσιν', 'neam')];
S['55:5'] = [J('ἔθνος', 'ἔθνη', 'neam'), J('οἶδα', 'οὐκ/ᾔδεισάν', 'n-au cunoscut', 'Ebraica: „un neam pe care nu îl cunoști” (singular, adresat lui Israel); Septuaginta: „neamuri care nu te cunosc” (ἃ οὐκ ᾔδεισάν σε).'),
  J('ἐπικαλέω', 'ἐπικαλέσονταί', 'a chema', 'Ebraica: „vei chema” (tikra, 2 sg.); Septuaginta: „te vor chema” (ἐπικαλέσονταί σε), neamurile fiind subiectul.'), J('λαός', 'λαοί', 'popor'), J('ἐπίσταμαι', 'ἐπίστανταί', 'a cunoaște'),
  J('καταφεύγω', 'καταφεύξονται', 'a-și căuta scăpare', 'Ebraica: „va alerga spre tine” (iarutsu); Septuaginta: „își vor căuta scăpare la tine” (καταφεύξονται).'), Z('Septuaginta nu are „DOMNULUI” (YHWH) înaintea lui „Dumnezeului tău”.'),
  J('θεός', 'τοῦ/θεοῦ', 'Dumnezeu'), J('ἅγιος', 'τοῦ/ἁγίου', 'sfânt'), J('Ἰσραήλ', 'Ισραηλ', 'Israel'), J('δοξάζω', 'ἐδόξασέν', 'a slăvi')];
module.exports = S;
