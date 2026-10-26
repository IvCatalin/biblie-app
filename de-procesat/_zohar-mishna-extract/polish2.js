// Curățare Kabbala + Mișna: titlu/subtitlu simple; în panoul „i” rămân doar sursa și statutul (domeniu public / ediția); fără note de proces.
const { load, save } = require('./lib.js');
const S = load(); const lib = S.lib;
const kab = lib.arhivaRabinica.subfolders.find(f => f.label === 'Kabbala');
const mi = lib.arhivaRabinica.subfolders.find(f => f.label === 'Mișna');
const K = {
  'kab-zo-zohar-chadash': { summary: 'Zohar Chadash („Zoharul Nou”) — colecție de texte zoharice suplimentare, organizate pe parașele Torei, plus secțiunile Shir HaShirim, Midrash Rut, Midrash HaNeelam la Eikha, Sifra Tanina și Tikkunim.', author: 'corpus zoharic', meta: '31 secțiuni · 4.430 paragrafe', ed: { source: 'Sefaria — Zohar Chadash', source_status: 'Domeniu public' } },
  'kab-zo-beur-hagra-on-sifra-detzniuta': { summary: 'Comentariul Vilna Gaon (Gra) la Sifra DeTzniuta, secțiune din Zohar.', meta: '5 capitole · 297 paragrafe', ed: { source: 'Sefaria / Wikisource — ediția Vilna 1820', source_status: 'Domeniu public' } },
  'kab-sy-pri-yitzhak-on-sefer-yetzirah-gra-version': { summary: 'Comentariu la Sefer Yețirah (versiunea Gra).', author: '', ed: { source: 'Sefaria — ebraică, ediția Varșovia 1884', source_status: 'Domeniu public' } },
  'kab-sy-raavad-on-sefer-yetzirah': { summary: 'Comentariul tradițional atribuit lui Raavad la Sefer Yețirah, cu cele două introduceri ale sale.', author: 'atribuit lui Avraham ben David (Raavad)', meta: '8 secțiuni · 418 comentarii', ed: { source: 'Sefaria — ebraică, ediția Varșovia 1884', source_status: 'Domeniu public' } },
  'kab-sy-sefer-yetzirah-gra-version': { summary: 'Recensiunea Gra (Vilna Gaon) a textului Sefer Yețirah.', author: 'Vilna Gaon (Gra)', meta: '6 capitole · 62 mișnaiot', ed: { source: 'Sefaria — ebraică, ediția Varșovia 1884', source_status: 'Domeniu public' } },
  'kab-sy-hagra-on-sefer-yetzirah-gra-version': { summary: 'Comentariul cabalistic al Vilna Gaon (HaGra) la Sefer Yețirah (versiunea Gra).', author: 'Vilna Gaon (HaGra)', ed: { source: 'Sefaria — ebraică, ediția Varșovia 1884', source_status: 'Domeniu public' } },
  'kab-sy-ramban-on-sefer-yetzirah': { summary: 'Comentariul cabalistic al lui Ramban la Sefer Yețirah.', ed: { source: 'Sefaria — ebraică, ediția Varșovia 1884', source_status: 'Domeniu public' } },
  'kab-sy-rasag-on-sefer-yetzirah': { summary: 'Comentariul lui Saadia Gaon la Sefer Yețirah.', ed: { source: 'Sefaria — ebraică, ediția Varșovia 1884', source_status: 'Domeniu public' } },
  'kab-sy-sefer-yetzirah': { author: 'atribuit tradițional lui Avraham Avinu', ed: { source: 'Sefaria — Community Translation', source_status: 'CC0' } },
  'kab-sy-sefer-yetzirah-kalisch-1877': { summary: 'Traducere alternativă, mai veche, a lui Sefer Yețirah, semnată Isidor Kalisch (1877).', author: 'atribuit tradițional lui Avraham Avinu; traducere Isidor Kalisch, 1877', meta: '14 mișnaiot', ed: { source: 'Isidor Kalisch, New York, 1877', source_status: 'Domeniu public' } },
  'kab-derech-etz-chayim-(ramchal)': { summary: 'Derech Etz Chayim („Calea Pomului Vieții”) a lui Ramchal, introducere sistematică în Kabbala lurianică.', meta: '78 paragrafe', ed: { source: 'Sefaria — Community Translation', source_status: 'Domeniu public / CC0' } },
  'kab-asarah-perakim-leramchal': { summary: 'Rezumat al lui Etz Chaim (Arizal) în zece capitole.', meta: '10 capitole · 75 paragrafe', ed: { source: 'Sefaria — Community Translation (cap. 1, 2, 6, 8–10); Jean-Claude Sudre, Torat Emet (cap. 3–5, 7)', source_status: 'CC0 / domeniu public' } },
  'kab-gan-naul-(abulafia)': { summary: 'Gan Naul („Grădina Încuiată”), tratat de Kabbala extatică al lui Avraham Abulafia, comentariu la Sefer Yețirah.', meta: '171 secțiuni', ed: { source: 'Sefaria — Gan Naul (Abulafia)', source_status: 'Domeniu public' } },
  'kab-sefer-habahir': { summary: 'Sefer HaBahir, unul dintre cele mai vechi texte cabalistice cunoscute.', author: 'atribuit lui R. Nehunia ben HaKana (tradițional)', meta: '200 paragrafe', ed: { source: 'Sefaria — ediția Torat Emet', source_status: 'Domeniu public' } },
  'kab-maamar-zohar-harakia': { summary: 'Ma\'amar Zohar HaRakia apără autenticitatea Zoharului față de obiecții legate de citate biblice și contradicții aparente cu Talmudul.', author: 'Avraham Azulai (atribuit), sec. XVII', meta: '5 fragmente' },
  'kab-heikhalot-rabbati': { ed: { source: 'Sefaria — Morton Smith / Gershom Scholem / Don Karr; Community Translation; ebraică Wertheimer', source_status: 'Community Translation: CC0' } },
  'kab-beur-eser-sefirot': { summary: 'Un tratat scurt, în formă de întrebare-răspuns, despre existența unui Stăpânitor al lumii, Ein-Sof, și de ce emanația se manifestă prin exact zece Sefirot.', author: 'autor incert (atribuit lui Cordovero sau cercului cabalistic timpuriu)', meta: '12 capitole · 30 paragrafe', ed: { source: 'Sefaria — Community Translation', source_status: 'Domeniu public / CC0' } },
  'kab-zo-zohar': { author: 'corpus zoharic', ed: { source: 'Sefaria — Zohar, text aramaic clasic (paginare Vilna; Mantua 1558 / Vilna), nu comentariul Sulam', source_status: 'Domeniu public' } },
  'kab-zo-idra-zuta': { author: 'corpus zoharic', ed: { source: 'Sefaria — Zohar, text aramaic clasic', source_status: 'Domeniu public' } },
  'kab-zo-idra-raba': { author: 'corpus zoharic', ed: { source: 'Sefaria — Zohar, text aramaic clasic', source_status: 'Domeniu public' } },
  'kab-zo-sifra-ditzniuta': { author: 'corpus zoharic', ed: { source: 'Sefaria — Zohar, text aramaic clasic', source_status: 'Domeniu public' } }
};
let nk = 0;
for (const it of kab.items) {
  const c = K[it.slug]; if (!c) continue;
  if (c.summary !== undefined) it.summary = c.summary;
  if (c.author !== undefined) it.author = c.author;
  if (c.meta !== undefined) it.meta = c.meta;
  if (c.ed) it.edition = c.ed; else delete it.edition;
  nk++;
}
// Mișna: ediția în panoul „i”
for (const it of mi.items) if (it.slug && it.available && it.lazySrc) { it.edition = { source: 'Sefaria — Mishnah, ediția Romm, Vilna 1913', source_status: 'Domeniu public' }; }
// note editoriale de proces din text
const T = {
  'kab-zo-zohar-chadash': [['[Lipsește începutul subiectului — în sursă.] ', '[Începutul lipsește.] '], ['[lipsă în sursă]', '[lipsă]'], [' [unitatea e lungă/fuzionează în Sefaria până la capătul nodului]', ''], ['[Notă de ediție în sursă: tikkunim pe col. 25b–26; unele cărți pun aici un pasaj potrivit mai sus, nu din subiect.]', '[Tikkunim pe col. 25b–26.]']],
  'kab-zo-beur-hagra-on-sifra-detzniuta': [['[același text ca §18 în sursa Sefaria/Wikisource — duplicat în ediție, nu s-a inventat altceva]', '[același text ca §18]']],
  'kab-sy-rasag-on-sefer-yetzirah': [[' [Restul comentariului 5:2 este tăiat în extrasul Sefaria.]', ' […]'], ['[lipsă în Warsaw 1884 pe Sefaria: he=[ ], next=null după 5:2]', '[lipsă]']],
  'kab-heikhalot-rabbati': [['[lipsă restul secțiunii 38:5 în extrasul Sefaria folosit aici; ebraica Wertheimer se întrerupe după «אומרים לו עכשיו מה תקנה יש לנו אומר להם».]', '[restul secțiunii lipsește]']]
};
let nt = 0;
for (const it of kab.items) { const rs = T[it.slug]; if (!rs) continue; for (const c of it.chapters) for (const v of c.verses) for (const [a, b] of rs) if (v.t.includes(a)) { v.t = v.t.split(a).join(b); nt++; } }
save(S.h, S.s, S.e, lib);
console.log('Kabbala girate:', nk, '| note din text curățate:', nt);
