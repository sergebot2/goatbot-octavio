const games = {}
const ADMIN_UID = "61564382117276";

const renderBoard = (board) => {
  const emojis = board.map(cell => cell || "⬜")
  return `
╭────⌾⋅⌾────╮
│
│   ${emojis[0]} ${emojis[1]} ${emojis[2]}
│   ${emojis[3]} ${emojis[4]} ${emojis[5]}
│   ${emojis[6]} ${emojis[7]} ${emojis[8]}
│
╰────⌾⋅⋅⌾────╯`.trim()
}

const checkWinner = (board, symbol) => {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ]
  return winPatterns.some(pattern => pattern.every(index => board[index] === symbol))
}

const getRandomMove = (board) => {
  const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(val => val !== null)
  return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null
}

module.exports = {
  config: {
    name: "tictactoe",
    version: "3.1",
    author: "Messie Osango",
    role: 0,
    shortDescription: "Jeu Tic Tac Toe",
    longDescription: "Jouez au Tic Tac Toe contre l'IA ou un autre joueur",
    category: "game",
    guide: "{prefix}tictactoe [ia|fin|UID1 UID2|UIDadversaire]"
  },

  onStart: async function({ api, event, args }) {
    const { threadID, senderID } = event

    if (!args[0]) {
      return api.sendMessage(`╭────⌾⋅⌾────╮
│
│ Utilisation :
│
│  ╭────⌾⋅⌾────╮
│  │ Vs entre deux joueurs :
│  │ _tictactoe UID1 UID2
│  ╰────⌾⋅⋅⌾────╯
│
│  ╭────⌾⋅⌾────╮
│  │ Solo contre IA :
│  │ _tictactoe ia
│  ╰────⌾⋅⋅⌾────╯
│
│  ╭────⌾⋅⌾────╮
│  │ 1vs1 contre un joueur :
│  │ _tictactoe UIDadversaire
│  ╰────⌾⋅⋅⌾────╯
│
│  ╭────⌾⋅⌾────╮
│  │ Pour finir une partie active :
│  │ _tictactoe fin
│  ╰────⌾⋅⋅⌾────╯
│
╰────⌾⋅⋅⌾────╯`, threadID)
    }

    if (args[0].toLowerCase() === "fin") {
      if (!games[threadID]) return api.sendMessage("❌ Aucune partie en cours", threadID)
      const game = games[threadID]
      if (senderID !== ADMIN_UID && senderID !== game.player1 && senderID !== game.player2) {
        return api.sendMessage("❌ Seuls les joueurs ou l'admin peuvent terminer la partie", threadID)
      }
      delete games[threadID]
      return api.sendMessage("✅ Partie terminée", threadID)
    }

    if (args[0].toLowerCase() === "ia") {
      if (games[threadID]) return api.sendMessage("❌ Partie déjà en cours", threadID)

      const board = Array(9).fill("")
      const player1 = senderID
      const player2 = "ia"

      games[threadID] = {
        board,
        player1,
        player2,
        current: player1,
        playing: true,
        ia: true
      }

      const userInfo = await api.getUserInfo(player1)
      const name = userInfo[player1].name

      return api.sendMessage({
        body: `🎮 ${name} (❌) vs IA (⭕)\n\n${renderBoard(board)}\n\nVotre tour: play [1-9]`,
        mentions: [{ id: player1, tag: name }]
      }, threadID)
    }

    if (args.length >= 2 && !isNaN(args[0])) {
      if (games[threadID]) return api.sendMessage("❌ Partie déjà en cours", threadID)

      const player1 = args[0]
      const player2 = args[1]

      if (player1 === player2) return api.sendMessage("❌ Les joueurs doivent être différents", threadID)

      const board = Array(9).fill("")

      games[threadID] = {
        board,
        player1,
        player2,
        current: player1,
        playing: true,
        ia: false
      }

      const userInfo = await api.getUserInfo([player1, player2])
      const name1 = userInfo[player1]?.name || `Joueur 1 (${player1})`
      const name2 = userInfo[player2]?.name || `Joueur 2 (${player2})`

      return api.sendMessage({
        body: `🎮 ${name1} (❌) vs ${name2} (⭕)\n\n${renderBoard(board)}\n\nTour de ${name1}: play [1-9]`,
        mentions: [{ id: player1, tag: name1 }, { id: player2, tag: name2 }]
      }, threadID)
    }

    if (args.length === 1 && !isNaN(args[0])) {
      if (games[threadID]) return api.sendMessage("❌ Partie déjà en cours", threadID)

      const player1 = senderID
      const player2 = args[0]

      if (player1 === player2) return api.sendMessage("❌ Vous ne pouvez pas jouer contre vous-même", threadID)

      const board = Array(9).fill("")

      games[threadID] = {
        board,
        player1,
        player2,
        current: player1,
        playing: true,
        ia: false
      }

      const userInfo = await api.getUserInfo([player1, player2])
      const name1 = userInfo[player1]?.name || `Joueur 1 (${player1})`
      const name2 = userInfo[player2]?.name || `Joueur 2 (${player2})`

      return api.sendMessage({
        body: `🎮 ${name1} (❌) vs ${name2} (⭕)\n\n${renderBoard(board)}\n\nTour de ${name1}: play [1-9]`,
        mentions: [{ id: player1, tag: name1 }, { id: player2, tag: name2 }]
      }, threadID)
    }

    return api.sendMessage("❌ Format invalide. Utilisez _tictactoe UIDadversaire ou _tictactoe UID1 UID2", threadID)
  },

  onChat: async function({ api, event }) {
    const { threadID, senderID, body, messageID } = event
    const game = games[threadID]
    if (!game || !game.playing) return

    if (body.toLowerCase() === "tictactoe fin") {
      if (senderID !== ADMIN_UID && senderID !== game.player1 && senderID !== game.player2) {
        return
      }
      delete games[threadID]
      return api.sendMessage("✅ Partie terminée", threadID, messageID)
    }

    const move = body.match(/^play\s([1-9])$/i)

    if (!move) {
      if (senderID === game.current) {
        return api.sendMessage("🎯 C'est à ton tour de jouer, nous t'attendons. Utilise : play [1-9]", threadID, messageID)
      }
      return
    }

    if (senderID !== game.current) {
      const userInfo = await api.getUserInfo(game.current)
      const name = userInfo[game.current]?.name || `Joueur (${game.current})`
      return api.sendMessage(`⏳ C'est le tour de ${name}`, threadID, messageID)
    }

    const position = parseInt(move[1]) - 1
    if (game.board[position] !== "") {
      return api.sendMessage("❌ Case déjà occupée", threadID, messageID)
    }

    const symbol = game.current === game.player1 ? "❌" : "⭕"
    game.board[position] = symbol

    if (checkWinner(game.board, symbol)) {
      const userInfo = await api.getUserInfo(game.current)
      const winner = userInfo[game.current]?.name || `Joueur (${game.current})`
      delete games[threadID]
      return api.sendMessage(`🎉 ${winner} a gagné !\n\n${renderBoard(game.board)}`, threadID, messageID)
    }

    if (!game.board.includes("")) {
      delete games[threadID]
      return api.sendMessage(`🤝 Match nul !\n\n${renderBoard(game.board)}`, threadID, messageID)
    }

    if (game.ia) {
      const aiMove = getRandomMove(game.board)
      if (aiMove !== null) {
        game.board[aiMove] = "⭕"

        if (checkWinner(game.board, "⭕")) {
          delete games[threadID]
          return api.sendMessage(`🤖 L'IA a gagné !\n\n${renderBoard(game.board)}`, threadID, messageID)
        }

        if (!game.board.includes("")) {
          delete games[threadID]
          return api.sendMessage(`🤝 Match nul !\n\n${renderBoard(game.board)}`, threadID, messageID)
        }
      }

      game.current = game.player1
      const userInfo = await api.getUserInfo(game.player1)
      const name = userInfo[game.player1]?.name || `Joueur (${game.player1})`

      return api.sendMessage({
        body: `🔴 ${name}, à vous de jouer\n\n${renderBoard(game.board)}`,
        mentions: [{ id: game.player1, tag: name }]
      }, threadID, messageID)
    } else {
      game.current = game.current === game.player1 ? game.player2 : game.player1
      const userInfo = await api.getUserInfo(game.current)
      const name = userInfo[game.current]?.name || `Joueur (${game.current})`

      return api.sendMessage({
        body: `🔵 ${name}, à vous de jouer\n\n${renderBoard(game.board)}`,
        mentions: [{ id: game.current, tag: name }]
      }, threadID, messageID)
    }
  }
        }
