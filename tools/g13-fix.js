// Geneza 13: forma greacă/ebraică a etichetelor = exact cea din verset (Rahlfs / Sefaria).
const NG = { greek: null, greek_def_ro: null };
const G = (greek, extra = {}) => ({ greek, greek_def_ro: null, ...extra });
const NOT = 'dezeticheteaza';
module.exports = [
  [3, { w: 'miazăzi' }, { heb: 'מִנֶּגֶב', ...G('τὴν ἔρημον') }],
  [3, { w: 'locul' }, G('τοῦ τόπου')],
  [4, { w: 'început' }, G('τὴν ἀρχήν')],
  [4, { w: 'DOMNUL' }, G('Κυρίου')],
  [5, { w: 'Lot' }, { heb: 'לְלוֹט', ...G('Λωτ') }],
  [7, { w: 'canaanitul' }, G('Χαναναῖοι')],
  [7, { w: 'țară' }, G('τὴν γῆν')],
  [8, { w: 'Lot' }, { heb: 'לוֹט' }],
  [8, { w: 'rogu-te' }, { ...NG, diff_ro: 'Septuaginta nu are un cuvânt pentru particula na (נָא), „rogu-te”, care îmblânzește porunca; textul grecesc rămâne o poruncă simplă: „Să nu fie ceartă”.' }],
  [8, { w: 'ceartă', heb: 'מְרִיבָה' }, G('μάχη')],
  [9, { w: 'rogu-te' }, { ...NG, diff_ro: 'Septuaginta nu are cuvânt pentru particula na (נָא), „rogu-te”: „Desparte-te de mine” (διαχωρίσθητι ἀπ᾿ ἐμοῦ) rămâne o cerere fără rugăminte.' }],
  [10, { w: 'DOMNUL' }, G('Θεὸν')],
  [12, { w: 'țara' }, G('γῇ')],
  [12, { w: 'orașele' }, G('πόλει')],
  [12, { w: 'întins' }, G('ἐσκήνωσεν')],
  [12, { w: 'cortul' }, NOT],
  [12, { w: 'Sodoma' }, G('Σοδόμοις')],
  [13, { w: 'DOMNUL' }, G('Θεοῦ')],
  [14, { w: 'DOMNUL' }, G('Θεὸς')],
  [17, { w: 'da' }, G('δώσω')],
  [18, { w: 'cortul' }, NOT],
  [18, { w: 'venit' }, G('ἐλθὼν')],
  [18, { w: 'câmpiile' }, G('παρὰ τὴν δρῦν')],
  [18, { w: 'Mamre' }, G('Μαμβρη')],
];
