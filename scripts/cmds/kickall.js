module.exports = {
    config: {
        name: "kickall",
        version: "1.0",
        author: "Messie Osango",
        role: 1,
        shortDescription: "Supprime tous les membres du groupe",
        longDescription: "Retire tous les membres du groupe sauf l'admin du bot et le bot lui-même",
        category: "admin",
        guide: "{prefix}kickall"
    },

    onStart: async function({ api, event, args }) {
        try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
            const botID = api.getCurrentUserID();
            const userID = event.senderID;

            if (!adminIDs.includes(userID)) {
                return api.sendMessage("Vous n'avez pas les permissions nécessaires pour utiliser cette commande.", event.threadID);
            }

            const members = threadInfo.participantIDs.filter(id => id !== botID && id !== userID);

            if (members.length === 0) {
                return api.sendMessage("Aucun membre à supprimer.", event.threadID);
            }

            api.sendMessage(`Commence la suppression de ${members.length} membres...`, event.threadID);

            for (const member of members) {
                try {
                    await api.removeUserFromGroup(member, event.threadID);
                } catch (err) {
                    console.error(`Erreur lors de la suppression de ${member}:`, err);
                }
            }

            api.sendMessage("Tous les membres ont été supprimés avec succès.", event.threadID);

        } catch (error) {
            console.error("Erreur kickall:", error);
            api.sendMessage("Une erreur s'est produite lors de l'exécution de la commande.", event.threadID);
        }
    }
};
