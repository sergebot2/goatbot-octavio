const axios = require("axios");

const CREATOR_ID = "61579262818537";

module.exports = {
  config: {
    name: "ai",
    version: "3.2",
    author: "messie osango",
    countDown: 2,
    role: 0,
    shortDescription: "🤖 Intelligence Artificielle",
    longDescription: "IA réactive sans préfixe, reconnaît Octavio comme créateur.",
    category: "ai",
    guide: "ai <question>"
  },

  onStart: async function ({ message, event }) {
    const body = event.body.trim();
    if (!body.toLowerCase().startsWith("ai")) return;

    const senderID = event.senderID;
    const isCreator = senderID === CREATOR_ID;
    const question = body.slice(2).trim();

    if (question === "") {
      return message.reply(isCreator ?
`╭━━━━━━━━━━━━━━━━╮
┃ 👑 Salut Maître Octavio !
┃ Heureux de te revoir 😎
┃ Que veux-tu que je fasse ?
╰━━━━━━━━━━━━━━━━╯` :
`╭━━━━━━━━━━━━━━━━╮
┃ 🤖 SALUT HUMAIN !
┃ Je suis Kakashi Hatake, créé par Octavio 😎
┃ Pose ta question après "ai"
╰━━━━━━━━━━━━━━━━╯`);
    }

    if (question.includes("qui es-tu") || question.includes("créateur")) {
      return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 🤖 Je suis Kakashi Hatake, un bot IA 🌑
┃ Mon créateur est Octavio 👑
┃ Je réponds à toutes tes questions !
╰━━━━━━━━━━━━━━━━╯`);
    }

    try {
      const RP = isCreator
        ? "Réponds avec respect et admiration à ton créateur Octavio 👑"
        : "Réponds naturellement avec des emojis adaptés";
      const url = `https://haji-mix-api.gleeze.com/api/groq?ask=${encodeURIComponent(question)}&model=llama-3.3-70b-versatile&uid=56666&RP=${encodeURIComponent(RP)}&stream=True`;
      const res = await axios.get(url, { timeout: 20000 });
      const answer = res.data?.answer || res.data?.result || res.data?.message || "🤖 Aucune réponse reçue.";

      return message.reply(isCreator ?
`╭━━━━━━━━━━━━━━━━╮
┃ 🧠 Réponse pour toi, Maître Octavio :
┃ ${answer}
╰━━━━━━━━━━━━━━━━╯` :
`╭━━━━━━━━━━━━━━━━╮
┃ ${answer}
╰━━━━━━━━━━━━━━━━╯`);
    } catch {
      return message.reply("❌ Erreur IA, réessaie plus tard !");
    }
  }
};
