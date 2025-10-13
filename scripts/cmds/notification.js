module.exports = {
  config: {
    name: "notification",
    aliases: ["noti"],
    version: "2.4",
    author: "messie osango",
    role: 2,
    shortDescription: "Notification globale",
    longDescription: "Envoie un message à tous les groupes où le bot est présent",
    category: "system",
    guide: {
      fr: "{pn} [message]",
      en: "{pn} [message]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const botAdmins = global.GoatBot.config.adminBot || [];

    if (!botAdmins.includes(event.senderID)) {
      return api.sendMessage(
        `╔════════════════════╗
║ 🚫 ACCÈS REFUSÉ ! ║
╚════════════════════╝`,
        event.threadID
      );
    }

    if (!args.length) {
      return message.reply(
        `╔════════════════════╗
║ 📖 GUIDE D'UTILISATION ║
╠────────────────────╣
║ • notification [message] ║
║ • noti [message]         ║
╚════════════════════╝`
      );
    }

    const userMessage = args.join(" ");

    try {
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = threadList.filter(thread => thread.isGroup);

      if (!groupThreads.length) {
        return api.sendMessage(
          `╔════════════════════╗
║ ⚠ AUCUN GROUPE TROUVÉ ║
╚════════════════════╝`,
          event.threadID
        );
      }

      let successCount = 0;
      let failCount = 0;

      for (const group of groupThreads) {
        try {
          await api.sendMessage(
            `╔════════════════════╗
║ 📣 NOTIFICATION ║
╠────────────────────╣
║ ${userMessage}
╚════════════════════╝`,
            group.threadID
          );
          successCount++;
          await new Promise(res => setTimeout(res, 300));
        } catch {
          failCount++;
        }
      }

      await api.sendMessage(
        `╔════════════════════╗
║ 📊 RAPPORT D'ENVOI ║
╠────────────────────╣
║ ✅ Groupes atteints: ${successCount}
║ ❌ Échecs: ${failCount}
╠────────────────────╣
║ Message diffusé:
║ "${userMessage}"
╚════════════════════╝`,
        event.threadID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage(
        `╔════════════════════╗
║ ❌ ERREUR DU SYSTÈME ║
╚════════════════════╝`,
        event.threadID
      );
    }
  }
};
     
