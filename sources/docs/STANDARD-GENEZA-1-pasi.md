# Standardul Geneza 1 — pașii de repetat pentru fiecare capitol din toată Biblia

Acesta e procesul stabilit acum, pe Geneza 1. Se aplică identic, capitol cu capitol,
peste tot restul Torei, apoi peste restul Bibliei. Nu se trece la pasul următor sau la
capitolul următor până pasul curent nu e verificat cu cifre exacte.

## Pasul 0 — Precondiție (o singură dată, deja făcută)
Panoul de cuvânt din `biblie-demo.html` a fost redesenat:
- Cuvântul de bază: mare, auriu, aliniat stânga, sus în panou.
- Sub el: ebraică, transliterare, cod Strong — neschimbat.
- Definiție ebraică (`tok.def_ro`) — română curată, verificată cuvânt cu cuvânt, NU
  luată direct din `lexicon-vt-complet-corectat.zip` (vezi audit mai sus).
- Definiție greacă nouă (`tok.greek_def_ro`) — termenul din Septuaginta + sensul lui în
  română, scris separat, nu doar transliterat.
- Notă de diferență ebraică/greacă (`tok.diff_ro`) — DOAR unde există o diferență reală
  de sens; secțiunea lipsește complet acolo unde LXX și textul ebraic coincid.
- Eliminat din panou: eticheta „Samaritean" și orice „referințe/apariții" — acelea nu
  aparțin panoului de cuvânt (comparația samariteană rămâne doar la nivel de verset, în
  `textCompare`; referințele TSK vor avea alt loc, de discutat separat, mai târziu).

Acest pas se face o singură dată per cuvânt/Strong, nu per capitol — odată tradus corect
H1254, de exemplu, traducerea se refolosește peste tot unde apare H1254 în toată Biblia.

## Pasul 1 — Lexicon Ebraic+Grec (per capitol)
1. Se ia lista de coduri Strong distincte folosite în capitol (`tok.strong` din fișierul
   `genesis-N.js` existent).
2. Pentru fiecare cod NOU (neîntâlnit încă în alt capitol deja făcut), se scrie din nou
   — nu se copiază din zip — o definiție ebraică (`def_ro`) și una greacă
   (`greek_def_ro`), plus notă de diferență doar unde chiar există.
3. Pentru codurile deja făcute la un capitol anterior, se refolosește traducerea — nu se
   retraduce.
4. Audit: căutare de cuvinte engleze reziduale (`the, and, of, with, from...`) — trebuie
   0 rezultate înainte de livrare.

## Pasul 2 — Comentarii + Sfinți Părinți (per verset, per capitol)
Sursă: fișierele deja extrase în `tora-openchristiandata/` (vezi README de acolo).
1. Pentru fiecare verset din capitol, se adună din fișierele relevante (comentarii +
   Sfinți Părinți) toate intrările care ating acel verset.
2. Se aleg **cele mai relevante 4** (amestec comentarii + Sfinți Părinți, nu doar unul
   sau altul), cu diversitate de epocă/tradiție — nu 4 din același autor.
3. Se verifică textul integral al fiecărei surse alese (nu doar primele rânduri) — s-a
   găsit deja o contaminare reală (comentariu „John Gill" cu un paragraf inserat despre
   Thomas Chalmers, mort la >150 de ani după Gill) — orice sursă suspectă se aruncă, nu
   se folosește „pentru că pare ok".
4. Se traduce integral și natural în română, fără să se amestece doi autori într-o
   singură intrare.
5. Se adaugă la array-ul `commentaries` existent al versetului — nu se șterge nimic din
   comentariile deja puse (Rashi, Ibn Ezra, Ramban, Talmud etc. rămân neatinse).
6. Audit: 0 reziduuri engleză, 0 texte duplicate.

## Pasul 3 — Dicționar (per capitol, ancorat pe cuvinte, nu pe verset)
De implementat: pentru cuvintele-cheie din capitol (nu toate — cele cu adâncime
teologică/culturală reală: nume proprii, concepte centrale), se adaugă o intrare de
dicționar (din Easton's/Smith's, filtrate deja pe carte în `dictionaries/`) tradusă în
română, legată de cuvântul din panou — nu de tot capitolul. Regulă fermă: dacă niciun
cuvânt din capitol n-are o intrare de dicționar cu adevărat utilă, se sare pasul acesta
pentru capitolul respectiv — nu se forțează.

## Pasul 4 — Referințe TSK (mai târziu, plan separat)
Rămâne pentru o discuție separată, cum ați cerut — nu se face acum.

## Pasul 5 — Validare tehnică finală (obligatoriu, la fiecare livrare)
1. `node --check` pe fișierul capitolului.
2. DOCTYPE intact în `biblie-demo.html` (dacă a fost atins).
3. Cifre exacte arătate: câte cuvinte Strong noi, câte comentarii noi adăugate, câte
   verificate cu 0 reziduuri engleză.
4. Fișier prezentat cu `present_files`.

## Ordinea de lucru propusă pentru Tora
Geneza (termină 1-31, apoi capitolele următoare deja traduse din Rosen) → Exod →
Levitic → Numeri → Deuteronom, câte un capitol o dată, fără să se sară la următorul
înainte ca cel curent să fie 100% pe pașii 1-2 (+3 unde se aplică).
