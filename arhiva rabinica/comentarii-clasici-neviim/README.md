# Comentatori clasici pe Nevi'im (Rashi, Radak, Metzudat David, Metzudat Zion) — material brut, netradus

Sursă: `github.com/Sefaria/Sefaria-Export`, date reale accesate prin API-ul public
`sefaria.org/api/texts/...` (fără autentificare). Fiecare fișier are propriul câmp
`license` — verificat individual per comentator × carte, nu presupus. Aceeași rigoare
ca la `arhiva rabinica/comentarii-clasici/` (Tora), dar cu setul de comentatori corect
pentru Nevi'im: **Rashi rămâne, dar Ibn Ezra/Ramban/Sforno (seturi de Tora) sunt
înlocuite cu Radak, Metzudat David și Metzudat Zion** — perechea Metzudat e standardul
pentru sens literal/lingvistic pe Nevi'im.

## Cărți incluse (18, exact cele din care provin cele 54+23 Haftarot catalogate)

Isaia, Ieremia, Ezechiel, Osea, Ioel, Amos, Obadia, Mica, Habacuc, Zaharia, Malahi,
Iosua, Judecători, Samuel I, Samuel II, Regi I, Regi II, Iona. Nu s-a descărcat nimic
din restul lui Nevi'im/Ketuvim (Judecătorii minori rămași, Cronici, etc.) — nu sunt
folosite de nicio Haftarah.

Format fișier: identic cu arhiva de Tora — `{"capitol": {"verset": {"en": [...], "he": [...]}}}`.
Un verset apare doar dacă are cel puțin un comentariu (en și/sau he); versetele fără
comentariu sunt omise din JSON. Text BRUT, netradus.

## Licențe confirmate, per comentator

| Comentator | Ebraică | Engleză |
|---|---|---|
| **Rashi** | Public Domain ("On Your Way"), toate 18 cărți | CC0 ("Sefaria Community Translation") la 12/18 cărți; CC-BY ("Judaica Press", trad. A.J. Rosenberg) la Osea/Ioel/Obadia/Mica/Habacuc; CC-BY ("Metsudah Tanach series") la Regi II |
| **Metzudat David** | Public Domain ("On Your Way"), toate 18 cărți | CC0 doar la Obadia/Iosua/Samuel I/Samuel II (4/18) — restul ebraică-only |
| **Metzudat Zion** | Public Domain ("On Your Way"), toate 18 cărți | CC0 doar la Malahi/Iosua/Regi I (3/18) — restul ebraică-only |
| **Radak** | **OMISĂ complet, toate 18 cărți** — singura versiune ebraică de pe Sefaria ("Radak on Nach") are licența `"unknown"`, nu `Public Domain`; exclusă pe același precedent ca Ramban/Exod ebraică (Tora) | CC0 ("Sefaria Community Translation") doar la Judecători/Samuel I/Iona; Public Domain ("McCaul Translation") doar la Zaharia — **4/18 cărți**, restul 14 complet omise |

**Exclus explicit**: orice versiune cu licență `"unknown"` (aceeași regulă ca la Tora) —
afectează în special Radak, care nu are nicio versiune ebraică utilizabilă pe nicio
carte din Nevi'im pe Sefaria.

## Rezultat descărcare — cifre exacte

58 de combinații comentator×carte descărcate cu succes, 0 erori:
- Rashi: 18/18 cărți (bilingv, cu fallback CC-BY unde nu exista CC0)
- Metzudat David: 18/18 cărți (ebraică completă; engleză doar la 4)
- Metzudat Zion: 18/18 cărți (ebraică completă; engleză doar la 3)
- Radak: 4/18 cărți (Judecători, Samuel I, Iona, Zaharia — doar engleză, fără ebraică)

**Radak omis complet la 14/18 cărți** (Isaia, Ieremia, Ezechiel, Osea, Ioel, Amos,
Obadia, Mica, Habacuc, Malahi, Iosua, Samuel II, Regi I, Regi II) — nicio versiune cu
licență acceptată, în nicio limbă. Aceasta e o lacună reală, nu o simplificare —
Radak, cerut ca „principalul comentator pe Nevi'im", va lipsi din comentariile Davar
la majoritatea Haftarot; Rashi + Metzudat David + Metzudat Zion rămân sursa principală
peste tot.

## Talmud
Nu s-a descărcat nimic la acest pas — la fel ca la Tora, se face ulterior, punctual,
doar pasajele cerute explicit pentru o Haftarah anume (nu în bloc).

## Ce NU e făcut încă
Nimic tradus în română. Nu s-a ales încă ce comentarii intră efectiv în fiecare
Haftarah — asta se face separat, per Haftarah, cu acest fișier ca sursă brută.
