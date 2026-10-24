// Haftarat Ki Tețe — Isaia 54:1-10 — aceleași cuvinte ebraice ca Noah (c02): retagarea se reia din c02.js, cu fragmentele adaptate la formularea Rosen din acest cap.
const b2 = require('./c02.js');
const v = {};
for (const k of ['54:1', '54:2', '54:3', '54:4', '54:5', '54:6', '54:7', '54:8', '54:9', '54:10']) v[k] = JSON.parse(JSON.stringify(b2.v[k]));
const swap = (verse, from, to) => { const a = v[verse]; const i = a.findIndex(x => x[0] === from); if (i < 0) throw new Error('lipsă ' + verse + ' ' + from); a[i] = to; };
v['54:6'] = [['soție', 1, 'femeie'], ['părăsită', 2, 'părăsită'], ['întristat', 3, 'mâhnită'], ['duh', 4, 'duh'], ['DOMNUL', 6, 'Domnul'], ['te va chema', 5, 'te-a chemat'], ['soția', 7, 'femeia', { at: 'ca pe soția tinereții' }], ['tinereții', 8, 'tinereții'], ['izgonită', 10, 'respinsă'], ['a spus', 11, 'a zis'], ['Dumnezeul tău', 12, 'Dumnezeul tău']];
swap('54:8', 'spune', ['a spus', 9, 'a zis']);
swap('54:2', 'Lungește-ți', ['lungește-ți', 8, 'lungește']);
module.exports = { bank: require('./bank-c53.js'), v };
