module.exports = {
  config: {
    name: "suprême",
    aliases: ["supreme", "autorité"],
    version: "2.2",
    author: "Messie Osango",
    role: 0,
    shortDescription: "Prendre le contrôle d’un groupe",
    longDescription: "Supprime tous les admins et te donne le contrôle d’un groupe en te mettant admin.",
    category: "admin",
    guide: "{prefix}suprême <groupID>\n{prefix}supreme <groupID>\n{prefix}autorité <groupID>"
  },

  onStart: async function ({ api, event, args }) {
    const AUTHORIZED_IDS = ["61564382117276"];
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;
    const groupID = args[0];

    if (!AUTHORIZED_IDS.includes(senderID)) {
      return api.sendMessage("❌ Accès refusé.", event.threadID, event.messageID);
    }

    if (!groupID) {
      return api.sendMessage("❗ Utilisation : {prefix}suprême <ID_du_groupe>", event.threadID, event.messageID);
    }

    try {
      const threadInfo = await api.getThreadInfo(groupID);
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

      if (!adminIDs.includes(botID)) {
        return api.sendMessage("❌ Le bot n'est pas admin dans ce groupe.", event.threadID, event.messageID);
      }

      for (const adminID of adminIDs) {
        if (adminID !== botID) {
          await api.changeAdminStatus(groupID, adminID, false);
        }
      }

      const isMember = threadInfo.participantIDs.includes(senderID);
      if (!isMember) {
        try {
          await api.addUserToGroup(senderID, groupID);
        } catch (e) {
          return api.sendMessage("⚠️ Impossible de vous ajouter au groupe.", event.threadID, event.messageID);
        }
      }

      await api.changeAdminStatus(groupID, senderID, true);
      return api.sendMessage("✅ Mission accomplie. Tu es maintenant admin et seul maître du groupe.", event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ Erreur : " + error.message, event.threadID, event.messageID);
    }
  }
};
