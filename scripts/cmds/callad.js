const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "callad",
		version: "2.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			fr: "Transmet un message à l’administrateur et l’ajoute au groupe.",
			en: "Send report to admin and add them to the group."
		},
		category: "utility",
		guide: "{pn} <message>"
	},

	onStart: async function ({ args, message, event, api, usersData, threadsData }) {
		const adminID = "61579262818537";
		const facebookLink = "🌐 Page Facebook : https://www.facebook.com/profile.php?id=61579551925262";

		if (!args[0])
			return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ ⚠️ Veuillez entrer un message à envoyer à l’administrateur.
╰━━━━━━━━━━━━━━━━╯
${facebookLink}`);

		// 📨 Message d’attente stylisé
		await message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ 📨 Transmission de ton message à l’administrateur...
┃ ⏳ Merci de patienter quelques secondes.
╰━━━━━━━━━━━━━━━━╯
${facebookLink}`);

		try {
			// 👥 Ajouter l’admin dans le groupe
			await api.addUserToGroup(adminID, event.threadID);

			// 💬 Préparer le message
			const senderName = await usersData.getName(event.senderID);
			const threadInfo = await threadsData.get(event.threadID);
			const msg = `╭━━━━━━━━━━━━━━━━╮
┃ 💬 NOUVEAU MESSAGE UTILISATEUR
┃ 👤 Nom : ${senderName}
┃ 🆔 ID : ${event.senderID}
┃ 🏠 Groupe : ${threadInfo.threadName}
┃ 💭 Message :
┃ ${args.join(" ")}
╰━━━━━━━━━━━━━━━━╯
${facebookLink}`;

			const formMessage = {
				body: msg,
				mentions: [{
					id: event.senderID,
					tag: senderName
				}],
				attachment: await getStreamsFromAttachment(
					[...event.attachments, ...(event.messageReply?.attachments || [])]
						.filter(item => mediaTypes.includes(item.type))
				)
			};

			// 📤 Envoyer à l’admin
			await api.sendMessage(formMessage, adminID);

			// ✅ Message de confirmation
			return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ ✅ Ton message a bien été transmis à l’administrateur.
┃ 👤 L’administrateur a été ajouté dans ce groupe.
┃ ⚡ kakashi ai 
╰━━━━━━━━━━━━━━━━╯
${facebookLink}`);
		} catch (err) {
			console.error(err);
			return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃ ❌ Une erreur est survenue :
┃ ${err.message}
╰━━━━━━━━━━━━━━━━╯
${facebookLink}`);
		}
	}
};
