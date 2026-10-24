// Septuaginta (Rahlfs 1935, Isaia și 1 Samuel) — Isaia 54:11-55:5 (+ 1 Samuel 20:18, 42; Isaia 66:1, 23): traduceri și note TM–LXX (factuale)
const t2 = require('./lxxtr-c02.js'), t47 = require('./lxxtr-c47.js');
const pick = (t, ks) => { const o = {}; for (const k of ks) { if (!t[k]) throw new Error('lipsă ' + k); o[k] = t[k]; } return o; };
module.exports = Object.assign({},
  pick(t2, ['54:15', '54:16', '54:17', '55:1', '55:2', '55:4', '55:5']),
  pick(t47, ['66:1', '66:23']),
  {
    '55:3': { keepTr: 1, note: 'Septuaginta adaugă „și urmați căile Mele” (ἐπακολουθήσατε ταῖς ὁδοῖς μου), care nu apare în ebraică, și redă „îndurările” (hasdē) prin „cele sfinte” (τὰ ὅσια).' },
    '1 Samuel 20:18': { keepTr: 1, note: 'Corespondență strânsă cu Textul Masoretic.' },
    '1 Samuel 20:42': { tr: '„Și Ionatan a zis: Mergi în pace; și precum am jurat noi amândoi în numele Domnului, zicând: Domnul va fi martor între mine și tine și între sămânța mea și sămânța ta până în veac.”', note: 'Septuaginta nu are „lui David” (ledavid) și adaugă „martor” (μάρτυς): „Domnul va fi martor între mine și tine”.' }
  });
