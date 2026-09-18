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
- `biblie-demo.html` — fișierul principal, ~8.8MB, ultima versiune livrată e cea corectă
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
- Samaritean Levitic/Numeri/Deuteronom marcate „(în lucru)" — 74-90% engleză amestecată, NU se folosesc încă
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

### 2. Panou lexical per cuvânt (dropdown) — câmpuri exacte din `tokens[]`
Țintă: ~9,9 cuvinte tagate per verset, în medie.

Câmpurile exacte citite de `showWordPopover()` în `biblie-demo.html`, în ordinea reală de afișare: `heb`, `translit`, `strong`, `pos` → **`def_ro`** (definiția principală afișată — NU câmpul `def`, care e nefolosit/legacy) → apoi, în panoul extins (fiecare doar dacă are conținut): `greek` (etichetă „LXX (Septuaginta)"), `greek_def_ro` (etichetă „Definiție greacă"), `diff_ro` (etichetă „Diferență ebraică / greacă"), `dict_ro` (etichetă „Dicționar biblic").

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

**Audit exact (16 sept. 2026), comentarii per verset**: Geneza 1 = 7,13; Geneza 2 = 4,08; Geneza 3 = 4,33 — Geneza 2 și 3 sunt SUB nivelul Genezei 1, mai ales la Rashi/Ibn Ezra/Ramban/Sforno/Talmud/Kabbala:

| Sursă | Geneza 1 | Geneza 2 | Geneza 3 |
|---|---|---|---|
| Rashi | 24 | 8 | 2 |
| Ibn Ezra | 14 | 2 | 1 |
| Ramban | 10 | 4 | 1 |
| Sforno | 16 | 1 | 1 |
| Talmud | 7 | 1 | 0 |
| Kabbala | 1 | 0 | 0 |

De completat retroactiv la Geneza 2-3 când arhiva Talmud/Kabbala/comentatori e disponibilă pentru verificare.

### 6. Validare tehnică — obligatorie la fiecare livrare
1. DOCTYPE intact — verificat, nu presupus (a existat un incident real de corupere)
2. `node --check` pe fiecare bloc `<script>` din fișier (există exact 2 în `biblie-demo.html`)
3. Numărul de sloguri neschimbat — trebuie 362, dacă nu se adaugă/șterge intenționat o lucrare (caz în care crește/scade cu exact 1 per lucrare, nu mai mult)
4. Cifre exacte arătate, nu aproximări — câte versete, câte comentarii, ce lipsește și de ce

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
2. `node --check` pe fiecare `<script>` (exact 2)
3. Numărul de sloguri — 362, sau +1 exact per lucrare nouă
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
