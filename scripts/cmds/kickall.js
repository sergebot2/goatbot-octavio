const activeKickalls = new Map();

module.exports = {
  config: {
    name: "kickall",
    version: "2.2",
    author: "Messie Osango",
    role: 1,
    shortDescription: "Supprime tous les membres d'un groupe",
    longDescription: "Retire tous les membres d'un groupe spécifié sauf l'admin du bot",
    category: "admin",
    guide: "{prefix}kickall [threadID]\n{prefix}kickall off [threadID]"
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!global.GoatBot.config.adminBot.includes(event.senderID)) return;

      const cmd = args[0];
      const targetThreadID = (cmd === "off" ? args[1] : args[0]) || event.threadID;

      if (!targetThreadID) return api.sendMessage("Veuillez spécifier l'ID du groupe.", event.threadID);

      if (cmd === "off") {
        if (activeKickalls.has(targetThreadID)) {
          activeKickalls.set(targetThreadID, false);
          return api.sendMessage(`Processus kickall arrêté dans le groupe ${targetThreadID}.`, event.threadID);
        } else {
          return api.sendMessage(`Aucun processus kickall en cours dans le groupe ${targetThreadID}.`, event.threadID);
        }
      }

      activeKickalls.set(targetThreadID, true);

      const botID = api.getCurrentUserID();
      const adminID = event.senderID;
      const threadInfo = await api.getThreadInfo(targetThreadID);
      const adminIDs = threadInfo.adminIDs.map(e => e.id);

      if (!adminIDs.includes(adminID)) {
        return api.sendMessage("Vous n'avez pas les permissions nécessaires dans ce groupe.", event.threadID);
      }

      const members = threadInfo.participantIDs.filter(id => id !== botID && id !== adminID);
      if (members.length === 0) {
        return api.sendMessage("Aucun membre à supprimer dans ce groupe.", event.threadID);
      }

      api.sendMessage(`Commence la suppression de ${members.length} membres dans le groupe ${targetThreadID}...`, event.threadID);

      let successCount = 0;
      let failCount = 0;

      for (const member of members) {
        if (activeKickalls.get(targetThreadID) === false) break;
        try {
          await api.removeUserFromGroup(member, targetThreadID);
          successCount++;
        } catch {
          failCount++;
        }
      }

      activeKickalls.delete(targetThreadID);

      api.sendMessage(`Opération terminée.\nMembres supprimés: ${successCount}\nÉchecs: ${failCount}`, event.threadID);
    } catch {
      api.sendMessage("Une erreur s'est produite lors de l'exécution de la commande.", event.threadID);
    }
  }
};
