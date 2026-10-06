// textCompare + commentaries pentru capitolul 1 (1 Samuel 20:18-42)
const lxx = require('./lxx-1Sam-20.json');
function tc(v, translation, note) {
  return [
    {source:"Textul Masoretic (ebraică)", original:"[vezi heb]", translation:translation0(v), note:""},
    {source:"Septuaginta (greacă, sec. III-II î.Hr.)", original:lxx[v], greek:true, translation, note: note||"Corespondență strânsă cu Textul Masoretic."}
  ];
}
function translation0(v){ return "— traducerea rabinului Rosen, vezi textul principal."; }

const C = {};

C["20:18"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Mâine este Luna Nouă” — e obiceiul tuturor celor care mănâncă la masa regelui să vină la masă în ziua de sărbătoare. „Și lipsa ta va fi observată” — tatăl meu te va căuta și va întreba unde ești, căci locul tău va fi gol. Ionatan presupunea că, din respect pentru David, nimeni nu-i va lua locul."}
]};
C["20:19"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Vreme de trei zile” — să întreiești zilele, și apoi să cobori foarte mult, adică atunci când vine a treia zi, să te ascunzi bine, căci atunci te vor căuta. Și vei veni la acel loc ascuns, unde ești ascuns azi, o zi de lucru. „Stânca reper” — o piatră care era reper pentru călători; alții spun că piatra reper era folosită ca țintă pentru tras cu săgeți."}
]};
C["20:21"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Iată, voi trimite apoi un tânăr” — e obiceiul celui care caută o săgeată trasă să meargă spre locul unde o vede zburând, dar nu poate calcula exact; câteodată caută și săgeata e dincolo de el, câteodată trece dincolo de săgeată și o caută, și prin aceasta vei ști [răspunsul]."}
]};
C["20:22"] = {comm:[
 {author:"Radak (1160–1235)", text:"„Căci DOMNUL te-a trimis” — așa traduce și Targumul: „căci DOMNUL te-a izbăvit” — adică du-te, căci DOMNUL te-a trimis și ai scăpat de sabia tatălui meu."}
]};
C["20:23"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Cât despre lucrul de care am vorbit” — legământul pe care l-am făcut împreună. „Iată, DOMNUL [este martor] între mine și tine” — un martor cu privire la acel lucru."}
]};
C["20:28"] = {comm:[
 {author:"Metzudat David", text:"„Mi-a cerut voie” — de la mine a cerut voie să se ducă până la Betleem."}
]};
C["20:32"] = {comm:[
 {author:"Metzudat David", text:"„Ce a făcut?” — dacă DOMNUL l-a făcut rege [pe David], ce vină are el, Ionatan, în asta?"}
]};
C["20:31"] = {comm:[
 {author:"Metzudat David", text:"„Căci cât timp” — [Șaul spune] dacă nu alegi ca el să domnească, nu-l vei putea scăpa din mâna mea, căci toate zilele vieții lui [regatul] nu va fi întemeiat, nici tu, nici regatul. „Trimite deci” — din moment ce tu i-ai dat voie să plece, ție îți revine să-l aduci înapoi, căci e condamnat la moarte, și eu îl voi ucide."}
]};
C["20:25"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Pe scaunul de lângă perete” — în capul canapelei, lângă perete. „Ionatan s-a ridicat” — s-a ridicat de pe locul lui, pentru că nu se cuvenea ca un fiu să stea culcat alături de tatăl său: obiceiul era să mănânce întinși pe canapele, iar David stătea de obicei între Ionatan și Șaul. Cum David n-a venit, Ionatan nu s-a mai întins pe locul lui, până ce Avner n-a șezut lângă Șaul — și abia atunci Ionatan a șezut lângă Avner."},
 {author:"Metzudat David", text:"Ordinea locurilor la masă era: David ședea alături de rege, după el Ionatan, după el Avner. Regele a șezut la locul lui, Ionatan la locul lui, Avner la locul lui — dar, neputând David să vină, Ionatan a rămas așezat direct lângă tatăl său, fără nimeni între ei, lucru nepotrivit pentru un fiu. De aceea Ionatan s-a ridicat, s-a mutat pe locul lui Avner, iar Avner a șezut în locul lui Ionatan, lângă Șaul — ca intermediar între tată și fiu."}
]};
C["20:26"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„S-a întâmplat ceva” — a avut o scurgere [involuntară]. „Trebuie să fie necurat” — încă nu s-a scufundat ritual pentru acea scurgere, căci dacă s-ar fi scufundat, n-ar mai fi trebuit să așteapte asfințitul pentru a mânca hrană obișnuită."},
 {author:"Radak (1160–1235)", text:"Șaul și-a spus în sinea lui: i s-a întâmplat ceva care-l ține ocupat, fie că e curat, fie necurat printr-o scurgere de noapte; de aceea nu a venit. Poate că la masa regală de Roș Hodeș se serveau și jertfe de pace, și păzeau cu strictețe să nu se amestece curatul cu necuratul, chiar la mâncare obișnuită."}
]};
C["20:27"] = {comm:[
 {author:"Radak (1160–1235)", text:"„În ziua de după Luna Nouă, a doua zi” — adică a doua zi a lunii; Targumul Ionatan traduce „în ziua următoare, care e a doua zi a lunii.”"}
]};
C["20:29"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Și el, fratele meu, mi-a poruncit” — cel mai mare al casei m-a chemat să fiu acolo; „el” este fratele meu Eliav."},
 {author:"Metzudat David", text:"„Ospăț de familie” — în acea zi, cei din familia lui David aduceau în cetatea lor jertfe de pace. „El mi-a poruncit” — Ionatan explică cine a poruncit: Eliav, fratele cel mai mare, cel care avea autoritatea să poruncească."}
]};
C["20:30"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Fiu de femeie nesupusă [și] răzvrătită” — naavat e un cuvânt de la rădăcina „a se abate, a rătăci”, o femeie care rătăcește; o altă explicație: aluzie la episodul din Judecători, când bărbații lui Beniamin au răpit fetele din Șilo care dansau în vii — Șaul, rușinat, nu voia să ia una din ele cu forța, până ce una a venit ea însăși, purtându-se necuviincios, și l-a urmărit."},
 {author:"Metzudat David", text:"„Fiu de femeie nesupusă” — așa cum mama ta s-a răzvrătit prin fapta ei de atunci, tot așa tu, fiul ei, te răzvrătești acum. „Nu știu eu?” — de mult știam că tu îl preferi pe fiul lui Ișai să domnească, spre rușinea ta și spre rușinea goliciunii descoperite a mamei tale — căci oamenii vor zice: mama lui s-a pângărit, iar el nu-i cu adevărat fiul lui Șaul, de-aceea iubește pe vrăjmașii lui Șaul."},
 {author:"Metzudat Țion", text:"„Naavat” — de la rădăcina avah (nelegiuire, abatere). „Hamardut” — de la rădăcina marad (a se răzvrăti). „Ervat” — expune rușinea ascunsă, ca în „descoperirea goliciunii” (Deuteronomul 24:1)."}
]};
C["20:33"] = {comm:[
 {author:"Metzudat David", text:"„Căci s-a desăvârșit” — [Ionatan a înțeles] că decizia tatălui său de a-l ucide pe David era deplin luată, fără cale de întoarcere."}
]};
C["20:34"] = {comm:[
 {author:"Radak (1160–1235)", text:"Ionatan n-a mâncat în a doua zi a Lunii Noi din două pricini, amândouă „din cauza lui David”: întâi, s-a întristat văzând că tatăl său era hotărât să-l ucidă pe David, și al doilea, pentru că tatăl lui îl umilise pe el însuși, atât prin vorbă, cât și prin fapta de a arunca sulița asupra lui."}
]};
C["20:36"] = {comm:[
 {author:"Radak (1160–1235)", text:"După ce a tras prima săgeată, tânărul a alergat după ea; cât încă alerga, Ionatan a tras a doua, ca s-o facă să zboare mai departe decât prima — tocmai semnalul convenit cu David."}
]};
C["20:37"] = {comm:[
 {author:"Metzudat David", text:"„Locul săgeții” — cea pe care o trăsese prima dată. „Nu e oare săgeata” — cea trasă ultima, nu e ea de la tine și mai departe?"}
]};
C["20:38"] = {comm:[
 {author:"Metzudat David", text:"„Grăbește-te iute” — aleargă repede după a doua [săgeată] și nu te opri la locul primei. „Săgețile” — prima și a doua, amândouă."}
]};
C["20:39"] = {comm:[
 {author:"Metzudat David", text:"„N-a știut nimic” — despre semnul făcut prin tragerea acestor săgeți."}
]};
C["20:40"] = {comm:[
 {author:"Metzudat David", text:"„Armele lui” — arcul și săgețile."}
]};
C["20:41"] = {comm:[
 {author:"Rashi (1040–1105)", text:"„Până ce David [a plâns] mai mult” — adică mai mult decât Ionatan: David a plâns mai mult pentru că, pe când Ionatan se putea întoarce acasă liniștit, David trebuia să fugă de Șaul, care-i căuta viața."},
 {author:"Radak (1160–1235)", text:"„De lângă partea de miazăzi” — de partea de sud a pietrei Ezel, căci Ionatan a tras săgețile spre partea de nord a ei, ca să nu-l vadă tânărul pe David atunci când aduna săgețile."}
]};
C["20:42"] = {comm:[
 {author:"Mișna, Avot 5:16", text:"„Orice iubire care depinde de un lucru [anume] — când lucrul acela piere, piere și iubirea; iar cea care nu depinde de nimic, nu piere niciodată. Care e iubirea ce depinde de un lucru? Iubirea lui Amnon și a Tamarei. Și care e cea care nu depinde de nimic? Iubirea lui David și a lui Ionatan.” Mișna citează exact acest legământ, reînnoit aici la despărțirea finală, ca exemplul clasic al unei prietenii necondiționate."},
 {author:"Context ANE", text:"Formula legământului „între mine și tine... între sămânța mea și sămânța ta, în veci” urmează tiparul tratatelor regale de legământ din Orientul Apropiat antic (frecvente între suzerani și vasali hitiți sau asirieni), care își extindeau obligațiile dincolo de viața celor doi semnatari, asupra urmașilor lor — exact cum David va respecta mai târziu acest jurământ față de Mefiboșet, fiul lui Ionatan (2 Samuel 9)."},
 {author:"Radak (1160–1235)", text:"„Ce-am jurat” — adu-ți aminte ce-am jurat și am spus amândoi: DOMNUL va fi martor între mine și tine. Repetarea („eu și tu”, „amândoi”) întărește ideea legământului reciproc."}
]};

module.exports = { lxx, tc, translation0, C };
