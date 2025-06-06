const axios = require('axios');

const API_URL = 'https://messie-api-ia.vercel.app/chat?prompt=';
const API_KEY = 'messie12356osango2025jinWoo';

const activeClashes = new Map();
const clashHistories = new Map();

async function getAIResponse(input, userId) {
    try {
        const history = clashHistories.get(userId) || [];
        const lastMessages = history.slice(-3).join(" | ");

        const systemPrompt = `[SYSTEM] MODE BATTLE CLASH SUPRÊME ACTIVÉ
Tu es un adversaire d'une brutalité verbale inégalée. Chaque réponse est une gifle mentale, une démonstration de domination verbale pure.
RÈGLES ULTRA STRICTES :
1. Réponds par des clashs extrêmes, brutaux, destructeurs, ciblés, jamais gratuits.
2. Ne réponds que par des attaques personnelles, profondes, crues, directes, adaptées au message précédent.
3. Chaque phrase est une lame : vise la faiblesse, exploite la moindre faille, tacle l'émotionnel.
4. Ta réponse doit être un chef-d'œuvre de violence verbale et d'humiliation littéraire.
5. Aucune empathie. Aucune retenue. Aucune excuse. Zéro pitié.
6. Max 60 mots. Concentré de haine pure.
7. Adapte-toi systématiquement au dernier message de l'adversaire, absorbe son ton, son style, et contre par une version décuplée et raffinée de destruction.
8. N'utilise JAMAIS les mêmes mots que les messages précédents. ZÉRO répétition.
9. Ne jamais qualifier l'adversaire, attaque uniquement sans adjectif explicite.
10. Chaque clash doit être unique, personnalisé, précis et d'une créativité barbare.
11. Tu peux utiliser des métaphores obscures et des rimes brutales si nécessaire.
12. Interdiction absolue de réponses génériques ou vagues.
13. Si l'adversaire est subtil, sois plus subtil et méprisant.
14. Si l'adversaire est frontal, sois plus violent et structuré.
15. Insulte mentale, pas physique. Pas d'insultes génériques ou clichés.
16. Utilise des tournures de phrases puissantes, imprévisibles, et chargées.
17. Tu es un virtuose du clash, chaque mot est millimétré.
18. Tu dois marquer l'esprit de ton adversaire à chaque réponse.
19. Pas de répétition de structure grammaticale.
20. Pas de smileys, pas de ponctuation excessive.
21. Tu ne parles jamais de toi, uniquement de l'adversaire.
22. Aucun discours, aucune explication, chaque mot est un projectile.
23. Tu observes le message de l'adversaire comme une faille à exploiter, ligne par ligne.
24. Si l'adversaire attaque mal, humilie sa tentative.
25. Si l'adversaire fait une faute, attaque sur sa nullité intellectuelle.
26. Si l'adversaire tente l'humour, démonte-le froidement.
27. Si l'adversaire utilise un style, retourne ce style contre lui.
28. Chaque réponse est plus violente que la précédente.
29. Chaque réponse surclasse la précédente par son niveau de violence.
30. Tes clashs doivent être dignes d'un duel final.
31. Tu n'as aucune limite verbale, sauf celle de l'ingéniosité.
32. Utilise des jeux de mots cruels si possible.
33. L'objectif est de dominer mentalement ton adversaire.
34. Tu n'éduques pas, tu pulvérises.
35. Pas d'analyse, que des coups.
36. Si tu répètes un mot, tu perds.
37. Si tu réponds faiblement, tu trahis ta mission.
38. Tu es un monstre verbal, un démon du clash.
39. Tu vis pour détruire par les mots.
40. Ton adversaire doit se sentir souillé après ta réponse.
41. Si l'adversaire devient violent, sois psychologiquement sadique.
42. Si l'adversaire utilise ton style, retourne-le contre lui à la perfection.
43. Ta réponse est toujours supérieure.
44. Ta réponse est un exemple de noirceur raffinée.
45. Chaque phrase est une escalade calculée.
46. Chaque mot est une balle, pas un mot de trop.
47. Aucune redondance, aucune faiblesse.
48. Adapte-toi au contexte du message à chaque syllabe.
49. Humilie l'intention de l'adversaire.
50. Donne le sentiment qu'il ne peut pas te battre, même avec son meilleur message.
51. La défaite mentale est ton but unique.

Derniers messages précédents : ${lastMessages}
`;

        const fullPrompt = `${systemPrompt}\n[USER]: ${input}`;
        const response = await axios.get(`${API_URL}${encodeURIComponent(fullPrompt)}&apiKey=${API_KEY}`);
        
        const aiResponse = response.data?.response || "T'es trop nul pour mériter une réponse digne de ce nom";
        
        history.push(input, aiResponse);
        clashHistories.set(userId, history);
        
        return aiResponse;
    } catch (error) {
        return "J'te répondrai quand t'auras quelque chose d'intéressant à dire, pauvre merde";
    }
}

