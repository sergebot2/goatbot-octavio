const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    alias: ["🧋"],
    version: "1.3",
    author: "messie osango",
    countDown: 5,
    role: 0,
    shortDescription: "Change bot prefix",
    longDescription: "Change the bot's command symbol in your chat box or the entire bot system (admin only)",
    category: "box chat",
    guide: {
      en: "   {pn} <new prefix>: change new prefix in your box chat"
        + "\n   Example:"
        + "\n    {pn} #"
        + "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
        + "\n   Example:"
        + "\n    {pn} # -g"
        + "\n\n   {pn} reset: change prefix in your box chat to default"
    }
  },

  langs: {
    en: {
      reset: "✨ Your prefix has been reset to default: %1",
      onlyAdmin: "⚠️ Only admin can change prefix of system bot",
      confirmGlobal: "🔔 Please react to this message to confirm change prefix of system bot",
      confirmThisThread: "💬 Please react to this message to confirm change prefix in your box chat",
      successGlobal: "✅ Successfully changed prefix of system bot to: %1",
      successThisThread: "✅ Successfully changed prefix in your box chat to: %1",
      myPrefix: `
╭─⌾⋅𝑆𝐴𝑇𝑂𝑅𝑈 𝐵𝑂𝑇⋅⌾──╮
│
│   𝑝𝑟𝑒𝑓𝑖𝑥 𝑑𝑢 𝑏𝑜𝑡 :
│
│   ✧ 「 %2 」
│
│   𝚄𝚝𝚒𝚕𝚒𝚜𝚎𝚣 %2help 𝚙𝚘𝚞𝚛
│   𝚟𝚘𝚒𝚛 𝚝𝚘𝚞𝚜 𝚕𝚎𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚎𝚜
│
│
╰──────⌾⋅ ⋅⌾──────╯
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
