// ==================== GAME BOARD MANAGEMENT ====================

import { gameState, usedGames } from './game-utils/state.js';
import { selectSquare } from './mini-game-management.js';

let miniGameState = null;

// ==================== GAME INITIALIZATION ====================
export function initializeGame() {
  gameState.board = Array(gameState.boardSize)
    .fill(null)
    .map(() => Array(gameState.boardSize).fill("N"));
  gameState.currentPlayer = "X";
  gameState.gameStatus = "playing";
  usedGames.clear();
  renderGameBoard();
  updateGameInfo();
}

export function resetGame() {
  gameState.scores = { X: 0, O: 0 };
  gameState.board = [];
  gameState.currentPlayer = "X";
  gameState.gameStatus = "playing";
  miniGameState = null;
  usedGames.clear();
}

// ==================== GAME RENDERING ====================
export function renderGameBoard() {
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

export function updateGameInfo() {
  const playerName = gameState.playerNames[gameState.currentPlayer];
  const symbol = gameState.currentPlayer;

  document.getElementById("current-player-display").textContent = `${symbol}: ${playerName}'s Turn`;

  const symbolEl = document.querySelector(".current-symbol");
  if (symbolEl) {
    symbolEl.textContent = symbol;
    symbolEl.className = `current-symbol ${symbol.toLowerCase()}`;
  }

  document.getElementById("player-x-score").textContent = gameState.scores.X;
  document.getElementById("player-o-score").textContent = gameState.scores.O;
  document.getElementById("player-x-name").textContent = gameState.playerNames.X;
  document.getElementById("player-o-name").textContent = gameState.playerNames.O;
}