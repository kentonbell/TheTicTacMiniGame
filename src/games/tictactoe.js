// Tic-Tac-Toe Mini Game

import { checkMiniWinner, isMiniBoardFull } from './utils.js';

export function initMiniTicTacToe(completeMiniGame) {
  const boardElement = document.getElementById("mini-board-tictactoe");
  const gameContainer = document.getElementById("minigame-tictactoe");
  gameContainer.classList.remove("hidden");

  let miniBoard = Array(3)
    .fill(null)
    .map(() => Array(3).fill("N"));
  let miniCurrent = "X";

  renderMiniBoard();

  function renderMiniBoard() {
    boardElement.innerHTML = "";
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = document.createElement("button");
        cell.className = "mini-cell";
        const cellValue = miniBoard[row][col];

        if (cellValue !== "N") {
          cell.classList.add("played");
          cell.textContent = cellValue;
          cell.classList.add(cellValue.toLowerCase());
        }

        if (cellValue === "N") {
          cell.addEventListener("click", () => handleMiniBoardClick(row, col));
        }
        boardElement.appendChild(cell);
      }
    }
  }

  function handleMiniBoardClick(row, col) {
    if (miniBoard[row][col] === "N") {
      miniBoard[row][col] = miniCurrent;
      const winner = checkMiniWinner(miniBoard);

      if (winner) {
        completeMiniGame(winner === "X");
        return;
      }

      if (isMiniBoardFull(miniBoard)) {
        completeMiniGame(false);
        return;
      }

      miniCurrent = miniCurrent === "X" ? "O" : "X";
      renderMiniBoard();
    }
  }
}
