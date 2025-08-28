const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    alias: ["🌚"],
    version: "1.3",
    author: "messie osango",
    countDown: 5,
    role: 0,
    shortDescription: "Changer le préfixe du bot",
    longDescription: "Change le symbole de commande du bot dans votre boîte de discussion ou dans tout le système du bot (admin uniquement)",
    category: "box chat",
    guide: {
      fr: "   {pn} <nouveau préfixe>: changer le préfixe dans votre boîte de discussion"
        + "\n   Exemple:"
        + "\n    {pn} #"
        + "\n\n   {pn} <nouveau préfixe> -g: changer le préfixe dans le système du bot (admin bot uniquement)"
        + "\n   Exemple:"
        + "\n    {pn} # -g"
        + "\n\n   {pn} reset: réinitialiser le préfixe dans votre boîte de discussion"
    }
  },

  langs: {
    fr: {
      reset: "✨ Votre préfixe a été réinitialisé par défaut: %1",
      onlyAdmin: "⚠️ Seuls les administrateurs peuvent changer le préfixe du système",
      confirmGlobal: "🔔 Veuillez réagir à ce message pour confirmer le changement de préfixe du système",
      confirmThisThread: "💬 Veuillez réagir à ce message pour confirmer le changement de préfixe dans votre discussion",
      successGlobal: "✅ Préfixe du système changé avec succès: %1",
      successThisThread: "✅ Préfixe changé avec succès dans votre discussion: %1",
      myPrefix: `
╭━[GOATBOT PUBLIC]━━╮
┃   Préfixe du bot :
┃  「 %2 」
┃   Utilisez %2help pour
┃   voir toutes les commandes
┃
╰━━━━━━━━━━━━━━━━╯
      `
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g")
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    else
      formSet.setGlobal = false;

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }
    else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body && (event.body.toLowerCase() === "prefix" || event.body.toLowerCase() === "🧋"))
      return () => {
        return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
      };
  }
};
