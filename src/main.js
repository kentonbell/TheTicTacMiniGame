/**
 * This file, src/main.js, manages the flow of the game by handling various game-related functionalities.
 * It initializes and updates the game state, renders the game board, and handles user interactions.
 * The game state is stored in the gameState object and is used by functions in game-flow.js to manage the game flow.
 * The game state is updated by functions such as initializeGame, resetGame, updatePlayerNameFields, and updateGameInfo.
 * The showScreen function displays different screens in the game based on the provided screen name.
 * The updatePlayerNameFields function updates the display of player name fields based on the player count.
 * The main.js file also exposes functions globally for use in inline onclick handlers.
 * The initializeGame function initializes the game state and updates the game UI.
 * The resetGame function resets the game state.
 * The selectSquare function starts the corresponding mini-game if the selected square is unplayed.
 * The main.js file sets up event listeners for various buttons and elements in the game UI.
 */
// ==================== IMPORTS ====================
import { gameState } from './game-utils/state.js';
import {
  getTitleCase, showAlert, showHowToPlay, loadDictionaries, getRandomGame
} from './game-utils/index.js';
import { usedGames } from './game-utils/state.js';
import { setupGameFlow, startMiniGame, completeMiniGame, playCPUMove, checkMainGameWinner, isMainGameDraw, showGameOver } from './game-flow.js';

let screens, buttons;

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenName) {
  if (screens[screenName]) {
    Object.values(screens).forEach((screen) => {
      if (screen) screen.classList.add("hidden");
    });
    screens[screenName].classList.remove("hidden");
  }
}

function updatePlayerNameFields() {
  const label2 = document.getElementById("player-name-2-group");
  if (gameState.playerCount === 2) {
    if (label2) label2.style.display = "flex";
    document.querySelector('label[for="player-name"]').textContent = "Player 1 Name";
  } else {
    if (label2) label2.style.display = "none";
    document.querySelector('label[for="player-name"]').textContent = "Your Name";
  }
}

// ==================== GAME SETUP ====================
function initializeGame() {
  gameState.board = Array(gameState.boardSize)
    .fill(null)
    .map(() => Array(gameState.boardSize).fill("N"));
  gameState.currentPlayer = "X";
  gameState.gameStatus = "playing";
  usedGames.clear();
  renderGameBoard();
  updateGameInfo();
}

function resetGame() {
  gameState.scores = { X: 0, O: 0 };
  gameState.board = [];
  gameState.currentPlayer = "X";
  gameState.gameStatus = "playing";
  usedGames.clear();
}

function renderGameBoard() {
  const boardContainer = document.getElementById("game-board");
  boardContainer.innerHTML = "";
  boardContainer.className = `game-board size-${gameState.boardSize}`;

  for (let row = 0; row < gameState.boardSize; row++) {
    for (let col = 0; col < gameState.boardSize; col++) {
      const cell = document.createElement("button");
      cell.className = "board-cell";
      const cellValue = gameState.board[row][col];

      if (cellValue !== "N") {
        cell.classList.add("played");
        cell.textContent = cellValue;
        cell.classList.add(cellValue.toLowerCase());
      } else {
        cell.addEventListener("click", () => {
          if (gameState.gameStatus === "playing") {
            selectSquare(row, col);
          }
        });
      }
      boardContainer.appendChild(cell);
    }
  }
}

function updateGameInfo() {
  const playerName = gameState.playerNames[gameState.currentPlayer];
  const symbol = gameState.currentPlayer;
  
  document.getElementById("current-player-display").textContent = `${symbol}: ${playerName}'s Turn`;

  const symbolEl = document.querySelector(".current-symbol");
  if (symbolEl) {
    symbolEl.textContent = symbol;
    symbolEl.className = `current-symbol ${symbol.toLowerCase()}`;
  }

  //document.getElementById("player-x-score").textContent = gameState.scores.X;
  //document.getElementById("player-o-score").textContent = gameState.scores.O;
  //document.getElementById("player-x-name").textContent = gameState.playerNames.X;
  //document.getElementById("player-o-name").textContent = gameState.playerNames.O;
}

function selectSquare(row, col) {
  if (gameState.board[row][col] === "N") {
    gameState.miniGameRow = row;
    gameState.miniGameCol = col;
    const game = getRandomGame();
    startMiniGame(game);
  }
}

// Expose globally for inline onclick handlers
window.showHowToPlay = showHowToPlay;

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  // Now that DOM is ready, query for elements
  screens = {
    welcome: document.getElementById("welcome-screen"),
    game: document.getElementById("game-screen"),
    miniGame: document.getElementById("mini-game-screen"),
    gameover: document.getElementById("gameover-screen"),
    settings: document.getElementById("settings-screen"),
  };

  buttons = {
    playerCount: document.querySelectorAll(".player-btn"),
    boardSize: document.querySelectorAll(".size-btn"),
    difficulty: document.querySelectorAll(".difficulty-btn"),
  };

  // Setup game flow module with access to main.js functions
  setupGameFlow(showScreen, updateGameInfo, renderGameBoard, selectSquare);

  // Setup event listeners
  buttons.playerCount.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.playerCount.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      gameState.playerCount = parseInt(btn.dataset.players);
      updatePlayerNameFields();
    });
  });

  buttons.boardSize.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.boardSize.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      gameState.boardSize = parseInt(btn.dataset.size);
    });
  });

  buttons.difficulty.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.difficulty.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      gameState.difficulty = parseInt(btn.dataset.difficulty);
    });
  });

  document.getElementById("start-game-btn").addEventListener("click", () => {
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

  document.getElementById("settings-btn")?.addEventListener("click", () => {
    showScreen("settings");
  });

  document.getElementById("settings-btn-welcome")?.addEventListener("click", () => {
    showScreen("settings");
  });

  document.getElementById("back-from-settings")?.addEventListener("click", () => {
    showScreen(gameState.board.length ? "game" : "welcome");
  });

  const quitBtn = document.getElementById("quit-btn");
  if (quitBtn) {
    quitBtn.addEventListener("click", () => {
      // Direct quit flow (no native confirm in some environment)
      showScreen("welcome");
      resetGame();
      showAlert("Quit", "Game ended. Back to main menu.");
    });
  }

  const forfeitBtn = document.getElementById("back-from-minigame");
  if (forfeitBtn) {
    forfeitBtn.addEventListener("click", () => {
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
    });
  }

  document.getElementById("play-again-btn").addEventListener("click", () => {
    resetGame();
    initializeGame();
    showScreen("game");
  });

  document.getElementById("main-menu-btn").addEventListener("click", () => {
    resetGame();
    showScreen("welcome");
  });

  // Set defaults and initialize
  buttons.playerCount[0].click();
  buttons.boardSize[0].click();
  buttons.difficulty[1].click();
  updatePlayerNameFields();
  loadDictionaries();
});
