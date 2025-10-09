const axios = require("axios");

const Prefixes = ["ai", "anjara", "ae"];
const RP = "Ajoute des Emojis et répond à la question";

const fonts = {
  a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
  j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
  s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
  A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
  J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
  S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
};

function applyFont(text) {
  return text.split('').map(char => fonts[char] || char).join('');
}

module.exports = {
  config: {
    name: "ai",
    aliases: ["ae"],
    version: "2.3",
    author: "Octavio",
    countDown: 2,
    role: 0,
    shortDescription: "🤖 AI + images multiples",
    longDescription: "Pose une question à l’IA et reçois du texte stylisé et toutes les images en direct.",
    category: "ai",
    guide: "{pn} <question>"
  },

  onStart: async function ({ message, args, event, api }) {
    const input = args.join(" ").trim().toLowerCase();

    // Réponse par défaut si seulement "ai"
    if (input === "" || input === "ai") {
      return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🤖 SALUT HUMAIN ! 
┃ Je suis Kakashi Hatake, créé par Octavio 😎
┃ Vas-y, balance ta question 🤣
╰━━━━━━━━━━━━━━━━╯`);
    }

    // Réponse si "qui es-tu" ou variantes
    if (input.includes("qui es-tu")) {
      return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🤖 Je suis Kakashi Hatake, un bot créé par Octavio 🌑
┃ Je peux répondre à vos questions et générer des textes stylisés
╰━━━━━━━━━━━━━━━━╯`);
    }

    // Si autre question, passe à l’IA
    try {
      const url = `https://haji-mix-api.gleeze.com/api/groq?ask=${encodeURIComponent(input)}&model=llama-3.3-70b-versatile&uid=56666&RP=${encodeURIComponent(RP)}&stream=True`;
      const res = await axios.get(url, { timeout: 20000 });
      const raw = res.data?.answer || res.data?.result || res.data?.message || "🤖 Aucune réponse reçue.";
      const styled = applyFont(raw);
      return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ ${styled}
╰━━━━━━━━━━━━━━━━╯`);
    } catch (err) {
      console.error(err.message);
      return message.reply(applyFont("❌ Erreur de réponse IA."));
    }
  }
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
