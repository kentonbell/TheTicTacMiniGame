// ==================== GAME STATE ====================

export let gameState = {
  playerCount: 1,
  boardSize: 3,
  difficulty: 2,
  playerNames: { X: "Player 1", O: "CPU" },
  currentPlayer: "X",
  board: [],
  scores: { X: 0, O: 0 },
  gameStatus: "playing",
  activeMiniGame: null,
  miniGameRow: -1,
  miniGameCol: -1,
};

export let miniGameState = null;
export let dictionaries = {};

export const gameList = [
  "tictactoe", "wordle", "geography", "wordscramble", "math", 
  "dotsboxes", "connect4", "spellingbee", "higherlow", "guessnumber", 
  "coinflip", "boggle", "anagrams", "filler"
];

export let usedGames = new Set();

export function resetGameState() {
  gameState = {
    playerCount: 1,
    boardSize: 3,
    difficulty: 2,
    playerNames: { X: "Player 1", O: "CPU" },
    currentPlayer: "X",
    board: [],
    scores: { X: 0, O: 0 },
    gameStatus: "playing",
    activeMiniGame: null,
    miniGameRow: -1,
    miniGameCol: -1,
  };
  miniGameState = null;
  usedGames.clear();
}

export function getRandomGame() {
  let availableGames = gameList.filter(g => !usedGames.has(g));
  if (availableGames.length === 0) {
    usedGames.clear();
    availableGames = gameList;
  }
  const game = availableGames[Math.floor(Math.random() * availableGames.length)];
  usedGames.add(game);
  return game;
}
