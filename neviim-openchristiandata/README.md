# Materiale brute (engleză) creștine/patristice pentru Nevi'im — extras restrâns, doar Haftarot

Acesta e stadiul de EXTRAGERE, nu de integrare. Nimic din acest folder nu e tradus și nimic
nu a fost pus încă în aplicație. Echivalentul pentru Nevi'im al `tora-openchristiandata/`
(care acoperă doar Tora), dar RESTRÂNS explicit doar la cele 18 cărți și DOAR la capitolele
care conțin efectiv text folosit de cele 54+23 Haftarot catalogate — nu cărțile complete.

## Diferență importantă față de `tora-openchristiandata/`

La Tora s-au descărcat cărțile COMPLETE (Geneza-Deuteronom, ~187 capitole). Pentru Nevi'im
asta ar fi însemnat ~372 de capitole doar pentru cele 18 cărți (Isaia are 66, Ieremia 52,
Ezechiel 48 etc.) — de 2-3× mai mult decât toată Tora, pentru conținut care în cea mai mare
parte nu ar folosi la nicio Haftarah. **Decizie deliberată**: s-au descărcat DOAR cele ~117
capitole (per comentator) care conțin efectiv versetele citite la Haftarot — lista exactă e
în `commentaries/*.json` → `meta.book_scope`. Dacă apare nevoia de comentariu pe un capitol
neacoperit aici (de ex. la revizuirea unei Haftarot), se descarcă punctual, la cerere.

## `commentaries/` — comentarii clasice creștine

Sursă: **HelloAO Bible API** (`bible.helloao.org/api/c/...`), aceeași familie de date ca
proiectul OpenChristianData folosit la Tora. Licență **Public Domain Mark 1.0** confirmată
individual pentru toate cele 6 comentarii folosite (verificată prin `licenseUrl` din
`/api/available_commentaries.json`, nu presupusă).

**Wesley — omis complet.** La Tora, comentariul lui Wesley venea dintr-o sursă diferită
(CrossWire SWORD, format ThML/zCom), nu din HelloAO. HelloAO nu are deloc Wesley în lista sa
de comentarii disponibile. Replicarea pipeline-ului SWORD pentru Nevi'im n-a fost făcută la
acest pas — rămâne un gol real, de completat separat dacă se dorește.

### Acoperire per comentator (din 18 cărți posibile)

| Comentator | Cărți acoperite | Lipsă | Note |
|---|---|---|---|
| **Adam Clarke** | 14/18 | Ieremia, Ioel, Malahi, Judecători | Sursă are aceste cărți complet absente din indexul HelloAO pentru acest comentator (nu doar fără conținut la capitolele cerute) |
| **John Calvin** | 13/18 | Judecători, Samuel I/II, Regi I/II | Calvin nu a scris comentarii pe cărțile istorice (Iosua–Regi), doar pe Psalmi/Profeți — absență reală, nu eroare |
| **Jamieson-Fausset-Brown** | 18/18 | — | Acoperire completă |
| **John Gill** | 18/18 | — | Acoperire completă |
| **Keil-Delitzsch** | 18/18 | — | Acoperire completă (comentariu doar pe VT, ca de obicei) |
| **Matthew Henry** | 18/18 | — | Acoperire completă, dar text scurt/sumar la multe cărți minore (ex. Obadia = 2 intrări) |
| **Wesley** | 0/18 | toate | Sursă diferită (SWORD), nereplicat la acest pas |

**99 de fișiere** `{comentator}-{carte}.json` scrise (din 108 combinații posibile la cele 6
comentatori disponibili prin HelloAO; 9 lipsă documentate mai sus).

Format fișier: `{"meta": {...}, "data": [{"chapter": N, "verse_range": "...", "commentary_text": "..."}]}` —
identic structural cu Tora, dar `meta.book_scope` documentează explicit ce capitole s-au
cerut pentru acel fișier.

## `church_fathers_filtered/` — citate patristice

Sursă: **`github.com/HistoricalChristianFaith/Commentaries-Database`** (aceeași sursă ca la
Tora), licență **Public Domain** confirmată (fișiere `.toml` individuale per verset/autor).
Filtrare făcută direct la sursă (nu reprocesare a fișierelor de Tora), păstrând DOAR citatele
ale căror fișiere încep cu numele uneia din cele 18 cărți.

