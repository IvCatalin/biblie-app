# Starea arhivelor din `de-procesat` (6 octombrie 2026)

## Terminate — mutate în `procesate/`

### `procesate/samaritean/`
- `Pentateuh_Samaritean_Lev_Num_Deu_RO.zip`, `_samaritean-extract/`, `_samaritean-v2/` (cu arhivele v2 pentru Geneza, Exod, Levitic/Numeri/Deuteronom)
- Integrat în Bibliotecă (commit 0d70c5f): Geneza — 50 de versete corectate, Exod — 40, Levitic/Numeri/Deuteronom — traducere nouă integrală, fără engleză; marcajul „(în lucru)” scos.

### `procesate/haftarot-ciclu-saptamanal/`
- `Haftarot_Exod.zip`, `Haftarot_Levitic.zip` + `_v2`, `Haftarot_Numeri.zip` + `_v2`, `Haftarot_Deuteronom.zip` + `_v2` și folderele lor de lucru
- Textul lor de bază e în întregime în fișierul de lucru `_haftarot-extract/haftarot-ciclu-saptamanal.json` (57 de capitole, 1.332 de versete).

### `procesate/Zohar_baza.PARTIAL.pana-la-Miketz-8-si-10.ro.zip`
- Integrat în Bibliotecă la slug `kab-zo-zohar` (placeholder gol înlocuit complet, `available: true`).
- 11 secțiuni (Introducere + parașele Bereșit–Vaieșev integral, plus Mikeț parțial: secțiunile 1-8 și 10, lipsă secțiunea 9) · 4.146 paragrafe în total.
- Titlurile de capitol traduse în română, format identic cu Haftarot (ex. „Bereșit - La început”).
- `name_ro`: „Cartea Splendorii”. Sursă: text aramaic clasic (ediția Vilna/Mantua, domeniu public, NU comentariul Sulam), API Sefaria.
- Restul Zoharului (de la Vaigaș înainte) nu e încă disponibil în nicio arhivă — următoarea etapă posibilă, când/dacă apare o arhivă nouă.

## TERMINAT COMPLET (6 octombrie 2026) — ciclul săptămânal de Haftarot

Toate cele 57 de capitole ale ciclului săptămânal de Haftarot (Bereșit → Haazinu) sunt acum la Standardul Davar complet: lexicon grec (comparație cu Septuaginta) adăugat la fiecare cuvânt tagat, pe lângă comentariile evreiești, dicționarul și trimiterile deja existente din sesiunile anterioare. Validate cu `node lex/apply.js <cap> --rev` — 0 erori pe toate cele 57. Integrate live în aplicație prin `public/haftarot-geneza.js`, `haftarot-exod.js`, `haftarot-levitic.js`, `haftarot-numeri.js`, `haftarot-deuteronom.js` (încărcate prin `lazySrc` din LIBRARY).

- `_haftarot-extract/` și `_haftarot-deuteronom-extract/` **rămân** în `de-procesat/` ca unelte de lucru active (sursa master `haftarot-ciclu-saptamanal.json` + scripturile `lex/`), nu ca arhive de arhivat — se vor folosi din nou la orice corectură viitoare a Haftarot-urilor.

## Încă în lucru — rămân în `de-procesat/`

- `Haftarot_Sarbatori_v2.zip` — textul de bază pentru 27 de haftare de sărbători (660 de versete), verificat structural; urmează compararea cu pozele paginilor și construirea capitolelor.
- `Haftarot_Sarbatori.zip`, `citiri_sarbatori.json` — prima versiune a sărbătorilor, înlocuită de v2; se păstrează până la integrarea v2.
- `Haftarot.zip` — pozele originale ale cărții Rosen (necesare la verificarea sărbătorilor).
- `tora-openchristiandata.zip`, `WhatsApp Image 2026-09-19 at 13.25.31.jpeg`, `Beresit din tab-ul biblia de pe telefon.jpeg`, `beresit tab-ul arhiva biblica-tora web.png`, `panou lexical hael idee/` — neatinse, fără legătură cu procesarea de conținut (poze de referință/UI, nu arhive de text).
- `task-audit-haftarot-bugs.txt` — listă de bug-uri de interfață (nu de conținut); parțial depășită, căci haftarot-geneza.js etc. au acum conținut real (nu mai sunt „verses: []”) — restul punctelor (1-3, 5-7) rămân de verificat separat, în chat (bug-uri de interfață, nu procesare de conținut).

