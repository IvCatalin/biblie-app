const fs = require('fs');
const SRC = 'de-procesat/_haftarot-extract/haftarot-sarbatori.json';
const d = JSON.parse(fs.readFileSync(SRC, 'utf8'));

const TITLES = {
  1: "Sabat Erev Roș Hodeș - Sabatul ajunului de început de lună",
  2: "Sabat Roș Hodeș - Sabat de cap de lună",
  3: "Sabat Hanuca (I) - Sabatul Luminilor (I)",
  4: "Sabat Hanuca (II) - Sabatul Luminilor (II)",
  9: "Sabat Hagadol - Marele Sabat",
  10: "Pesah ziua 1 (Paștele)",
  11: "Pesah ziua 2 (Paștele)",
  12: "Pesah Sabat Hol Hamoed (Paște - Sabat în zilele de mijloc)",
  13: "Pesah ziua 7 (Paștele)",
  14: "Pesah ziua 8 (Paștele)",
  15: "Șavuot ziua 1 (Sărbătoarea Săptămânilor)",
  16: "Șavuot ziua 2 (Sărbătoarea Săptămânilor)",
  17: "Tișa Be’Av dimineața (9 Av)",
  18: "Taanit Țibur Minha (Post colectiv - după-amiază)",
  19: "Roș Hașana ziua 1 (Anul Nou)",
  20: "Roș Hașana ziua 2 (Anul Nou)",
  21: "Iom Kipur dimineața (Ziua Ispășirii)",
  22: "Iom Kipur după-amiaza (Ziua Ispășirii)",
  23: "Sucot ziua 1 (Sărbătoarea Colibelor)",
  24: "Sucot ziua 2 (Sărbătoarea Colibelor)",
  25: "Sucot Sabat Hol Hamoed (Colibe - Sabat în zilele de mijloc)",
};

