module.exports = {
	config: {
		name: "unsend",
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Gỡ tin nhắn của bot, hiển thị cảnh báo trước khi gỡ",
			en: "Unsend bot's message with a warning message before deleting"
		},
		category: "box chat",
		guide: {
			vi: "reply tin nhắn muốn gỡ của bot và gọi lệnh {pn}",
			en: "reply the message you want to unsend and call the command {pn}"
		}
	},

	langs: {
		vi: {
			syntaxError: "Vui lòng reply tin nhắn muốn gỡ của bot"
		},
		en: {
			syntaxError: "Please reply the message you want to unsend"
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
			return message.reply(getLang("syntaxError"));

		// ⚠️ Message avant suppression
		await message.reply("⚠️ Le message du bot va être supprimé dans quelques secondes...");

		// ⏳ Petit délai avant suppression
		setTimeout(() => {
			message.unsend(event.messageReply.messageID);
		}, 3000); // 3 secondes avant suppression
	}
};
