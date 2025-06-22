module.exports = {
  config: {
    name: "respect",
    version: "2.0",
    author: "Messie Osango",
    role: 0,
    shortDescription: {
      fr: "Gestion avancée des administrateurs"
    },
    longDescription: {
      fr: "Ajoute l'utilisateur comme admin dans un groupe spécifié ou retire tous les admins du groupe actuel"
    },
    category: "admin",
    guide: {
      fr: "{prefix}respect [groupID]"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    try {
      if (event.senderID !== "61564382117276") {
        return message.reply("❌ Accès réservé au propriétaire");
      }

      if (args[0] && args[0].match(/^\d+$/)) {
        const targetGroupID = args[0];
        
        try {
          const threadInfo = await api.getThreadInfo(targetGroupID);
          const botID = api.getCurrentUserID();
          const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
          
          if (!isBotAdmin) {
            return message.reply(`🔒 Je dois être admin dans le groupe ${targetGroupID} pour pouvoir vous y ajouter`);
          }

          await api.changeAdminStatus(targetGroupID, event.senderID, true);
          return message.reply(`✅ Vous avez été ajouté comme administrateur dans le groupe ${targetGroupID}`);
          
        } catch (error) {
          console.error(error);
          return message.reply(`⚠ Impossible d'accéder au groupe ${targetGroupID} ou erreur lors de l'ajout`);
        }
      } else {
        if (!event.isGroup) {
          return message.reply("ℹ Veuillez spécifier un ID de groupe ou utiliser cette commande dans un groupe");
        }

        const threadInfo = await api.getThreadInfo(event.threadID);
        const botID = api.getCurrentUserID();
        const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
        
        if (!isBotAdmin) {
          return message.reply("🔒 Je dois être admin dans ce groupe pour effectuer cette action");
        }

        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const otherAdmins = adminIDs.filter(id => id !== botID);

        if (otherAdmins.length === 0) {
          return message.reply("ℹ Il n'y a pas d'autres administrateurs à retirer dans ce groupe");
        }

        let successCount = 0;
        let failCount = 0;

        for (const adminID of otherAdmins) {
          try {
            await api.changeAdminStatus(event.threadID, adminID, false);
            successCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Failed to remove admin ${adminID}:`, error);
            failCount++;
          }
        }

        let replyMessage = `✅ ${successCount} administrateur(s) retiré(s) avec succès`;
        if (failCount > 0) {
          replyMessage += `\n⚠ Échec pour ${failCount} administrateur(s)`;
        }

        return message.reply(replyMessage);
      }
    } catch (error) {
      console.error(error);
      return message.reply("⚠ Erreur système");
    }
  }
};