const INTRO = {
  1: "Ionatan îl ajută pe David să afle, printr-un semn discret cu săgețile, că Saul vrea să-l ucidă, și cei doi își reînnoiesc legământul de prietenie înainte de separare. Haftara se citește în sâmbăta de ajun a lunii noi, pentru că cei doi vorbesc tocmai despre sărbătoarea Lunii Noi de la curtea regelui.",
  2: "Profeția se încheie cu promisiunea că, în vremurile viitoare, toată făptura va veni să se încline înaintea Domnului „din lună nouă în lună nouă, din sabat în sabat” — exact tema acestui Sabat care cade chiar în ziua Lunii Noi. Isaia contrastează smerenia adevărată, plăcută Domnului, cu jertfele aduse fără inimă curată.",
  3: "Zaharia vede sfeșnicul de aur cu șapte candele și măslinii de alături, și primește făgăduința „nu prin putere, nici prin forță, ci prin Duhul Meu” — versetul central al sărbătorii Hanuca. Profeția vestește și reconstrucția Templului prin Zorobabel, cu bucuria revenirii Șechinei în Sion.",
  4: "Lista uneltelor de aur lucrate de Hiram pentru Templul lui Solomon oglindește sfeșnicul de aur din haftara zilei anterioare, legând sfințirea Templului lui Solomon de sfințirea reluată de Macabei la Hanuca. Textul enumeră minuțios vasele, oalele și sfeșnicele turnate pentru Casa DOMNULUI.",
  5: "Regele Ioaș poruncește preoților să strângă argintul adus la Templu pentru reparații, exact ca darea anuală de jumătate de siclu amintită de Parașat Șekalim. Haftara descrie și reforma religioasă de după uciderea Atalei, cu reînnoirea legământului dintre popor și DOMNUL.",
  6: "Saul primește porunca să nimicească pe Amalek, dar îl cruță pe regele Agag, iar Samuel îl mustră și-l ucide el însuși — legătura directă cu porunca „Adu-ți aminte ce ți-a făcut Amalek”, citită înainte de Purim. Neascultarea lui Saul marchează momentul în care Samuel îi vestește lepădarea de la domnie.",
  7: "Ezechiel vestește curățirea viitoare a lui Israel cu „apă curată” și o inimă nouă, în locul celei de piatră — imaginea profetică din spatele ritualului vacii roșii, folosit pentru purificarea înaintea Templului. Promisiunea se încheie cu renașterea țării pustiite, „ca o grădină a Edenului”.",
  8: "Ezechiel descrie jertfele și ceremoniile viitoare ale primei zile din prima lună — exact luna Nisan, anunțată de Parașat Hahodeș drept pregătire pentru Pesah. Rânduielile privesc și rolul special al „prințului” în aducerea darurilor de sărbătoare.",
  9: "Maleahi vestește venirea lui Ilie înainte de „ziua cea mare și înfricoșată a DOMNULUI”, care să împace „inima părinților cu fiii” — versetul care dă numele acestui Sabat de dinaintea Pesahului. Profetul mustră și necredincioșia poporului în aducerea dijmelor.",
  10: "Israel trece Iordanul pe uscat, Iosua rânduiește circumcizia generației născute în pustiu și poporul ține primul Pesah în Țara Promisă. Episodul leagă direct eliberarea din Egipt de intrarea în Canaan, la patruzeci de ani de la ieșire.",
  11: "Regele Iosia citește legământul înaintea poporului, curăță Templul de idoli și ține un Pesah „cum n-a mai fost ținut” din zilele judecătorilor. Reforma lui marchează cea mai amplă reînnoire religioasă din istoria regilor lui Iuda.",
  12: "Viziunea Văii oaselor uscate, care prind din nou viață și carne la cuvântul lui Dumnezeu, simbolizează învierea națională a lui Israel — tema de mijloc a Pesahului, sărbătoarea eliberării și a vieții noi. Ezechiel vede cum Duhul Domnului redă suflare întregului popor risipit.",
  13: "Cântarea de izbăvire a lui David, după ce DOMNUL l-a scăpat „din mâna tuturor vrăjmașilor”, oglindește cântarea lui Moise de la trecerea Mării Roșii, citită în ziua a șaptea a Pesahului. Imaginile de apă, valuri și eliberare leagă cele două cântări printr-un fir tematic comun.",
  14: "Isaia vestește venirea unui vlăstar din rădăcina lui Iese, peste care se va odihni Duhul DOMNULUI, și o nouă cântare de laudă, „iată, Dumnezeu este mântuirea mea” — potrivită ultimei zile a Pesahului în diasporă. Profeția descrie și adunarea exilaților din toate cele patru colțuri ale lumii.",
  15: "Ezechiel are viziunea Carului divin — heruvimi, roți și tronul de safir — citită la Șavuot ca ecou al revelației de la Sinai, cealaltă mare arătare a slavei divine către Israel. Profetul e răpit de Duh și aude corul ceresc lăudând slava DOMNULUI.",
  16: "Habacuc cântă teofania DOMNULUI venind din Teman, cu munții cutremurându-se și soarele stând pe loc — o altă imagine a revelației divine, potrivită zilei a doua a Șavuotului. Cartea se încheie cu încrederea profetului în DOMNUL, „chiar dacă smochinul nu va înflori”.",
  17: "Ieremia plânge dărâmarea iminentă a Ierusalimului și cheamă la o jale „ca pentru un fiu unic”, text citit dimineața de 9 Av, ziua pustiirii Templului. Profetul contrastează deșertăciunea bogăției și înțelepciunii omenești cu singura glorie adevărată — cunoașterea DOMNULUI.",
  18: "Isaia cheamă la căutarea DOMNULUI „cât mai e aproape” și la pocăința sinceră care aduce milă, text citit la rugăciunea de după-amiază a posturilor publice. Profeția se încheie cu promisiunea că Templul va fi „casă de rugăciune pentru toate neamurile”.",
  19: "Ana se roagă cu amărăciune pentru un fiu, face un jurământ și e binecuvântată cu Samuel — exemplul rugăciunii ascultate, citit în prima zi a Anului Nou. Cântarea ei de mulțumire, „DOMNUL ucide și dă viață”, prefigurează tema judecății din Roș Hașana.",
  20: "DOMNUL făgăduiește restaurarea lui Israel cu o iubire veșnică, iar Rahela plânge pentru fiii ei până sunt readuși acasă — versete despre mila divină, centrale în liturghia Anului Nou. Efraim se căiește, iar DOMNUL făgăduiește să-și aducă aminte de el „ca de un fiu drag”.",
  21: "Isaia respinge postul fățarnic și cere adevăratul post — desfacerea legăturilor nedreptății și hrănirea celui flămând — text citit chiar în dimineața Zilei Ispășirii. Profeția promite lumină și vindecare celor care păzesc cu adevărat Sabatul.",
  22: "Iona fuge de misiunea de a predica la Ninive, e înghițit de un pește mare, dar cetatea se pocăiește la propovăduirea lui, iar Mica încheie cu imnul „cine-i ca Tine, Dumnezeu care iartă” — tema centrală a după-amiezii Ispășirii. Nemulțumirea lui Iona față de mila arătată Ninivei scoate în relief îndurarea nemărginită a lui Dumnezeu.",
  23: "Zaharia vestește ziua finală a DOMNULUI, când toate neamurile vor sui la Ierusalim să prăznuiască Sucot, și „DOMNUL va fi unul și Numele Lui unul” — versetul recitat zilnic în rugăciunea Aleinu. Profeția descrie și apele vii țâșnind din Ierusalim spre cele două mări.",
  24: "Solomon aduce Chivotul în Templul nou-zidit, chiar de sărbătoarea Sucot, și slava DOMNULUI umple Casa într-un nor atât de dens încât preoții nu mai pot sluji. Regele binecuvântează adunarea și amintește făgăduința dată lui David.",
  25: "Ezechiel vestește înfrângerea finală a lui Gog și a oștilor lui pe munții lui Israel, urmată de șapte ani în care armele arse înlocuiesc nevoia de lemne de foc — o viziune de pace veșnică, potrivită zilelor de mijloc ale Sucotului. Israel îngroapă mulțimea învinsă timp de șapte luni, pentru curățirea deplină a țării.",
  26: "Solomon își încheie rugăciunea de sfințire a Templului, binecuvântează poporul și, în a opta zi, îi trimite acasă — ziua de încheiere solemnă care dă numele Șemini Ațeret. DOMNUL îi confirmă apoi lui Solomon, printr-o a doua arătare, că i-a ascultat ruga.",
  27: "După moartea lui Moise, DOMNUL îl încredințează pe Iosua cu porunca „fii tare și curajos” și cu Cartea Legii care nu trebuie să se depărteze din gura lui — ultimele cuvinte citite la Simhat Tora, chiar înainte de a reîncepe lectura Torei de la Geneza. Poporul și triburile de peste Iordan îi făgăduiesc lui Iosua aceeași ascultare pe care au avut-o față de Moise.",
};

let titleChanges = 0, introChanges = 0;
d.chapters.forEach(ch => {
  if (TITLES[ch.num]) { ch.title = TITLES[ch.num]; titleChanges++; }
  if (INTRO[ch.num]) { ch.intro = INTRO[ch.num]; introChanges++; }
});

fs.writeFileSync(SRC, JSON.stringify(d, null, 1));
console.log('Titluri schimbate:', titleChanges, '/ Introduceri adaugate:', introChanges, '/ total capitole:', d.chapters.length);
