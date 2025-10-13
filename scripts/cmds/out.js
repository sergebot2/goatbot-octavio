module.exports = {
  config: {
    name: "out",
    version: "1.4",
    author: "messie osango",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Kick bot from group by owner"
    },
    longDescription: {
      en: "Remove the bot from the group safely with an enriched dark-style warning"
    },
    category: "owner",
    guide: {
      en: "Just write: out"
    }
  },

  onStart: async function ({ api, args, event }) {
    try {
      const botID = api.getCurrentUserID();
      let threadTarget = event.threadID;

      if (args[0] && !isNaN(args[0])) threadTarget = args[0];

      // Message avant de quitter, enrichi
      await api.sendMessage(`╔══════════════════════════╗
║ ⚠️  ATTENTION ! PRÉCISION DARK
║──────────────────────────
║ 🔹 Je m'apprête à quitter ce groupe.
║ 🔹 Merci à tous pour vos échanges et votre présence.
║ 🔹 Rappelez-vous : la connaissance est la vraie puissance. ⚡
║ 🔹 Si vous avez aimé mon aide, gardez mon esprit dans vos conversations.
╚══════════════════════════╝`, threadTarget);

      // Pause pour assurer l’envoi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Quitter le groupe
      await api.removeUserFromGroup(botID, threadTarget);

    } catch (err) {
      console.error(err);
      await api.sendMessage(`╔══════════════════════════╗
║ ❌ ERREUR
║──────────────────────────
║ Impossible de quitter le groupe.
║ Vérifiez les permissions ou réessayez.
╚══════════════════════════╝`, event.threadID);
    }
  }
};.
