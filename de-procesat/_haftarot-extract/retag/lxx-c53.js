// Ki Tețe — Isaia 54:1-10 (Rahlfs 1935) — LXX pentru FIECARE tag; aceleași cuvinte ca în Noah (c02)
const l2 = require('./lxx-c02.js');
const S = { __tot: true };
for (const k of ['54:1', '54:2', '54:3', '54:4', '54:5', '54:6', '54:7', '54:8', '54:9', '54:10']) S[k] = l2[k].slice();
module.exports = S;
