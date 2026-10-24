// Ajutoare comune pentru lxx-c17*.js (Judecători 4:4–5:31, Rahlfs JudgB)
const D = {};
const I = (g, f, df) => { if (!D[g]) throw new Error('fără definiție: ' + g); return g + '¦' + f + '¦' + D[g] + (df ? '¦' + df : ''); };
const J = (g, f, def, df) => g + '¦' + f + '¦' + def + (df ? '¦' + df : '');
const Z = df => '0' + (df ? '¦' + df : '');
module.exports = { D, I, J, Z };
