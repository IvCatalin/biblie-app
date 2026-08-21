// =====================================================================
// Server minim Express — generează audio TTS (OpenAI) pentru aplicația
// Biblie. Cheia OPENAI_API_KEY NU ajunge niciodată în browser — rămâne
// doar aici, pe server, citită din variabilele de mediu.
// =====================================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error(
    "\n[EROARE] Lipsește OPENAI_API_KEY din variabilele de mediu.\n" +
    "Creează un fișier .env (copiază .env.example) și pune cheia ta acolo.\n"
  );
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// CORS permisiv — aplicația e locală, cu un singur utilizator (tu).
// Dacă găzduiești public mai târziu, restrânge origin la domeniul tău.
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Presetare de voce — un singur profil (masculin, Cedar). Clientul nu alege
// liber ID-ul vocii/modelul, doar declanșează generarea.
const VOICE_PRESETS = {
  male: { voice: "cedar" }
};

const MODEL = "gpt-4o-mini-tts";
// Instrucțiune combinată: structura Connoisseur (Ton/Ritm/Emoție/Rostire), dar
// adaptată complet pentru citit Scriptura — fără accent francez, fără aroganță,
// fără referiri la artă. Am păstrat ce era de fapt bun acolo: pauzele deliberate
// la momente-cheie și reverența calmă, informată.
const NARRATOR_INSTRUCTIONS =
  "Accent/Rostire: română clară și naturală, fără accent străin, pronunție corectă a numelor biblice.\n" +
  "Ton: cald și reverent — solemn, dar niciodată arogant sau distant, ca un narator care cunoaște și iubește profund textul.\n" +
  "Ritm: moderat, cu pauze deliberate la momentele importante ale versetului, ca ascultătorul să aibă timp să înțeleagă și să simtă greutatea cuvintelor.\n" +
  "Emoție: calmă, cu o reverență și o admirație autentică față de text — fără dramatizare excesivă, fără teatralitate.\n" +
  "Nu adăuga, elimina sau parafraza cuvinte din text. Respectă punctuația pentru intonație.";

const MAX_TEXT_LENGTH = 2000; // un verset/pasaj rezonabil; blochează abuz accidental

app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceProfile } = req.body || {};

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Lipsește textul de citit." });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ error: "Textul e prea lung pentru o singură cerere TTS." });
    }

    const preset = VOICE_PRESETS[voiceProfile] || VOICE_PRESETS.male;

    const response = await openai.audio.speech.create({
      model: MODEL,
      voice: preset.voice,
      input: text,
      instructions: NARRATOR_INSTRUCTIONS,
      response_format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length,
      "Cache-Control": "no-store"
    });
    res.send(buffer);
  } catch (err) {
    console.error("Eroare TTS:", err);
    const status = err && err.status ? err.status : 500;
    res.status(status).json({
      error: "Generarea audio a eșuat.",
      details: process.env.NODE_ENV === "development" ? String(err.message || err) : undefined
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, hasKey: !!process.env.OPENAI_API_KEY });
});

app.listen(PORT, () => {
  console.log(`\nServer TTS pornit pe http://localhost:${PORT}`);
  console.log(`Verifică rapid: http://localhost:${PORT}/api/health\n`);
});
