const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Fonction pour récupérer l’URL de base de la 4ᵉ API
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.5",
    author: "messie osango",
    role: 0,
    countDown: 30,
    shortDescription: {
      fr: "Recherche d’images sur Pinterest"
    },
    longDescription: {
      fr: "Cherche et affiche plusieurs images Pinterest selon votre recherche. Supporte plusieurs APIs pour plus de fiabilité."
    },
    category: "image",
    guide: {
      fr: "{prefix}pinterest chat noir -5"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const query = args.join(" ");
      const key = query.substr(0, query.indexOf("-")).trim();

      if (!key) {
        return api.sendMessage(
          `╭━━━━━[ ⚠️ 𝑼𝒕𝒊𝒍𝒊𝒔𝒂𝒕𝒊𝒐𝒏 ]━━━━━╮
📸 | Format : pinterest [mot-clé] -[nombre]
💀 | Exemple : pinterest chat noir -5
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
          event.threadID,
          event.messageID
        );
      }

      let limit = parseInt(query.split("-").pop().trim()) || 1;
      limit = Math.min(Math.max(limit, 1), 12);

      let images = [];
      let fetched = [];

      const apis = [
        async () => {
          const { data } = await axios.get(`https://api-samirxyz.onrender.com/api/Pinterest?query=${encodeURIComponent(key)}&number=${limit}&apikey=global`);
          return Array.isArray(data) ? data : [];
        },
        async () => {
          const { data } = await axios.get(`https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(key)}`);
          return Array.isArray(data) ? data.map(d => d.image) : [];
        },
        async () => {
          const { data } = await axios.get(`https://itsaryan.onrender.com/api/pinterest?query=${encodeURIComponent(key)}&limits=${limit}`);
          return Array.isArray(data) ? data : [];
        },
        async () => {
          const base = await baseApiUrl();
          const { data } = await axios.get(`${base}/pinterest?search=${encodeURIComponent(key)}&limit=${limit}`);
          return Array.isArray(data.data) ? data.data : [];
        }
      ];

      // 🔍 Essaye les APIs une par une jusqu’à obtenir des résultats
      for (const fetchApi of apis) {
        if (images.length > 0) break;
        try {
          const results = await fetchApi();
          if (results.length > 0) {
            images = results.slice(0, limit);
          }
        } catch (err) {
          console.error("❌ Erreur API:", err.message);
        }
      }

      if (images.length === 0) {
        throw new Error("Aucune image trouvée ou APIs inaccessibles.");
      }

      // 📥 Téléchargement des images
      const attachments = await Promise.all(
        images.map(async (url, i) => {
          if (fetched.includes(url)) return null;
          fetched.push(url);
          try {
            const { data } = await axios.get(url, { responseType: "arraybuffer" });
            const filePath = path.join(__dirname, "tmp", `${i + 1}.jpg`);
            await fs.outputFile(filePath, data);
            return fs.createReadStream(filePath);
          } catch (e) {
            console.error("Erreur image:", e.message);
            return null;
          }
        })
      );

      const valid = attachments.filter(Boolean);
      if (valid.length === 0) throw new Error("Impossible de charger les images.");

      // 🖤 Envoi du message final
      await api.sendMessage({
        body: `╭━━━━━[ 🖤 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝑺𝒆𝒂𝒓𝒄𝒉 ]━━━━━╮
🔎 | Résultats pour : ${key}
📸 | ${valid.length} image(s) trouvée(s)
🌑 | Octavio Bot a exécuté la recherche.
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        attachment: valid
      }, event.threadID, event.messageID);

      // 🧹 Nettoyage du dossier temporaire
      await fs.remove(path.join(__dirname, "tmp"));

    } catch (error) {
      console.error("Erreur Pinterest:", error.message);
      return api.sendMessage(
        `╭━━━━━[ ⚠️ 𝑬𝒓𝒓𝒆𝒖𝒓 ]━━━━━╮
💀 | ${error.message}
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        event.threadID,
        event.messageID
      );
    }
  }
};
