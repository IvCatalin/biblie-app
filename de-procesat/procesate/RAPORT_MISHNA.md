# Raport de fază — Mișna în limba română (21.10.2026)

## 1. Ce s-a făcut
- **Traducere integrală** a Mișnei din ebraică, după ediția Romm, Vilna 1913 (domeniu public; textul de pe Sefaria): **6 ordine, 63 de tratate, 4.187 mișnayot**, în **103 fișiere JSON** (format HANDOFF: `translation, source, source_status, modernization, book, chapters[{chapter, title, verses[{verse, text}]}], notes`). Numerotarea este identică cu sursa (verificat automat la fiecare build).
- Pirkei Avot include și capitolul 6 (Kinyan Tora), ca în Sefaria.
- **A doua lectură** (revizuire), apoi **aplicarea deciziilor utilizatorului** din 21.10 (nume biblice, nume divine, termeni etc.).
- Livrabil: `/workspace/mishna/Mishna_complet.ro.zip` (103 fișiere; copie în `checkpoints/Mishna_complet_2110.ro.zip`).

## 2. Reguli aplicate (rezumat; lista completă în `glossary.md`)
1. **Cărțile biblice** au numele din EDC100 (Biblia Cornilescu 2024, bible.com, versiunea 3914): Geneza, Exodul, Leviticul, Numeri, Deuteronomul … Psalmul, Proverbele, Eclesiastul, Cântarea cântărilor, Ezechiel, Mica etc. Numerotarea trimiterilor rămâne cea din ediție.
2. **Numele divine** sunt redate în stilul Cornilescu:
   - YHVH → Domnul (Domnului, la vocativ Doamne);
   - Elohim → Dumnezeu;
   - YHVH Elohim → Domnul Dumnezeu; „Domnul Dumnezeul tău”.
   - Excepție: Zevachim 4:6 „(Ha-Șem)”, unde textul discută Numele.
3. **Termenul contextual** e folosit primul; dacă e nevoie, varianta vine în paranteză:
   - נכרי = neevreu.
   - עובד כוכבים = „închinător la stele” (păstrat).
   - נזיר = nazireu / nazireat (formele EDC100).
4. **Iudeea, Galileea** pentru regiuni.
5. **Alte unificări de termeni:**
   - חיה = „animal (sau „fiară sălbatică”)” la prima apariție din mișna, apoi „animal”.
   - מצרים = Egipt („Mițrayim”), cu glosa la prima apariție din unitate.
   - שדה = câmp.
   - בטל באחד ומאה = „se anulează într-unul din o sută și unu”.
   - כשר/פסול = valabil/nevalabil. Verbul פוסל = „declară nevalabil” (decizie a unui înțelept) / „face nevalabil” (efect al unui lucru) / „devine nevalabil”.
6. **Parantezele drepte [ ]:** semnele au fost scoase, cuvintele adăugate rămân. S-au păstrat numai parantezele ediției, verificate în ebraică: Zevachim 4:3, Pesachim 3:7, Kiddushin 4:3.
7. **„cuvânt (transliterație)”** rămâne în text (decizia utilizatorului).
8. **Text și note:** fără note în textul mișnei; toate notele sunt în câmpul final `notes`. Nu s-a inventat și nu s-a adăugat text.

## 3. Cifre (modificările din 21.10)

| Modificare | Număr |
|---|---|
| Paranteze [ ] scoase (semnele) | ~11.130 perechi în 3.207 mișnayot (total Mișna+Zohar: 14.709); păstrate 3 (ale ediției) |
| YHVH / Elohim → Domnul / Dumnezeu | 204 apariții (Zevachim 4:6 „(Ha-Șem)” păstrat) |
| נכרי → neevreu | 19 |
| nazir → nazireu / nazireat (corpus comun Mișna + Zohar) | 245 |
| Mițrayim → Egipt, glosa „(Mițrayim)” la prima apariție din mișna | 10 glose rămase |
| țarină → câmp (cu acordul refăcut) | 31 (Peah, Demai) |
| חיה → animal (sau „fiară sălbatică”) | 28 de mișnayot |
| Iudeea / Galileea (regiuni) | Bava Batra, Bava Kamma, Sheviit 9:2, Terumot, Demai 1:1 |
| Terumot 4:7, 4:11, 4:13 → formula din Shabbat 21:1 | 3 mișnayot |
| „descalific-” → nevalabil | 196 de apariții în 112 mișnayot (Parah, Mikvaot, Tahorot, Zavim, Zevachim, Tevul Yom, Meilah etc.) |
| Note cu [ ] aliniate la text | 6 |

