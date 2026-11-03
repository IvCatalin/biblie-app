// Explicații ale sărbătorilor din calendarul românesc și cel german (panoul care se
// deschide din „Sărbătorile calendaristice”, Acasă). Fiecare intrare are:
//   s   = rezumatul (4 propoziții), afișat mereu
//   m   = detalii în plus, afișate la „Citește mai mult”
//   src = sursele (panoul ⓘ)
// Orice afirmație de aici a fost verificată pe sursa trecută la src; ce nu a putut fi
// verificat nu a fost scris. Cheile sunt exact numele din romanianHolidays()/germanHolidays().
(function(){
  const BIB = "Biblia (Noul Testament) — pasajele indicate în text";
  const CM = "Codul muncii (Legea 53/2003), art. 139 — sărbători legale în care nu se lucrează";
  const WRO = "Wikipedia română — CC BY-SA 4.0";
  const WEN = "Wikipedia engleză — CC BY-SA 4.0";
  const WDE = "Wikipedia germană — CC BY-SA 4.0";
  const EUS = "Eusebiu din Cezareea, Istoria bisericească — textul din Biblioteca aplicației";
  const PRO = "Protoevanghelia lui Iacov (apocrif, adaptare după A. Walker; domeniu public) — Biblioteca aplicației";
  const PSM = "Evanghelia pseudo-Matei (apocrif, adaptare după A. Walker; domeniu public) — Biblioteca aplicației";
  const PET = "Evanghelia lui Petru (apocrif, adaptare după M. R. James / H. B. Swete; domeniu public) — Biblioteca aplicației";
  const AND = "Pătimirea lui Andrei (apocrif, după M. R. James, 1924; domeniu public) — Biblioteca aplicației";

  const RO = {
    "Anul Nou": {
      s: "1 ianuarie este prima zi a anului civil și, în România, zi de sărbătoare legală în care nu se lucrează. Începutul anului la 1 ianuarie vine din calendarul roman: reforma lui Iulius Cezar a intrat în vigoare la 1 ianuarie 45 î.Hr. și a păstrat această dată. În creștinătate, 1 ianuarie este și sărbătoarea Tăierii împrejur a Domnului, la opt zile după Crăciun. Evanghelia după Luca 2:21 spune că, după opt zile, pruncului i s-a pus numele Isus.",
      m: "Calendarul iulian, introdus de Cezar, a rămas în uz în Occident până în 1582, când papa Grigore al XIII-lea a introdus calendarul gregorian, în timp ce majoritatea Bisericilor răsăritene au rămas la cel iulian. Biserica Ortodoxă Română a adoptat în 1924 calendarul iulian revizuit pentru sărbătorile cu dată fixă; Paștele și sărbătorile legate de el au rămas după calculul iulian.",
      src: [CM, WEN + " — «New Year's Day», «Revised Julian calendar»", WDE + " — «Ostern» (reforma din 1582)", BIB + " (Luca 2:21)"]
    },
    "A doua zi de Anul Nou": {
      s: "2 ianuarie este, alături de 1 ianuarie, zi de sărbătoare legală în care nu se lucrează în România. Prevederea se găsește în articolul 139 alineatul (1) din Codul muncii.",
      m: "Pentru originea începutului de an la 1 ianuarie, vezi explicația de la „Anul Nou”.",
      src: [CM]
    },
    "Boboteaza": {
      s: "Boboteaza, numită în greacă Teofanie sau Epifanie, adică „Arătarea Domnului”, se ține pe 6 ianuarie. Biserica Ortodoxă comemorează botezul lui Isus în râul Iordan, înțeles ca manifestarea Fiului lui Dumnezeu către lume. Evanghelia după Matei 3:16-17 descrie coborârea Duhului în chip de porumbel și glasul din ceruri. Creștinii occidentali comemorează în primul rând vizita magilor la Pruncul Isus.",
      m: "Cea mai veche mențiune cunoscută a unei sărbători a botezului lui Isus vine de la Clement din Alexandria, în jurul anului 200: el scrie că urmașii lui Vasilide țineau ziua botezului ca sărbătoare, petrecând noaptea dinainte în lecturi. Datele egiptene pe care le dă corespund cu 6 și 10 ianuarie. În toate Bisericile ortodoxe, preoții fac agheasmă, cu care „botează” apele, oamenii, animalele și casele. În localitățile de pe malul unui râu, al Dunării sau al mării, preotul aruncă o cruce de lemn în apă, iar câțiva flăcăi curajoși sar după ea. 6 ianuarie a fost declarat sărbătoare legală în care nu se lucrează prin completarea articolului 139 din Codul muncii.",
      src: [BIB + " (Matei 3:13-17)", WRO + " — «Boboteaza»", WEN + " — «Epiphany (holiday)» (Clement din Alexandria)", "Completarea art. 139 din Codul muncii cu 6 și 7 ianuarie — presa (Alba24, Antena 3)"]
    },
    "Sf. Ioan Botezătorul": {
      s: "Pe 7 ianuarie, Biserica Ortodoxă ține soborul Sfântului Ioan Botezătorul, socotit ziua lui principală de pomenire, imediat după Bobotează. Evanghelia după Luca 1 spune că nașterea lui a fost vestită preotului Zaharia de îngerul Gavriil în Templul din Ierusalim, iar mama lui, Elisabeta, este numită „rudă” a Mariei, mama lui Isus (Luca 1:36). Cele trei evanghelii sinoptice spun că Ioan boteza în Iordan și că L-a botezat pe Isus; la Marcu, el propovăduiește „botezul pocăinței”. Pentru că l-a mustrat pe Irod Antipa din pricina căsătoriei cu Irodiada, Ioan a fost arestat și apoi decapitat (Marcu 6:17-29; Matei 14:1-12).",
      m: "Istoricul evreu Josephus Flavius spune, în Antichitățile Iudaice (Cartea XVIII, cap. 5), că Irod Antipa, temându-se că influența lui Ioan ar putea stârni o răscoală, l-a întemnițat și l-a executat la cetatea Macheront; unii evrei au socotit că înfrângerea de mai târziu a lui Irod a fost pedeapsa pentru această faptă. Luca este singura evanghelie care arată o legătură de familie între Ioan și Isus. Protoevanghelia lui Iacov, scriere apocrifă, povestește că Irod l-a căutat pe Ioan și l-a trimis la Zaharia să afle unde e fiul lui; Zaharia a răspuns că nu știe și a fost ucis în zori, la pragul templului (cap. 23). Biserica pomenește și nașterea lui Ioan, pe 24 iunie, și tăierea capului, pe 29 august.",
      src: [BIB + " (Luca 1; Marcu 6:17-29; Matei 14:1-12)", WEN + " — «John the Baptist» (Josephus, Antichități 18.5.2)", PRO + ", cap. 23"]
    },
    "Unirea Principatelor Române": {
      s: "Pe 5/17 ianuarie 1859, Alexandru Ioan Cuza a fost ales în unanimitate domn al Moldovei, iar pe 24 ianuarie 1859 adunarea electivă din București l-a ales și domn al Țării Românești. Convenția de la Paris din 1858 stabilise o unire mai degrabă formală: doi domni, două guverne și instituții comune, precum Comisia Centrală de la Focșani. La București, conservatorii aveau 46 din cele 72 de locuri, iar presiunea unei mulțimi de peste 30.000 de oameni a contribuit la rezultat. Ziua de 24 ianuarie este sărbătoare legală în care nu se lucrează.",
      m: "În aprilie 1859, puterile conferinței de la Paris au recunoscut dubla alegere, iar Poarta otomană și Austria au acceptat-o la sfârșitul lui august–începutul lui septembrie 1859. Unirea politică deplină a urmat după conferința de la Constantinopol: firmanul otoman din decembrie 1861 a acceptat-o, iar în ianuarie 1862 s-a format un singur guvern, condus de Barbu Catargiu. Adunările ad-hoc din 1857 fuseseră doar consultative, iar în Moldova votul a fost contestat din pricina unei presupuse falsificări a listelor electorale, iar rezultatele au fost anulate. Denumirea „Mica Unire” este socotită în articolul Wikipedia folosită greșit și minimalizator, fiindcă subestimează întemeierea statului român.",
      src: [WRO + " — «Unirea Principatelor Române»", CM]
    },
    "Duminica Floriilor": {
      s: "Duminica Floriilor este duminica dinaintea Paștelui și amintește intrarea lui Isus în Ierusalim, relatată în Matei 21:1-11, Marcu 11:1-11, Luca 19:28-44 și Ioan 12:12-19. Doar Evanghelia după Ioan precizează că mulțimea a luat ramuri de finic; ceilalți evangheliști vorbesc despre haine așternute pe drum și ramuri tăiate. În troparul zilei se spune „Osana întru cei de sus!”. În România și Moldova ziua se numește Duminica Floriilor sau, pe scurt, Florii.",
      m: "În tradiția răsăriteană, Sâmbăta lui Lazăr, ziua dinaintea Floriilor, este ziua în care credincioșii pregătesc adesea ramurile, împletite uneori în forma unor cruci. În creștinismul răsăritean, Săptămâna Mare începe după Postul Mare, în timp ce în Occident duminica aceasta deschide ultima săptămână a Postului.",
      src: [BIB + " (Matei 21; Marcu 11; Luca 19; Ioan 12)", WEN + " — «Palm Sunday»"]
    },
    "Vinerea Mare": {
      s: "Vinerea Mare comemorează răstignirea și moartea lui Isus pe Golgota, în ultima vineri dinaintea Paștelui. În afara evangheliilor, istoricul roman Tacitus scrie în Anale (cca 116 d.Hr.) că Christus „a suferit pedeapsa supremă în vremea domniei lui Tiberiu”, din ordinul procuratorului Pontiu Pilat. Evangheliile după Matei și Marcu redau strigătul lui Isus „Dumnezeul meu, Dumnezeul meu, pentru ce m-ai părăsit?”, iar Ioan 19:39-40 spune că Nicodim a adus miresme pentru înmormântare. Vinerea Mare a devenit sărbătoare legală în care nu se lucrează în România printr-o lege promulgată în martie 2018.",
      m: "Evanghelia lui Petru, scriere apocrifă, povestește că Domnul a fost răstignit între doi făcători de rele, că deasupra crucii s-a scris „Acesta este regele lui Israel”, că la amiază întuneric a cuprins toată Iudeea și că în acel ceas catapeteasma templului s-a rupt în două (cap. 4-5). Tot acolo se spune că i-au scos cuiele din mâini și L-au pus pe pământ, iar Iosif a luat trupul, l-a înfășat în giulgiu și l-a așezat în mormântul său (cap. 6).",
      src: [BIB + " (Matei 27; Marcu 15; Luca 23; Ioan 19)", "Tacitus, Annales 15.44 — via " + WEN + " «Tacitus on Christ»", WEN + " — «Good Friday»", PET + ", cap. 4-6", "Promulgarea legii care face din Vinerea Mare sărbătoare legală — Știrile ProTV, 12.03.2018"]
    },
    "Paștele": {
      s: "Paștele ortodox sărbătorește Învierea lui Isus Hristos din morți, în a treia zi după răstignire. Data se calculează ca duminica de după prima lună plină de primăvară, iar Bisericile ortodoxe aplică regula pe calendarul iulian, care în anii 1900–2099 rămâne cu 13 zile în urma celui gregorian; de aceea Paștele ortodox cade adesea în altă duminică decât cel occidental. Sinodul de la Niceea din 325 a dat prima regulă obligatorie pentru data Paștelui și s-a pronunțat împotriva celor care îl țineau în orice zi a săptămânii. Biserica Ortodoxă Română a adoptat în 1924 calendarul iulian revizuit pentru sărbătorile cu dată fixă, dar pentru Paște a păstrat calculul iulian.",
      m: "Eusebiu din Cezareea povestește (Istoria bisericească V.23-25) disputa în care bisericile din Asia țineau Paștele în ziua a paisprezecea a lunii, ziua în care iudeilor li se poruncise să jertfească mielul, oricare ar fi fost ziua săptămânii, pe când restul lumii încheia postul numai în ziua învierii. Episcopul Policrat, într-o scrisoare către Victor al Romei, a apărat tradiția asiatică, trimițând la Filip, la Ioan, la Policarp și la ceilalți „mari luminători” adormiți în Asia. Sinoadele ținute în Palestina, la Roma, în Pont, în Galia, în Osroene și la Corint au hotărât totuși ca taina învierii să fie sărbătorită numai în ziua Domnului. Prima și a doua zi de Paști sunt zile de sărbătoare legală în care nu se lucrează.",
      src: [EUS + " (V.23, V.24, V.25)", WEN + " — «Date of Easter», «First Council of Nicaea», «Revised Julian calendar»", CM]
    },
    "A doua zi de Paști": {
      s: "A doua zi de Paști este zi de sărbătoare legală în care nu se lucrează în România, împreună cu prima zi. Paștele ortodox se calculează pe calendarul iulian, de aceea poate cădea în altă duminică decât Paștele occidental. Eusebiu din Cezareea arată că rânduiala bisericii, din tradiția apostolică, era ca postul să se încheie numai în ziua învierii Domnului (Istoria bisericească V.23).",
      m: "Despre Înviere, vezi explicația de la „Paștele”.",
      src: [CM, EUS + " (V.23)", WEN + " — «Date of Easter»"]
    },
    "Ziua Muncii": {
      s: "Pe 1 mai se sărbătorește Ziua Muncii, zi de sărbătoare legală în România. Data a fost aleasă de Federația Americană a Muncii pentru a comemora greva generală începută în Statele Unite la 1 mai 1886, care a culminat cu incidentul Haymarket din 4 mai. Congresul de la Paris din 1889, care a pus bazele Internaționalei a II-a, a adoptat o rezoluție pentru o „mare demonstrație internațională” în sprijinul zilei de lucru de opt ore. Prima sărbătorire a avut loc la 1 mai 1890, iar congresul din 1891 a recunoscut-o oficial ca eveniment anual.",
      m: "Mișcarea pentru ziua de opt ore cerea opt ore pentru muncă, opt pentru recreere și opt pentru odihnă.",
      src: [WEN + " — «International Workers' Day»", CM]
    },
    "Înălțarea Domnului (Ziua Eroilor)": {
      s: "Înălțarea Domnului amintește că, potrivit Faptelor Apostolilor 1:1-11, după o vreme de patruzeci de zile Isus S-a înălțat sub ochii ucenicilor, iar un nor L-a ascuns; doi bărbați în haine albe au spus că va reveni în același chip. Evanghelia după Luca 24:51 spune că, în timp ce îi binecuvânta, Isus S-a despărțit de ei și a fost ridicat la cer. Sărbătoarea se ține în a patruzecea zi după Paști, mereu într-o joi. În România, aceeași zi este Ziua Eroilor, sărbătoare națională stabilită prin Legea 379/2003, art. 39.",
      m: "Sărbătoarea e atestată în liturghia Ierusalimului din 383/384, prin jurnalul pelerinei Egeria. Potrivit Wikipedia engleză, Înălțarea a făcut inițial parte din sărbătoarea Rusaliilor și s-a dezvoltat ca sărbătoare aparte treptat, de la sfârșitul secolului al IV-lea. În 1920, autoritățile statului și Biserica Ortodoxă au convenit ca eroii să fie cinstiți la Înălțare. În perioada comunistă comemorarea a fost mutată pe 9 mai, iar Legea 48/1995 a readus-o în ziua Înălțării.",
      src: [BIB + " (Fapte 1:1-11; Luca 24:50-53)", WEN + " — «Ascension of Jesus»", WDE + " — «Christi Himmelfahrt» (Egeria)", "Legea 379/2003, art. 39; Legea 48/1995 — Digi24, Agerpres, TVR Info"]
    },
    "Rusaliile (Pogorârea Sf. Duh)": {
      s: "Rusaliile, numite și Cincizecime sau Pogorârea Sfântului Duh, amintesc coborârea Duhului Sfânt peste apostoli, povestită în Faptele Apostolilor 2:1-31, în timpul sărbătorii evreiești a Săptămânilor (Șavuot). Se țin la 50 de zile după Paști, iar în tradiția creștină ziua este numită „ziua de naștere a Bisericii”. Șavuot cade la șapte săptămâni după Paștele evreiesc, iar numărătoarea celor cincizeci de zile vine din Leviticul 23:16. În Biserica Ortodoxă, Rusaliile se numesc și Duminica Sfintei Treimi, iar sărbătoarea durează trei zile.",
      m: "Cele trei zile sunt duminica, Lunea Duhului Sfânt și o a treia zi, numită a Treia Zi a Treimii. Apostolul Pavel însuși notează, în secolul I, însemnătatea sărbătorii (Fapte 20:16; 1 Corinteni 16:8). Prima și a doua zi de Rusalii sunt zile de sărbătoare legală în care nu se lucrează în România.",
      src: [BIB + " (Fapte 2; Leviticul 23:15-21)", WEN + " — «Pentecost»", CM]
    },
    "A doua zi de Rusalii": {
      s: "A doua zi de Rusalii, numită în Ortodoxie Lunea Duhului Sfânt, face parte din sărbătoarea de trei zile a Rusaliilor. Este zi de sărbătoare legală în care nu se lucrează în România, împreună cu prima zi de Rusalii.",
      m: "Despre evenimentul amintit, coborârea Duhului Sfânt (Fapte 2), vezi explicația de la „Rusaliile”.",
      src: [WEN + " — «Pentecost»", CM]
    },
    "Ziua Copilului": {
      s: "Ziua de 1 iunie este Ziua Copilului și zi de sărbătoare legală în România. Ziua Internațională a Copilului a fost proclamată la Geneva, la Conferința Mondială pentru Bunăstarea Copilului din 1925. La 4 noiembrie 1949, Federația Democrată Internațională a Femeilor a stabilit 1 iunie ca Zi Internațională pentru Protecția Copiilor. Este o altă zi decât Ziua Mondială a Copilului, 20 noiembrie, care amintește adoptarea de către ONU a Declarației drepturilor copilului (1959) și a Convenției drepturilor copilului (1989).",
      m: "În 1954, Adunarea Generală a ONU a încurajat statele să instituie o Zi Universală a Copilului.",
      src: [WEN + " — «Children's Day»", CM]
    },
    "Adormirea Maicii Domnului": {
      s: "Pe 15 august, Biserica Ortodoxă pomenește adormirea (moartea) Mariei, mama lui Isus, și ridicarea ei la cer. Scrierile canonice ale Noului Testament nu relatează moartea sau adormirea ei. Primele relatări sunt apocrife: tradiții anonime, ca „Cartea Odihnei Mariei”, circulau din secolul al III-lea, poate mai devreme, iar apocriful grecesc atribuit lui Pseudo-Ioan este datat de Tischendorf cel târziu în secolul al IV-lea. Împăratul Mauriciu (582–602) ar fi hotărât, după Nichifor Calist Xantopulos, ca sărbătoarea să se țină pe 15 august.",
      m: "Epifanie din Salamina scria că sfârșitul Mariei e incert și încheia: „Nimeni nu știe sfârșitul ei”. Scrierea latină Liber de transitu Virginis Mariae, a lui Pseudo-Melito, este datată în secolul al V-lea. Înainte de sărbătoare, ortodocșii postesc în 1–14 august; la Bisericile care folosesc calendarul iulian, 15 august corespunde cu 28 august gregorian. Potrivit articolului Wikipedia în română, Maria și-ar fi petrecut ultimii ani la Efes, alături de Ioan Evanghelistul. În România, Adormirea Maicii Domnului este zi de sărbătoare legală în care nu se lucrează.",
      src: [WEN + " — «Dormition of the Mother of God»", WRO + " — «Adormirea Maicii Domnului»", CM]
    },
    "Sf. Andrei": {
      s: "Andrei a fost fratele lui Simon Petru, pescar din Betsaida, și mai întâi ucenic al lui Ioan Botezătorul; după ce Ioan a arătat spre Isus, Andrei L-a urmat și l-a adus la El pe Petru (Ioan 1:35-42), de aceea Biserica Ortodoxă îl numește „Cel dintâi chemat”. Evangheliile după Matei 4:18-20 și Marcu 1:16-18 îl arată chemat împreună cu Petru, pe când pescuiau. Eusebiu din Cezareea scrie (Istoria bisericească III.1) că apostolii s-au risipit prin lume și că, după tradiție, Sciția i-a revenit lui Andrei. Tradiția spune că a murit răstignit la Patras, în Ahaia, iar în Pătimirea lui Andrei, scriere apocrifă, călăii i-au legat mâinile și picioarele de cruce, fără să le bată în cuie.",
      m: "În Pătimirea lui Andrei, apostolul vorbește crucii înfipte la marginea nisipului, lângă mare, apoi rămâne atârnat de ea și, după două zile, încă viu și fără să fi gustat nimic, continuă să vorbească mulțimii (cap. 4, 5 și 7). Cât despre „capul în jos”: Eusebiu o leagă de Petru, care la Roma „a fost răstignit cu capul în jos; căci ceruse să sufere în acest chip” (III.1), nu de Andrei. Crucea în formă de X, „crucea Sfântului Andrei”, nu apare în aceste izvoare vechi: Réau notează că apare întâi în secolul al X-lea și că nu devine standard în iconografie înainte de secolul al XVII-lea, iar cea mai veche reprezentare sculptată cunoscută e un capitel din Quercy, din începutul secolului al XII-lea. În România, tradiția îl socotește pe Andrei cel care a propovăduit Evanghelia în Sciția (Dobrogea de azi), pe baza lui Hipolit al Romei, care spune că Andrei a propovăduit sciților și tracilor. Ziua de 30 noiembrie, „Sfântul Apostol Andrei, cel Întâi chemat, Ocrotitorul României”, este sărbătoare legală în care nu se lucrează.",
      src: [BIB + " (Ioan 1:35-42, 1:44; Matei 4:18-20; Marcu 1:16-18)", EUS + " (III.1)", AND + ", cap. 4, 5, 7", WEN + " — «Saint Andrew» (Réau 1958, Calvert 1984)", WRO + " — «Andrei (apostol)»", CM]
    },
    "Ziua Națională a României": {
      s: "Pe 1 decembrie 1918, Adunarea Națională de la Alba Iulia a hotărât „Unirea Transilvaniei, Banatului, Crișanei și Maramureșului cu Regatul Român”. Legea nr. 10 din 31 iulie 1990 a proclamat 1 decembrie zi națională a României, în locul zilei de 23 august. Până în 1989, ziua națională fusese 23 august, declarată prin hotărâre de guvern din 18 august 1949, în amintirea înlăturării guvernului Antonescu în 1944, prezentată de propaganda comunistă drept „Marea Insurecție Armată Antifascistă și Antiimperialistă”. 1 decembrie este zi de sărbătoare legală în care nu se lucrează.",
      src: [WRO + " — «Ziua Națională a României»", CM]
    },
    "Crăciunul": {
      s: "Crăciunul sărbătorește nașterea lui Isus la Betleem, povestită în Evanghelia după Luca (2:1-7), unde Iosif și Maria merg de la Nazaret la Betleem pentru recensământ, iar Isus este așezat într-o iesle, și în cea după Matei, unde magii urmează o stea până la Betleem. Cel mai vechi document care dă 25 decembrie ca zi a nașterii lui Isus este Cronograful din 354, iar istoricii liturgici socotesc că data a fost fixată la Roma în jurul anului 336. Data coincide cu solstițiul de iarnă din Imperiul Roman, iar originea ei exactă rămâne neclară. Biserica Ortodoxă Română a adoptat în 1924 calendarul iulian revizuit, care se aplică sărbătorilor cu dată fixă, deci Crăciunul se ține pe 25 decembrie.",
      m: "Protoevanghelia lui Iacov, scriere apocrifă, spune că Iosif a găsit o peșteră lângă Betleem, că un nor luminos a acoperit peștera și apoi o lumină mare s-a arătat în ea (cap. 18-19), iar steaua i-a dus pe magi „până au venit în peșteră” (21:12). Evanghelia pseudo-Matei, tot apocrifă, adaugă că a treia zi după naștere Maria a ieșit din peșteră, a intrat într-un staul și a pus Pruncul în iesle, unde „boul și asinul L-au adorat” (cap. 19). În România, Crăciunul se sărbătorește mai multe zile, cu 25 decembrie în prim-plan, urmat de 26 decembrie, iar cântatul colindelor este un obicei foarte răspândit. Prima și a doua zi de Crăciun sunt zile de sărbătoare legală în care nu se lucrează.",
      src: [BIB + " (Luca 2:1-7; Matei 2)", PRO + ", cap. 18-21", PSM + ", cap. 18-19", WRO + " — «Crăciun»", WEN + " — «Christmas», «Revised Julian calendar»", CM]
    },
    "A doua zi de Crăciun": {
      s: "A doua zi de Crăciun este zi de sărbătoare legală în România, împreună cu prima zi. În calendarul ortodox, 26 decembrie este Soborul Maicii Domnului, iar Sfântul Ștefan, primul martir creștin, se pomenește a doua zi, pe 27 decembrie; în Occident, ziua Sfântului Ștefan este 26 decembrie. Potrivit Faptelor Apostolilor 6-7, Ștefan era unul dintre cei șapte aleși să împartă ajutoarele, a vorbit în fața Sinedriului și a fost omorât cu pietre, în timp ce ucigașii și-au pus hainele la picioarele tânărului Saul, mai târziu apostolul Pavel. Eusebiu din Cezareea scrie (Istoria bisericească II.1) că Ștefan a fost primul, după Domnul, omorât cu pietre.",
      m: "Eusebiu adaugă că Ștefan a fost cel dintâi care a primit „cununa, potrivită cu numele lui”, a martirilor lui Hristos. Potrivit tradiției, în 415 preotul Lucian a avut un vis care i-a arătat locul moaștelor lui Ștefan, la Beit Jimal; moaștele au fost purtate în procesiune la biserica Hagia Sion pe 26 decembrie 415, de aceea această dată a devenit ziua sărbătorii în Occident.",
      src: [BIB + " (Fapte 6-7)", EUS + " (II.1, III.5)", WEN + " — «Saint Stephen»", CM]
    }
  };

  const DE = {
    "Neujahr (Anul Nou)": {
      s: "Neujahr, 1 ianuarie, este sărbătoare legală în toate cele 16 landuri ale Germaniei. Începutul anului la 1 ianuarie vine din calendarul roman: reforma lui Iulius Cezar a intrat în vigoare la 1 ianuarie 45 î.Hr. și a păstrat această dată. În creștinătate, 1 ianuarie este și sărbătoarea Tăierii împrejur a Domnului. Evanghelia după Luca 2:21 spune că, după opt zile, pruncului i s-a pus numele Isus.",
      m: "Papa Grigore al XIII-lea a introdus în 1582 calendarul gregorian în Biserica occidentală, iar majoritatea Bisericilor răsăritene au rămas la calendarul iulian.",
      src: [WDE + " — «Gesetzliche Feiertage in Deutschland», «Ostern»", WEN + " — «New Year's Day»", BIB + " (Luca 2:21)"]
    },
    "Karfreitag (Vinerea Mare)": {
      s: "Cuvântul Karfreitag vine din vechea germană înaltă kara, „plângere, durere, doliu”, iar ziua se mai numește și „vinerea liniștită” (stiller Freitag). Creștinii își amintesc de suferința și moartea lui Isus pe cruce, iar împreună cu Paștele este una dintre cele mai înalte sărbători creștine. În Germania, Karfreitag este sărbătoare legală în toate landurile și face parte din „zilele liniștite” (stille Tage). Curtea Constituțională Federală a socotit că regulile acestor zile se justifică prin crearea unui „cadru exterior de liniște”.",
      m: "În aceste zile se aplică restricții, între care interdicția dansului și a unor evenimente sportive sau de divertisment; excepțiile sunt posibile atunci când ele servesc „înălțării sufletești” sau unui interes superior al artei, științei sau educației populare. În 2016, Curtea Constituțională Federală a declarat neconstituțională interdicția generală a dansului din Bavaria, fiindcă excludea de la început orice posibilitate de scutire. Istoricul roman Tacitus scrie în Anale (cca 116 d.Hr.) că Christus „a suferit pedeapsa supremă în vremea domniei lui Tiberiu”, din ordinul procuratorului Pontiu Pilat. Pentru Biserica Romano-Catolică, Karfreitag este zi de post strict și de abținere.",
      src: [WDE + " — «Karfreitag»", WDE + " — «Gesetzliche Feiertage in Deutschland»", "Tacitus, Annales 15.44 — via " + WEN + " «Tacitus on Christ»"]
    },
    "Ostersonntag (Paștele)": {
      s: "Ostern, Paștele, este „cea mai înaltă sărbătoare creștină” și comemorează învierea lui Isus Hristos în a treia zi după moartea pe cruce. În Biserica occidentală, Paștele cade pe duminica de după prima lună plină de primăvară, cel mai devreme pe 22 martie și cel mai târziu pe 25 aprilie. Sinodul de la Niceea din 325 a dat prima regulă obligatorie pentru data Paștelui, iar Grigore al XIII-lea a introdus în 1582 calendarul gregorian în Biserica occidentală, în timp ce majoritatea Bisericilor răsăritene au rămas la cel iulian. Ostersonntag nu apare între sărbătorile legale din toate cele 16 landuri, spre deosebire de Ostermontag.",
      m: "În noaptea Paștelui, la începutul slujbei se binecuvântează focul de Paști (Osterfeuer), de la care preotul aprinde lumânarea pascală; în afara contextului religios, focurile publice de Paști sunt răspândite până la Ostermontag. În spațiul de limbă germană și în Țările de Jos, copiii caută ouă vopsite și dulciuri atribuite iepurelui de Paști (Osterhase). Eusebiu din Cezareea povestește (Istoria bisericească V.23) că Biserica a hotărât ca taina învierii să fie sărbătorită numai în ziua Domnului.",
      src: [WDE + " — «Ostern»", WDE + " — «Gesetzliche Feiertage in Deutschland»", WEN + " — «First Council of Nicaea»", EUS + " (V.23)"]
    },
    "Ostermontag (Luni de Paști)": {
      s: "Ostermontag, a doua zi de Paști, este sărbătoare legală în toate cele 16 landuri ale Germaniei. A rămas zi liberă legală după ce octava Paștelui a fost scurtată. Obiceiul „Emmausgang”, plimbarea de Lunea Paștelui, este menționat între obiceiurile Paștelui. El trimite la Evanghelia după Luca 24, unde doi ucenici merg spre Emaus.",
      src: [WDE + " — «Ostern»", WDE + " — «Gesetzliche Feiertage in Deutschland»", BIB + " (Luca 24)"]
    },
    "Tag der Arbeit (Ziua Muncii)": {
      s: "Tag der Arbeit, 1 mai, este sărbătoare legală în toate cele 16 landuri ale Germaniei. În 1886, mișcarea muncitorească nord-americană a chemat la grevă generală pe 1 mai pentru ziua de opt ore, iar după adunarea din Haymarket, de la Chicago, au urmat ciocniri violente. În 1889, congresul de întemeiere al Internaționalei a II-a a declarat 1 mai „zi de luptă a mișcării muncitorești”, iar în 1890 ziua a fost marcată pentru prima dată cu greve în masă și demonstrații în lume. În Germania, Adunarea Națională de la Weimar a vrut în 1919 să facă din 1 mai sărbătoare legală, dar regula a fost valabilă doar în acel an.",
      m: "În 1933, naziștii au făcut din 1 mai sărbătoare legală, cu numele „Tag der nationalen Arbeit”, iar pe 2 mai 1933 sindicatele au fost desființate. După 1945, Consiliul de Control Aliat a confirmat sărbătoarea în 1946. În Republica Federală, 1 mai este sărbătoare legală potrivit legilor sărbătorilor ale landurilor; în RDG denumirea oficială era „Zi internațională de luptă și sărbătoare a oamenilor muncii pentru pace și socialism”.",
      src: [WDE + " — «Maifeiertag»", WEN + " — «International Workers' Day»", WDE + " — «Gesetzliche Feiertage in Deutschland»"]
    },
    "Christi Himmelfahrt (Înălțarea)": {
      s: "Christi Himmelfahrt amintește înălțarea lui Isus la cer, povestită ca eveniment vizibil doar în Evanghelia după Luca și în Faptele Apostolilor; cele „patruzeci de zile” apar numai în Faptele Apostolilor (1:1-11). Sărbătoarea se ține a patruzecea zi a perioadei pascale, adică la 39 de zile după duminica Paștelui, și cade mereu într-o joi. În Germania este sărbătoare legală în toate landurile. În obiceiul laic, ziua a ajuns să fie „Vatertag”, iar în estul Germaniei și „Herrentag”.",
      m: "Zilele de rugăciune dinaintea sărbătorii sunt legate de procesiuni de rugăciune, înțelese ca mers prin câmpuri pentru o recoltă bună. Sărbătoarea e atestată în liturghia Ierusalimului din 383/384, prin jurnalul pelerinei Egeria. Potrivit Faptelor Apostolilor, doi bărbați în haine albe au spus ucenicilor că Isus va reveni în același chip în care L-au văzut mergând la cer.",
      src: [WDE + " — «Christi Himmelfahrt»", WEN + " — «Ascension of Jesus»", BIB + " (Fapte 1:1-11; Luca 24:50-53)"]
    },
    "Pfingstsonntag (Rusaliile)": {
      s: "Pfingsten, Rusaliile, comemorează coborârea Duhului Sfânt peste apostoli, povestită în Faptele Apostolilor 2:1-31, în timpul sărbătorii evreiești a Săptămânilor (Șavuot). Se ține la 50 de zile după Paști și este numită „ziua de naștere a Bisericii”. Șavuot cade la șapte săptămâni după Paștele evreiesc, iar numărătoarea celor cincizeci de zile vine din Leviticul 23:16. Pfingstsonntag nu apare între sărbătorile legale din toate cele 16 landuri, spre deosebire de Pfingstmontag.",
      m: "Apostolul Pavel notează în secolul I însemnătatea sărbătorii (Fapte 20:16; 1 Corinteni 16:8).",
      src: [WEN + " — «Pentecost»", BIB + " (Fapte 2; Leviticul 23:15-21)", WDE + " — «Gesetzliche Feiertage in Deutschland»"]
    },
    "Pfingstmontag (Luni de Rusalii)": {
      s: "Pfingstmontag, lunea de după Rusalii, este sărbătoare legală în toate cele 16 landuri ale Germaniei. Rusaliile amintesc coborârea Duhului Sfânt peste apostoli (Fapte 2) și se țin la 50 de zile după Paști. Sărbătoarea Săptămânilor (Șavuot), în timpul căreia s-a petrecut evenimentul, cade la șapte săptămâni după Paștele evreiesc.",
      src: [WDE + " — «Gesetzliche Feiertage in Deutschland»", WEN + " — «Pentecost»", BIB + " (Fapte 2)"]
    },
    "Tag der Deutschen Einheit (Ziua Unității Germane)": {
      s: "Pe 3 octombrie 1990, aderarea RDG la Republica Federală a devenit efectivă: noile landuri au intrat în sfera de aplicare a Legii Fundamentale, conform articolului 23. Articolul 2, alineatul 2 din Tratatul de unificare a declarat 3 octombrie sărbătoare legală cu numele „Tag der Deutschen Einheit”. Căderea Zidului Berlinului, pe 9 noiembrie 1989, fusese discutată ca dată, dar a fost socotită nepotrivită, fiindcă 9 noiembrie este și data pogromurilor din noiembrie 1938. 3 octombrie a fost cel mai apropiat termen posibil după conferința miniștrilor de externe ai CSCE din 2 octombrie, la care urmau să fie prezentate rezultatele negocierilor „Doi plus patru”.",
      m: "Sărbătoarea oficială se ține de regulă în capitala landului care deține președinția Consiliului Federal (Bundesrat), iar ordinea landurilor e reglementată prin Acordul de la Königstein, după numărul de locuitori. Au existat excepții, de pildă Bonn în 2011, Frankfurt pe Main în 2015 și Halle (Saale) în 2021.",
      src: [WDE + " — «Tag der Deutschen Einheit»", WDE + " — «Gesetzliche Feiertage in Deutschland»"]
    },
    "1. Weihnachtstag (Prima zi de Crăciun)": {
      s: "Weihnachten, Crăciunul, sărbătorește nașterea lui Isus, povestită în Evanghelia după Luca (2:1-7), iar Matei adaugă magii și fuga în Egipt; Ioan și Pavel presupun nașterea, fără să o descrie. Data de 25 decembrie este numită explicit pentru prima oară în Cronograful din 354, care se sprijină pe surse romane din 336, iar un adaos ulterior la Comentariul la Daniel al lui Hipolit al Romei dă tot 25 decembrie; originea datei rămâne neclară. În țările de limbă germană, Bescherung, darurile, se face de obicei în seara de 24 decembrie și este socotită partea principală a sărbătorii. Prima și a doua zi de Crăciun sunt sărbători legale în toate cele 16 landuri.",
      m: "Potrivit Wikipedia germană, Martin Luther a propus să se pună „Heiliger Christ” în locul Sfântului Nicolae ca aducător al darurilor. Până la sfârșitul secolului al XVIII-lea, Crăciunul se sărbătorea mai ales în biserici și pe străzi, între obiceiurile de stradă fiind menționate piețele de Crăciun (Weihnachtsmärkte). Protoevanghelia lui Iacov, scriere apocrifă, spune că Iosif a găsit o peșteră lângă Betleem, iar steaua i-a dus pe magi „până au venit în peșteră” (cap. 18-21); Evanghelia pseudo-Matei adaugă că „boul și asinul L-au adorat” (cap. 19).",
      src: [WDE + " — «Weihnachten»", WDE + " — «Gesetzliche Feiertage in Deutschland»", BIB + " (Luca 2:1-7; Matei 2)", PRO + ", cap. 18-21", PSM + ", cap. 19"]
    },
    "2. Weihnachtstag (A doua zi de Crăciun)": {
      s: "A doua zi de Crăciun, 26 decembrie, este sărbătoare legală în toate cele 16 landuri ale Germaniei. În Occident, 26 decembrie este ziua Sfântului Ștefan, primul martir creștin. Potrivit Faptelor Apostolilor 6-7, Ștefan era unul dintre cei șapte aleși să împartă ajutoarele, a vorbit în fața Sinedriului și a fost omorât cu pietre, în timp ce ucigașii și-au pus hainele la picioarele tânărului Saul, mai târziu apostolul Pavel. Eusebiu din Cezareea scrie (Istoria bisericească II.1) că Ștefan a fost primul, după Domnul, omorât cu pietre.",
      m: "Eusebiu adaugă că Ștefan a fost cel dintâi care a primit „cununa, potrivită cu numele lui”, a martirilor lui Hristos. Potrivit tradiției, în 415 preotul Lucian a avut un vis care i-a arătat locul moaștelor lui Ștefan, la Beit Jimal; moaștele au fost purtate în procesiune la biserica Hagia Sion pe 26 decembrie 415, de aceea această dată a devenit ziua sărbătorii în Occident.",
      src: [BIB + " (Fapte 6-7)", EUS + " (II.1)", WEN + " — «Saint Stephen»", WDE + " — «Gesetzliche Feiertage in Deutschland»"]
    }
  };

  window.SARBATORI_DETALII = { ro: RO, de: DE };
})();
