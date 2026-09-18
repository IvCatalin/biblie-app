# Materiale brute (engleză) pentru Tora — OpenChristianData

Acesta e stadiul de EXTRAGERE, nu de integrare. Nimic din acest folder nu e tradus și nimic
nu a fost pus încă în aplicație. Scopul: să avem tot ce ne trebuie pentru toată Tora
descărcat, filtrat și organizat, ca să putem lua fișierul potrivit atunci când lucrăm
capitol cu capitol.

## Sursă și licență
- `github.com/OpenChristianData/open-christian-data`, licență **CC0** (confirmat).
- Descărcat direct din `raw.githubusercontent.com`, nu din Hugging Face.

## Structură

### `commentaries/` (38 MB)
Un fișier JSON per (autor × carte), format original al proiectului OpenChristianData:
`{"meta": {...}, "data": [{"chapter": N, "verse_range": "1-2", "commentary_text": "..."}]}`.

35 de fișiere = 5 cărți (Geneza, Exod, Levitic, Numeri, Deuteronom) × 7 comentarii
(Adam Clarke, Calvin, Jamieson-Fausset-Brown, John Gill, Keil-Delitzsch, Matthew Henry,
Wesley). Lipsește doar Adam Clarke pe Deuteronom (nu există în sursă).

### `church_fathers_filtered/` (4 MB)
Un fișier JSON per autor patristic, **deja filtrat** doar la citatele care ating Tora
(Geneza–Deuteronom) — restul (Talmud... nu, restul Bibliei, adică Evanghelii/Epistole
etc.) a fost scos ca să nu cărăm date inutile. Format: `{"meta": {...}, "by_book":
{"Gen": [...], "Exod": [...], ...}}`, fiecare intrare cu `anchor_ref`, `quote`,
`source_title`.

24 de autori verificați: Augustin, Ioan Gură de Aur, Vasile cel Mare, Origen, Efrem
Sirul, Ambrozie al Milanului, Ieronim, Teodoret de Cir, Chiril al Alexandriei, Grigorie
de Nyssa, Irineu, Tertulian, Clement Alexandrinul, Iustin Martirul, Ipolit al Romei,
Metodiu de Olimp, Eusebiu de Cezareea, Grigorie de Nazianz, Chiril al Ierusalimului,
Isidor de Sevilla, Beda Venerabilul, Rabanus Maurus, Filon din Alexandria, Iosif
Flaviu, Cartea Jubileelor.

### `dictionaries/` (18 MB)
- `eastons-bible-dictionary.json`, `smiths-bible-dictionary.json` — dicționare complete
  (nefiltrate) + câte un fișier `-torah-index.json` cu ID-urile intrărilor care ating
  Tora (Easton's: 763/494/247/488/429 intrări pe Gen/Exod/Lev/Num/Deut; Smith's:
  622/284/152/485/14).
- `hitchcocks-bible-names-dictionary.json` — dicționar de nume proprii, nefiltrat pe
  carte (se caută mai bine după numele propriu din text decât după referință de verset).
- `torreys-topical-textbook.json` — index tematic (nu pe verset, ci pe subiect), util
  mai târziu pentru trimiteri încrucișate tematice, nu pentru panoul de cuvânt.

## Ce NU e făcut încă
- Nimic tradus.
- Nu s-a ales încă „cele mai relevante 4/verset" din comentarii + Sfinți Părinți — asta
  se face pe măsură ce lucrăm capitol cu capitol, cu fișierele astea ca sursă.
- `hitchcocks` și `torreys` nu sunt filtrate — rămân complete, se interogează la nevoie.

## AUDIT — problemă găsită la lexiconul Strong's+BDB (separat de acest pachet)
Arhiva `lexicon-vt-complet-corectat.zip` primită anterior are reziduuri reale de
engleză, verificate cu script, nu presupuse:

| Carte | Intrări totale | Cu reziduuri engleză (≥2 cuvinte) |
|---|---|---|
| Geneza | 1772 | 139 (8%) |
| Exod | 1406 | 133 (9%) |
| Levitic | 945 | 90 (10%) |
| Numeri | 1434 | 124 (9%) |
| Deuteronom | 1432 | 138 (10%) |

Important: procentul e mic per total de intrări, dar cuvintele afectate sunt tocmai cele
mai **frecvente** — prepoziții (עַל), verbe comune (הָיָה, בָּרַךְ) — deci apar în aproape
fiecare verset. La Geneza 1, de exemplu, 32 din cele 88 de cuvinte tagate (36%) foloseau
o definiție stricată din acest zip. Concluzie: zipul nu poate fi folosit direct — fiecare
definiție trebuie verificată/tradusă din nou înainte de a intra în vreun capitol,
exact cum am făcut manual la Geneza 1.