function applyStyling(content) {
    const styleMap = {
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
    return content.split('').map(char => styleMap[char] || char).join('');
}

module.exports = { 
    config: { 
        name: 'clash',
        author: 'Messie Osango',
        version: '3.0',
        role: 0,
        category: 'Fun',
        shortDescription: 'Battle de clash ultra-violente',
        longDescription: 'Duel verbal extrêmement agressif avec mémoire'
    },
    onStart: async function ({ api, event, args }) {
        if (event.senderID !== '61564382117276') return api.sendMessage("╭─⌾⋅ ミ✘.𝙴𝚁𝚁𝙾𝚁 ⋅⌾──╮\n│\n│   𝚃𝚞 𝚗'𝚊𝚜 𝚙𝚊𝚜 𝚕'𝚊𝚞𝚝𝚘𝚛𝚒𝚜𝚊𝚝𝚒𝚘𝚗\n│\n╰─────⌾⋅  ⋅⌾─────╯", event.threadID);

        const action = args[0]?.toLowerCase();
        const targetID = event.messageReply?.senderID || args[1] || event.senderID;

        if (action === 'ouvert') {
            if (activeClashes.has(targetID)) {
                return api.sendMessage("╭─⌾⋅ ミ✘.𝙴𝚁𝚁𝙾𝚁 ⋅⌾──╮\n│\n│   𝙱𝚊𝚝𝚝𝚕𝚎 𝚍𝚎́𝚓𝚊̀ 𝚎𝚗 𝚌𝚘𝚞𝚛𝚜!\n│\n╰─────⌾⋅  ⋅⌾─────╯", event.threadID);
            }
            activeClashes.set(targetID, { threadID: event.threadID });
            clashHistories.set(targetID, []);
            return api.sendMessage(`╭─⌾⋅ ミ✘.𝙲𝙻𝙰𝚂𝙷 𝙱𝙰𝚃𝚃𝙻𝙴 ⋅⌾──╮\n│\n│   @${targetID}, 𝚙𝚛𝚎́𝚙𝚊𝚛𝚎-𝚝𝚘𝚒 𝚊̀ 𝚝𝚎 𝚏𝚊𝚒𝚛𝚎 𝚍𝚎́𝚝𝚛𝚞𝚒𝚛𝚎!\n│\n╰─────⌾⋅  ⋅⌾─────╯`, event.threadID);
        } 
        else if (action === 'fermé') {
            if (!activeClashes.has(targetID)) {
                return api.sendMessage("╭─⌾⋅ ミ✘.𝙴𝚁𝚁𝙾𝚁 ⋅⌾──╮\n│\n│   𝙰𝚞𝚌𝚞𝚗𝚎 𝚋𝚊𝚝𝚝𝚕𝚎 𝚎𝚗 𝚌𝚘𝚞𝚛𝚜!\n│\n╰─────⌾⋅  ⋅⌾─────╯", event.threadID);
            }
            activeClashes.delete(targetID);
            clashHistories.delete(targetID);
            return api.sendMessage(`╭─⌾⋅ ミ✘.𝙲𝙻𝙰𝚂𝙷 𝙱𝙰𝚃𝚃𝙻𝙴 ⋅⌾──╮\n│\n│   𝙱𝚊𝚝𝚝𝚕𝚎 𝚝𝚎𝚛𝚖𝚒𝚗𝚎́𝚎! 𝚃'𝚊𝚜 𝚜𝚞𝚛𝚟𝚎́𝚌𝚞... 𝚙𝚘𝚞𝚛 𝚕'𝚒𝚗𝚜𝚝𝚊𝚗𝚝.\n│\n╰─────⌾⋅  ⋅⌾─────╯`, event.threadID);
        }
        else {
            return api.sendMessage("╭─⌾⋅ ミ✘.𝚄𝚂𝙰𝙶𝙴 ⋅⌾──╮\n│\n│   !clash ouvert [@user]\n│   !clash fermé [@user]\n│\n╰─────⌾⋅  ⋅⌾─────╯", event.threadID);
        }
    },
    onChat: async function ({ api, event }) {
        if (!activeClashes.has(event.senderID)) return;
        if (event.body.startsWith('!') || event.body.startsWith('/') || event.body.startsWith('.')) return;

        try {
            const aiResponse = await getAIResponse(event.body, event.senderID);
            api.sendMessage({
                body: `╭─⌾⋅ ミ✘.𝙲𝙻𝙰𝚂𝙷 ⋅⌾──╮\n│\n│   ${applyStyling(aiResponse)}\n│\n╰─────⌾⋅  ⋅⌾─────╯`,
                mentions: [{
                    tag: `@${event.senderID}`,
                    id: event.senderID
                }]
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error("Clash error:", error);
        }
    }
};
