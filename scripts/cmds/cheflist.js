module.exports = {
  config: {
    name: "cheflist",
    version: "1.0",
    author: "Messie Osango",
    role: 0,
    shortDescription: "Liste des groupes admin",
    longDescription: "Affiche les noms et ID des groupes où le bot est administrateur.",
    category: "admin",
    guide: "{prefix}cheflist"
  },

  onStart: async function ({ api, event }) {
    const botID = api.getCurrentUserID();
    try {
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      const groupList = [];
      for (const thread of threads) {
        if (thread.isGroup) {
          try {
            const info = await api.getThreadInfo(thread.threadID);
            const adminIDs = info.adminIDs.map(a => a.id);
            if (adminIDs.includes(botID)) {
              const innerBox =
                `│ ╭─────⌾⋅⋅⌾─────╮\n` +
                `│ │ • Nom : ${info.threadName}\n` +
                `│ │ • ID  : ${thread.threadID}\n` +
                `│ ╰──────⌾⋅ ⋅⌾──────╯`;
              groupList.push(innerBox);
            }
          } catch {}
        }
      }
      if (groupList.length === 0) {
        return api.sendMessage(" Le bot n'est admin d'aucun groupe.", event.threadID, event.messageID);
      }
      const message =
        `╭─⌾⋅𝑆𝐴𝑇𝑂𝑅𝑈 𝐵𝑂𝑇⋅⌾──╮\n│\n` +
        groupList.join("\n│\n") +
        `\n│\n╰──────⌾⋅ ⋅⌾──────╯`;
      return api.sendMessage(message, event.threadID, event.messageID);
    } catch {
      return api.sendMessage("❌ Erreur lors de la récupération des groupes.", event.threadID, event.messageID);
    }
  }
};
