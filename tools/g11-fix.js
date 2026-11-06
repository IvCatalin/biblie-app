// Geneza 11: forma greacă/ebraică a etichetelor = exact cea din verset (Rahlfs / Sefaria).
const NG = { greek: null, greek_def_ro: null };
const G = (greek, extra = {}) => ({ greek, greek_def_ro: null, ...extra });
module.exports = [
  [2, { w: 'țara' }, G('γῇ')],
  [3, { w: 'piatră' }, G('λίθον')],
  [4, { w: 'vârful' }, G('ἡ κεφαλὴ')],
  [6, { w: 'zădărnicit' }, G('ἐκλείψει')],
  [7, { w: 'limba', heb: 'שְׂפָתָם' }, G('τὴν γλῶσσαν')],
  [10, { w: 'doi ani' }, G('δευτέρου ἔτους')],
  [12, { w: 'Șelah' }, { ...NG, diff_ro: 'Septuaginta nu are aici pe Șelah (Σαλα), ci pe Cainan (Καιναν), un nume care lipsește din textul ebraic și din cel samaritean: după ea, Arpacșad a născut mai întâi pe Cainan, iar Cainan pe Șelah (versetul 13).' }],
  [13, { w: 'patru sute trei ani' }, G('τετρακόσια τριάκοντα')],
  [17, { w: 'patru sute treizeci de ani' }, G('τριακόσια ἑβδομήκοντα')],
  [23, { w: 'două sute de ani' }, G('ἔτη διακόσια')],
  [24, { w: 'douăzeci și nouă de ani' }, G('ἔτη ἑβδομήκοντα ἐννέα')],
  [25, { w: 'o sută nouăsprezece ani' }, G('ἔτη ἑκατὸν εἴκοσι ἐννέα')],
  [29, { w: 'luat' }, { heb: 'וַיִּקַּח' }],
  [29, { w: 'soției' }, G('ὄνομα τῇ γυναικὶ')],
  [29, { w: 'Milcăi' }, G('Μελχα')],
  [29, { w: 'Iscăi' }, G('Ιεσχα')],
  [30, { w: 'copil' }, G('ἐτεκνοποίει')],
  [31, { w: 'fiul' }, G('υἱὸν αὐτοῦ')],
  [31, { w: 'ajuns' }, G('ἦλθεν')],
];
