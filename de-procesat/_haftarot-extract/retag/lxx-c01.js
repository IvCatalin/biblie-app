// Bereșit — Isaia 42:5-43:10 — cele 10 tag-uri rămase fără greacă
const N = { '42:5': 15, '42:8': 9, '42:13': 10, '42:19': 10, '42:21': 6, '42:23': 5, '42:25': 10, '43:9': 16, '43:10': 15 };
const S = {}; for (const [v, n] of Object.entries(N)) S[v] = Array(n).fill(null);
S['42:5'][9] = ['τὰ ἐν αὐτῇ', 'αὐτῇ', 'cele din ea, ceea ce se află pe ea'];
S['42:8'][8] = ['γλυπτός', 'γλυπτοῖς', 'cioplit; idol cioplit'];
S['42:13'][7] = ['βοάω', 'βοήσεται', 'a striga, a țipa', 'Ebraica are două verbe („Își înalță glasul, chiar strigă puternic”); Septuaginta le redă printr-un singur verb, βοήσεται.'];
S['42:19'][5] = 0; S['42:19'][7] = 0; S['42:21'][5] = 0; S['42:23'][3] = 0; S['42:25'][7] = 0; S['43:9'][13] = 0; S['43:10'][0] = 0;
module.exports = S;
