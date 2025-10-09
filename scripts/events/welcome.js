const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "1.9",
        author: "Octavio Wina",
        category: "events"
    },

    langs: {
        en: {
            session1: "matin",
            session2: "midi",
            session3: "après-midi",
            session4: "soir",
            
            welcomeMessage: `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🌑 𝗢𝗰𝘁𝗮𝘃𝗶𝗼 𝗕𝗼𝘁  ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✨ Merci de m’avoir invité dans votre univers !
🔹 Préfixe du bot : %1
🔹 Pour découvrir toutes mes capacités, tapez : %1help

💀 À présent… que le *mode immersif* commence.
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,

            multiple1: "toi",
            multiple2: "vous",

            defaultWelcomeMessage: `╭━━━━━━━[ 🌌 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒖𝒆 🌌 ]━━━━━━━╮
👤  Salut {userName}
💫  Bienvenue {multiple} dans le royaume : {boxName}

🌗  Que ton {session} soit rempli d’énergie et de bonne humeur.
🖤  N’hésite pas à interagir avec Octavio Bot.

╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        // Vérifie si c'est un event d’ajout
        if (event.logMessageType !== "log:subscribe") return;

        const hours = getTime("HH");
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;

        // Si le bot lui-même est ajouté
        if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
            if (nickNameBot)
                api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
            return message.send(getLang("welcomeMessage", prefix));
        }

        // Initialisation du cache temporaire
        if (!global.temp.welcomeEvent[threadID])
            global.temp.welcomeEvent[threadID] = {
                joinTimeout: null,
                dataAddedParticipants: []
            };

        global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
        clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

        // Temporisation (1.5 sec) pour regrouper les arrivées multiples
        global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
            const threadData = await threadsData.get(threadID);
            if (threadData?.data?.sendWelcomeMessage === false) return;

            const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
            const dataBanned = threadData.data?.banned_ban || [];
            const threadName = threadData.threadName;
            const userName = [];
            const mentions = [];
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

            if (userName.length === 0) return;

            // Récupération du message de bienvenue
            let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
            const form = {
                mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
            };

            // Remplacements dynamiques
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

            // Chargement des fichiers d’attachement
            if (threadData.data.welcomeAttachment && threadData.data.welcomeAttachment.length > 0) {
                const attachments = [];
                for (const file of threadData.data.welcomeAttachment) {
                    try {
                        attachments.push(await drive.getFile(file, "stream"));
                    } catch (err) {
                        console.error(`[WELCOME] Fichier invalide: ${file}`);
                    }
                }
                if (attachments.length > 0) form.attachment = attachments;
            }

            // Envoi du message final
            message.send(form);
            delete global.temp.welcomeEvent[threadID];
        }, 1500);
    }
}; 
