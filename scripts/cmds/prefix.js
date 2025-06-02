const styleMap = {
  'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍',
  'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓',
  'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙',
  'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟',
  'Y': '𝘠', 'Z': '𝘡',
  'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧',
  'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭',
  'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳',
  's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
  'y': '𝘺', 'z': '𝘻'
};

function applyStyle(text) {
  return text.split('').map(char => styleMap[char] || char).join('');
}

const { config } = global.GoatBot;
const path = require("path");
const fs = require("fs-extra");
const { utils } = global;
const axios = require("axios");

module.exports = {
  config: {
    name: "prefix",
    version: "1.4",
    author: "messie osango",
    countDown: 5,
    role: 0,
    shortDescription: "Gérer le préfixe du bot",
    longDescription: "Changer le préfixe des commandes dans votre chat ou pour tout le système",
    category: "config",
    guide: {
      fr: "   {pn} <nouveau préfixe>: changer le préfixe dans votre chat\n   Exemple:\n    {pn} #\n\n   {pn} <préfixe> -g: changer le préfixe global (admin seulement)\n   Exemple:\n    {pn} # -g\n\n   {pn} reset: réinitialiser le préfixe"
    }
  },

  langs: {
    fr: {
      reset:applyStyle("╔═══════════════╗\n┋ Préfixe réinitialisé ┋\n╚═══════════════╝\n➤ Valeur par défaut: %1"),
      onlyAdmin: applyStyle("╔══════════════════╗\n┋ Accès refusé        ┋\n╚════════════════════╝\n➤ Seul l'admin peut modifier le préfixe global"),
      confirmGlobal: applyStyle("╔══════════════════╗\n┋ Confirmation requise ┋\n╚════════════════════╝\n➤ Réagissez pour confirmer le changement de préfixe global"),
      confirmThisThread: applyStyle("╔══════════════════╗\n┋ Confirmation requise ┋\n╚════════════════════╝\n➤ Réagissez pour confirmer le changement dans ce chat"),
      successGlobal: applyStyle("╔════════════════╗\n┋ Modification réussie ┋\n╚══════════════════╝\n➤ Nouveau préfixe global: %1"),
      successThisThread: applyStyle("╔════════════════╗\n┋ Modification réussie ┋\n╚══════════════════╝\n➤ Nouveau préfixe pour ce chat: %1"),
      myPrefix:
applyStyle(`╔═════════════════════╗
  ┋  `+`𝑆𝐴𝑇𝑂𝑅𝑈 𝐺𝑂𝐽𝑂 𝐵𝑂𝑇`+`       ┋
  ╚═════════════════════╝
 ┌─────────────────────┐
 │   ➤ Préfixe global: %1 │
 │   ➤ Votre préfixe: %2  │
.└─────────────────────┘
Tapez %2help pour voir mes commandes`)
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }
    else if (args[0] == "file") {
      const isAdmin = config.adminBot.includes(event.senderID);
      if (!isAdmin) {
        message.reply(getLang("onlyAdmin"));
      }
      else {
        const fileUrl = event.messageReply && event.messageReply.attachments[0].url;

        if (!fileUrl) {
          return message.reply(applyStyle("╔════════════════╗\n┋ Erreur          ┋\n╚════════════════╝\n➤ Aucun fichier valide trouvé"));
        }

        const folderPath = 'scripts/cmds/prefix';

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        try {
          const files = await fs.readdir(folderPath);
          for (const file of files) {
            await fs.unlink(path.join(folderPath, file));
          }
        } catch (error) {
          return message.reply(applyStyle("╔════════════════╗\n┋ Erreur          ┋\n╚════════════════╝\n➤ " + error));
        }

        const response = await axios.get(fileUrl, {
          responseType: "arraybuffer",
          headers: {
            'User-Agent': 'axios'
          }
        });

        const contentType = response.headers['content-type'];
        if (contentType.includes('image')) {
          const imagePath = path.join(folderPath, 'image.jpg');
          fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
        } else if (contentType.includes('video') || contentType.includes('gif')) {
          const ext = contentType.includes('video') ? '.mp4' : '.gif';
          const mediaPath = path.join(folderPath, 'media' + ext);
          fs.writeFileSync(mediaPath, Buffer.from(response.data, 'binary'));
        } else {
          return message.reply(applyStyle("╔════════════════════╗\n┋ Format invalide     ┋\n╚════════════════════╝\n➤ Seules les images/vidéos/gifs sont acceptés"));
        }

        message.reply(applyStyle("╔══════════════════╗\n┋ Succès           ┋\n╚══════════════════╝\n➤ Fichier enregistré avec succès"));
      }
    }
    else if (args == "clear") {
      const isAdmin = config.adminBot.includes(event.senderID);
      if (!isAdmin) {
        message.reply(getLang("onlyAdmin"));
      }
      else {
        try {
          const folderPath = 'scripts/cmds/prefix';

          if (fs.existsSync(folderPath)) {
            const files = await fs.readdir(folderPath);
            for (const file of files) {
              await fs.unlink(path.join(folderPath, file));
            }
            message.reply(applyStyle("╔══════════════════╗\n┋ Succès           ┋\n╚══════════════════╝\n➤ Dossier vidé avec succès"));
          } else {
            return message.reply(applyStyle("╔════════════════╗\n┋ Erreur          ┋\n╚════════════════╝\n➤ Le dossier n'existe pas"));
          }
        } catch (error) {
          return message.reply(applyStyle("╔════════════════╗\n┋ Erreur          ┋\n╚════════════════╝\n➤ " + error));
        }
      }
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
    const folderPath = 'scripts/cmds/prefix';

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const files = await fs.readdir(folderPath);

    const attachments = [];
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStream = fs.createReadStream(filePath);
      attachments.push(fileStream);
    }

    const messageContent = {
      attachment: attachments
    };

    if (event.body) {
      const prefixesToCheck = ["bot", "prefix", "préfixe"];
      const lowercasedMessage = event.body.toLowerCase();
      
      if (prefixesToCheck.includes(lowercasedMessage.trim())) {
        return () => {
          return message.reply({ 
            body: getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)),
            attachment: messageContent.attachment
          });
        };
      }
    }
  }
};
