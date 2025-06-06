const { getStreamsFromAttachment } = global.utils;

function applyFont(text) {
  const fontMap = {
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
  return text.split('').map(char => fontMap[char] || char).join('');
}

module.exports = {
  config: {
    name: "notification",
    aliases: ["notify", "noti"],
    version: "1.8",
    author: "Messie Osango",
    countDown: 5,
    role: 2,
    description: {
      en: applyFont("Send notification from admin to all box")
    },
    category: "owner",
    guide: {
      en: `{pn} <${applyFont("message")}>`
    },
    envConfig: {
      delayPerGroup: 250
    }
  },

  langs: {
    en: {
      missingMessage: `╭─⌾${applyFont("ERROR")}⋅⌾──╮\n│\n│ ${applyFont("Please enter the message")}\n│\n╰─────────────⌾`,
      notification: `╭─⌾${applyFont("NOTIFICATION")}⋅⌾──╮\n│\n│ ${applyFont("From admin bot to all groups")}\n│ ${applyFont("(Do not reply)")}\n│\n╰─────────────⌾`,
      sendingNotification: `╭─⌾${applyFont("SENDING")}⋅⌾──╮\n│\n│ ${applyFont("Starting to send to")} %1 ${applyFont("groups")}\n│\n╰─────────────⌾`,
      sentNotification: `╭─⌾${applyFont("SUCCESS")}⋅⌾──╮\n│\n│ ✅ ${applyFont("Sent to")} %1 ${applyFont("groups")}\n│\n╰─────────────⌾`,
      errorSendingNotification: `╭─⌾${applyFont("ERROR")}⋅⌾──╮\n│\n│ ❌ ${applyFont("Failed to send to")} %1 ${applyFont("groups")}:\n│ %2\n│\n╰─────────────⌾`
    }
  },

  onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
    const { delayPerGroup } = envCommands[commandName];
    if (!args[0])
      return message.reply(getLang("missingMessage"));

    const formSend = {
      body: `${getLang("notification")}\n────────────────\n${args.join(" ")}`,
      attachment: await getStreamsFromAttachment(
        [
          ...event.attachments,
          ...(event.messageReply?.attachments || [])
        ].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
      )
    };

    const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
    message.reply(getLang("sendingNotification", allThreadID.length));

    let sendSucces = 0;
    const sendError = [];
    const wattingSend = [];

    for (const thread of allThreadID) {
      const tid = thread.threadID;
      try {
        wattingSend.push({
          threadID: tid,
          pending: api.sendMessage(formSend, tid)
        });
        await new Promise(resolve => setTimeout(resolve, delayPerGroup));
      }
      catch (e) {
        sendError.push(tid);
      }
    }

    for (const sended of wattingSend) {
      try {
        await sended.pending;
        sendSucces++;
      }
      catch (e) {
        const { errorDescription } = e;
        if (!sendError.some(item => item.errorDescription == errorDescription))
          sendError.push({
            threadIDs: [sended.threadID],
            errorDescription
          });
        else
          sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
      }
    }

    let msg = "";
    if (sendSucces > 0)
      msg += getLang("sentNotification", sendSucces) + "\n";
    if (sendError.length > 0)
      msg += getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0), 
        sendError.reduce((a, b) => a + `\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`, ""));

    message.reply(msg || applyFont("Operation completed"));
  }
};
