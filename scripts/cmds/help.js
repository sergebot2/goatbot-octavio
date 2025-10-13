const fs = require("fs-extra");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const doNotDelete = "╭━[ OCTAVIO BOT DARK ]━━╮\n╰━━━━━━━━━━━━━━━━╯";

function applyFont(text) {
  const fontMap = {
    'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵',
    'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻',
    'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁',
    'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇',
    'Y': '𝚈', 'Z': '𝚉',
    'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏',
    'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕',
    'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛',
    's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡',
    'y': '𝚢', 'z': '𝚣'
  };
  return text.split('').map(c => fontMap[c] || c).join('');
}

function roleTextToString(role) {
  switch (role) {
    case 0: return applyFont("All users");
    case 1: return applyFont("Group admins");
    case 2: return applyFont("Bot admins");
    default: return applyFont("Unknown");
  }
}

// Emojis pour catégories
const categoryEmojis = {
  info: "ℹ️",
  admin: "🛠️",
  fun: "🎮",
  nsfw: "🔥",
  reply: "💬"
};

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "messie osango",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View commands list & info" },
    longDescription: { en: "Displays all commands and detailed info per command" },
    category: "info",
    guide: { en: "{pn} [command_name]" },
    priority: 1
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = await getPrefix(threadID);

    // HELP SANS ARGUMENT → LISTE DES COMMANDES
    if (!args[0]) {
      const categories = {};
      let msg = `╭━[ ${applyFont("COMMAND LIST")} ]━━╮\n┃\n┃  ${applyFont("OCTAVIO BOT DARK")}\n┃\n╰━━━━━━━━━━━━━━━━╯\n`;

      for (const [name, cmd] of commands) {
        if (cmd.config.role > role) continue;
        const cat = cmd.config.category || "NO CATEGORY";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
      }

      Object.keys(categories).sort().forEach(cat => {
        const emoji = categoryEmojis[cat] || "📌";
        msg += `╭━[ ${emoji} ${applyFont(cat.toUpperCase())} ]━━╮\n┃\n`;
        categories[cat].sort().forEach(cmdName => {
          msg += `┃ ✦ ${applyFont(cmdName)}\n`;
        });
        msg += `┃\n╰━━━━━━━━━━━━━━━━╯\n`;
      });

      msg += `╭━[ ${applyFont("INFO")} ]━━╮\n┃\n`;
      msg += `┃ ${applyFont("TOTAL COMMANDS")}: ${commands.size}\n`;
      msg += `┃ ${applyFont("PREFIX")}: ${prefix}\n`;
      msg += `┃ ${applyFont("Type")} ${prefix}help cmd_name\n`;
      msg += `┃ ${applyFont("for detailed info")}\n┃\n╰━━━━━━━━━━━━━━━━╯\n`;
      msg += doNotDelete;

      return await message.reply({ body: msg });
    }

    // HELP AVEC ARGUMENT → INFO SUR UNE COMMANDE
    const input = args[0].toLowerCase();
    const cmd = commands.get(input) || commands.get(aliases.get(input));
    if (!cmd) {
      return await message.reply(`╭━[ ${applyFont("ERROR")} ]━━╮\n┃\n┃ ${applyFont("Command not found")} ❌\n┃\n╰━━━━━━━━━━━━━━━━╯`);
    }

    const c = cmd.config;
    const usage = (c.guide?.en || "No guide").replace(/{p}/g, prefix).replace(/{n}/g, c.name);

    const infoMsg = `╭━[ ${applyFont("COMMAND INFO")} ]━━╮
┃
┃ ${applyFont("NAME")}: ${applyFont(c.name)}
┃ ${applyFont("VERSION")}: ${c.version || "1.0"}
┃ ${applyFont("AUTHOR")}: ${applyFont(c.author || "Unknown")}
┃
┃ ${applyFont("DESCRIPTION")}:
┃ ${c.longDescription?.en || "No description"}
┃
┃ ${applyFont("USAGE")}:
┃ ${usage}
┃
┃ ${applyFont("ALIASES")}: ${c.aliases ? c.aliases.map(a => applyFont(a)).join(", ") : "None"}
┃ ${applyFont("ROLE")}: ${roleTextToString(c.role)}
┃ ${applyFont("COOLDOWN")}: ${c.countDown || 2}s
┃
╰━━━━━━━━━━━━━━━━╯`;

    return await message.reply(infoMsg);
  }
};
