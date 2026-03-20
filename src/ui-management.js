// ==================== UI MANAGEMENT ====================

import { gameState } from './game-utils/state.js';
import { initializeGame, resetGame, updateGameInfo, renderGameBoard } from './game-board.js';
import { loadDictionaries, showAlert } from './game-utils/index.js';

// ==================== UI ELEMENTS ====================
let screens = null;
let buttons = null;

function getScreens() {
  if (!screens) {
    screens = {
      welcome: document.getElementById("welcome-screen"),
      game: document.getElementById("game-screen"),
      miniGame: document.getElementById("mini-game-screen"),
      gameover: document.getElementById("gameover-screen"),
      settings: document.getElementById("settings-screen"),
    };
  }
  return screens;
}

function getButtons() {
  if (!buttons) {
    buttons = {
      playerCount: document.querySelectorAll(".player-btn"),
      boardSize: document.querySelectorAll(".size-btn"),
      difficulty: document.querySelectorAll(".difficulty-btn"),
    };
  }
  return buttons;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Get fresh button references
  const playerButtons = document.querySelectorAll(".player-btn");
  const boardButtons = document.querySelectorAll(".size-btn");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  // Setup button group event listeners
  playerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      playerButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      gameState.playerCount = parseInt(btn.dataset.players);
      updatePlayerNameFields();
    });
  });

  boardButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      boardButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      gameState.boardSize = parseInt(btn.dataset.size);
    });
  });

  difficultyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      difficultyButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      gameState.difficulty = parseInt(btn.dataset.difficulty);
    });
  });

  // Setup other UI event listeners
  const startGameBtn = document.getElementById("start-game-btn");
  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
      const playerName = document.getElementById("player-name").value || "Player 1";
      gameState.playerNames.X = playerName;
      if (gameState.playerCount === 2) {
        const player2Name = document.getElementById("player-name-2")?.value || "Player 2";
        gameState.playerNames.O = player2Name;
      } else {
        gameState.playerNames.O = "CPU";
      }
      initializeGame();
      showScreen("game");
    });
  }

  const settingsBtn = document.getElementById("settings-btn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      showScreen("settings");
    });
  }

  const backFromSettingsBtn = document.getElementById("back-from-settings");
  if (backFromSettingsBtn) {
    backFromSettingsBtn.addEventListener("click", () => {
      showScreen("game");
    });
  }

  const quitBtn = document.getElementById("quit-btn");
  if (quitBtn) {
    quitBtn.addEventListener("click", () => {
      showScreen("welcome");
      resetGame();
      showAlert("Quit", "Game ended. Back to main menu.");
    });
  }

  const backFromMinigameBtn = document.getElementById("back-from-minigame");
  if (backFromMinigameBtn) {
    backFromMinigameBtn.addEventListener("click", () => {
      const opponent = gameState.currentPlayer === "X" ? "O" : "X";
      if (typeof gameState.miniGameRow !== "number" || typeof gameState.miniGameCol !== "number") {
        showAlert("Forfeit", "Cannot forfeit because no active mini-game coordinate is set.");
        return;
      }

      gameState.board[gameState.miniGameRow][gameState.miniGameCol] = opponent;
      gameState.scores[opponent]++;

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

      gameState.currentPlayer = gameState.playerCount === 1 ? "X" : opponent;
      updateGameInfo();
      renderGameBoard();
      showScreen("game");
      showAlert("Forfeit", "You forfeited this mini-game. Opponent takes the square.");
      // miniGameState = null; // This is handled in mini-game-management.js
    });
  }

  const playAgainBtn = document.getElementById("play-again-btn");
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      resetGame();
      initializeGame();
      showScreen("game");
    });
  }

  const mainMenuBtn = document.getElementById("main-menu-btn");
  if (mainMenuBtn) {
    mainMenuBtn.addEventListener("click", () => {
      resetGame();
      showScreen("welcome");
    });
  }
}

// ==================== SCREEN MANAGEMENT ====================
export function showScreen(screenName) {
  const scrns = getScreens();
  if (scrns[screenName]) {
    Object.values(scrns).forEach((screen) => {
      if (screen) screen.classList.add("hidden");
    });
    scrns[screenName].classList.remove("hidden");
  }
}

export function updatePlayerNameFields() {
  const label2 = document.getElementById("player-name-2-group");
  if (gameState.playerCount === 2) {
    if (label2) label2.style.display = "flex";
    document.querySelector('label[for="player-name"]').textContent = "Player 1 Name";
  } else {
    if (label2) label2.style.display = "none";
    document.querySelector('label[for="player-name"]').textContent = "Your Name";
  }
}

export function initializeDefaultSettings() {
  // Setup event listeners first
  setupEventListeners();

  // Get buttons fresh for default clicks
  const playerButtons = document.querySelectorAll(".player-btn");
  const boardButtons = document.querySelectorAll(".size-btn");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  // Set default selections
  if (playerButtons.length > 0) playerButtons[0].click();
  if (boardButtons.length > 0) boardButtons[0].click();
  if (difficultyButtons.length > 1) difficultyButtons[1].click();

  updatePlayerNameFields();
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

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  buttons.playerCount[0].click();
  buttons.boardSize[0].click();
  buttons.difficulty[1].click();
  updatePlayerNameFields();
  loadDictionaries();
});