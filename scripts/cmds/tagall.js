module.exports = {
  config: {
    name: "tagall",
    version: "4.1",
    author: "Messie Osango",
    role: 0,
    shortDescription: "Mentionne TOUS les membres",
    longDescription: "Tag tous les membres (max 250) avec encadrement par lot",
    category: "admin",
    guide: "{prefix}tagall"
  },
  onStart: async function ({ api, event }) {
    try {
      if (!event.isGroup) return api.sendMessage("ℹ️ Cette commande fonctionne uniquement dans un groupe.", event.threadID);

      const threadInfo = await api.getThreadInfo(event.threadID);
      let participants = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());

      if (participants.length > 250) {
        participants = participants.slice(0, 250);
        api.sendMessage("⚠️ Le groupe contient plus de 250 membres. Seuls les 250 premiers seront mentionnés.", event.threadID);
      }

      const chunkSize = 25;
      const chunks = [];

      for (let i = 0; i < participants.length; i += chunkSize) {
        chunks.push(participants.slice(i, i + chunkSize));
      }

      for (let c = 0; c < chunks.length; c++) {
        const group = chunks[c];
        let messageBody = "╭─⌾⋅𝑴𝑬𝑴𝑩𝑹𝑬𝑺⋅⌾──╮\n│";
        let mentions = [];

        for (let i = 0; i < group.length; i++) {
          const id = group[i];
          const userInfo = await api.getUserInfo(id);
          const name = userInfo[id]?.name || "Utilisateur";
          const tag = `@${name}`;
          const num = (c * chunkSize) + i + 1;
          const block = `\n│ ${num < 10 ? " " : ""}${num}. ╭──────────────╮\n│     │ ${tag.padEnd(14)}│\n│     ╰──────────────╯`;
          const fromIndex = messageBody.length + block.indexOf(tag);
          const toIndex = fromIndex + tag.length;
          mentions.push({ tag, id, fromIndex, toIndex });
          messageBody += block;
        }

        messageBody += "\n│\n╰─────⌾⋅  ⋅⌾─────╯";

        await api.sendMessage({
          body: messageBody,
          mentions
        }, event.threadID);
      }

    } catch {
      api.sendMessage("⚠️ Une erreur est survenue lors du tag.", event.threadID);
    }
  }
};
