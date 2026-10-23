// Dicționar biblic pentru 2 Samuel 6:1-7:17 (Haftarat Șemini, rit așkenaz) — versetele 6:1-19 vin din bank-c28
const b24 = require('./bank-c24.js');
const b25 = require('./bank-c25.js');
const b26 = require('./bank-c26.js');
const b27 = require('./bank-c27.js');
const reuse = {};
['H1129', 'H859', 'H168', 'H7931', 'H3678', 'H3824'].forEach(k => { reuse[k] = b25[k]; });
['H428'].forEach(k => { reuse[k] = b24[k]; });
['H595'].forEach(k => { reuse[k] = b26[k]; });
['H2617'].forEach(k => { reuse[k] = b27[k]; });
module.exports = Object.assign({}, require('./bank-c28.js'), reuse, {
  H589: { x: `Ani, „eu”, este pronumele pe care Dumnezeu îl rostește când Își aduce aminte de binefacerile făcute lui David: „Eu te-am luat de la stână”. Accentul pe „eu” arată că ridicarea lui David este lucrarea lui Dumnezeu, nu a omului.` },
  H7725: { x: `Șuv înseamnă „a se întoarce”. David se întoarce acasă după ce a binecuvântat poporul, ca să-și binecuvânteze și casa; sărbătoarea publică se încheie în viața de familie.` },
  H7125: { x: `Qara în forma de infinitiv „likrat” înseamnă „în întâmpinarea”. Mical iese în întâmpinarea lui David, dar nu ca să-l primească, ci ca să-l mustre.` },
  H3513: { x: `Kavad în Nifal înseamnă „a fi cinstit”, „a fi greu de demnitate”. Mical spune cu ironie cât de „cinstit” a fost regele, iar David îi răspunde că va fi cinstit tocmai între slujnicele pe care ea le-a pomenit.` },
  H1540: { x: `Gala în Nifal înseamnă „a se descoperi”, „a se dezveli”. Mical spune că David s-a descoperit în ochii slujnicelor, ca un om de rând, o acuzație de lipsă de demnitate.` },
  'H1540+H1540': { x: `„Kehigalot niglot”, „cum se descoperă cel care se descoperă”, este o repetare a rădăcinii, cu sens de dispreț. Mical îl compară pe David cu un om fără rușine care se dezvelește în public.` },
  H519: { x: `Ama înseamnă „slujnică”, „roabă”. Mical pomenește disprețuitor slujnicele slujitorilor lui David; David răspunde că tocmai între ele va fi cinstit.` },
  H259: { x: `Ehad înseamnă „unul”. „Unul dintre cei de nimic” arată cum își închipuie Mical un om oarecare care se dezvelește fără rușine.` },
  H7386: { x: `Reqim sunt „cei deșerți”, „cei goi”, oamenii fără valoare morală. Mical îl asemuiește pe David cu unul dintre ei.` },
  H1: { x: `Av înseamnă „tată”. David se referă la „tatăl tău”, adică la Saul, ca să arate că a fost ales în locul casei lui; mai târziu, „părinții tăi” sunt strămoșii cu care David se va odihni.` },
  H6680: { x: `Țivah în Piel înseamnă „a porunci”, „a rândui”. Dumnezeu „poruncește” judecători peste poporul Său și, mai târziu, rânduiește să fie ridicat un conducător; rânduiala vine de sus.` },
  H5057: { x: `Nagid înseamnă „conducător”, „cel pus în frunte”, titlul pe care îl dă Dumnezeu celui ales, înainte de a fi numit „rege”, ca în 1 Samuel 9:16. David este numit „nagid” peste poporul DOMNULUI.` },
  H7043: { x: `Qalal în Nifal înseamnă „a fi disprețuit”, „a fi socotit ușor”. David spune că este gata să fie socotit și mai mic decât până acum, pentru slava DOMNULUI.` },
  H2063: { x: `Zot, „aceasta”, arată către ce a spus Mical. „Mai de nimic decât aceasta” înseamnă: și mai umil decât ce ai văzut acum.` },
  H8217: { x: `Șafal înseamnă „jos”, „umil”. David este gata să fie umil în ochii lui însuși, ceea ce arată că adevărata cinste vine de la Dumnezeu, nu din ținuta regală.` },
  H3206: { x: `Ialed înseamnă „copil”. Mical nu a avut copii până la moarte; Biblia nu spune clar cauza, dar încheie scena de dispreț cu o remarcă asupra lipsei descendenților.` },
  H4194: { x: `Mavet înseamnă „moarte”. „Până în ziua morții ei” arată durata stării de fără copii, o stare care taie linia lui Saul.` },
  H5117: { x: `Nuah în Hifil înseamnă „a da odihnă”. Dumnezeu îi dă lui David odihnă de dușmani, ceea ce deschide drumul gândului de a zidi o casă pentru Chivot.` },
  H341: { x: `Oiev înseamnă „dușman”. David avea mulți dușmani de jur împrejur; odihna de ei este condiția pentru a ajunge la planul Templului.` },
  H5439: { x: `Saviv înseamnă „de jur împrejur”. Odihna este totală: din toate părțile, de la toți dușmanii.` },
  H5030: { x: `Navi înseamnă „profet”, cel care vorbește în numele lui Dumnezeu. Natan este profetul de curte care aduce cuvântul lui Dumnezeu lui David.` },
  H5416: { x: `Natan înseamnă „El a dat”. Este profetul care vestește lui David făgăduința dinastiei; același profet îl va mustra mai târziu pentru păcatul cu Bat-Șeba.` },
  H730: { x: `Erez înseamnă „cedru”, lemnul scump al Libanului, folosit la palate și la Templu. David locuiește într-o casă de cedru, în timp ce Chivotul este sub pânze.` },
  H8432: { x: `Tavek înseamnă „mijloc”, „în mijlocul”. Chivotul stă „în mijlocul pânzelor”, adică într-un cort, în contrast cu casa de cedru a regelui.` },
  H3407: { x: `Ieria este „pânza” sau „perdeaua” din care era făcut cortul. Chivotul stă între perdele, într-un spațiu provizoriu, în vreme ce David stă într-o casă de lemn nobil.` },
  H3915: { x: `Laila înseamnă „noapte”. Cuvântul DOMNULUI vine în aceeași noapte la Natan, ceea ce arată că hotărârea Lui nu a așteptat a doua zi.` },
  'H3117+H2088': { x: `„Ad haiom haze”, „până în ziua aceasta”, spune că Dumnezeu nu a locuit într-o casă din ziua ieșirii din Egipt până atunci, o vreme foarte lungă.` },
  'H1961+H1980': { x: `„Vaehie mithalekh”, „am fost umblând”, descrie un Dumnezeu mereu în mișcare, care însoțește poporul în cort și în tabernacol, nu un Dumnezeu fixat într-o clădire.` },
  H4908: { x: `Miškan înseamnă „locaș”, „tabernacol”, de la „a locui”. Este locuința mobilă a lui Dumnezeu din pustie; Dumnezeu spune că S-a mulțumit cu ea timp de secole.` },
  H1696: { x: `Dibber în Piel înseamnă „a vorbi”. Dumnezeu întreabă dacă a vorbit vreodată vreunui judecător despre o casă din cedru: nu a cerut niciodată una.` },
  H7462: { x: `Raa înseamnă „a păși”, „a păstori”. Dumnezeu spune că a poruncit conducătorilor să păstorească poporul, nu să-I zidească case; David este păstor luat de la oi.` },
  H3947: { x: `Laqah înseamnă „a lua”. Dumnezeu îl ia pe David de la turme și îl pune conducător; ridicarea lui este un dar, nu un merit.` },
  H5116: { x: `Naveh înseamnă „pășune”, „stână”. David păstorea oile; Dumnezeu amintește de începutul lui modest ca să arate că tot ce are vine de la El.` },
  H6629: { x: `Țon înseamnă „turmă de oi și capre”. De la păstoritul turmelor, David este ridicat să fie conducător peste Israel.` },
  H3772: { x: `Karat în Hifil înseamnă „a tăia”, „a nimici”. Dumnezeu spune că a nimicit pe toți dușmanii lui David, ceea ce a făcut ca numele lui să fie mare.` },
  H1419: { x: `Gadol înseamnă „mare”. Numele lui David va fi mare, ca numele celor mari de pe pământ, făgăduință asemănătoare celei date lui Avraam.` },
  H5193: { x: `Nata înseamnă „a planta”. Dumnezeu plantează Israelul în locul lui, ca pe un pom care are rădăcini și nu mai este smuls.` },
  H7264: { x: `Ragaz înseamnă „a tremura”, „a se agita”. În țara lui, Israelul nu va mai tremura, adică va trăi în siguranță.` },
  'H1121+H5766': { x: `„Bnei avla”, „fiii nedreptății”, sunt oamenii nedrepți care chinuiau poporul înainte. În limbajul biblic, „fiii lui” înseamnă cei care aparțin unei însușiri.` },
  H3254: { x: `Iasaf înseamnă „a adăuga”, „a continua”. Fiii nedreptății nu vor mai continua să-l chinuie pe Israel, o făgăduință de oprire a asupririi.` },
  H6031: { x: `Ana în Piel înseamnă „a asupri”, „a chinui”. Asuprirea poporului de către dușmani este încheiată prin făgăduința lui Dumnezeu.` },
  H7223: { x: `Rișon înseamnă „la început”, „mai înainte”. „Ca la început” trimite la vremea judecătorilor, când Israel era asuprit.` },
  H8199: { x: `Șofet înseamnă „judecător”, conducătorul care îl apăra pe Israel înaintea regalității. Dumnezeu amintește că i-a rânduit, apoi spune că îi va da lui David odihnă.` },
  H4390: { x: `Male în forma folosită aici înseamnă „a se împlini”. Zilele lui David se vor împlini, adică va ajunge la sfârșitul vieții, fără ca făgăduința să se sfârșească.` },
  H7901: { x: `Șakav înseamnă „a se culca”; „a se culca cu părinții” este expresia pentru moarte. David se va culca cu părinții lui, dar descendenții lui rămân.` },
  H4578: { x: `Meim sunt „măruntaiele”, „coapsele”, locul din care iese urmașul trupesc. „Cel ce va ieși din coapsele tale” este un fiu al lui David, Solomon.` },
  H3559: { x: `Kun înseamnă „a statornici”, „a întemeia”. Dumnezeu făgăduiește că va întemeia domnia urmașului și tronul lui pe veci.` },
  H4467: { x: `Mamlaha înseamnă „regat”, „domnie”. Domnia lui David și a urmașilor lui este făgăduită de Dumnezeu ca stabilă și veșnică.` },
  H5753: { x: `Avah în Hifil înseamnă „a păcătui”, „a face rău”. Urmașul lui David va fi mustrat dacă păcătuiește, dar nu va fi lepădat.` },
  H3198: { x: `Iakah în Hifil înseamnă „a mustra”, „a îndrepta”. Dumnezeu va mustra pe fiul lui David cu un toiag omenesc, ca un tată care îl disciplinează pe copil.` },
  H7626: { x: `Șevet înseamnă „toiag”. Toiagul este instrumentul disciplinării; mustrarea nu vine din răzbunare, ci din grija unui tată pentru fiul lui.` },
  H5061: { x: `Nega înseamnă „lovitură”, „plagă”. „Loviturile omenești” sunt pedepsele prin mâna oamenilor, nu o respingere definitivă de către Dumnezeu.` },
  'H1121+H120': { x: `„Bnei adam”, „fiii omului”, înseamnă oameni. Dumnezeu va mustra prin oameni, nu prin distrugere divină directă.` },
  H2384: { x: `Hizaion înseamnă „viziune”. Natan comunică lui David toate cuvintele și toată viziunea primită, ca un mesager fidel.` }
});
