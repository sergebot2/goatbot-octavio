module.exports = {
  config: {
    name: "adminkick",
    version: "3.5",
    author: "Octavio Wina",
    role: 2,
    shortDescription: {
      fr: "Retire les droits admin d’un membre"
    },
    longDescription: {
      fr: "Commande immersive pour retirer le statut d’administrateur d’un membre dans le groupe."
    },
    category: "admin",
    guide: {
      fr: "{prefix}adminkick [@mention | uid | réponse]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      // 🔒 Vérifie si c’est bien un groupe
      if (!event.isGroup) {
        return message.reply(
          `╭━━━━━━━[ ⚠️ 𝑬𝒓𝒓𝒆𝒖𝒓 ]━━━━━━━╮
❌ | Cette commande est réservée aux groupes.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      const threadInfo = await api.getThreadInfo(event.threadID);
      const botID = api.getCurrentUserID();

      // 🧠 Vérifie si le bot est admin
      const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
      if (!isBotAdmin) {
        return message.reply(
          `╭━━━━━━━[ 🔒 𝑨𝒄𝒄𝒆̀𝒔 𝒓𝒆𝒇𝒖𝒔𝒆́ ]━━━━━━━╮
🕶️ | Je dois être administrateur pour retirer un autre admin.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      // 🔹 Vérifie si l’utilisateur est admin du bot
      const botAdmins = global.GoatBot.config.adminBot;
      if (!botAdmins.includes(event.senderID)) {
        return message.reply(
          `╭━━━━━━━[ 🚫 𝑨𝒄𝒄𝒆̀𝒔 𝒓𝒆́𝒔𝒆𝒓𝒗𝒆́ ]━━━━━━━╮
❌ | Seuls les administrateurs du système peuvent exécuter cette commande.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      // 🎯 Détermine la cible
      let targetID;
      if (event.messageReply) targetID = event.messageReply.senderID;
      else if (Object.keys(event.mentions).length > 0) targetID = Object.keys(event.mentions)[0];
      else if (args[0] && args[0].match(/^\d+$/)) targetID = args[0];
      else {
        return message.reply(
          `╭━━━━━━━[ ℹ️ 𝑰𝒏𝒇𝒐 ]━━━━━━━╮
💬 | Réponds à un message, mentionne une personne ou entre un ID pour la retirer des admins.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      // ⚙️ Vérifications de la cible
      const isTargetAdmin = threadInfo.adminIDs.some(admin => admin.id === targetID);
      if (!isTargetAdmin) {
        return message.reply(
          `╭━━━━━━━[ ⚠️ 𝑬𝒓𝒓𝒆𝒖𝒓 ]━━━━━━━╮
🧩 | La personne ciblée n’est pas administrateur du groupe.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      if (targetID === botID) {
        return message.reply(
          `╭━━━━━━━[ 🚫 𝑨𝒄𝒄𝒊𝒐𝒏 𝒊𝒎𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆 ]━━━━━━━╮
🤖 | Je ne peux pas retirer mes propres privilèges d’administrateur.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      // 💀 Suppression du rôle admin
      await api.changeAdminStatus(event.threadID, targetID, false);
      return message.reply(
        `╭━━━━━━━[ ✅ 𝑺𝒖𝒄𝒄𝒆̀𝒔 ]━━━━━━━╮
⚡ | L’utilisateur ${targetID} a été retiré des administrateurs.
🌑 | Octavio Bot a exécuté la purge avec précision.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
      );

    } catch (error) {
      console.error(error);
      return message.reply(
        `╭━━━━━━━[ ⚠️ 𝑬𝒓𝒓𝒆𝒖𝒓 𝑺𝒊𝒔𝒕𝒆̀𝒎𝒆 ]━━━━━━━╮
💀 | Une erreur interne s’est produite.
🧩 | Détails : ${error.message || "inconnus"}.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }
  }
};.
