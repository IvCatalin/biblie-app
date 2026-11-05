# Davar Atlas — instrucțiuni pentru Claude Code

Acest fișier e citit automat de Claude Code la fiecare sesiune nouă, în acest repo. Nu se mai dă manual — conține tot ce trebuie știut ca să continui munca de conținut pe Davar Atlas.

---

## FLUXUL DE LUCRU STANDARD — urmat automat, la fiecare sesiune, fără să fie nevoie să fie repetat

Utilizatorul discută planificarea, deciziile de licențiere și bug-urile de interfață separat, în chat (claude.ai). Aici, în Claude Code, treaba e procesarea de conținut. Când utilizatorul pornește o sesiune și spune ceva de tipul „continuă", „procesează arhivele", sau nu dă instrucțiuni specifice, urmează exact acest flux, fără să ceri reconfirmare la fiecare pas:

1. **Verifică `de-procesat/`** (NU `de-procesat/procesate/`, care e arhiva a ce s-a integrat deja — istoric, nu se atinge, nu se șterge).
2. **Dacă `de-procesat/` e gol** (sau conține doar `procesate/`): spune-i clar utilizatorului că nu-i nimic de procesat acum, și oprește-te.
3. **Dacă are fișiere `.zip`**: alege UNUL (cel mai vechi după dată dacă nu-i altfel evident) și procesează-l complet, urmând cei 7 pași din secțiunea „PROCESUL PENTRU KABBALA (și documente similare)" de mai jos — extragere, verificare structură, comparație cu ce-i deja în aplicație, unificare/renumerotare dacă e cazul, construirea intrării finale, integrare în `LIBRARY`, validare tehnică.
4. **După Pasul 7 (validare tehnică), dacă totul e OK**:
   - Mută arhiva `.zip` procesată din `de-procesat/` în `de-procesat/procesate/` (creează acest subfolder dacă nu există încă — nu se șterge niciodată arhiva originală, rămâne acolo ca istoric/plasă de siguranță)
   - Fă `git commit` cu mesaj clar și descriptiv (ex: „Integrare Sefer HaBahir — 71 capitole, verificat 0 dubluri cu ce exista")
   - Fă `git push`
   - Explică utilizatorului, în română, simplu, cifre exacte: ce s-a integrat, ce verificări s-au făcut, că push-ul s-a făcut
5. **Treci la următoarea arhivă din `de-procesat/`** (repetă de la pasul 3) — nu te opri după una singură dacă mai sunt altele. Continuă până se termină toate sau apare o problemă reală.
6. **Dacă apare o ambiguitate reală** la o arhivă anume (nu poți decide singur dacă e dublură parțială, sursa pare incompletă în alt fel decât cele deja documentate, structura nu se potrivește cu nimic cunoscut din aplicație): oprește-te DOAR la acea arhivă, explică exact problema, și treci la următoarea din listă dacă nu are aceeași problemă — nu bloca tot lotul din cauza unei singure arhive neclare.
7. **La final** (toate arhivele procesate, sau te-ai oprit la probleme reale): dă un rezumat, cu cifre exacte — câte arhive procesate cu succes, câte mutate în `procesate/`, câte au rămas cu o problemă și de ce, câte commit-uri/push-uri s-au făcut.

Regula fermă din tot documentul rămâne valabilă aici la fel: **niciodată nu presupune că o arhivă nouă e conținut nou** — Pasul 3 din procesul de mai jos (compară cu ce-i deja în aplicație) e obligatoriu la fiecare arhivă, fără excepție.

---

## Reguli de comportament, specifice pentru Claude Code

- Explică întotdeauna, în română, simplu, ce ai făcut și de ce — nu doar arăta diff-uri de cod tăcut.
- Înainte să schimbi orice fișier, fă un commit git cu starea curentă, ca plasă de siguranță.
- Niciodată `git push --force`. Niciodată nu ștergi fișiere fără să întrebi întâi.
- La finalul fiecărei sarcini: rulează validarea (DOCTYPE intact, `node --check`, numărul de sloguri neschimbat sau schimbat intenționat) și arată rezultatul exact.

---

## STATUSUL CURENT AL APLICAȚIEI

### Fișiere de bază
- `public/biblie-demo.html` — fișierul principal, ~0,5 MB (din 5 nov. 2026); datele bibliotecii (`const LIBRARY = …`, ~11 MB) NU mai sunt în el, ci în `public/library-data.js`, încărcat cu `defer` din HTML (`library-data.js?v=N`: **se crește N la orice schimbare de date**, ca browserele să nu țină versiunea veche). Motiv: pagina de 11,8 MB (3,4 MB comprimată) se descărca și se parsa înainte de primul ecran și se vedea scurt o aplicație goală, înghețată (fals placeholder: „Citat”, „Geneza 1:1”); acum HTML-ul are 0,12 MB comprimat. **Ecran de pornire — SCOS (5 nov. 2026, cerere explicită):** imaginea DAVAR (acoperire în pagină, `apple-touch-startup-image`, preîncărcări) a fost ștearsă din `biblie-demo.html`, după ce pe iPhone dădea „alb → imagine → cadru pătrățos → imagine → interfață” (filmare în `de-procesat/WhatsApp Video 2026-11-05 at 17.45.53.mp4`). Fișierele `public/images/davar-splash.jpg` și `public/images/startup/` au rămas în repo, nereferite. Textele provizorii din pagină (data, citatul, versetul zilei) sunt goale; interfața se vede de la primul cadru și se completează. Dacă problema persistă fără imagine, planul convenit: întoarcere la versiunea de la ora 12 (commit `1922a67`) și reaplicare doar a îmbunătățirilor mici de încărcare. **Service worker (5 nov. 2026):** `public/sw.js` (înregistrat la finalul `app.js`) pornește aplicația din memoria telefonului — HTML, `app.js`, imagini, `library-data.js` — și verifică în fundal dacă există versiune nouă (stale-while-revalidate, doar fișiere de pe același domeniu; `/api/`, `Range` și domeniile externe nu sunt atinse). NU există reîncărcare automată (pe iPhone producea un fulger alb între imagine și acasă): o versiune nouă se vede la a doua deschidere după actualizare. Prima deschidere după o actualizare arată versiunea veche din memorie. Motiv: la fiecare lansare se făceau 8+ cereri de revalidare spre server (Cache-Control: no-cache), cu latență de rețea, ceea ce dădea secunde de ecran negru/alb; ebiblia.ro, bible.com și biblegateway au HTML mic (25–125 KB) servit de pe CDN/server apropiat (TTFB 0,18–0,23 s). La schimbări de `sw.js` se crește `CACHE` (`davar-shell-vN`). **Încărcare (5 nov. 2026, versiunea 2):** scriptul principal e `public/app.js` (extern, `defer`; HTML-ul nu mai conține JS mare), la fel `citate.js`, `sarbatori-detalii.js`, `tanakh/index.js`; Umami e `async`. `library-data.js` NU se cere la pornire: se încarcă după ce acasă e gata (`window.libLoad`, în pauză) sau imediat la nevoie (Diverse, foaia de verset); imaginile cardurilor Diverse se pregătesc abia după aceea (fără `<link rel=preload>` în cap, ca să nu concureze cu primul ecran). Acoperirea dispare când interfața acasă e încărcată VIZUAL (`window.__mainReady`, la finalul init din `app.js`): imaginile de fundal (antet, ceață, fundalul versetului zilei) și iconițele barei de jos sunt gata și desenate (plasă de siguranță 3 s); imaginile antetului și ceții sunt preîncărcate în `<head>`. NU așteaptă datele: versetul zilei, istoria zilei și pericopa se completează apoi, pe rând (cerut explicit: interfața întâi, conținutul secțiunilor după). Versetul zilei pornește gol (fără „Geneza 1:1” provizoriu; rezerva Geneza 1:1 apare doar dacă versetul curat nu a sosit în 2,5 s). Primul cadru al acoperirii e un degrade neted (fără miniatură pixelată, constatat în filmarea de pe iPhone din `de-procesat/WhatsApp Video 2026-11-05 at 17.45.53.mp4`: alb de sistem → imagine de pornire → cadru pătrățos → imagine → interfață); imaginea de pornire a modelului de iPhone se preîncarcă în `<head>` cu `media`. Albul de la început (primele ~0,2 s) e animația de lansare a iOS, nu a paginii. Pe iPhone acoperirea din pagină folosește EXACT aceeași imagine ca `apple-touch-startup-image` (media queries în `#early-bg`), ca trecerea de la imaginea sistemului la pagină să fie continuă; pericopa se desenează imediat din tabelul local, apoi se rafinează cu @hebcal de pe CDN; nu mai așteaptă biblioteca. iPhone: `apple-touch-startup-image` (11 mărimi, `public/images/startup/`, generate din `davar logo.png`, imagine întreagă) — apare la lansarea aplicației instalate, înainte de pagină; se vede după ce aplicația e adăugată din nou pe ecranul principal. Imaginea din pagină: `davar-splash.jpg` 900 px. Android: ecranul de pornire îl face sistemul din `manifest.json` (icoană + `background_color`), nu se poate înlocui cu imagine întreagă. Ecranele Diverse apar instant din `LIB_SKELETON` (dosare și subdosare, în `biblie-demo.html`; se reface cu `node tools/build-lib-skeleton.js` când se schimbă structura dosarelor), iar cărțile se deschid când sosește `library-data.js` (`libWhenReady`); imaginile cardurilor sunt preîncărcate (`<link rel=preload>`) înaintea bibliotecii, care are `fetchpriority=low`. Toate uneltele (`tools/*`, `search-index.js`) citesc `LIBRARY` din `library-data.js`, nu din HTML.
- `manifest.json` — separat, în `public/`, lângă html
- `public/images/` — 53+ fișiere (poze de fundal, iconițe)
- `genesis-1.js`, `genesis-2.js`, `genesis-3.js` — singurele capitole cu lexicon Strong's+BDB și panou „Dicționar biblic" (`dict_ro`) integrate până acum, la nivelul complet al Standardului Davar (vezi mai jos)

### Siglă/iconițe — gata
Fundal albastru deschis, DAVAR auriu, flacără completă, aplicată la toate 4 dimensiunile de iconiță + `manifest.json`, cu `?v=8` pentru cache-busting. Dacă se schimbă din nou: nu se taie niciodată din imagine — dacă nu-i deja pătrată, se extinde fundalul lateral (gradient continuat), nu se decupează flacăra. Verifică vizual la 48px înainte de livrare.

### Acasă — restructurat complet
- Cardul „Meditații cerești" mutat în interiorul cardului „Pericopa săptămânii"
- Conținutul (perspectivă evreiască/creștină) permanent vizibil, fără dropdown
- Fiecare pasaj (Tora + fiecare bucată de Haftarah) are buton mic rotund auriu (→) spre capitolul din Biblie
- `translateRef` reparat să traducă toate cărțile dintr-o referință dublă, nu doar prima
- Experimentul cu „stivă de carduri la scroll" abandonat — nu se reia fără cerere explicită

### Diverse
- Protecție copiere/click-dreapta activă (CSS + JS)
- Meta-text redundant șters din 94 de titluri; notele oneste de lacune păstrate intenționat
- Pentateuhul Samaritean (sp-geneza … sp-deuteronom): versiunea v2 de la Grok integrată pe 29 sept. 2026 — Levitic/Numeri/Deuteronom retraduse integral (fără engleză), Geneza 50 și Exod 40 de versete corectate după ebraica samariteană; marcajul „(în lucru)” scos
- Iconițele „▶" brute înlocuite peste tot cu săgeți aurii rotunde consecvente

### Biblia (tab principal)
- Referințele deschid panou mic cu textul versetului, plus buton „→ citește capitolul"
- Bug de swipe (schimbare de capitol la scroll vertical pieziș) reparat — cere mișcare clar orizontală
- Antet VT/NT ascuns la Tora (Rosen)
- textCompare: stil vizual distinct (sursă aurie, text citat italic), fraza de deschidere generată automat la afișare, nu scrisă manual
- Geneza 1: 11 versete cu engleză brută la comparația samariteană — toate traduse, verificat, 0 rămase

**Bug neconfirmat ca reparat**: panoul de previzualizare a referințelor a fost raportat gol o dată (doar titlu + buton, fără text verset). S-a întărit codul defensiv, dar nu s-a primit confirmare fermă că problema a dispărut — verifică din nou cu utilizatorul dacă subiectul revine.

### Kabbala — status
15 din 74 lucrări gata. Liste complete cu ce lipsește: subfolderele Zohar, Sefer Ietzira, Alte texte cabalistice.

**Regulă fermă, permanentă**: `kab-maamar-zohar-harakia` nu se completează NICIODATĂ din ebraică — autorul (Yerucham Leiner) nu e domeniu public, licență refuzată explicit. Rămâne strict la fragmentele CC0 deja existente.

### Lexicon Strong's + BDB
Tradus complet pentru tot Vechiul Testament (Tora, Istorice, Poetice, Profeți, Ketuvim), verificat riguros. Integrat efectiv doar în Geneza 1-3 până acum (câmpul `dict_ro`, afișat ca „Dicționar biblic" în popover). Restul capitolelor așteaptă integrarea — lucru capitol cu capitol, ca la Geneza 1-3.

### Render + Umami — active, confirmate
Render pe planul Starter ($7/lună, 0.5 CPU, fără adormire). Umami analytics activ, confirmat că prinde vizite reale, fără cookie-uri.

### Decizii de licențiere
- NTR (Biblica) — respins definitiv
- Psalmii + cele 5 Meghilot (ediții Rosen) — pe pauză, așteaptă permisiune explicită
- Haftarot (Rosen) — nedigitizat, utilizatorul trimite poze din cartea fizică în bucăți de 30-40/conversație

---

## STANDARDUL DAVAR — checklist obligatoriu pentru fiecare capitol

Geneza 1 este capitolul-model. Fiecare capitol viitor trebuie să ajungă la același nivel pe toate cele 6 secțiuni de mai jos înainte de a trece la capitolul următor. **Nu se trece la un capitol nou până cel curent nu e 100% pe toate cele 6.**

### 1. Text de bază
- Text real din documentul sursă Rosen, verificat cuvânt-cu-cuvânt, nu parafrazat
- Fidela adăugată doar dacă există sursă confirmată — nu se inventează
- Dacă un verset n-are sursă confirmată pentru Fidela, rămâne fără ea

### 2. Panou lexical per cuvânt (cardul `#word-popover`) — câmpuri exacte din `tokens[]`
Țintă: ~9,9 cuvinte tagate per verset, în medie.

**Aspect vizual — obligatoriu, identic în tot `biblie-demo.html`** (același `#word-popover`/`showWordPopover()` e folosit și de tab-ul Biblia, și de Bibliotecă/Haftarot — un singur loc de cod, nu se duplică niciodată):
- Card tip pergament/kraft (`#C9A36A`, textură granulată SVG, colțuri rotunjite 26px), nu panou simplu albastru-întunecat
- Chenar interior (`.wp-frame`) — **bordură reală pe un bloc care crește cu conținutul** (nu decor `position:absolute` cu înălțime fixă — asta a tăiat literal textul la capitole lungi, bug real întâlnit și reparat)
- Ornament de colț: „Corner Flourish 3" de Arvin61r58 (CC0 1.0, Openclipart.org, via Wikimedia Commons), recolorat bleumarin — **niciodată desenat manual** (patru tentative de desen manual au fost toate respinse; vezi memoria `replica-exacta-referinta-vizuala`)
- Medalion circular (inele + raze + steluțe, bleumarin `#16294a`) cu ebraica (`heb`) **aurie** (`#f0c419`, bold) și transliterarea (`translit`) **bleumarin, bold, italic**, ambele centrate în medalion
- Titlul cardului = `tok.t`, curățat de ghilimele și punctuație rămase la marginea frazei-token (ex. „început," → „început") — bleumarin, bold
- `strong` (numărul Strong's) NU se arată vizual pe card (ascuns, `display:none` — ușor reversibil); `pos` (partea de vorbire) se arată, sub medalion, maro, italic
- Tot „textul propriu-zis" — `def_ro`, `dict_ro`, `diff_ro`+`greek_def_ro`, termenul grecesc — e **maro** (`#3A2614`), aceeași mărime (15.5px) și greutate (600/bold) pentru toate, ca să se citească la fel de clar
- Etichetele de secțiune (LXX, Diferență ebraică/greacă, Dicționar biblic) — bleumarin, uppercase, bold
- Fonturi: EB Garamond (latină), Noto Serif Hebrew (ebraică)
- La fiecare deschidere, scrollul panoului se resetează la 0 (nu rămâne de la cuvântul anterior)

Câmpurile exacte citite de `showWordPopover()`, în ordinea reală de afișare: `heb`, `translit`, `strong` (nefolosit vizual), `pos` → **`def_ro`** (definiția principală afișată — NU câmpul `def`, care e nefolosit/legacy) → apoi, în panoul extins (fiecare doar dacă are conținut): `greek` (etichetă „LXX (Septuaginta)" — pe același rând cu traducerea românească scurtă, extrasă automat din `greek_def_ro` prin regex, ex. „ὁ Θεός (ho Theos) — Dumnezeu"), `diff_ro` **împreună cu** `greek_def_ro` complet, sub o singură etichetă „Diferență ebraică / greacă" (apare dacă există oricare din cele două câmpuri — **nu mai există o secțiune separată „Definiție greacă"**), `dict_ro` (etichetă „Dicționar biblic").

`dict_ro` e acum **obligatoriu** la fiecare cuvânt tagat din fiecare capitol viitor, la nivelul Genezei 1:
- NU e traducere literală BDB cu sensuri numerotate (1)(2)(3)
- E explicație de dicționar biblic în proză curgătoare: etimologie/rădăcină, context cultural sau tradiție evreiască, trimiteri la alte versete, nuanțe pe care definiția scurtă nu le prinde
- 2-4 propoziții, stilul exact al intrărilor deja scrise în Geneza 1-3 (ex. H430 Elohim, H5175 șarpe)

Câmpul `bdb` (traducere literală BDB) există în date vechi la Geneza 1, dar NU e citit nicăieri în HTML — e mort, nu se mai populează de acum.

**Lecție învățată**: verifică mereu `biblie-demo.html`-ul REAL din repo (nu unul dintr-o sesiune anterioară de chat) înainte de a presupune ce câmp/format se afișează.

### 3. Comparație texte (Masoretic / Septuaginta / Samaritean)
- La fiecare verset
- Samaritean doar cu verificare reală — niciodată presupus „identic" fără verificare efectivă
- Lead-ul (fraza de deschidere) se generează automat la afișare, din textul real — nu se scrie manual
- Dacă sursa n-are text pentru comparație la un verset, se lasă gol, marcat onest

### 4. Trimiteri (referințe încrucișate)
- 100% unde există legătură reală
- Se lasă onest fără trimitere la versete de dialog procedural fără legătură distinctă
- Sursă recomandată: Treasury of Scripture Knowledge — domeniu public, ~382.000 de referințe, `github.com/ariseshinestudio/TSK`

### 5. Comentarii — diversitate obligatorie, la nivelul exact al Genezei 1
Fiecare verset trebuie să aibă, unde există sursă reală: **Rashi** (bază, mereu primul dacă există) + 2-3 dintre **Ibn Ezra/Ramban/Sforno** + **Talmud/Mișna** (fila verificată direct în arhivă, NICIODATĂ din memorie) + **Kabbala** (doar legătură reală) + **Context ANE** + **Josephus Flavius** (verifică întâi duplicate) + **Patristice** + **Șamai-Hillel/Zugot** doar unde există dispută reală documentată.

Comentatorii evrei vin primii, înainte de orice altă sursă.

Convenții de etichetare autor: Cartea Jubileelor → „Cartea Jubileelor [N] — comparație" (N = capitolul din Jubilee, nu din Geneza); Josephus → mereu „Josephus Flavius, Antichitățile Iudaice, Cartea I, cap. 1".

#### Regula nouă (4 nov. 2026): niciun comentariu scris din memorie
Fiecare rând din „Comentarii" și „Texte" trebuie să aibă una din două forme, nimic altceva:
- **Textul real, cuvânt cu cuvânt, din lucrarea din Bibliotecă** (Resurse): comentatorii Tanakh (Rashi, Ibn Ezra, Ramban, Sforno, Rashbam, Da'at Zekenim, Radak) = intrarea lor la verset din `public/tanakh/`; Zohar/Mișna = paragraful/mișna citată; Talmud = unitatea din foaia integrată (`public/talmud/`), cea mai relevantă pe verset (una singură); Josephus/Jubilee/Enoh/apocrife = propoziția sau versetul real. Rezumatele scrise de Claude se scot.
- **„În lucru: traducerea acestui comentariu urmează."**, când lucrarea încă nu există în aplicație (Talmud până vine foaia, Ba'al HaTurim). Dacă sursa nu are comentariu la acel verset (ex. Rashbam 1:1), rândul nu apare.
- **Butonul „Citește pasajul →"** stă la finalul textului extins al rândului; duce la lucrare, la locul exact, cu bliț de 1 secundă. Rezolvarea țintei e în `libResolveSource` (`biblie-demo.html`) și are nevoie de etichete de forma „Talmudul Babilonian, Hagiga 12a:16", „Zohar, Bereșit 19:3", „Mișna, Ievamot 6:6". **Întoarcerea (5 nov. 2026):** din cititor, „înapoi” (←), ✕ sau apăsarea pe fundal readuc foaia de verset (același tab Comentarii/Texte, același rând deschis); deschiderile din căutare nu se schimbă (înapoi = lista Bibliotecii). Mecanism: `window.libReturnCtx` / `libReturnToVerseSheet` în `biblie-demo.html`.
- Rămân (până se integrează lucrările lor): patristicele, modernii și notele editoriale Davar (Context cultural-istoric, Notă structurală etc.).
- Notele din lucrări (butonul „note"): doar informație utilă — „Citatul: Carte c:v.", definiții scurte de termeni, identificări reale, corecturi de sens. NU: paralele din margine (Mesorat HaShas), glose ale ediției (Haggahot etc.), variante, abrevieri, parantezele editorului, „pasaj semnalat / înțeles nesigur". Titluri de capitol/foaie curate în română: „Capitolul N", „Foaia 2a" (nu „Pereq N - …", „Daf 2a - …").
- Oricând se adaugă o lucrare nouă în Bibliotecă, comentariile existente care o citează se leagă de ea (nu se duplică textul).

**Audit exact (16 sept. 2026), comentarii per verset** (istoric; după regula de mai sus cifrele s-au schimbat): Geneza 1 = 7,13; Geneza 2 = 4,08; Geneza 3 = 4,33 — Geneza 2 și 3 sunt SUB nivelul Genezei 1, mai ales la Rashi/Ibn Ezra/Ramban/Sforno/Talmud/Kabbala:

| Sursă | Geneza 1 | Geneza 2 | Geneza 3 |
|---|---|---|---|
| Rashi | 24 | 8 | 2 |
| Ibn Ezra | 14 | 2 | 1 |
| Ramban | 10 | 4 | 1 |
| Sforno | 16 | 1 | 1 |
| Talmud | 7 | 1 | 0 |
| Kabbala | 1 | 0 | 0 |

De completat retroactiv la Geneza 2-3 când arhiva Talmud/Kabbala/comentatori e disponibilă pentru verificare.

#### Reguli noi, 5 nov. 2026 (se adaugă la cele 6 secțiuni)
- **Text de bază = exact Rosen din Bibliotecă.** La fiecare capitol se compară textul versetelor (tokenii lipiți) cu textul Rosen din `tora-rosen-*` (Bibliotecă), cuvânt cu cuvânt, inclusiv punctuația finală. Notele de subsol Rosen au uneori etichete `<i>` interioare: se elimină prin numărare de etichete (nu cu prima `</i>`); aceeași regulă în `search-index.js` și în cititor. Geneza 1–23: verificat, 0 diferențe.
- **Talmud: cititorul nu arată foi.** Fiecare tratat se arată pe capitole reale („Capitolul 9”, din împărțirea Sefaria), cu unitățile numerotate în ordine; foile apar doar în „i” (câmpul `meta`). Un rând de Talmud în Comentarii are eticheta „Talmudul Babilonian, Șabat, cap. 9”, iar ținta butonului „Citește pasajul” stă în câmpul ascuns `src: { slug, spec: { num, v } }` al rândului. Nicio etichetă nu conține „Foaia”, „Daf” sau numere de foaie.
- **Tora completă în Biblia (5 nov. 2026):** `genesis-24..50`, `exodus-1..40`, `leviticus-1..27`, `numbers-1..36`, `deuteronomy-1..34` există cu text Rosen; Geneza 24–50 au și comentarii reale (7 comentatori + Talmud din paginile integrate). Le lipsesc încă panoul lexical, comparația de texte, trimiterile TSK și Fidela: NU sunt la nivelul complet al standardului.
- **Numerotare (decis 5 nov. 2026):** capitolele și versetele afișate rămân numerotarea Rosen, chiar și la cele 20 de capitole unde diferă de EDC100 (Geneza 31–32; Exodul 7–8, 20–22; Leviticul 5–6; Numeri 16–17, 29–30; Deuteronom 5, 12–13, 22–23, 28–29); nu se renumerotează până va exista în aplicație versiunea EDC100 (atunci tot ce ține de numerotare trece la EDC100). Trimiterile (`refs[]`) se exprimă în EDC100 (verificat pe ebiblia).
- **Căutare:** indexul se construiește pe bucăți, la ~20 s după pornire; limită de 60 de căutări pe minut pe vizitator; fișierele text sunt servite gzip. Pe Render Starter (512 MB) indexul ocupă ~330 MB: orice text nou mare trebuie testat pentru memorie (`node -e` cu `search-index.js`, RSS sub ~400 MB) înainte de push.
- Procesul de lucru la un capitol nou: (1) text Rosen exact; (2) panou lexical complet (`dict_ro` la fiecare cuvânt tagat; ținta de ~9,9 cuvinte pe verset e un ghid, nu se fragmentează); (3) comparație de texte la fiecare verset; (4) trimiteri TSK 5–6 pe verset; (5) rânduri de comentarii reale, `Talmud` și `Ba'al HaTurim` „în lucru” până vin; (6) validare tehnică.
- **Comentarii la un capitol nou — surse complete (5 nov. 2026):** (a) toți comentatorii Tanakh din Bibliotecă (`public/tanakh/`: Rashi, Targum Onkelos, Targum Ionatan, Ibn Ezra, Ramban, Sforno, Rashbam, Da'at Zekenim, Radak, Chizkuni, Bekhor Shor, Or HaChaim) = o intrare la fiecare verset unde lucrarea are text (lista pe verset: `TANAKH_GEN_INDEX` din `public/tanakh/index.js`; scripturi: `tools/add-tanakh-more.js`, `tools/add-from-index.js`); (b) Diverse: se pornește de la `data/geneza-diverse-index.md` / `.json` (generat cu `node tools/index-diverse-geneza.js`, din trimiterile explicite Geneza/Facerea/Bereșit N:V ale tuturor lucrărilor; conține și harta lucrărilor narative paralele — Jubilee, Cartea Dreptului, Josephus, Apocalipsa lui Moise, Viața lui Adam și Eva, Enoh, Sibiline, Testamente — și ce rânduri există deja în fiecare `genesis-N.js`). Nu se mai caută de la zero în Diverse: se citește indexul, se alege unitatea care citează versetul la început (sau îl leagă explicit în note), se pune textul real cu `src` ascuns pentru butonul „Citește pasajul”. Talmud: o unitate pe verset; Mișna: una; Kabbala/apocrife: textul real, fără rezumate. (c) După adăugarea unei lucrări noi în Bibliotecă se reface indexul.

### 6. Validare tehnică — obligatorie la fiecare livrare
1. DOCTYPE intact — verificat, nu presupus (a existat un incident real de corupere)
2. `node --check` pe `app.js` și `library-data.js`, plus `vm.Script` pe scriptul inline mic (ecranul de pornire) din `biblie-demo.html`
3. Numărul de sloguri neschimbat — acum 386 (numărat cu regex-ul `"slug":"…"`, toate aparițiile, în `library-data.js` (380) + `biblie-demo.html` (6); 5 nov. 2026), dacă nu se adaugă/șterge intenționat o lucrare (caz în care crește/scade cu exact 1 per lucrare, nu mai mult)
4. Cifre exacte arătate, nu aproximări — câte versete, câte comentarii, ce lipsește și de ce

---

## SURSE, UNELTE ȘI DOCUMENTE — locuri fixe în repo (nu se mai cer utilizatorului, nu se mai caută)

Tot ce trebuie pentru un capitol de Geneză e deja în repo. Dacă ceva pare că lipsește, se caută întâi aici; utilizatorul se întreabă doar dacă lipsește de tot.

| Ce | Unde (în repo) | Note |
|---|---|---|
| Text de bază Rosen | `LIBRARY` din `public/biblie-demo.html` (`tora-rosen-*`) | note de subsol cu `<i>` interior: se elimină prin numărare de etichete |
| Lexicon Strong's+BDB tradus (câmpurile `heb, translit, def_ro, bdb_ro`, cheie `H####`) | `sources/lexicon-ro/{tora,istorice,poetic,profeti,ketuvim}/*.json` (din `lexicon-vt-complet-corectat-FINAL.zip`) | Sursă openscriptures/HebrewLexicon (CC BY 4.0). `def_ro` din panou = definiția verificată; NU se copiază orbește (pot fi reziduuri englezești: audit `the/and/of/with/from` = 0). `bdb`/`bdb_ro` nu se afișează |
| Dicționare biblice (pentru `dict_ro`) | `tora-openchristiandata/dictionaries/` (Easton, Smith, Hitchcock, Torrey; indexuri `*-torah-index.json`) | `dict_ro` = proză 2–4 propoziții în stilul Geneza 1–3, doar la cuvinte-cheie reale; dacă nu e nimic util, se sare |
| Comentarii creștine/moderne + Sfinți Părinți | `tora-openchristiandata/commentaries/` (Adam Clarke, Calvin, JFB, John Gill, Keil-Delitzsch, Matthew Henry, Wesley) și `church_fathers_filtered/` (Ambrozie, Augustin, Vasile, Beda, Clement, Chiril, Efrem, Eusebiu, Grigorie, Hipolit, Irineu, Isidor, Ieronim, Gură de Aur, Iustin, Metodiu, Origen, Filon, Tertulian, Teodoret, Josephus, Jubilee) | engleză CC0; se aleg ~4 relevante pe verset, se traduc integral în română, se verifică contaminarea (cazul Gill/Chalmers); README-ul folderului |
| Trimiteri TSK | `sources/tsk/tskxref.txt` (`carte cap verset sort cuvânt refs`), numerotare identică cu EDC100 | `node tools/fill-refs.js --ch=N [--write]` completează la 6 pe verset, în ordinea TSK, doar unde TSK are mai multe; verset fără intrare TSK rămâne onest cu ce are |
| Comentatori Tanakh (12) | `public/tanakh/` + `TANAKH_GEN_INDEX` | `node tools/add-tanakh-more.js --ch=N [--write]`; ordine: Rashi, Targum Onkelos, Targum Ionatan, Ibn Ezra, Ramban, Sforno, Rashbam, Da'at, Radak, Chizkuni, Bekhor Shor, Or HaChaim |
| Diverse → Geneza (index pe 50 de capitole) | `data/geneza-diverse-index.md` / `.json` | `node tools/index-diverse-geneza.js`; refă după orice lucrare nouă în Bibliotecă |
| Rânduri din Diverse la un capitol | `node tools/add-from-index.js --ch=N [--write]` (unități care citează versetul la început; Talmud 1/verset, Mișna 1) + hărți manuale pentru lucrările narative paralele (`tools/add-narrative-g12.js` pentru Geneza 1–2, `tools/add-diverse-g3.js` pentru Geneza 3: Apocalipsa lui Moise, Viața lui Adam și Eva, Cartea Dreptului, Jubilee, 2 Enoh, 4 Ezdra, Sibiline, Sirah, Înțelepciunea, Odele, Barnaba, Tovit etc.) | pentru un capitol nou se face o hartă la fel, citind unitățile cu `node tools/show-units.js <slug> <cap> <v1,v2>`; textul real, fără rezumat |
| Audit pe capitol | `node tools/audit-standard.js [N]` | cifre: cuvinte tagate/verset, `dict_ro` lipsă, comparații, trimiteri, comentarii; „text ≠ Rosen" poate fi fals-pozitiv (verificare cu balansare de etichete) |
| Documente de standard / instrucțiuni Grok | `sources/docs/STANDARD-GENEZA-1-pasi.md`, `sources/docs/instructiuni-grok-lexicon.md`; mesajele către Grok la `de-procesat/` | |
| Verificare vizuală | Playwright/Chromium local (nu extensia Chrome), server `PORT=3333 OPENAI_API_KEY=test node --max-old-space-size=320 server.js`; `valid.js`-ul de butoane verifică toate țintele `Citește pasajul` | țintă: 0 lipsă |

### Procedura completă pe capitol de Geneză (în ordine; nu se trece la capitolul următor până nu e 100%)
1. Text de bază = Rosen exact (verificare cu balansare de etichete).
2. Panou lexical: `def_ro` din `sources/lexicon-ro` verificat, `greek_def_ro`/`diff_ro` doar unde e diferență reală, `dict_ro` din dicționare la cuvintele-cheie, ~9,9 cuvinte/verset ca ghid.
3. `textCompare` (Masoretic/Septuaginta/Samaritean) la fiecare verset.
4. Trimiteri: `tools/fill-refs.js` (țintă 5–6; unde TSK n-are, se lasă onest).
5. Comentarii, în ordinea: (a) cei 12 comentatori Tanakh (`add-tanakh-more`), (b) Talmud 1/verset din foile integrate (restul „În lucru" până vine Grok), Mișna, Zohar, Bahir, Kabbala (din index), (c) lucrările narative/apocrife din Diverse (hartă pe capitol), (d) Sfinți Părinți + moderni din `tora-openchristiandata`, traduși integral. Același text nu apare la două versete.
6. Validare: `node --check`, DOCTYPE, sloguri (386), `valid.js` 0 ținte lipsă, scan de fraze interzise cu deschiderea fiecărei potriviri, captură Playwright la un verset cu rânduri noi.
7. Commit (fără `de-procesat/`, `acbooks.json.tmp`, `public/images/_preview48.png`, `package-lock.json`), push, raport cu cifre.

**Stare (5 nov. 2026):** Geneza 1–4 = Tanakh 12/12, Diverse din index + hărți narative, TSK completat, `dict_ro` și comparații 100%; Geneza 4 are și Părinți/moderni traduși din `tora-openchristiandata` (`tools/g4-ocd-data.js`, aplicat cu `tools/apply-ocd.js`; candidați cu `tools/ocd-candidates.js`/`tools/ocd-dump.js`). Talmudul rămâne „În lucru” (Grok). Geneza 5–23 nu au `dict_ro`.

---

## Reguli ferme suplimentare, valabile mereu
- Audit complet din 3 în 3 capitole — verificare încrucișată a tot ce s-a livrat până atunci, nu doar a capitolului curent
- Niciodată conținut inventat — dacă o sursă tace, se spune explicit
- **Pasul 6.4** — audit obligatoriu ÎNAINTE de orice livrare: scan de fraze interzise pe câmpul `author` ȘI pe tot textul fișierului. Orice potrivire găsită trebuie deschisă și citită integral — niciodată presupusă fals-pozitivă fără verificare
- Zero note de proces în fișierele livrate — fraze ca „Verificat direct...", „presupunere/presupus", „(rezumat/traducere proprie, sursă domeniu liber CC0)", „(verificat)" aparțin DOAR conversației, niciodată câmpurilor `t`/`summary`/`meta`/`dict_ro` din JSON/JS livrat

---

## PROCESUL PENTRU KABBALA (și documente similare)

Se aplică la orice arhivă `.zip` nouă cu fișiere `.json` (Kabbala, comentarii biblice, dicționare — orice conținut structurat pe capitole/versete).

### Pasul 1 — Extragere și verificare brută
1. Dezarhivează în folder propriu, separat
2. Verifică fiecare JSON e valid (`json.load` fără eroare)
3. Citește câmpul `notes` din fiecare fișier — de multe ori conține informația cea mai importantă (ce lipsește, unde se taie API-ul, ce-i onest incomplet). Nu se sare peste.

### Pasul 2 — Verifică structura capitolelor/versetelor
- Există goluri de numerotare?
- Există duplicate reale (același verset, texte diferite)?
- Numerotarea e simplă (1,2,3) sau compusă (1:1, 1:2 — mishna:comentariu)?

### Pasul 3 — CEA MAI IMPORTANTĂ VERIFICARE: compară cu ce-i deja în aplicație
Niciodată nu presupune că o arhivă nouă e conținut nou.
1. Extrage intrarea curentă din `biblie-demo.html` (caută după `slug`)
2. Compară text-cu-text, nu doar numărul de versete
3. Dacă numerotarea diferă dar textul-i identic — compară prin poziție/ordine, nu prin cheie
4. Rezultate posibile:
   - **Identic 100%** → nu se schimbă nimic, se raportează așa
   - **Extindere reală** → se integrează, păstrând ce exista deja dacă arhiva nouă nu-l acoperă
   - **Îmbunătățire de calitate** → se înlocuiește textul, se păstrează structura

### Pasul 4 — Unificare/renumerotare, dacă arhiva are grupuri multiple
1. Stabilește ordinea corectă de citire
2. Concatenează versetele în ordine, într-un singur array per capitol real
3. Renumerotează secvențial (1,2,3...) dacă aplicația folosește numerotare simplă la lucrări similare
4. Verifică suma finală cu un script — dacă nu se potrivește exact cu notele sursei, investighează de ce

### Pasul 5 — Construiește intrarea finală
```json
{
  "slug": "kab-...",
  "name": "...",
  "name_ro": "...",
  "meta": "N capitole · M comentarii",
  "author": "...",
  "summary": "...",
  "available": true,
  "chapters": [
    {"num": 1, "verses": [{"v": 1, "t": "..."}, ...]}
  ]
}
```
- `meta` — doar cifre esențiale, fără fraze descriptive redundante („text integral" etc.)
- `author` — nu repeta ce-i deja în titlu
- `summary` — descriere reală, scurtă, menționează onest orice lacună cunoscută
- `name_ro` — traducerea în română a titlului (`name`), naturală, nu literală cuvânt-cu-cuvânt dacă nu sună bine așa. Afișată în interfață (lista Bibliotecii) în locul liniei tehnice meta/autor, care s-a mutat în panoul „i" din cititor. Obligatoriu la fiecare lucrare nouă completată (`available: true`).

### Pasul 6 — Caută locul în `LIBRARY`
1. Caută placeholder existent cu același slug (`available: false, chapters: []`)
2. Dacă există: înlocuiește-l complet (nu duplica)
3. Dacă nu există: adaugă în subfolderul corect (Zohar / Sefer Ietzira / Alte texte cabalistice), cu `isHeader` verificat

### Pasul 7 — Validare tehnică, obligatorie
1. DOCTYPE intact
2. `node --check` pe scripturile inline și pe `library-data.js`
3. Numărul de sloguri — 386 (vezi mai sus), sau +1 exact per lucrare nouă
4. Verifică punctual: `meta`, `available: true`, numărul de capitole/versete — printează explicit, nu presupune

### Ce NU se face niciodată
- Nu se inventează text pentru versete/paragrafe lipsă — se lasă gol, marcat onest intern
- Nu se completează `kab-maamar-zohar-harakia` din ebraică, niciodată
- Nu se amestecă texte din surse diferite fără atribuire distinctă
- Nu se lasă note de proces în datele livrate
- Nu se șterge conținut real existent ca să facă loc unei versiuni „noi" dar mai puțin complete

### Greșeli reale, întâlnite, de reținut
- Talmud/Mișna citat „(verificat)" fără căutare reală — corectat de fiecare dată; fila se verifică EFECTIV în sursă
- Fișier „nou" retrimis, de fapt identic cu ce exista deja (Heikhalot Rabbati, Rasag, Ramban) — comparat text-cu-text, confirmat 0 diferențe
- Numerotare diferită între aplicație și sursă pentru același conținut — comparat prin poziție, nu prin cheie
- Sumă de versete ușor diferită de notele estimative ale sursei — nu-i alarmant dacă componentele se verifică corect

---

## Căutarea (tab Căutare)
- Secțiunea „Biblia” = doar textul Torei (Rosen) și al Haftarot; „Comentarii-Texte” = restul arhivei din Diverse + comentariile atașate versetelor din Biblia. Nu se amestecă.
- Haftarot se caută într-un index mic de text, `public/search-haftarot.js`, generat cu `node tools/build-search-haftarot.js`. **Se rulează din nou după orice modificare de text la Haftarot** (altfel căutarea arată textul vechi).
- „Comentarii-Texte” se caută pe server (`/api/search`, modulul `search-index.js`), care indexează la pornire toată arhiva din Diverse, inclusiv capitolele încărcate la cerere (Zohar, Mișna, Josephus, Eusebiu). Indexul se reconstruiește la fiecare repornire/deploy, deci nu cere nicio regenerare. Fără server, aplicația caută doar în ce e deja încărcat.
- Numărul de capitol afișat în cititor e cel real din sursă (`libChNum`), nu poziția: Marcion începe la cap. 5, Dialogul Mântuitorului la 120.

## Istoria zilei (panou în Acasă)
- Date de pe server: `/api/istoria-zilei?m=&d=` (`istoria-zilei.js`). Surse (atribuirea apare în iconița „i” a panoului, nu se scoate): evenimente selectate din Wikipedia engleză, traduse în română, în `data/evenimente-src/` (se refac cu `node tools/build-istoria-evenimente.js` → `data/istoria-evenimente.json`); nașteri/decese din Wikidata (CC0) în `data/istoria-persoane.json` (`node tools/build-istoria-persoane.js`, durează ~40 min); completare din paginile de zi ale Wikipedia în română (CC BY-SA 4.0). Evenimentele neoprotestante din `neoprotestante.json` au fost verificate pe surse web; nu se adaugă date neverificate.
- **Versetul zilei (regulă fermă, 5 nov. 2026):** doar versete de încurajare, bucurie, mângâiere și înălțare, niciodată un verset oarecare. Lista e `VOTD_CURATED` din `public/biblie-demo.html` (118 referințe exacte din Haftarot, verificate că există în `public/search-haftarot.js`). Rotația e pe zile; dacă un verset din listă se potrivește clar (≥2 cuvinte-cheie) cu evenimentul zilei, se alege acela. Nu se mai caută în toate versetele Haftarot după cuvintele evenimentului (așa a ieșit 1 Samuel 20:30). La extinderea listei, fiecare verset se citește și se alege manual; fără mânie, rușine, moarte, război, blesteme; fără versete care cer context.
- Ordinea: întâi cele cu cuvinte-cheie creștine/iudaice (lista `RELIGIOUS`), apoi cele mai bine documentate; evenimentul zilei = primul din listă. „Povestea zilei” = introducerea articolului Wikipedia la care trimite evenimentul.
