const OsangoMessie = require('os');
const moment = require('moment-timezone');

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

function applyStyle(text) {
    return text.split('').map(char => styleMap[char] || char).join('');
}

module.exports = {
    config: {
        name: "uptime",
        aliases: ["upt", "up"],
        version: "1.0",
        author: "𝚖𝚎𝚜𝚜𝚒𝚎 𝚘𝚜𝚊𝚗𝚐𝚘",
        role: 0,
        shortDescription: {
            en: applyStyle("𝚂𝚝𝚊𝚝𝚒𝚜𝚝𝚒𝚚𝚞𝚎𝚜 𝚜𝚢𝚜𝚝𝚎𝚖𝚎")
        },
        longDescription: {
            en: applyStyle("𝙰𝚏𝚏𝚒𝚌𝚑𝚎 𝚕𝚎𝚜 𝚙𝚎𝚛𝚏𝚘𝚛𝚖𝚊𝚗𝚌𝚎𝚜 𝚍𝚞 𝚜𝚢𝚜𝚝𝚎𝚖𝚎")
        },
        category: "𝚜𝚢𝚜𝚝𝚎𝚖",
        guide: {
            en: applyStyle("╭─⌾⋅ ミ✘.𝚄𝚂𝙰𝙶𝙴 ⋅⌾──╮\n│\n│   {p}uptime\n│\n╰─────⌾⋅  ⋅⌾─────╯")
        }
    },
    onStart: async function ({ api, event }) {
        try {
            const Madara = process.uptime();
            const satoru = OsangoMessie.uptime();

            const gojo = Math.floor(Madara / 86400);
            const sung = Math.floor((Madara % 86400) / 3600);
            const jinwoo = Math.floor((Madara % 3600) / 60);
            const messie = Math.floor(Madara % 60);

            const Osango = `╭─⌾⋅ ミ✘.𝙱𝙾𝚃 ⋅⌾──╮\n│\n│ ${gojo} 𝚓𝚘𝚞𝚛𝚜\n│ ${sung} 𝚑𝚎𝚞𝚛𝚎𝚜\n│ ${jinwoo} 𝚖𝚒𝚗𝚞𝚝𝚎𝚜\n│ ${messie} 𝚜𝚎𝚌𝚘𝚗𝚍𝚎𝚜\n│\n╰─────⌾⋅  ⋅⌾─────╯`;

            const sungJinWoo = Math.floor(satoru / 86400);
            const Igris = Math.floor((satoru % 86400) / 3600);
            const beru = Math.floor((satoru % 3600) / 60);
            const bellion = Math.floor(satoru % 60);

            const uptimeServer = `╭─⌾⋅ ミ✘.𝚂𝙴𝚁𝚅𝙴𝚄𝚁 ⋅⌾──╮\n│\n│ ${sungJinWoo} 𝚓𝚘𝚞𝚛𝚜\n│ ${Igris} 𝚑𝚎𝚞𝚛𝚎𝚜\n│ ${beru} 𝚖𝚒𝚗𝚞𝚝𝚎𝚜\n│ ${bellion} 𝚜𝚎𝚌𝚘𝚗𝚍𝚎𝚜\n│\n╰─────⌾⋅  ⋅⌾─────╯`;

            const totalMem = OsangoMessie.totalmem() / (1024 ** 3);
            const usedMem = (OsangoMessie.totalmem() - OsangoMessie.freemem()) / (1024 ** 3);
            const cpuSpeed = (OsangoMessie.cpus()[0].speed / 1000).toFixed(2);

            const now = moment().tz('Africa/Douala').format('YYYY-MM-DD HH:mm:ss');

            const message = `
╭⌾⋅ ミ✘.𝚂𝚈𝚂𝚃𝙴𝙼𝙴 ⋅⌾─╮
│
│ ${applyStyle("𝙿𝙴𝚁𝙵𝙾𝚁𝙼𝙰𝙽𝙲𝙴𝚂")} 
│
${Osango}
│
${uptimeServer}

╭⌾⋅ミ✘𝚁𝙴𝚂𝚂𝙾𝚄𝚁𝙲e⋅⌾─╮
│
│ 𝙲𝙿𝚄: ${cpuSpeed} 𝙶𝙷𝚣
│ 𝚁𝙰𝙼: ${usedMem.toFixed(2)}/${totalMem.toFixed(2)} 𝙶𝙱
│
╰─────⌾⋅  ⋅⌾─────╯
│
╭⌾⋅ミ✘.𝙷𝙴𝚄𝚁𝙴 ⋅⌾─╮
│
│ ${now}
│
╰─────⌾⋅  ⋅⌾────╯`;

            api.sendMessage(message, event.threadID);

        } catch (error) {
            console.error(error);
            api.sendMessage(`╭─⌾⋅ ミ✘.𝙴𝚁𝚁𝙴𝚄𝚁 ⋅⌾──╮\n│\n│   ${applyStyle("𝙴𝚛𝚛𝚎𝚞𝚛 𝚜𝚢𝚜𝚝𝚎𝚖𝚎")}\n│\n╰─────⌾⋅  ⋅⌾─────╯`, event.threadID);
        }
    }
};
