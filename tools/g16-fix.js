// Geneza 16: forma greacă/ebraică a etichetelor = exact cea din verset (Rahlfs / Sefaria).
const L = require('./fixlib.js')(16);
module.exports = [
  [1, { w: 'nume' }, L(1, 'ονομα')],
  [2, { w: 'nasc' }, L(2, 'τικτειν')],
  [2, { w: 'zidită' }, L(2, 'τεκνοποιησης')],
  [2, { w: 'ascultat' }, L(2, 'υπηκουσεν')],
  [4, { w: 'văzut' }, L(4, 'ειδεν')],
  [4, { w: 'stăpâna' }, L(4, 'κυρια')],
  [5, { w: 'zămislit' }, L(5, 'εν γαστρι εχει')],
  [7, { w: 'găsit-o' }, L(7, 'ευρεν')],
  [8, { w: 'îndrepți' }, { heb: 'תֵלֵכִי', ...L(8, 'πορευη') }],
  [11, { w: 'durerea' }, L(11, 'ταπεινωσει σου')],
  [13, { w: 'văzut', heb: 'רָאִיתִי' }, L(13, 'ειδον')],
  [13, { w: 'văzut', heb: 'רָאָה' }, { heb: 'רֹאִי', ...L(13, 'οφθεντα') }],
  [14, { w: 'fântâna' }, { heb: 'לַבְּאֵר', ...L(14, 'φρεαρ') }],
  [16, { w: 'optzeci și șase de ani' }, { heb: 'שְׁמֹנִים', ...L(16, 'ογδοηκοντα εξ ετων') }],
];
