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
  return text.split('').map(c => fontMap[c] || c).join('');
}

const frameTop = "╭─⌾⋅𝑵𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏⋅⌾──╮";
const frameBottom = "╰────⌾⋅  ⋅⌾────╯";

const OWNER_ID = "61564382117276";

module.exports = {
  config: {
    name: "notification",
    aliases: ["notify", "noti"],
    version: "1.9",
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
      missingMessage: `${frameTop}\n│\n│  ${applyFont("❗ Please enter the message")}\n│\n${frameBottom}`,
      sendingNotification: `${frameTop}\n│\n│  ${applyFont("Starting to send to")} %1 ${applyFont("groups")}...\n│\n${frameBottom}`,
      sentNotification: `${frameTop}\n│\n│  ✅ ${applyFont("Sent to")} %1 ${applyFont("groups")}\n│\n${frameBottom}`,
      errorSendingNotification: `${frameTop}\n│\n│  ❌ ${applyFont("Failed to send to")} %1 ${applyFont("groups")}:\n│ %2\n│\n${frameBottom}`,
      forwardedReply: `${frameTop}\n│\n│  ${applyFont("New reply from group:")} %1\n│  ${applyFont("User:")} %2\n│  ${applyFont("Message:")}\n│  %3\n│\n${frameBottom}`
    }
  },

  onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
    const { delayPerGroup } = envCommands[commandName];
    if (!args[0]) return message.reply(getLang("missingMessage"));

    const content = args.join(" ");
    const formSend = {
      body: `${frameTop}\n│\n│  ${content}\n│\n${frameBottom}`,
      attachment: await getStreamsFromAttachment(
        [
          ...event.attachments,
          ...(event.messageReply?.attachments || [])
        ].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
      )
    };

    const allThreadID = (await threadsData.getAll()).filter(
      t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup
    );

    message.reply(getLang("sendingNotification", allThreadID.length));

    let sendSuccess = 0;
    const sendError = [];
    const waitingSend = [];

    for (const thread of allThreadID) {
      const tid = thread.threadID;
      try {
        waitingSend.push({
          threadID: tid,
          pending: api.sendMessage(formSend, tid)
        });
        await new Promise(r => setTimeout(r, delayPerGroup));
      } catch {
        sendError.push(tid);
      }
    }

    for (const sent of waitingSend) {
      try {
        await sent.pending;
        sendSuccess++;
      } catch (e) {
        const { errorDescription } = e;
        if (!sendError.some(item => item.errorDescription === errorDescription))
          sendError.push({
            threadIDs: [sent.threadID],
            errorDescription
          });
        else
          sendError.find(item => item.errorDescription === errorDescription).threadIDs.push(sent.threadID);
      }
    }

    let msg = "";
    if (sendSuccess > 0)
      msg += getLang("sentNotification", sendSuccess) + "\n";
    if (sendError.length > 0)
      msg += getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0),
        sendError.reduce((a, b) => a + `\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`, ""));

    message.reply(msg || `${frameTop}\n│\n│  ${applyFont("Operation completed")}\n│\n${frameBottom}`);
  },

  onReply: async function ({ api, event, getLang, threadsData, usersData }) {
    if (!event.messageReply || !event.messageReply.senderID) return;
    if (event.senderID == OWNER_ID) return;

    const threadInfo = await threadsData.get(event.threadID);
    if (!threadInfo || !threadInfo.isGroup) return;

    const adminID = OWNER_ID;
    const senderName = await usersData.getName(event.senderID);
    let messageContent = event.body || "";

    const attachments = event.attachments || [];
    let attachmentText = "";
    if (attachments.length > 0) {
      attachmentText = "\n[Attachment(s) included]";
    }

    const forwardMsg = `${getLang("forwardedReply", event.threadName, senderName, messageContent + attachmentText)}`;
    api.sendMessage(forwardMsg, adminID);
  }
};
