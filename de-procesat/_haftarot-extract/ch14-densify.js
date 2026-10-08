const CUVANTUL_FORMULA = {heb:"וַיְהִי דְבַר יְהוָה אֵלַי", translit:"vaihi devar Adonai ēlai", strong:"H1961", pos:"verb, qal imperfect consecutiv + substantiv construct + nume propriu", def_ro:"și a fost cuvântul DOMNULUI către mine.", dict_ro:"Formula standard de introducere a unei noi profeții, repetată identic la începutul fiecărei viziuni din acest capitol (1:4, 1:11, 1:13, 2:1) — o structură literară deliberată care marchează etapele succesive ale chemării lui Ieremia, de la vocație la cele trei viziuni confirmatoare."};
const DOMNUL_MI_A_SPUS = {heb:"וַיֹּאמֶר יְהוָה אֵלַי", translit:"vaiomer Adonai ēlai", strong:"H559", pos:"verb, qal imperfect consecutiv + nume propriu + prepoziție", def_ro:"și DOMNUL mi-a spus.", dict_ro:"Formula de răspuns divin direct, repetată de mai multe ori în acest capitol — fiecare obiecție sau viziune a lui Ieremia primește un răspuns imediat, personal, al DOMNULUI, fără intermediere."};
const CACI_EU_SUNT_CU_TINE = {heb:"כִּי אִתְּךָ אָנִי", translit:"ki itha ani", strong:"H854", pos:"conjuncție + prepoziție + sufix + pronume personal", def_ro:"căci Eu sunt cu tine.", dict_ro:"Metzudat David observă simetria compozițională: această promisiune, rostită aici la v.8, este reluată aproape identic la finalul capitolului (v.19), încadrând întreaga chemare profetică între aceeași asigurare de protecție divină, rostită la început și confirmată la sfârșit."};