## 4. Ce s-a verificat de mână și ce automat

**Citit integral, mișna cu mișna, lângă ebraică:**
- **Zeraim:** toate cele 11 tratate.
- **Moed:** toate cele 12 (Shabbat, Eruvin; apoi, în 21.10 seara, Pesachim, Shekalim, Yoma, Sukkah, Beitzah, Rosh Hashanah, Taanit, Megillah, Moed Katan, Chagigah — 446 de mișnayot, citite toate, una câte una, lângă ebraică; vezi §4a).
- **Nashim:** toate cele 7.
- **Nezikin:**
  - Bava Kamma, Bava Metzia, Bava Batra, Sanhedrin, Makkot;
  - Shevuot (integral);
  - Eduyot, Avodah Zarah, Avot, Horayot.
- **Kodashim:** toate cele 11.
- **Tohorot:** toate cele 12 (Kelim, Oholot, Negaim, Parah, Tahorot, Mikvaot, Niddah, Makhshirin, Zavim, Tevul Yom, Yadayim, Oktzin).

**Tot de mână, în această fază:**
- fiecare apariție de נכרי, țarină, Iudeea/Galileea, Terumot 4;
- cele 196 de forme „descalific-”;
- vocativele numelor divine;
- un eșantion de mișnayot fără paranteze.

**Automat, pe tot corpusul:**
- `build.py`: numerotare = sursă; fără text gol; fără ebraică; raport de lungime; trimiteri biblice.
- `final_audit.py`: 103 fișiere, 63 de tratate, 4.187 mișnayot, **issues 0**; JSON valid; `notes` ultimul câmp. Raportul de lungime RO/HE are mediana 1,78 (minim 1,11, maxim 2,69).
- `names_check.py`: numele rabinilor față de sursă; au rămas doar fals-pozitive cunoscute.
- Numele divine: numărul de apariții e același ca înainte de conversie în fiecare mișna. Cele 20 de diferențe față de ה'/השם din ebraică existau dinainte: השם = „Numele”, citate fără Nume.
- După scoaterea parantezelor: fără spații duble, fără spațiu înainte de punctuație, fără paranteze goale, fără paranteze neperechi.
  - Scanare pentru cuvinte dublate: cazurile găsite au fost verificate.

