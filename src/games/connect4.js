// Connect 4 Mini Game

export function initConnect4(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-connect4");
  gameContainer.classList.remove("hidden");

  let board = Array(6)
    .fill(null)
    .map(() => Array(7).fill("N"));
  let currentPlayer = "X";

  function renderConnect4Board() {
    const boardEl = document.getElementById("connect4-board");
    boardEl.innerHTML = "";
    boardEl.style.display = "grid";
    boardEl.style.gridTemplateColumns = "repeat(7, 40px)";
    boardEl.style.gap = "2px";
    boardEl.style.justifyContent = "center";
    boardEl.style.margin = "10px auto";
    boardEl.style.maxHeight = "270px";
    boardEl.style.overflowY = "auto";

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cell = document.createElement("div");
        cell.className = "connect4-cell";
        cell.style.width = "40px";
        cell.style.height = "40px";
        cell.style.borderRadius = "50%";
        cell.style.backgroundColor = board[row][col] === "X" ? "#FF6B6B" : board[row][col] === "O" ? "#4ECDC4" : "#2a2a2a";
        cell.style.border = "2px solid rgba(255,255,255,0.2)";
        boardEl.appendChild(cell);
      }
    }
  }

  window.dropPieceC4 = function (col) {
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === "N") {
        board[row][col] = currentPlayer;
        const winner = checkConnect4Win(board);

        if (winner) {
          renderConnect4Board();
          completeMiniGame(winner === "X");
          return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        const buttons = document.querySelectorAll(".drop-btn");
        buttons.forEach(b => 
          b.style.backgroundColor = currentPlayer === "X" ? "#FF6B6B" : "#4ECDC4"
        );
        renderConnect4Board();
        return;
      }
    }
  };

  const buttons = document.querySelectorAll(".drop-btn");
  buttons.forEach((b, i) => {
    b.style.backgroundColor = "#FF6B6B";
    b.onclick = () => window.dropPieceC4(i);
  });
  renderConnect4Board();
}

function checkConnect4Win(board) {
  const rows = board.length;
  const cols = board[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 3; col++) {
      if (
        board[row][col] !== "N" &&
        board[row][col] === board[row][col + 1] &&
        board[row][col] === board[row][col + 2] &&
        board[row][col] === board[row][col + 3]
      ) {
        return board[row][col];
      }
    }
  }

  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols; col++) {
      if (
        board[row][col] !== "N" &&
        board[row][col] === board[row + 1][col] &&
        board[row][col] === board[row + 2][col] &&
        board[row][col] === board[row + 3][col]
      ) {
        return board[row][col];
      }
    }
  }

  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols - 3; col++) {
      if (
        board[row][col] !== "N" &&
        board[row][col] === board[row + 1][col + 1] &&
        board[row][col] === board[row + 2][col + 2] &&
        board[row][col] === board[row + 3][col + 3]
      ) {
        return board[row][col];
      }
    }
  }

  for (let row = 0; row < rows - 3; row++) {
    for (let col = 3; col < cols; col++) {
      if (
        board[row][col] !== "N" &&
        board[row][col] === board[row + 1][col - 1] &&
        board[row][col] === board[row + 2][col - 2] &&
        board[row][col] === board[row + 3][col - 3]
      ) {
        return board[row][col];
      }
    }
  }

  return null;
}