module.exports = [
{v:"1:2", newTags:[
  ["regele lui Iuda", {heb:"מֶלֶךְ יְהוּדָה", translit:"meleh iehuda", strong:"H4428", pos:"substantiv construct + nume propriu", def_ro:"regele lui Iuda.", dict_ro:"Titlul regal standard, folosit pentru a fixa exact domnia în care Ieremia își începe profeția — Ioșiahu, al treisprezecelea an al domniei sale — reper cronologic precis, reluat identic pentru fiecare rege următor menționat în capitol."}]
]},
{v:"1:3", newTags:[
  ["regele lui Iuda", {heb:"מֶלֶךְ יְהוּדָה", translit:"meleh iehuda", strong:"H4428", pos:"substantiv construct + nume propriu", def_ro:"regele lui Iuda.", dict_ro:"Titlul regal se repetă identic pentru Iehoiakim, marcând a doua etapă cronologică a activității profetice a lui Ieremia."}],
  ["regele lui Iuda", {heb:"מֶלֶךְ יְהוּדָה", translit:"meleh iehuda", strong:"H4428", pos:"substantiv construct + nume propriu", def_ro:"regele lui Iuda.", dict_ro:"A treia repetare a titlului, pentru Țedechia — Metzudat David explică succesiunea cronologică precisă a versetului: activitatea profetică a lui Ieremia s-a întins de-a lungul domniilor a trei regi succesivi, încheindu-se odată cu exilul."}],
  ["în a cincea lună", {heb:"בַּחֹדֶשׁ הַחֲמִישִׁי", translit:"bahodeș hahamiși", strong:"H2320", pos:"substantiv + numeral ordinal", def_ro:"în luna a cincea.", dict_ro:"Metzudat David precizează data exactă a exilului — luna a cincea a anului al unsprezecelea al lui Țedechia — fixând cronologic distrugerea Ierusalimului, evenimentul care încheie activitatea profetică descrisă în acest verset."}]
]},
{v:"1:4", newTags:[
  ["Cuvântul DOMNULUI a venit la mine", CUVANTUL_FORMULA]
]},
{v:"1:5", newTags:[
  ["înainte ca tu să fi ieșit din", {heb:"וּבְטֶרֶם תֵּצֵא", translit:"uvterem tēțē", strong:"H2962", pos:"adverb + verb, qal imperfect", def_ro:"și înainte ca [tu] să ieși din.", dict_ro:"Repetarea particulei beterem («înainte ca») leagă cele două etape ale alegerii divine — plăsmuirea în pântece și ieșirea din el — într-o singură afirmație a cunoașterii lui Dumnezeu, anterioară oricărei existențe vizibile a profetului."}]
]},
{v:"1:7", newTags:[
  ["Iar DOMNUL mi-a spus", DOMNUL_MI_A_SPUS],
  ["Să nu spui: «eu sunt [încă] tânăr»", {heb:"אַל תֹּאמַר נַעַר אָנֹכִי", translit:"al tomar naar anohi", strong:"H408", pos:"particulă negativă + verb, qal jusiv + substantiv + pronume personal", def_ro:"nu spune: «[sunt] tânăr eu».", dict_ro:"DOMNUL citează direct, pentru a o respinge, obiecția exactă pe care Ieremia tocmai a rostit-o la v.6 — «căci sunt [încă] tânăr» — un procedeu retoric care arată că nicio scuză personală nu anulează chemarea primită."}],
  ["vei merge", {heb:"תֵּלֵךְ", translit:"tēlēh", strong:"H3212", pos:"verb, qal imperfect", def_ro:"vei merge.", dict_ro:"Verbul halah («a merge»), folosit aici în paralel strict cu «vei vorbi» din a doua parte a versetului — cele două verbe acoperă integral misiunea profetică: deplasarea fizică la cei trimiși și cuvântul transmis lor."}],
  ["vei vorbi", {heb:"תְּדַבֵּר", translit:"tedabēr", strong:"H1696", pos:"verb, piel imperfect", def_ro:"vei vorbi.", dict_ro:"Rashi explică: tot ce îi va porunci DOMNUL să spună lui Israel — misiunea lui Ieremia nu-i cere să inventeze mesajul, ci doar să-l transmită exact, cuvânt cu cuvânt."}]
]},
{v:"1:8", newTags:[
  ["căci Eu sunt cu tine", CACI_EU_SUNT_CU_TINE]
]},
{v:"1:10", newTags:[
  ["Privește", {heb:"רְאֵה", translit:"reē", strong:"H7200", pos:"verb, qal imperativ", def_ro:"vezi, privește.", dict_ro:"Rădăcina raah («a vedea») leagă acest imperativ de motivul central al capitolului — cele trei viziuni ulterioare (nuiaua de migdal, cazanul clocotind) continuă tema «văzutului» ca mod de revelație profetică, alături de cuvântul auzit."}]
]},
{v:"1:11", newTags:[
  ["Cuvântul DOMNULUI a venit la mine", CUVANTUL_FORMULA],
  ["Ce vezi, Ieremia?", {heb:"מָה אַתָּה רֹאֶה יִרְמְיָהוּ", translit:"ma ata roe irmeiahu", strong:"H4100", pos:"particulă interogativă + pronume + verb, qal participiu + nume propriu", def_ro:"ce vezi tu, Ieremia?", dict_ro:"Întrebarea, adresată direct pe nume, deschide prima dintre cele două viziuni-pereche ale capitolului (nuiaua de migdal și cazanul clocotind) — un dialog direct, nu o viziune impusă fără explicație."}]
]},
{v:"1:12", newTags:[
  ["DOMNUL mi-a spus: „Ai văzut bine", {heb:"וַיֹּאמֶר יְהוָה אֵלַי הֵיטַבְתָּ לִרְאוֹת", translit:"vaiomer Adonai ēlai hētavta lirot", strong:"H3190", pos:"verb, qal imperfect consecutiv + nume propriu + verb, hifil perfect + verb, qal infinitiv", def_ro:"și DOMNUL mi-a spus: ai făcut bine să vezi.", dict_ro:"Rashi explică: migdalul (șaked) se grăbește să dea floare înaintea tuturor pomilor, iar DOMNUL Se grăbește (șokēd, joc de cuvinte cu șaked) să-Și împlinească cuvântul — confirmarea divină a viziunii se bazează pe un calambur ebraic pe care traducerea îl poate păstra doar prin notă."}]
]},
{v:"1:13", newTags:[
  ["Cuvântul DOMNULUI a venit la mine a doua oară", {heb:"וַיְהִי דְבַר יְהוָה אֵלַי שֵׁנִית", translit:"vaihi devar Adonai ēlai șēnit", strong:"H1961", pos:"verb, qal imperfect consecutiv + substantiv construct + nume propriu + numeral ordinal", def_ro:"și a fost cuvântul DOMNULUI către mine, a doua oară.", dict_ro:"Precizarea «a doua oară» leagă explicit această viziune de cea precedentă (nuiaua de migdal) — cele două viziuni formează o pereche: prima anunță graba împlinirii, a doua arată direcția exactă a pedepsei, de la miazănoapte."}],
  ["Ce vezi?", {heb:"מָה אַתָּה רֹאֶה", translit:"ma ata roe", strong:"H4100", pos:"particulă interogativă + pronume + verb, qal participiu", def_ro:"ce vezi?", dict_ro:"Repetarea formulei de întrebare din v.11, aici fără numele profetului — a doua viziune a dialogului continuă direct firul primei, fără nevoia unei noi adresări explicite."}]
]},
{v:"1:14", newTags:[
  ["DOMNUL mi-a spus", DOMNUL_MI_A_SPUS],
  ["De la miazănoapte", {heb:"מִצָּפוֹן", translit:"mițafon", strong:"H6828", pos:"substantiv", def_ro:"de la nord.", dict_ro:"Țafon — «miazănoapte», direcția exactă indicată deja de gura cazanului clocotind din viziunea precedentă (v.13) — Metzudat David leagă direct cele două versete: capacul cazanului, aflat cu gura spre nord, se deschide acum efectiv, iar răul se revarsă de acolo peste toată țara."}]
]},
{v:"1:15", newTags:[
  ["tuturor regatelor de la miazănoapte", {heb:"מַמְלְכוֹת צָפוֹנָה", translit:"mamlehot țafona", strong:"H4467", pos:"substantiv construct + substantiv", def_ro:"regatelor dinspre miazănoapte.", dict_ro:"Radak explică: «regatele» se referă la regi, căpeteniile regatelor de sub stăpânirea Babilonului — regele cel mare fiind Nabucodonosor, iar celelalte căpetenii pomenite mai departe în carte, la căderea Ierusalimului."}],
  ["și fiecare va veni și își va pune", {heb:"וּבָאוּ וְנָתְנוּ אִישׁ", translit:"uvau venatnu iș", strong:"H935", pos:"verb, qal perfect consecutiv + verb, qal perfect consecutiv + substantiv", def_ro:"și vor veni și va pune fiecare om.", dict_ro:"Radak explică: fiecare dintre căpeteniile regale își va pune scaunul în fața intrărilor porților și pe ziduri, ca să asedieze cetatea de jur împrejur — imaginea unui consiliu de război instalat chiar la porțile Ierusalimului."}],
  ["la intrarea porților Ierusalimului", {heb:"פֶּתַח שַׁעֲרֵי יְרוּשָׁלִַם", translit:"petah șaarē ierușalam", strong:"H6607", pos:"substantiv construct + substantiv construct + nume propriu", def_ro:"la intrarea porților Ierusalimului.", dict_ro:"Localizarea precisă a tronurilor asediatorilor chiar la porțile cetății arată apropierea totală, fără bariere, a amenințării descrise — nu o invazie îndepărtată, ci o asediere directă a punctului de acces al Ierusalimului."}],
  ["și peste toate orașele din Iuda", {heb:"וְעַל כָּל עָרֵי יְהוּדָה", translit:"veal kal arē iehuda", strong:"H5892", pos:"prepoziție + substantiv construct + substantiv plural construct + nume propriu", def_ro:"și peste toate cetățile lui Iuda.", dict_ro:"Extinderea amenințării dincolo de capitală, la toate cetățile lui Iuda, arată amploarea totală a invaziei prezise — nu doar Ierusalimul, ci întreaga țară devine ținta asediului venit de la miazănoapte."}]
]},
{v:"1:16", newTags:[
  ["și s-au prosternat înaintea lucrării mâinilor lor", {heb:"וַיִּשְׁתַּחֲווּ לְמַעֲשֵׂי יְדֵיהֶם", translit:"vaiștahavu lemaasē iedēhem", strong:"H7812", pos:"verb, hitpael imperfect consecutiv + substantiv construct + substantiv + sufix", def_ro:"și s-au prosternat înaintea lucrărilor mâinilor lor.", dict_ro:"Ironia profetică standard a idolatriei: poporul se prosternează nu înaintea unui dumnezeu real, ci înaintea obiectelor create de propriile lor mâini — aceeași acuzație centrală care leagă acest verset de interdicția idolatriei din toată literatura profetică."}]
]},
{v:"1:17", newTags:[
  ["și scoală-te, și vorbește cu ei tot ceea ce îți voi porunci Eu", {heb:"וְקַמְתָּ וְדִבַּרְתָּ אֲלֵיהֶם אֵת כָּל אֲשֶׁר אָנֹכִי אֲצַוֶּךָּ", translit:"vekamta vedibarta alēhem ēt kal așer anohi ațaveka", strong:"H6965", pos:"verb, qal perfect consecutiv + verb, piel perfect consecutiv + prepoziție + sufix + marcă a complementului direct + substantiv construct + particulă relativă + pronume personal + verb, piel imperfect + sufix", def_ro:"și te vei scula și vei vorbi către ei tot ce îți voi porunci Eu.", dict_ro:"Porunca dublă — a se ridica și a vorbi — reia structura din v.7 («vei merge»/«vei vorbi»), confirmând că misiunea lui Ieremia constă exclusiv în transmiterea exactă a cuvântului primit, fără adaos propriu."}]
]},
{v:"1:18", newTags:[
  ["împotriva conducătorilor săi", {heb:"לְשָׂרֶיהָ", translit:"lesareha", strong:"H8269", pos:"substantiv plural construct + sufix", def_ro:"împotriva căpeteniilor ei.", dict_ro:"Sarim — «căpetenii, conducători, nobili» — enumerarea completă a claselor sociale ale lui Iuda (regi, conducători, preoți, popor) arată că rezistența pe care Ieremia o va înfrunta va veni din toate straturile societății, nu doar de la o singură autoritate."}],
  ["și împotriva poporului țării", {heb:"וּלְעַם הָאָרֶץ", translit:"ulam haareț", strong:"H5971", pos:"substantiv construct + substantiv", def_ro:"și împotriva poporului țării.", dict_ro:"Încheierea enumerării cu «poporul țării» completează lista opoziției totale pe care Ieremia o va înfrunta — de la rege până la omul de rând, nimeni nu-l va scuti de confruntare."}]
]},
{v:"1:19", newTags:[
  ["căci Eu sunt cu tine", CACI_EU_SUNT_CU_TINE]
]},
{v:"2:1", newTags:[
  ["Cuvântul DOMNULUI a venit la mine", CUVANTUL_FORMULA],
  ["spunând", {heb:"לֵאמֹר", translit:"lēmor", strong:"H559", pos:"verb, qal infinitiv", def_ro:"spunând, zicând.", dict_ro:"Formula standard care pregătește citarea directă a cuvântului divin — aici introduce profeția centrală a capitolului, adresată direct Ierusalimului."}]
]},
{v:"2:2", newTags:[
  ["Du-te și vestește în auzul Ierusalimului", {heb:"הָלֹךְ וְקָרָאתָ בְאָזְנֵי יְרוּשָׁלִַם", translit:"haloh vekarata veaznē ierușalam", strong:"H1980", pos:"verb, qal infinitiv absolut + verb, qal perfect consecutiv + substantiv construct + nume propriu", def_ro:"du-te și vestește în auzul Ierusalimului.", dict_ro:"Porunca introduce una dintre cele mai cunoscute profeții de consolare din toată cartea — imaginea tinereții de legământ a lui Israel, rostită direct «în auzul» cetății, ca o chemare personală, nu un decret impersonal."}],
  ["ritualurilor tale nupțiale", {heb:"כְּלוּלֹתָיִךְ", translit:"kelulotaih", strong:"H3623", pos:"substantiv plural construct + sufix", def_ro:"nunții tale, logodnei tale.", dict_ro:"Rashi explică: kelulotaih înseamnă «aducere înăuntru», adică nunta — imaginea legământului de la Sinai ca o căsătorie, cu Israel adus «sub baldachin» de DOMNUL Însuși, rămâne una dintre cele mai puternice metafore ale relației dintre Dumnezeu și poporul Său."}]
]},
{v:"2:3", newTags:[
  ["răul se va abate asupra lor", {heb:"רָעָה תָּבֹא אֲלֵיהֶם", translit:"raa tavo alēhem", strong:"H7451", pos:"substantiv + verb, qal imperfect + prepoziție + sufix", def_ro:"răul va veni asupra lor.", dict_ro:"Rashi explică: așa cum pârga secerișului dinaintea omerului e oprită de la mâncare, iar cel ce o mănâncă se face vinovat, tot așa toți cei care «îl mănâncă» pe Israel — îl asupresc sau îl exploatează — se expun aceleiași pedepse divine garantate."}]
]}
];