**21 din 24 de autori patristici au citate reale pe Nevi'im** (2145 citate în total). **3
autori nu au avut niciun citat relevant**: **Cartea Jubileelor**, **Josephus**, **Philo din
Alexandria** — normal și de așteptat, nu o eroare: toți trei sunt texte antice evreiești ale
căror conținuturi din această bază de date acoperă narativul Torei (Geneza–Exod pentru
Jubileele, Antichitățile Iudaice cărțile I-IV pentru Josephus, tratatele pe Pentateuh pentru
Philo), nu Nevi'im.

### Acoperire per autor (cărți cu citate reale, din cele 18)

| Autor | Citate | Cărți |
|---|---|---|
| Ambrose of Milan | 335 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hab,Hos,Isa,Jer,Joel,Jonah,Josh,Judg |
| Augustine of Hippo | 267 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hab,Hos,Isa |
| Basil of Caesarea | 99 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hab,Hos,Isa,Jer,Joel,Jonah,Josh,Judg,Mic,Zech |
| Bede | 709 | 1Kgs,1Sam,2Kgs,2Sam |
| Clement of Alexandria | 58 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hos,Isa,Jer,Joel,Josh,Mic,Zech |
| Cyril of Alexandria | 219 | Amos,Ezek,Hab,Hos,Isa,Jer,Joel |
| Cyril of Jerusalem | 73 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hos,Isa,Jer,Joel,Jonah,Josh,Mal,Mic,Zech |
| Ephrem the Syrian | 205 | 1Kgs,1Sam,2Kgs,Amos,Ezek,Hos,Isa,Jer,Josh,Judg,Mal,Mic,Obad,Zech |
| Eusebius of Caesarea | 113 | 1Sam,Ezek,Hab,Isa,Jer,Josh,Judg,Zech |
| Gregory of Nazianzus | 81 | 1Sam,Amos,Ezek,Hos,Isa,Jer,Joel,Jonah,Josh,Judg,Mal,Mic,Zech |
| Gregory of Nyssa | 39 | 1Sam,Ezek,Isa,Josh,Judg,Mic,Zech |
| Hippolytus of Rome | 31 | 1Kgs,1Sam,Ezek,Hos,Isa,Jer,Mal,Mic,Zech |
| Irenaeus | 43 | 1Sam,Amos,Ezek,Hab,Hos,Isa,Jer,Jonah,Mal,Zech |
| Isidore of Seville | 5 | Isa |
| Jerome | 410 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek |
| John Chrysostom | 75 | 1Kgs,1Sam,2Kgs,2Sam |
| Justin Martyr | 51 | 1Sam,2Kgs,2Sam,Ezek,Hos,Isa,Jer,Joel,Josh,Mal,Mic,Zech |
| Methodius of Olympus | 20 | 1Sam,2Kgs,Hab,Isa,Jer,Joel,Jonah,Judg,Mic,Zech |
| Origen of Alexandria | 364 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hab,Hos,Isa,Jer |
| Tertullian | 104 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hab,Hos,Isa,Jer,Joel |
| Theodoret of Cyrus | 342 | 1Kgs,1Sam,2Kgs,2Sam,Amos,Ezek,Hab,Hos,Isa,Jer,Joel,Jonah,Josh,Mal,Mic,Obad |

Format fișier: `{"meta": {...}, "by_book": {"Isa": [{entry_id, author, anchor_ref, quote, source_title, source_url}, ...], ...}}` —
identic structural cu Tora (`anchor_ref.raw`/`anchor_ref.osis`, `quote`, `source_title`).

## `dictionaries/`

Nu s-a creat nimic nou aici — Easton's/Smith's/Hitchcock's/Torrey's din
`tora-openchristiandata/dictionaries/` sunt deja dicționare COMPLETE (nefiltrate), deci
acoperă deja și Nevi'im. Nu s-a creat un `-index.json` separat pentru Nevi'im (ca cel de Tora)
pentru că ar necesita re-parsarea completă a dicționarelor pentru a extrage ID-urile pe
carte — amânat, nu blocant pentru integrarea Haftarot.

## Ce NU e făcut încă
- Nimic tradus în română.
- Wesley lipsește complet (sursă diferită, nereplicată).
- `dictionaries/` fără index Nevi'im dedicat (dicționarele complete rămân utilizabile direct).
- Dacă o Haftarah viitoare necesită un capitol neacoperit aici, se descarcă punctual.
