// Tic-Tac-Toe Mini Game

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

function checkMiniWinner(board) {
  for (let row of board) {
    if (row[0] !== "N" && row.every((cell) => cell === row[0])) return row[0];
  }

  for (let col = 0; col < 3; col++) {
    if (
      board[0][col] !== "N" &&
      board.every((row) => row[col] === board[0][col])
    )
      return board[0][col];
  }

  if (
    board[0][0] !== "N" &&
    board.every((_, i) => board[i][i] === board[0][0])
  )
    return board[0][0];

  if (
    board[0][2] !== "N" &&
    board.every((_, i) => board[i][2 - i] === board[0][2])
  )
    return board[0][2];

  return null;
}

function isMiniBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== "N"));
}
