# Instrucțiuni pentru Grok — Lexicon ebraic (Strong's + BDB), tradus în română, pentru tot Vechiul Testament

## Contextul task-ului

Aplicația Davar Atlas are, la fiecare cuvânt ebraic din text, un panou lateral cu: cuvântul ebraic, transliterarea, și un număr Strong's (ex: H7225). Vrem să adăugăm la fiecare cuvânt **două câmpuri noi**:
1. `def` — definiția scurtă Strong's (deja există în engleză undeva în surse, trebuie doar extrasă + tradusă)
2. `bdb` — explicația extinsă din Brown-Driver-Briggs (BDB), un lexicon ebraic savant, mult mai bogat decât Strong's (rădăcină, sensuri numerotate, nuanțe)

Ambele câmpuri trebuie **traduse și adaptate în limba română** — nu traducere automată cuvânt-cu-cuvânt, ci o traducere clară, naturală, păstrând sensul teologic/lingvistic exact.

---

## Sursele de date (3 fișiere XML, gratuite, licență CC BY 4.0)

Toate trei sunt în același repo GitHub: **openscriptures/HebrewLexicon**

1. **Strong's Hebrew (definiții scurte)**
   `https://raw.githubusercontent.com/openscriptures/HebrewLexicon/master/HebrewStrong.xml`

2. **Brown-Driver-Briggs (definiții extinse)**
   `https://raw.githubusercontent.com/openscriptures/HebrewLexicon/master/BrownDriverBriggs.xml`

3. **Indexul care leagă numărul Strong's de intrarea BDB corespunzătoare**
   `https://raw.githubusercontent.com/openscriptures/HebrewLexicon/master/LexicalIndex.xml`

Licență: **CC BY 4.0** — folosire liberă, doar cu atribuire (nu GPL, ca alt repo asemănător de la aceeași organizație — verifică să fie exact acest repo, `HebrewLexicon`, nu `strongs`).

---

## Pasul 1 — Extrage definiția scurtă Strong's (din HebrewStrong.xml)

Format brut:
```xml
<entry id="H1">
  <w pos="n-m" pron="awb" xlit="ʼâb" xml:lang="heb">אָב</w>
  <source>a primitive word;</source>
  <meaning><def>father</def>, in a literal and immediate, or figurative and remote application</meaning>
  <usage>chief, (fore-) father(-less), patrimony, principal.</usage>
</entry>
```

Extrage conținutul din `<meaning>` (sau din `<usage>` dacă `<meaning>` lipsește), pentru fiecare `id="Hxxxx"`. Scoate tag-urile XML, păstrează doar textul.

## Pasul 2 — Leagă numărul Strong's de intrarea BDB corectă (din LexicalIndex.xml)

Format brut:
```xml
<entry id="bxy">
  <w xlit="bārāʾ">בָּרָא</w> <pos>V</pos> <def>shape</def>
  <xref bdb="b.cw.aa" strong="1254" aug="a" twot="278"/>
</entry>
```

**ATENȚIE — capcană reală, descoperită prin verificare directă**: unele numere Strong's au **mai multe intrări** în acest index (sensuri diferite ale aceleiași rădăcini). Exemplu confirmat: H1254 (ברא) apare de două ori — o dată cu `aug="a"` → sensul „shape, create" (sensul din Geneza 1:1!), și o dată cu `aug="b"` → sensul rar „be fat". Dacă iei prima potrivire găsită în fișier, fără să te uiți la `aug`, poți lua sensul GREȘIT.

**Regula corectă**: pentru fiecare număr Strong's, dacă există mai multe `<xref>` cu `strong="acelasi_numar"`:
- preferă intrarea **fără atribut `aug`** (înseamnă sens unic, sigur)
- dacă există mai multe cu `aug`, preferă **`aug="a"`** (e sensul principal/cel mai comun)
- ignoră `aug="b"`, `"c"` etc. dacă există un `"a"` disponibil

Rezultatul acestui pas: o listă `numar_strong -> id_bdb` (ex: `H7225 -> t.ad.ag`).

## Pasul 3 — Extrage textul BDB (din BrownDriverBriggs.xml), folosind id-ul din pasul 2

Format brut (exemplu real, H7225):
```xml
<entry id="t.ad.ag" cite="full"><w>רֵאשִׁית</w> <pos>n.f</pos>. <def>beginning</def>, <def>chief</def>
  <sense n="1">
    <sense n="a"><def>beginning</def></sense>
    <sense n="b"><def>first</def></sense>
  </sense>
  <sense n="2"><def>first</def>, <def>chief</def></sense>
  <status p="912">base</status>
</entry>
```

Curăță: scoate `<status>...</status>` complet (e doar metadată de pagină, nu conținut util), transformă `<sense n="X">` în „(X)" simplu, transformă `<ref r="...">text</ref>` în „[text]", scoate restul tag-urilor XML, decodează entitățile HTML (`&amp;` → `&`).

