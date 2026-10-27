# Pachet pentru Grok — Faptele lui Petru (și Faptele lui Andrei)

Sursa (domeniu public): M. R. James, *The Apocryphal New Testament*, Oxford 1924 — descărcată și curățată de Claude Code.

## 1. Faptele lui Petru — de tradus integral în română modernă
- `petru-EN-unitati.json` = lista capitolelor (câmpul `parts` = unități de tradus, în ordine). 42 capitole (Fragmentul copt + Vercelli I–XLI), 195 unități (3 eliminate din cap. III = comentariul lui James), ~98.000 caractere.
- `petru-RO-facut/00.json … 10.json` = capitolele DEJA traduse (stilul de urmat: română modernă, ș ț ă â î, „Domnul”, nume: Petru, Pavel, Simon Magul, Marcel, Nero, Agripa…).
- De făcut: capitolele 11–41 (fișiere `11.json … 41.json`), același format:
  `{"ch":11,"title":"11","verses":[{"w":1,"t":"…"},{"w":2,"t":"…"}]}` — EXACT același număr de unități ca în `parts`, în aceeași ordine.
- Traducere integrală, fără rezumat, fără adaosuri, fără note de proces. Comentariile editoriale ale lui James din paranteze se omit; lacunele manuscrisului se păstrează ca [ … ].

## 2. Faptele lui Andrei — completări
Aplicația are doar epitoma lui Grigore de Tours (38 capitole). În `andrei-James-EN.txt` mai sunt de tradus:
- fragmentele și citatele dinaintea Pasiunii (liniile ~540–840, inclusiv fragmentul din Vatican cu cuvântările lui Andrei);
- **Martiriul** (de la „THE MARTYRDOM”, ~liniile 845–1085).
Se predau ca fișiere separate, pe capitole/numerotare ca în sursă.

## 3. Verificare (o rulează Claude Code, ieftin)
`unelte/verify.js` — numără unitățile, raportul lungime RO/EN (0,8–1,6), cedilă, engleză rămasă, numere lipsă.
