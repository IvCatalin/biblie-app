// Septuaginta (Rahlfs 1935, Isaia) — Isaia 54:1-10: traduceri și note TM–LXX (factuale)
const t2 = require('./lxxtr-c02.js');
const pick = (t, ks) => { const o = {}; for (const k of ks) { if (!t[k]) throw new Error('lipsă ' + k); o[k] = t[k]; } return o; };
module.exports = Object.assign({}, pick(t2, ['54:3', '54:6', '54:10']), {
  '54:1': { tr: '„Veselește-te, stearpo, cea care nu naști; izbucnește și strigă, cea care n-ai durerile nașterii; căci mulți sunt copiii celei pustii, mai mulți decât ai celei ce are bărbat; căci a zis Domnul.”', note: 'Septuaginta redă „copiii celei locuite” prin „ai celei ce are bărbat” (τῆς ἐχούσης τὸν ἄνδρα) și adaugă la sfârșit „căci a zis Domnul” (εἶπεν γὰρ κύριος).' }
});
