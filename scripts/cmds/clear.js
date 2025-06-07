module.exports = {
  config: {
    name: "clear",
    version: "1.2",
    author: "messie osango",
    countDown: 5,
    role: 0,
    description: "Supprime tous les messages du bot de la dernière heure",
    category: "box chat",
    guide: "clear"
  },

  onStart: async function ({ api, event, message }) {
    try {
      const threadID = event.threadID;
      const botID = api.getCurrentUserID();
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      let deletedCount = 0;

      async function unsendBotMessages() {
        let beforeID = null;
        let hasMore = true;

        while (hasMore) {
          try {
            const history = await api.getThreadHistory(threadID, 50, beforeID);
            if (!history || history.length === 0) break;

            const botMessages = history.filter(
              msg => msg.senderID === botID && msg.timestamp >= oneHourAgo
            );

            for (const msg of botMessages) {
              try {
                await api.unsendMessage(msg.messageID);
                deletedCount++;
                await new Promise(resolve => setTimeout(resolve, 300)); // Pause pour éviter le flood
              } catch (e) {
                console.error("Erreur lors de la suppression:", e);
              }
            }

            beforeID = history[history.length - 1].messageID;
            hasMore = history.length === 50;
          } catch (err) {
            console.error("Erreur lors de la récupération de l'historique:", err);
            hasMore = false;
          }
        }
      }

      await message.send("⏳ Suppression des messages du bot dans la dernière heure...");
      await unsendBotMessages();
      await message.send(`✅ ${deletedCount} messages du bot ont été supprimés.`);
    } catch (error) {
      console.error(error);
      message.send("❌ Une erreur est survenue pendant la suppression des messages.");
    }
  }
};
