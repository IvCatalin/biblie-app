# Comentatori clasici (Rashi, Ibn Ezra, Ramban, Sforno) + Talmud țintit — material brut, netradus

Sursă: `github.com/Sefaria/Sefaria-Export` — indexul de pe GitHub trimite la datele reale
găzduite pe `storage.googleapis.com/sefaria-export` (bucket public, fără autentificare).
Fiecare fișier JSON de acolo are propriul câmp `license` — verificat individual pentru
fiecare combinație, nu presupus.

## Ce s-a descărcat

Pentru fiecare comentator × carte din Tora (20 combinații), s-au descărcat:
- **Engleză**: versiunea "Sefaria Community Translation" — confirmat **CC0** pentru toate
  cele 20 de combinații.
- **Ebraică**: versiunea publică cu licență confirmată cea mai completă disponibilă per
  combinație (de obicei "On Your Way", uneori "Vocalized Edition" — toate **Public Domain**),
  verificată individual. Vezi tabelul de mai jos pentru excepția Ramban/Exod.

Format fișier: `{"capitol": {"verset": {"en": [...comentarii...], "he": [...comentarii...]}}}`.
Un verset poate avea 0, 1 sau mai multe comentarii în array (Rashi, de ex., are des mai
multe comentarii scurte per verset). Text BRUT, netradus — traducerea în română se face
separat, capitol cu capitol, verificată cuvânt cu cuvânt, nu din memorie.

## Licențe confirmate, per fișier

| Comentator | Carte | Licență engleză | Licență ebraică |
|---|---|---|---|
| Rashi | toate 5 | CC0 (Sefaria Community Translation) | Public Domain (On Your Way) |
| Ibn Ezra | toate 5 | CC0 (Sefaria Community Translation) | Public Domain (On Your Way / Vocalized Edition) |
| Ramban | Geneza, Levitic, Numeri, Deuteronom | CC0 (Sefaria Community Translation) | Public Domain (On Your Way / Vocalized Edition) |
| Ramban | **Exod** | CC0 (Sefaria Community Translation) — dar text foarte sărac (44 versete cu comentariu, vs. ~230-550 la celelalte cărți) | **OMISĂ** — nicio versiune ebraică găsită cu licență confirmată (candidatele "On Your Way" și "Sefaria Vocalized Edition" au licență "unknown" în sursă) |
| Sforno | toate 5 | CC0 (Sefaria Community Translation) | Public Domain (On Your Way / Vocalized Edition / Daat) |

**Exclus explicit**: "William Davidson Edition" (traducerea completă engleză a Talmudului de pe
Sefaria) — licență **CC-BY-NC**, care nu e pe lista acceptată (Public Domain/CC0/CC-BY/CC-BY-SA).

## Talmud — `talmud-pasaje/genesis-relevante.json`

Doar cele 6 pasaje cerute (Chagigah 12a/12b/15b, Berakhot 2b, Shabbat 88a/109b), extrase
direct prin API-ul Sefaria (`sefaria.org/api/texts/<ref>`) cu versiuni fixate explicit:
engleză = Sefaria Community Translation (CC0), ebraică/aramaică = Wikisource Talmud Bavli
(CC-BY-SA).

Chagigah 12a, 12b și 15b au ambele limbi complete. **Berakhot 2b și Shabbat 109b nu au
traducere engleză CC0 disponibilă la Sefaria** (versiunea comunitară e goală la acele
pasaje) — rămân doar cu textul aramaic original, de tradus manual când se integrează.
Shabbat 88a are engleză CC0 dar foarte fragmentară (1 linie) — se folosește tot aramaica
ca sursă principală.

## Ce NU e făcut încă
Nimic tradus în română. Nu s-a ales încă ce comentarii intră efectiv în Geneza 2-3 —
asta se face separat, capitol cu capitol, cu acest fișier ca sursă brută.
