const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    version: "1.8",
    role: 0,
    author: "messie osango",
    countDown: 5,
    shortDescription: "Améliore les images en 4K",
    longDescription: "Transforme tes images en version 4K avec un rendu sombre, net et immersif.",
    category: "image",
    guide: {
      en: "{pn} → réponds à une ou plusieurs images pour les sublimer en 4K."
    }
  },

  onStart: async function ({ message, event }) {
    let images = [];

    // 🔹 1. Si on répond à un message contenant des images
    if (event.messageReply && event.messageReply.attachments) {
      images = event.messageReply.attachments.filter(a => a.type === "photo");
    }

    // 🔹 2. Si les images sont directement dans le message
    if (event.attachments && event.attachments.length > 0) {
      images = images.concat(event.attachments.filter(a => a.type === "photo"));
    }

    // ❌ Aucune image trouvée
    if (images.length === 0) {
      return message.reply(
        `╭━━━━━━━[ ⚠️ 𝑬𝒓𝒓𝒆𝒖𝒓 ]━━━━━━━╮
❌ | Réponds à une ou plusieurs images pour les transformer en 4K.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // 💎 Message de traitement
    message.reply(
      `╭━━━━━━━[ 💎 𝑻𝒓𝒂𝒊𝒕𝒆𝒎𝒆𝒏𝒕 ]━━━━━━━╮
🕶️ | Conversion de ${images.length} image(s) vers la 4K en cours...
🌑 | Merci de patienter quelques instants.
╰━━━━━━━━━━━━━━━━━━━━━━╯`, 
      async (err, info) => {

      let upscaled = [];

      // 🔹 Traitement une par une
      for (let img of images) {
        try {
          const imgurl = encodeURIComponent(img.url);
          const upscaleUrl = `https://smfahim.xyz/4k?url=${imgurl}`;

          const { data: { image } } = await axios.get(upscaleUrl);
          const attachment = await global.utils.getStreamFromURL(image, "octavio-4k.png");
          upscaled.push(attachment);
        } catch (e) {
          console.error("[4K UPSCALE ERROR]", e.message);
          upscaled.push(null);
        }
      }

      // 🖤 Envoi du résultat
      if (upscaled.filter(Boolean).length === 0) {
        message.reply(
          `╭━━━━━━━[ ❌ 𝑭𝒂𝒊𝒍 ]━━━━━━━╮
😞 | Aucune image n’a pu être traitée.
🔧 | Essaie avec une autre image ou réessaie plus tard.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );
      } else {
        message.reply({
          body: `╭━━━━━━━[ ✅ 𝑺𝒖𝒄𝒄𝒆̀𝒔 ]━━━━━━━╮
🖤 | ${upscaled.filter(Boolean).length} image(s) sublimée(s) en 4K.
✨ | L’ombre et la netteté d’Octavio sont à ton service.
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
          attachment: upscaled.filter(Boolean)
        });
      }

      // 🕯️ Efface le message “traitement”
      let processingMsgID = info.messageID;
      message.unsend(processingMsgID);
    });
  }
}; 
