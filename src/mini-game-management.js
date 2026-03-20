// ==================== MINI-GAME MANAGEMENT ====================

import {
  initMiniTicTacToe, initWordle, initGeography, initWordScramble,
  initMath, initDotsAndBoxes, initConnect4, initAnagrams,
  initSpellingBee, initHigherLower, initGuessNumber, initCoinFlip,
  initBoggle, initFiller,
  getTitleCase, showHowToPlay
} from './game-utils/index.js';
import { gameState, getRandomGame } from './game-utils/state.js';

let miniGameState = null;

// ==================== SQUARE SELECTION ====================
export function selectSquare(row, col) {
  if (gameState.board[row][col] === "N") {
    gameState.miniGameRow = row;
    gameState.miniGameCol = col;
    const game = getRandomGame();
    startMiniGame(game);
  }
}

// ==================== MINI-GAME MANAGEMENT ====================
export function startMiniGame(gameType) {
  gameState.activeMiniGame = gameType;
  document.getElementById("mini-game-title").textContent = getTitleCase(gameType);

  const infoContainer = document.getElementById("mini-game-info");
  infoContainer.innerHTML = `<button class="info-btn" onclick="showHowToPlay('${gameType}')">ℹ️</button>`;

  document.querySelectorAll(".mini-game").forEach((game) => game.classList.add("hidden"));

  // Reset all mini-games
  document.querySelectorAll(".mini-game input, .mini-game select").forEach(el => {
    el.value = "";
    el.disabled = false;
  });
  document.querySelectorAll(".mini-game button").forEach(btn => {
    btn.disabled = false;
  });

  switch (gameType) {
    case "tictactoe":
      initMiniTicTacToe(completeMiniGame);
      break;
    case "wordle":
      initWordle(completeMiniGame);
      break;
    case "geography":
      initGeography(completeMiniGame);
      break;
    case "wordscramble":
      initWordScramble(completeMiniGame);
      break;
    case "math":
      initMath(completeMiniGame);
      break;
    case "dotsboxes":
      initDotsAndBoxes(completeMiniGame);
      break;
    case "connect4":
      initConnect4(completeMiniGame);
      break;
    case "spellingbee":
      initSpellingBee(completeMiniGame);
      break;
    case "higherlow":
      initHigherLower(completeMiniGame);
      break;
    case "guessnumber":
      initGuessNumber(completeMiniGame);
      break;
    case "coinflip":
      initCoinFlip(completeMiniGame);
      break;
    case "boggle":
      initBoggle(completeMiniGame);
      break;
    case "anagrams":
      initAnagrams(completeMiniGame);
      break;
    case "filler":
      initFiller(completeMiniGame);
      break;
  }

  showScreen("miniGame");
}

// ==================== MINI-GAME COMPLETION ====================
function completeMiniGame(won) {
  if (won) {
    gameState.board[gameState.miniGameRow][gameState.miniGameCol] = gameState.currentPlayer;
    gameState.scores[gameState.currentPlayer]++;

    const winner = checkMainGameWinner();
    if (winner) {
      gameState.gameStatus = `${gameState.playerNames[winner]} won!`;
      showGameOver(winner);
      return;
    }

    if (isMainGameDraw()) {
      gameState.gameStatus = "Draw!";
      showGameOver(null);
      return;
    }

    if (gameState.playerCount === 1) {
      gameState.currentPlayer = "O";
      updateGameInfo();
      renderGameBoard();
      showScreen("game");
      setTimeout(playCPUMove, 1500);
    } else {
      gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
      updateGameInfo();
      renderGameBoard();
      showScreen("game");
    }
  } else {
    const opponent = gameState.currentPlayer === "X" ? "O" : "X";
    gameState.board[gameState.miniGameRow][gameState.miniGameCol] = opponent;
    gameState.scores[opponent]++;

    const winner = checkMainGameWinner();
    if (winner) {
      gameState.gameStatus = `${gameState.playerNames[winner]} won!`;
      showGameOver(winner);
      return;
    }

    gameState.currentPlayer = opponent;
    updateGameInfo();
    renderGameBoard();
    showScreen("game");
  }

  miniGameState = null;
}

function playCPUMove() {
  const emptySquares = [];
  for (let row = 0; row < gameState.boardSize; row++) {
    for (let col = 0; col < gameState.boardSize; col++) {
      if (gameState.board[row][col] === "N") {
        emptySquares.push([row, col]);
      }
    }
  }

  if (emptySquares.length > 0) {
    const [row, col] = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    gameState.currentPlayer = "O";
    selectSquare(row, col);
  }
}

function checkMainGameWinner() {
  const size = gameState.boardSize;

  for (let row = 0; row < size; row++) {
    if (
      gameState.board[row][0] !== "N" &&
      gameState.board[row].every((cell) => cell === gameState.board[row][0])
    ) {
      return gameState.board[row][0];
    }
  }

  for (let col = 0; col < size; col++) {
    if (
      gameState.board[0][col] !== "N" &&
      gameState.board.every((row) => row[col] === gameState.board[0][col])
    ) {
      return gameState.board[0][col];
    }
  }

  if (
    gameState.board[0][0] !== "N" &&
    gameState.board.every((_, i) => gameState.board[i][i] === gameState.board[0][0])
  ) {
    return gameState.board[0][0];
  }

  if (
    gameState.board[0][size - 1] !== "N" &&
    gameState.board.every(
      (_, i) =>
        gameState.board[i][size - 1 - i] === gameState.board[0][size - 1]
    )
  ) {
    return gameState.board[0][size - 1];
  }

  return null;
}

function isMainGameDraw() {
  return gameState.board.every((row) =>
    row.every((cell) => cell !== "N")
  );
}

function showGameOver(winner) {
  const titleEl = document.getElementById("gameover-title");
  const winnerEl = document.getElementById("gameover-winner");
  const finalXScore = document.getElementById("final-x-score");
  const finalOScore = document.getElementById("final-o-score");
  const finalXName = document.getElementById("final-x-name");
  const finalOName = document.getElementById("final-o-name");

  finalXName.textContent = gameState.playerNames.X;
  finalOName.textContent = gameState.playerNames.O;
  finalXScore.textContent = gameState.scores.X;
  finalOScore.textContent = gameState.scores.O;

  if (winner) {
    titleEl.textContent = "Game Over!";
    winnerEl.textContent = `${gameState.playerNames[winner]} wins! 🎉`;
  } else {
    titleEl.textContent = "Draw!";
    winnerEl.textContent = "The game is a tie!";
  }

  showScreen("gameover");
}

// Import showScreen and other UI functions
import { showScreen, updateGameInfo, renderGameBoard } from './ui-management.js';