## Pasul 4 — Traduce ambele câmpuri (`def` și `bdb`) în română

Asta e partea cea mai mare de muncă. Pentru fiecare cuvânt ebraic din Vechiul Testament (probabil 8.000+ numere Strong's unice în total, dar practic ai nevoie doar de cele care chiar apar în textul folosit de aplicație — vezi Pasul 5):

- Tradu **natural, clar, în română corectă** — nu traducere mecanică
- Păstrează structura de sensuri numerotate acolo unde există (1, 2, 3... sau a, b, c...)
- Termeni tehnici de gramatică ebraică (Qal, Niphal, Piel, Hiphil, Hophal, Hithpael — formele verbale) **NU se traduc**, rămân așa cum sunt, sunt termeni standard internaționali
- Dacă un sens conține un citat biblic (`[Gen 1:1]`), păstrează referința

## Pasul 5 — De unde iei lista de cuvinte care chiar apar în text

Nu ai nevoie să traduci toate cele 8.000+ intrări din dicționar — doar cele care apar EFECTIV în textul Vechiului Testament pe care-l are aplicația. Aplicația are deja, pentru fiecare capitol tradus, fișiere `genesis-N.js`, `exod-N.js` etc. (structură JSON), unde fiecare cuvânt din text are deja un câmp `strong` (ex: `"strong": "H7225"`). Extrage toate valorile unice de `strong` din toate capitolele deja traduse, și fă lista de cuvinte de tradus pe baza aceea — nu pe tot dicționarul.

Dacă vrei să acoperi TOT Vechiul Testament dintr-o dată (nu doar capitolele deja introduse în aplicație), poți folosi și textul ebraic tagat complet (WLC — Westminster Leningrad Codex cu tag-uri Strong's), disponibil tot open-source la:
`https://github.com/openscriptures/morphhb` (licență CC BY 4.0) — conține tot Tanakh-ul, cuvânt cu cuvânt, cu numărul Strong's atașat fiecăruia.

## Pasul 6 — Formatul final de livrare

Un fișier JSON simplu, cu numărul Strong's ca cheie, și cele două traduceri ca valori:

```json
{
  "H7225": {
    "heb": "בְּרֵאשִׁית",
    "translit": "bereshit",
    "def_ro": "începutul, primul, în loc, timp, ordine sau rang (specific, o pârgă/prim rod)",
    "bdb_ro": "רֵאשִׁית substantiv feminin. început, căpetenie (1) (a) început (b) întâi (2) întâi, căpetenie"
  },
  "H1254": {
    "heb": "בָּרָא",
    "translit": "bara",
    "def_ro": "(absolut) a crea; (calificat) a tăia (o pădure), a alege, a hrăni (ca procese formative)",
    "bdb_ro": "בָּרָא verb. a plăsmui, a crea Qal Pf.— a plăsmui, a făuri, a crea Niph.—Pasiv. (1) a fi creat (2) cu referire la naștere (3) despre ceva nou, uimitor Pi. (1) a tăia (2) a decupa"
  }
}
```

O intrare per număr Strong's unic — nu per apariție în text (economisește timp mult).

## Pasul 7 — Livrare, totul într-o arhivă .zip

Fiindcă-i vorba de tot Vechiul Testament, volumul de date poate fi mare — nu livra un singur fișier JSON uriaș. Împarte pe cărți (sau pe grupe de cărți, dacă unele sunt mici), un fișier JSON per carte, apoi pune totul într-o singură arhivă `.zip`, cu nume clare:

```
lexicon-vt-strong-bdb-ro.zip
├── geneza.json
├── exod.json
├── levitic.json
├── numeri.json
├── deuteronom.json
├── iosua.json
├── ... (restul cărților VT, câte un fișier fiecare)
└── README.txt   ← un fișier scurt cu: câte numere Strong's are fiecare carte,
                     dacă vreo carte a rămas incompletă și de ce, orice observație
```

Fiecare fișier JSON păstrează exact formatul de la Pasul 6 (obiect cu numărul Strong's ca cheie). Dacă un cuvânt apare în mai multe cărți, e ok să se repete în fiecare fișier — mai simplu de verificat carte cu carte decât un singur fișier gigant.

---

## Rezumat pentru Grok, pe scurt

1. Descarcă `HebrewStrong.xml`, `BrownDriverBriggs.xml`, `LexicalIndex.xml` din `openscriptures/HebrewLexicon`
2. Pentru fiecare număr Strong's din lista de cuvinte folosite (dată separat, sau din `morphhb` pentru tot Tanakh-ul): găsește definiția scurtă (pas 1), găsește id-ul BDB corect — **cu grijă la `aug="a"` vs `"b"`** (pas 2), extrage și curăță textul BDB (pas 3)
3. Traduce ambele texte în română, natural, păstrând structura de sensuri și termenii gramaticali ebraici netradusi
4. Livrează un JSON, un obiect per număr Strong's, cu cheile `heb`, `translit`, `def_ro`, `bdb_ro`
