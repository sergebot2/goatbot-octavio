const axios = require('axios');

module.exports = {
  config: {
    name: "prompt3",
    aliases: ['p'],
    version: "1.2",
    author: "Octavio Wina",
    countDown: 5,
    role: 0,
    shortDescription: "Génère un prompt IA",
    longDescription: "Crée un prompt Midjourney à partir d’un texte ou d’une image.",
    category: "𝗔𝗜",
    guide: {
      en: "{pn} <texte> : Génère un prompt à partir du texte.\n{pn} (réponse à une image) : Génère un prompt à partir de l'image."
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      let imageUrl;

      if (event.type === "message_reply" && event.messageReply.attachments[0]?.type === 'photo') {
        imageUrl = event.messageReply.attachments[0].url;
      } else {
        const promptText = args.join(" ");
        if (!promptText) {
          return message.reply(
            `╭━━━━━[ ⚠️ 𝑰𝒏𝒇𝒐 ]━━━━━╮
💬 | Fournis un texte ou réponds à une image pour générer un prompt.
╰━━━━━━━━━━━━━━━━╯`
          );
        }

        const response = await axios.get(`https://nova-apis.onrender.com/prompt?prompt=${encodeURIComponent(promptText)}`);
        if (response.status === 200) {
          return message.reply(
            `╭━━━━━[ 🤖 𝑷𝒓𝒐𝒎𝒑𝒕 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 ]━━━━━╮
🖤 | ${response.data.prompt}
╰━━━━━━━━━━━━━━━━╯`
          );
        }
      }

      if (imageUrl) {
        const response = await axios.get(`https://nova-apis.onrender.com/prompt?image=${encodeURIComponent(imageUrl)}`);
        if (response.status === 200) {
          return message.reply(
            `╭━━━━━[ 🤖 𝑷𝒓𝒐𝒎𝒑𝒕 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 ]━━━━━╮
🖤 | ${response.data.prompt}
╰━━━━━━━━━━━━━━━━╯`
          );
        }
      } else {
        return message.reply(
          `╭━━━━━[ ⚠️ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 ]━━━━━╮
💀 | Entrée invalide. Fournis un texte ou réponds à une image.
╰━━━━━━━━━━━━━━━━╯`
        );
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      message.reply(
        `╭━━━━━[ ⚠️ 𝑬𝒓𝒓𝒆𝒖𝒓 ]━━━━━╮
💀 | Une erreur est survenue. Réessaie plus tard.
╰━━━━━━━━━━━━━━━━╯`
      );
    }
  }
}; 
