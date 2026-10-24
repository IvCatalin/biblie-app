// Haftarat Reeh — Isaia 54:11-55:5 (+ 1 Samuel 20:18, 42; Isaia 66:1, 23) — aceleași cuvinte ebraice ca Noah (c02) și Masei (c47): retagarea se reia din c02.js / c47.js, cu fragmentele adaptate la formularea Rosen din acest cap.
const b2 = require('./c02.js'), b47 = require('./c47.js');
const v = {};
for (const k of ['54:11', '54:12', '54:13', '54:14', '54:15', '54:16', '54:17', '55:1', '55:2', '55:3', '55:4', '55:5']) v[k] = JSON.parse(JSON.stringify(b2.v[k]));
for (const k of ['66:1', '66:23']) v[k] = JSON.parse(JSON.stringify(b47.v[k]));
const swap = (verse, from, to) => { const a = v[verse]; const i = a.findIndex(x => x[0] === from); if (i < 0) throw new Error('lipsă ' + verse + ' ' + from); a[i] = to; };
swap('54:11', 'Sărmană', ['Obidită', 0, 'săraca']);
swap('54:11', 'îți voi face temeliile', ['îți voi face fundațiile', 9, 'te voi întemeia']);
swap('54:15', 'îți va cădea înainte', ['va cădea înaintea ta', 9, 'va cădea']);
swap('54:16', 'făurarul', ['meșterul', 3, 'fierarul']);
swap('54:16', 'flăcării', ['focul', 5, 'în foc']);
{ const a = v['54:16']; const i = a.findIndex(x => x[1] === 10); a[i] = ['Eu', 10, 'eu', { fn: 1, at: 'și Eu' }]; }
swap('54:17', 'o voi condamna', ['o vei condamna', 11, 'vei osândi']);
swap('55:1', 'Toți cei însetați', ['toți cei însetați', [1, 2], 'toți cei însetați']);
swap('55:1', '', ['mergeți', 12, 'mergeți', { at: 'și mâncați, mergeți' }]);
swap('55:1', 'să cumpărați', ['să cumpărați', 10, 'cumpărați']);
{
  const a = v['55:1']; const i = a.findIndex(x => x[1] === 13);
  a[i] = ['să cumpărați', 13, 'cumpărați', { at: 'mergeți să cumpărați fără' }];
}
swap('55:2', 'argintii', ['arginții', 2, 'argint']);
swap('55:2', 'trudei voastre', ['truda voastră', 5, 'ostenelii voastre']);
swap('55:3', 'legământ veșnic', ['legământ etern', [9, 10], 'legământ veșnic']);
swap('55:3', 'cele adevărate', ['', 13]);
{
  const a = v['55:5'];
  const i0 = a.findIndex(x => x[1] === 1), i4 = a.findIndex(x => x[1] === 4);
  const it1 = ['națiune', 1, 'neam'], it4 = a[i4];
  a.splice(i0, 1); const j4 = a.findIndex(x => x[1] === 4); a.splice(j4 + 1, 0, it1);
  swap('55:5', 'cunoști', ['știi', 3, 'cunoști']);
  const k3 = a.findIndex(x => x[1] === 3), it3 = a.splice(k3, 1)[0]; const k1 = a.findIndex(x => x[1] === 1); a.splice(k1 + 1, 0, it3);
  swap('55:5', 'neam', ['națiune', 5, 'neam', { at: 'și o națiune care' }]);
  const kS = a.findIndex(x => x[0] === 'Sfântului');
  a.splice(kS, 2, ['Sfântul lui Israel', [13, 14], 'Sfântul lui Israel']);
}
v['1 Samuel 20:18'] = [['Ionatan', 2, 'Ionatan'], ['a spus', 0, 'a zis'], ['Mâine', 3, 'mâine'], ['Luna Nouă', 4, 'luna nouă'], ['vei lipsi', 5, 'vei fi căutat'], ['scaunul tău', 8, 'locul tău de ședere'], ['va fi neocupat', 7, 'va fi gol']];
v['1 Samuel 20:42'] = [['Ionatan', 1, 'Ionatan'], ['a spus', 0, 'a zis'], ['David', 2, 'lui David'], ['Mergi', 3, 'du-te'], ['pace', 4, 'în pace'], ['noi doi', [7, 8], 'noi doi'], ['am jurat', 6, 'am jurat'], ['numele', 9, 'numele'], ['DOMNULUI', 10, 'Domnului'], ['spunând', 11, 'zicând'], ['DOMNUL', 12, 'Domnul'], ['va fi', 13, 'va fi', { fn: 1 }], ['copiii mei', 17, 'sămânța mea'], ['copiii tăi', 19, 'sămânța ta'], ['în veci', 21, 'pe veci']];
module.exports = { bank: require('./bank-c51.js'), v };
