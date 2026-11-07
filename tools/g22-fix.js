// Geneza 22: forma greacă/ebraică a etichetelor = exact cea din verset (Rahlfs / Sefaria).
const L = require('./fixlib.js')(22);
module.exports = [
  [3, { w: 'trezit' }, L(3, 'αναστας')],
  [3, { w: 'tineri' }, L(3, 'παιδας')],
  [3, { w: 'despicat' }, L(3, 'σχισας')],
  [7, { w: 'Iată-mă' }, { greek: null, greek_def_ro: null, diff_ro: 'Septuaginta nu are „Iată-mă” (הִנֵּנִי); Avraam răspunde simplu „Ce este, fiule?” (Τί ἐστιν, τέκνον;), fără cuvântul de disponibilitate.' }],
  [8, { w: 'mers' }, L(8, 'πορευθεντες')],
  [8, { w: 'împreună' }, L(8, 'αμφοτεροι αμα')],
  [14, { w: 'loc' }, L(14, 'τοπου')],
  [14, { w: 'spune' }, L(14, 'ειπωσιν')],
  [17, { w: 'stelele' }, L(17, 'αστερας')],
  [17, { w: 'nisipul' }, { heb: 'וְכַחוֹל' }],
  [20, { w: 'născut' }, L(20, 'τετοκεν')],
  [21, { w: 'fratele' }, L(21, 'αδελφον αυτου')],
  [24, { w: 'nume' }, L(24, 'ονομα')],
  [24, { w: 'Gaham' }, L(24, 'γααμ')],
  [24, { w: 'Tahaș' }, L(24, 'τοχος')],
  [24, { w: 'Maaha' }, L(24, 'μωχα')],
];
