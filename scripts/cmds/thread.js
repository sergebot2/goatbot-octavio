const { getTime } = global.utils;

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
    name: "thread",
    version: "1.6",
    author: "Messie Osango",
    countDown: 5,
    role: 0,
    description: {
      en: applyFont("Manage group chat in bot system")
    },
    category: "owner",
    guide: {
      en: `╭─⌾${applyFont("USAGE")}⋅⌾──╮
│
│ ${applyFont("{pn} [find | -f | search | -s] <name>")}
│ ${applyFont("Search groups in bot data")}
│
│ ${applyFont("{pn} [ban | -b] [<tid>] <reason>")}
│ ${applyFont("Ban group from using bot")}
│
│ ${applyFont("{pn} [unban | -u] [<tid>]")}
│ ${applyFont("Unban group")}
│
│ ${applyFont("{pn} [info | -i] [<tid>]")}
│ ${applyFont("View group info")}
│
╰─────────────⌾`
    }
  },

  langs: {
    en: {
      noPermission: `╭─⌾${applyFont("ERROR")}⋅⌾──╮\n│\n│ ${applyFont("You don't have permission")}\n│\n╰─────────────⌾`,
      found: `╭─⌾${applyFont("RESULT")}⋅⌾──╮\n│\n│ 🔎 ${applyFont("Found")} %1 ${applyFont("groups matching")} "%2"\n│\n%3\n╰─────────────⌾`,
      notFound: `╭─⌾${applyFont("NOT FOUND")}⋅⌾──╮\n│\n│ ❌ ${applyFont("No group found matching")} "%1"\n│\n╰─────────────⌾`,
      hasBanned: `╭─⌾${applyFont("BANNED")}⋅⌾──╮\n│\n│ ${applyFont("Group")} [%1 | %2]\n│ ${applyFont("Already banned")}\n│\n│ ${applyFont("Reason")}: %3\n│ ${applyFont("Time")}: %4\n│\n╰─────────────⌾`,
      banned: `╭─⌾${applyFont("BANNED")}⋅⌾──╮\n│\n│ ${applyFont("Group")} [%1 | %2]\n│ ${applyFont("Now banned")}\n│\n│ ${applyFont("Reason")}: %3\n│ ${applyFont("Time")}: %4\n│\n╰─────────────⌾`,
      notBanned: `╭─⌾${applyFont("NOT BANNED")}⋅⌾──╮\n│\n│ ${applyFont("Group")} [%1 | %2]\n│ ${applyFont("Not banned")}\n│\n╰─────────────⌾`,
      unbanned: `╭─⌾${applyFont("UNBANNED")}⋅⌾──╮\n│\n│ ${applyFont("Group")} [%1 | %2]\n│ ${applyFont("Now unbanned")}\n│\n╰─────────────⌾`,
      missingReason: `╭─⌾${applyFont("ERROR")}⋅⌾──╮\n│\n│ ${applyFont("Please provide a ban reason")}\n│\n╰─────────────⌾`,
      info: `╭─⌾${applyFont("GROUP INFO")}⋅⌾──╮
│
│ ${applyFont("ID")}: %1
│ ${applyFont("Name")}: %2
│ ${applyFont("Created")}: %3
│
│ ${applyFont("Members")}: %4
│ ${applyFont("Male")}: %5
│ ${applyFont("Female")}: %6
│
│ ${applyFont("Total messages")}: %7
%8
╰─────────────⌾`
    }
  },

  onStart: async function ({ args, threadsData, message, role, event, getLang }) {
    const type = args[0];

    const formatThreadInfo = (thread) => {
      return `╭─⌾${applyFont("THREAD")}⋅⌾──╮\n│\n│ ${applyFont("Name")}: ${thread.threadName}\n│ ${applyFont("ID")}: ${thread.threadID}\n│\n╰─────────────⌾`;
    };

    switch (type) {
      case "find":
      case "search":
      case "-f":
      case "-s": {
        if (role < 2)
          return message.reply(getLang("noPermission"));
        
        let allThread = await threadsData.getAll();
        let keyword = args.slice(1).join(" ");
        
        if (['-j', '-join'].includes(args[1])) {
          allThread = allThread.filter(thread => 
            thread.members.some(member => 
              member.userID == global.GoatBot.botID && member.inGroup
            )
          );
          keyword = args.slice(2).join(" ");
        }

        const result = allThread.filter(item => 
          item.threadID.length > 15 && 
          (item.threadName || "").toLowerCase().includes(keyword.toLowerCase())
        );

        const resultText = result.map(thread => formatThreadInfo(thread)).join("\n");
        
        if (result.length > 0)
          return message.reply(getLang("found", result.length, keyword, resultText));
        else
          return message.reply(getLang("notFound", keyword));
      }

      case "ban":
      case "-b": {
        if (role < 2)
          return message.reply(getLang("noPermission"));
        
        let tid, reason;
        if (!isNaN(args[1])) {
          tid = args[1];
          reason = args.slice(2).join(" ");
        }
        else {
          tid = event.threadID;
          reason = args.slice(1).join(" ");
        }

        if (!tid) return message.SyntaxError();
        if (!reason) return message.reply(getLang("missingReason"));

        reason = reason.replace(/\s+/g, ' ');
        const threadData = await threadsData.get(tid);
        const name = threadData.threadName;
        const status = threadData.banned.status;

        if (status)
          return message.reply(getLang("hasBanned", tid, name, threadData.banned.reason, threadData.banned.date));

        const time = getTime("DD/MM/YYYY HH:mm:ss");
        await threadsData.set(tid, {
          banned: {
            status: true,
            reason,
            date: time
          }
        });
        return message.reply(getLang("banned", tid, name, reason, time));
      }

      case "unban":
      case "-u": {
        if (role < 2)
          return message.reply(getLang("noPermission"));
        
        let tid;
        if (!isNaN(args[1]))
          tid = args[1];
        else
          tid = event.threadID;
        
        if (!tid) return message.SyntaxError();

        const threadData = await threadsData.get(tid);
        const name = threadData.threadName;
        const status = threadData.banned.status;

        if (!status)
          return message.reply(getLang("notBanned", tid, name));

        await threadsData.set(tid, {
          banned: {}
        });
        return message.reply(getLang("unbanned", tid, name));
      }

      case "info":
      case "-i": {
        let tid;
        if (!isNaN(args[1]))
          tid = args[1];
        else
          tid = event.threadID;
        
        if (!tid) return message.SyntaxError();

        const threadData = await threadsData.get(tid);
        const createdDate = getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss");
        const valuesMember = Object.values(threadData.members).filter(item => item.inGroup);
        const totalBoy = valuesMember.filter(item => item.gender == "MALE").length;
        const totalGirl = valuesMember.filter(item => item.gender == "FEMALE").length;
        const totalMessage = valuesMember.reduce((i, item) => i += item.count, 0);
        
        const infoBanned = threadData.banned.status ?
          `\n│ ${applyFont("Banned")}: ✅\n│ ${applyFont("Reason")}: ${threadData.banned.reason}\n│ ${applyFont("Date")}: ${threadData.banned.date}` :
          `\n│ ${applyFont("Banned")}: ❌`;

        return message.reply(getLang("info", 
          threadData.threadID, 
          threadData.threadName, 
          createdDate, 
          valuesMember.length, 
          totalBoy, 
          totalGirl, 
          totalMessage, 
          infoBanned
        ));
      }

      default:
        return message.SyntaxError();
    }
  }
};
