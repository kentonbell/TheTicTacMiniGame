// ==================== GAME FLOW MANAGEMENT ====================

import { gameState } from './game-utils/state.js';
import {
  initMiniTicTacToe, initWordle, initGeography, initWordScramble,
  initMath, initDotsAndBoxes, initConnect4, initAnagrams,
  initSpellingBee, initHigherLower, initGuessNumber, initCoinFlip,
  initBoggle, initFiller,
  getTitleCase, showHowToPlay
} from './game-utils/index.js';

// These functions will be called from main.js and need access to its functions
// We'll pass them in through a setup function
let showScreen, updateGameInfo, renderGameBoard, selectSquare;

export function setupGameFlow(screenFn, infoFn, boardFn, squareFn) {
  showScreen = screenFn;
  updateGameInfo = infoFn;
  renderGameBoard = boardFn;
  selectSquare = squareFn;
}

export function startMiniGame(gameType) {
  gameState.activeMiniGame = gameType;
  document.getElementById("mini-game-title").textContent = getTitleCase(gameType);

  const infoContainer = document.getElementById("mini-game-info");
  infoContainer.innerHTML = `<button class="info-btn" onclick="window.showHowToPlay('${gameType}')">ℹ️</button>`;

  document.querySelectorAll(".mini-game").forEach((game) => game.classList.add("hidden"));
  document.querySelectorAll(".mini-game input, .mini-game select").forEach(el => {
    el.value = "";
    el.disabled = false;
  });
  document.querySelectorAll(".mini-game button").forEach(btn => {
    btn.disabled = false;
  });

  switch (gameType) {
    case "tictactoe": initMiniTicTacToe(completeMiniGame); break;
    case "wordle": initWordle(completeMiniGame); break;
    case "geography": initGeography(completeMiniGame); break;
    case "wordscramble": initWordScramble(completeMiniGame); break;
    case "math": initMath(completeMiniGame); break;
    case "dotsboxes": initDotsAndBoxes(completeMiniGame); break;
    case "connect4": initConnect4(completeMiniGame); break;
    case "anagrams": initAnagrams(completeMiniGame); break;
    case "spellingbee": initSpellingBee(completeMiniGame); break;
    case "higherlow": initHigherLower(completeMiniGame); break;
    case "guessnumber": initGuessNumber(completeMiniGame); break;
    case "coinflip": initCoinFlip(completeMiniGame); break;
    case "boggle": initBoggle(completeMiniGame); break;
    case "filler": initFiller(completeMiniGame); break;
  }

  showScreen("miniGame");
}

export function completeMiniGame(won) {
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

    gameState.currentPlayer = gameState.playerCount === 1 ? "X" : opponent;
    updateGameInfo();
    renderGameBoard();
    showScreen("game");
  }
}

export function playCPUMove() {
  const emptySquares = [];
  for (let row = 0; row < gameState.boardSize; row++) {
    for (let col = 0; col < gameState.boardSize; col++) {
      if (gameState.board[row][col] === "N") {
        emptySquares.push([row, col]);
      }
    }
  }

  if (emptySquares.length === 0) {
    if (isMainGameDraw()) {
      gameState.gameStatus = "Draw!";
      showGameOver(null);
    }
    return;
  }

  const [row, col] = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  gameState.miniGameRow = row;
  gameState.miniGameCol = col;
  gameState.board[row][col] = "O";
  gameState.scores.O++;

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

  gameState.currentPlayer = "X";
  updateGameInfo();
  renderGameBoard();
  showScreen("game");
}

export function checkMainGameWinner() {
  const size = gameState.boardSize;

  for (let row = 0; row < size; row++) {
    if (gameState.board[row][0] !== "N" &&
      gameState.board[row].every((cell) => cell === gameState.board[row][0])) {
      return gameState.board[row][0];
    }
  }

  for (let col = 0; col < size; col++) {
    if (gameState.board[0][col] !== "N" &&
      gameState.board.every((row) => row[col] === gameState.board[0][col])) {
      return gameState.board[0][col];
    }
  }

  if (gameState.board[0][0] !== "N" &&
    gameState.board.every((_, i) => gameState.board[i][i] === gameState.board[0][0])) {
    return gameState.board[0][0];
  }

  if (gameState.board[0][gameState.boardSize - 1] !== "N" &&
    gameState.board.every((_, i) => gameState.board[i][gameState.boardSize - 1 - i] === gameState.board[0][gameState.boardSize - 1])) {
    return gameState.board[0][gameState.boardSize - 1];
  }

  return null;
}

export function isMainGameDraw() {
  return gameState.board.every((row) => row.every((cell) => cell !== "N"));
}

export function showGameOver(winner) {
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