## 4a. A doua lectură Moed (21.10 seara): Pesachim … Chagigah
- **446/446 mișnayot comparate** cuvânt cu cuvânt cu ebraica Vilna (dumpb.py: ebraică + traducere + adaosurile fostelor [ ]), tratat cu tratat; după fiecare tratat: build, names_check, checkpoint.
- Nimic inventat sau omis găsit; **59 de mișnayot corectate** (75 de înlocuiri, lista exactă în `fixes_moed2.txt`; backup înainte: `/workspace/backups_2110d/`):
  - termeni după glosar: אב הטומאה „sursă primară” → „părinte al necurăției” (Pesachim 1:6, Shekalim 8:4, 8:6, 8:7); חייב „vinovat” → „dator” (Pesachim 5:4, Yoma 8:2, Beitzah 5:5); miqvaʾot → mikvaot (Shekalim 1:1, Moed Katan 1:2); גר „străin convertit” → „prozelit” (Pesachim 8:8, Shekalim 1:3, 1:6, 7:6); „mană” → maneh (Yoma 4:4); Iyov/Daniʾel (cărți) → Iov/Daniel (Yoma 1:6); „din Psalmi” → „din cartea Psalmilor” (Sukkah 5:4); „Faptele Facerii” → „lucrarea creației” (Taanit 4:2, Megillah 3:6, Chagigah 2:1; aliniat și Chullin 5:5);
  - sens: Pesachim 2:3 (RSBG: „orice ḥameṭ după care câinele nu poate căuta”), 3:1 („berea din Media”), 10:6 (Domnul la persoana a III-a, nu vocativ; „care ai răscumpărat”); Shekalim 1:2 („să declare fără stăpân”), 3:2 („din vina față de visterie”), 4:4 („nu erau de acord în privința roadelor”), 5:6 („încăperea celor tainice”); Sukkah 2:1 („în treacăt”), 2:6 („noaptea primei zile”), 4:9 („Dacă a turnat…”); Beitzah 1:10 („dacă sunt pentru nevoia sărbătorii”), 5:2 și Megillah 1:5–1:6 (אוכל נפש = „hrana trebuincioasă vieții”, nu „pentru suflet”); Megillah 1:5 (Șabat/Yom Kippur explicitat „cel dintâi/cel de-al doilea”), 4:9 (לאעברא בארמיותא); Moed Katan 3:3 („scrisorile particulare”); Rosh Hashanah 1:7 („devine nevalabil”); Taanit 2:1 („în Tradiție (Profeții)”), 2:4 (binecuvântările la persoana a II-a: „care asculți”, „care Te înduri”);
  - gramatică/acord: Pesachim 1:7, 4:1, 5:6, 8:3, 9:2, 9:9; Shekalim 6:6; Yoma 3:9, 4:1, 5:1; Sukkah 2:3; Rosh Hashanah 1:2, 1:7, 3:1; Taanit 1:4, 3:2, 3:8, 4:6, 4:8; Megillah 2:4; Beitzah 5:4 (כלי → „vas (sau „o unealtă”)”).
- Rebuild + final_audit după corecturi: 103 fișiere, 4.187 mișnayot, issues 0. Zip refăcut.
- Limită: lectura a fost făcută o singură dată de mine (a doua lectură); fiecare mișna a fost citită integral, dar nu există o a treia verificare independentă.

## 5. Limite cunoscute
- **Fără paranteze:** unele completări explicative au devenit text obișnuit. Sunt corecte gramatical, dar cititorul nu mai vede ce e adăugat față de ebraică.
- **Forme ne-EDC100:** „nazirah” (feminin, 11 locuri) nu are formă în EDC100, deci e păstrat.
- **Glosa „(Mițrayim)”** apare doar la prima apariție din fiecare mișna.
- **Convenția „face nevalabil”:** e uneori folosită intransitiv („a făcut nevalabil”, „al doilea face nevalabil”), după precedentul deja existent în corpus (Yevamot, Kiddushin).
- **Zevachim 8:3:** „la nevalabilitate” e o formulare rară.

## 6. Puncte deschise (pentru utilizator)
1. Din `questions.md`, încă nerezolvate:
   - formatul intern al aplicației (1);
   - Pirkei Avot din aplicație (Herford, altă numerotare) (2);
   - comentariile din arhivă și licențele lor (3);
   - lucrările suplimentare despre Avot (4);
   - Kelim 15:1, unde textul Vilna pare inversat (6);
   - Kelim 20:6 משיתבר (7).
2. Confirmarea convenției pentru glosa „(Mițrayim)” și pentru formele „animal (sau „fiară sălbatică”)”.
3. Dacă transliterațiile din paranteză („cuvânt (transliterație)”, ~525) rămân definitiv în text.

## 7. Backup-uri
- `/workspace/backups_2110b/`: înainte de deciziile din 21.10 (b).
- `/workspace/backups_2110c/`: înainte de scoaterea [ ] și de „descalific-”.
- `/workspace/backups_2110d/`: înainte de a doua lectură Moed (Pesachim … Chagigah) + Chullin.
