# Raport — Josephus Flavius, Antichități iudaice, volumul 2 (cărțile XI–XX)

Comparat: `josephus-antichitati-volumul-2.zip` (10 fișiere JSON) cu textul-sursă `THE ANTIQUITIES OF THE JEWS.txt` (Whiston). Uneltele: `_josephus-extract/parse-en.js`, `_josephus-extract/coverage.js`.

## Concluzie: traducerea NU e completă și NU e fidelă — nu a fost adăugată în aplicație

Textul român e, în cea mai mare parte, un rezumat, nu o traducere. Împarte, pe secțiuni (paragrafele numerotate ale lui Whiston):

| Cartea | secțiuni în sursă | prezente în RO | complete (≥75% din lungime) | trunchiate/rezumate | caractere sursă | caractere RO |
|---|---|---|---|---|---|---|
| XI | 53 | 20 | 12 | 8 | 110.364 | 24.486 |
| XII | 68 | 24 | 9 | 15 | 137.378 | 25.196 |
| XIII | 87 | 40 | 24 | 16 | 141.411 | 41.963 |
| XIV | 111 | 23 | 8 | 15 | 161.411 | 15.608 |
| XV | 67 | 12 | 0 | 12 | 147.861 | 4.696 |
| XVI | 60 | 10 | 0 | 10 | 131.039 | 2.492 |
| XVII | 59 | 13 | 0 | 13 | 125.584 | 3.077 |
| XVIII | 56 | 10 | 1 | 9 | 130.092 | 2.630 |
| XIX | 51 | 8 | 0 | 8 | 115.251 | 1.761 |
| XX | 46 | 10 | 0 | 10 | (sursa include și anexe) | 2.063 |
| **Total** | **658** | **170** | **54 (8%)** | **116** | 1.605.904 | 123.972 |

- Doar 4 capitole din 114 sunt integral prezente și complete: XI.1, XI.2, XII.1, XIII.7.
- Începutul cărții XI e o traducere fidelă (ex. XI.1.1–2 corespund frază cu frază cu sursa). De la mijlocul cărții XI în jos traducerea devine rezumat, iar de la cartea XV e un rezumat de 3–5 rânduri per capitol (raport RO/EN ≈ 2–3%).
- Rezumatele conțin și afirmații care nu sunt în sursă. Exemple: XV.1 („Sosius… a insultat pe Antigon și l-a numit Antigona”); XX.1 (face din Cassius Longinus urmașul lui Marcus, deși sursa spune că procuratorul sosit în Iudeea e Fadus); XI.5 (numele „Iehonia” și deznodământul căsătoriilor cu femei străine sunt redate în mare parte altfel decât în Whiston).
- Împărțirea pe „versete” a fișierelor nu urmează secțiunile lui Whiston după ce traducerea se scurtează; câmpul `niese` e gol peste tot.

## Ce trebuie refăcut (de Grok)
Traducere integrală, secțiune cu secțiune (1., 2., 3. … ca în sursă), cărțile XI–XX, fără rezumate și fără adaosuri. Lista exactă a secțiunilor lipsă/trunchiate: rulează `node _josephus-extract/coverage.js <en.json> <dir-ro> <iesire.json>` (iese `coverage-miss.json` cu fiecare secțiune lipsă sau rezumată, pe carte).

Arhiva și sursa rămân în `de-procesat/`, neatinse. Volumul 1 (cărțile I–X) nu e încă în aplicație; în Bibliotecă, la Josephus, există doar placeholderul „Războiul Iudeilor”.
