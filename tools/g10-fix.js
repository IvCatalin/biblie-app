// Geneza 10: forma greacă/ebraică a etichetelor = exact cea din verset (Rahlfs / Sefaria).
const NG = { greek: null, greek_def_ro: null };
const G = (greek, extra = {}) => ({ greek, greek_def_ro: null, ...extra });
const FIL = G('ἐν ταῖς φυλαῖς αὐτῶν'), TARI = G('ἐν ταῖς χώραις αὐτῶν');
module.exports = [
  [1, { w: 'născut' }, G('ἐγενήθησαν')],
  [4, { w: 'Kitim' }, G('Κίτιοι')],
  [5, { w: 'insulele' }, G('νῆσοι')],
  [5, { w: 'limba' }, G('κατὰ γλῶσσαν')],
  [5, { w: 'familiile' }, FIL],
  [9, { w: 'spune' }, G('ἐροῦσιν')],
  [13, { w: 'naftuhiții' }, { heb: 'נַפְתֻּחִים' }],
  [14, { w: 'patrusiții' }, { heb: 'פַתְרֻסִים' }],
  [14, { w: 'casluhiții' }, { heb: 'כַסְלֻחִים' }],
  [14, { w: 'caftoriții' }, { heb: 'כַפְתֹּרִים' }],
  [15, { w: 'întâiul' }, G('πρωτότοκον')],
  [19, { w: 'întins' }, G('ἐγένοντο')],
  [19, { w: 'Gaza' }, G('Γάζαν')],
  [19, { w: 'Sodoma' }, G('Σοδομων')],
  [20, { w: 'familiile' }, FIL], [20, { w: 'țările' }, TARI],
  [21, { w: 'dincolo' }, G('Εβερ')],
  [21, { w: 'mare' }, G('τοῦ μείζονος')],
  [23, { w: 'Uț' }, G('Ως')],
  [25, { w: 'născut' }, G('ἐγενήθησαν')],
  [25, { w: 'fratelui' }, G('τῷ ἀδελφῷ αὐτοῦ')],
  [28, { w: 'Oval' }, { ...NG, diff_ro: 'Septuaginta (Rahlfs) nu are numele Oval (Obal) în această listă: după Iectan urmează Avimael și Șeva.' }],
  [28, { w: 'Avimael' }, G('Αβιμεηλ')],
  [30, { w: 'răsărit' }, G('ἀνατολῶν')],
  [31, { w: 'familiile' }, FIL], [31, { w: 'țările' }, TARI],
  [31, { w: 'neamurile' }, G('ἐν τοῖς ἔθνεσιν αὐτῶν')],
  [32, { w: 'fiilor' }, G('υἱῶν')],
  [32, { w: 'neamurile' }, G('κατὰ τὰ ἔθνη αὐτῶν')],
];
