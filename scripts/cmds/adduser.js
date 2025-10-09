const{ findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  config: {
    name: "adduser",
    version: "2.1",
    author: "Octavio Wina",
    countDown: 5,
    role: 1,
    shortDescription: "Ajoute un utilisateur dans le groupe",
    longDescription: "Ajoute un ou plusieurs utilisateurs dans le groupe via leur lien ou UID",
    category: "group",
    guide: {
      en: "   {pn} [lien du profil | uid]"
    }
  },

  langs: {
    fr: {
      alreadyInGroup: "👥 Cet utilisateur est déjà dans le groupe.",
      successAdd: "✅ Ajout réussi de %1 membre(s) dans le groupe.",
      failedAdd: "❌ Échec d’ajout de %1 membre(s).",
      approve: "🕒 %1 membre(s) ajouté(s) à la liste d’approbation.",
      invalidLink: "⚠️ Lien Facebook invalide.",
      cannotGetUid: "⚙️ Impossible d’obtenir l’UID de cet utilisateur.",
      linkNotExist: "❌ Ce lien de profil n’existe pas.",
      cannotAddUser: "🚫 Le bot est bloqué ou l’utilisateur empêche l’ajout par des inconnus."
    }
  },

  onStart: async function ({ message, api, event, args, threadsData, getLang }) {
    const { members, adminIDs, approvalMode } = await threadsData.get(event.threadID);
    const botID = api.getCurrentUserID();

    const success = [{ type: "success", uids: [] }, { type: "waitApproval", uids: [] }];
    const failed = [];

    function pushError(msg, item) {
      item = item.replace(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)/i, '');
      const exist = failed.find(e => e.type === msg);
      if (exist) exist.uids.push(item);
      else failed.push({ type: msg, uids: [item] });
    }

    const regExMatchFB = /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i;

    for (const item of args) {
      let uid;
      let skip = false;

      if (isNaN(item) && regExMatchFB.test(item)) {
        for (let i = 0; i < 10; i++) {
          try {
            uid = await findUid(item);
            break;
          } catch (err) {
            if (["SlowDown", "CannotGetData"].includes(err.name)) {
              await sleep(1000);
              continue;
            } else if (i === 9 || !["SlowDown", "CannotGetData"].includes(err.name)) {
              pushError(
                err.name === "InvalidLink" ? getLang("invalidLink") :
                err.name === "CannotGetData" ? getLang("cannotGetUid") :
                err.name === "LinkNotExist" ? getLang("linkNotExist") :
                err.message,
                item
              );
              skip = true;
              break;
            }
          }
        }
      } else if (!isNaN(item)) uid = item;
      else continue;
      if (skip) continue;

      if (members.some(m => m.userID == uid && m.inGroup)) {
        pushError(getLang("alreadyInGroup"), item);
      } else {
        try {
          await api.addUserToGroup(uid, event.threadID);
          if (approvalMode && !adminIDs.includes(botID)) success[1].uids.push(uid);
          else success[0].uids.push(uid);
        } catch {
          pushError(getLang("cannotAddUser"), item);
        }
      }
    }

    const ok = success[0].uids.length;
    const wait = success[1].uids.length;
    const err = failed.reduce((a, b) => a + b.uids.length, 0);

    let msg = `╭━━━━━━━━━━━━━[ 👥 AJOUT UTILISATEUR ]━━━━━━━━━━━━━╮\n`;
    if (ok) msg += `┃ ✅ Réussi : ${ok} membre(s)\n`;
    if (wait) msg += `┃ 🕒 En attente d’approbation : ${wait} membre(s)\n`;
    if (err) {
      msg += `┃ ❌ Échec : ${err} membre(s)\n`;
      for (const f of failed) {
        msg += `┃   + ${f.uids.join(', ')} : ${f.type}\n`;
      }
    }
    msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

    await message.reply(msg);
  }
};
					
