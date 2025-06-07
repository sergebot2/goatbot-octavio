module.exports = {
  config: {
    name: "respect",
    version: "1.0",
    author: "messie osango",
    role: 0,
    shortDescription: "Ajoute l'utilisateur comme admin",
    longDescription: "Permet au bot d'ajouter l'utilisateur comme administrateur du groupe",
    category: "admin",
    guide: "{prefix}respect"
  },
  onStart: async function ({ api, event, args }) {
    try {
      if (event.isGroup) {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        
        if (adminIDs.includes(api.getCurrentUserID())) {
          await api.changeAdminStatus(event.threadID, event.senderID, true);
        } else {
          api.sendMessage("Je dois être administrateur du groupe pour pouvoir vous ajouter comme admin.", event.threadID, event.messageID);
        }
      } else {
        api.sendMessage("Cette commande ne peut être utilisée que dans un groupe.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("Une erreur s'est produite lors de l'exécution de la commande.", event.threadID, event.messageID);
    }
  }
};
