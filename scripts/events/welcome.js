const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "1.8",
        author: "messie osango",
        category: "events"
    },

    langs: {
        fr: {
            session1: "matin",
            session2: "midi", 
            session3: "après-midi",
            session4: "soir",
            welcomeMessage: "╭─⌾𝑺𝑨𝑻𝑶𝑹𝑼 𝑮𝑶𝑱𝑶⌾──╮\n│\n│ 𝘔𝘦𝘳𝘤𝘪 𝘱𝘰𝘶𝘳 𝘭'𝘪𝘯𝘷𝘪𝘵𝘢𝘵𝘪𝘰𝘯\n│\n│ 𝘗𝘳𝘦́𝘧𝘪𝘹𝘦 : %1\n│ 𝘓𝘪𝘴𝘵𝘦 𝘥𝘦𝘴 𝘤𝘰𝘮𝘮𝘢𝘯𝘥𝘦𝘴 : %1help\n│\n╰─────────────⌾",
            multiple1: "toi",
            multiple2: "vous",
            defaultWelcomeMessage: "╭─⌾𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗨𝗘⋅⌾──╮\n│\n│ 𝘉𝘪𝘦𝘯𝘷𝘦𝘯𝘶𝘦 {userName}\n│\n│ 𝘎𝘳𝘰𝘶𝘱𝘦 : {boxName}\n│ 𝘔𝘰𝘮𝘦𝘯𝘵 : {session}\n│\n╰─────────────⌾"
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe")
            return async function () {
                const hours = getTime("HH");
                const { threadID } = event;
                const { nickNameBot } = global.GoatBot.config;
                const prefix = global.utils.getPrefix(threadID);
                const dataAddedParticipants = event.logMessageData.addedParticipants;

                if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
                    if (nickNameBot)
                        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                    return message.send(getLang("welcomeMessage", prefix));
                }

                if (!global.temp.welcomeEvent[threadID])
                    global.temp.welcomeEvent[threadID] = {
                        joinTimeout: null,
                        dataAddedParticipants: []
                    };

                global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
                clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

                global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                    const threadData = await threadsData.get(threadID);
                    if (threadData.settings.sendWelcomeMessage == false)
                        return;
                    const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                    const dataBanned = threadData.data.banned_ban || [];
                    const threadName = threadData.threadName;
                    const userName = [],
                        mentions = [];
                    let multiple = false;

                    if (dataAddedParticipants.length > 1)
                        multiple = true;

                    for (const user of dataAddedParticipants) {
                        if (dataBanned.some((item) => item.id == user.userFbId))
                            continue;
                        userName.push(user.fullName);
                        mentions.push({
                            tag: user.fullName,
                            id: user.userFbId
                        });
                    }

                    if (userName.length == 0) return;
                    let { welcomeMessage = getLang("defaultWelcomeMessage") } =
                        threadData.data;
                    const form = {
                        mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
                    };
                    welcomeMessage = welcomeMessage
                        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                        .replace(/\{boxName\}|\{threadName\}/g, threadName)
                        .replace(
                            /\{multiple\}/g,
                            multiple ? getLang("multiple2") : getLang("multiple1")
                        )
                        .replace(
                            /\{session\}/g,
                            hours <= 10
                                ? getLang("session1")
                                : hours <= 12
                                    ? getLang("session2")
                                    : hours <= 18
                                        ? getLang("session3")
                                        : getLang("session4")
                        );

                    form.body = welcomeMessage;

                    if (threadData.data.welcomeAttachment) {
                        const files = threadData.data.welcomeAttachment;
                        const attachments = files.reduce((acc, file) => {
                            acc.push(drive.getFile(file, "stream"));
                            return acc;
                        }, []);
                        form.attachment = (await Promise.allSettled(attachments))
                            .filter(({ status }) => status == "fulfilled")
                            .map(({ value }) => value);
                    }
                    message.send(form);
                    delete global.temp.welcomeEvent[threadID];
                }, 1500);
            };
    }
};
