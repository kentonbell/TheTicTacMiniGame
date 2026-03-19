const { invoke } = window.__TAURI__.core;

// ==================== GAME STATE ====================
let gameState = {
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

let miniGameState = null;

// ==================== UI ELEMENTS ====================
const screens = {
  welcome: document.getElementById("welcome-screen"),
  game: document.getElementById("game-screen"),
  miniGame: document.getElementById("mini-game-screen"),
  gameover: document.getElementById("gameover-screen"),
};

const buttons = {
  playerCount: document.querySelectorAll(".player-btn"),
  boardSize: document.querySelectorAll(".size-btn"),
  difficulty: document.querySelectorAll(".difficulty-btn"),
};

// ==================== EVENT LISTENERS ====================

// Player count selection
buttons.playerCount.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.playerCount.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    gameState.playerCount = parseInt(btn.dataset.players);
    updatePlayerNames();
  });
});

// Board size selection
buttons.boardSize.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.boardSize.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    gameState.boardSize = parseInt(btn.dataset.size);
  });
});

// Difficulty selection
buttons.difficulty.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.difficulty.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    gameState.difficulty = parseInt(btn.dataset.difficulty);
  });
});

// Start game
document.getElementById("start-game-btn").addEventListener("click", () => {
  const playerName = document.getElementById("player-name").value || "Player 1";
  gameState.playerNames.X = playerName;
  if (gameState.playerCount === 2) {
    gameState.playerNames.O = "Player 2";
  } else {
    gameState.playerNames.O = "CPU";
  }
  initializeGame();
  showScreen("game");
});

// Quit game
document.getElementById("quit-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to quit?")) {
    showScreen("welcome");
    resetGame();
  }
});

// Back from mini-game
document.getElementById("back-from-minigame").addEventListener("click", () => {
  showScreen("game");
  miniGameState = null;
});

// Play again
document.getElementById("play-again-btn").addEventListener("click", () => {
  resetGame();
  initializeGame();
  showScreen("game");
});

// Main menu from game over
document.getElementById("main-menu-btn").addEventListener("click", () => {
  resetGame();
  showScreen("welcome");
});

// ==================== SCREEN MANAGEMENT ====================

function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
  screens[screenName].classList.remove("hidden");
}

// ==================== GAME INITIALIZATION ====================

function initializeGame() {
  gameState.board = Array(gameState.boardSize)
    .fill(null)
    .map(() => Array(gameState.boardSize).fill("N"));
  gameState.currentPlayer = "X";
  gameState.gameStatus = "playing";
  renderGameBoard();
  updateGameInfo();
}

function resetGame() {
  gameState.scores = { X: 0, O: 0 };
  gameState.board = [];
  gameState.currentPlayer = "X";
  gameState.gameStatus = "playing";
  miniGameState = null;
}

// ==================== GAME RENDERING ====================

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
      }

      cell.addEventListener("click", () => {
        if (cellValue === "N" && gameState.gameStatus === "playing") {
          selectSquare(row, col);
        }
      });

      boardContainer.appendChild(cell);
    }
  }
}

function updateGameInfo() {
  const playerName = gameState.playerNames[gameState.currentPlayer];
  document.getElementById("current-player-display").textContent = playerName;

  const symbol = document.querySelector(".current-symbol");
  symbol.textContent = gameState.currentPlayer;
  symbol.className = `current-symbol ${gameState.currentPlayer.toLowerCase()}`;

  document.getElementById("player-x-score").textContent = gameState.scores.X;
  document.getElementById("player-o-score").textContent = gameState.scores.O;
  document.getElementById("player-x-name").textContent =
    gameState.playerNames.X;
  document.getElementById("player-o-name").textContent =
    gameState.playerNames.O;

  document.getElementById("game-status-text").textContent =
    gameState.gameStatus === "playing"
      ? "Choose a square to play a mini-game!"
      : gameState.gameStatus;
}

// ==================== SQUARE SELECTION ====================

function selectSquare(row, col) {
  if (gameState.board[row][col] === "N") {
    gameState.miniGameRow = row;
    gameState.miniGameCol = col;

    // Randomly select a mini-game
    const games = [
      "tictactoe",
      "wordle",
      "geography",
      "wordscramble",
      "math",
      "trivia",
      "dotsboxes",
      "connect4",
    ];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    startMiniGame(randomGame);
  }
}

// ==================== MINI-GAME MANAGEMENT ====================

async function startMiniGame(gameType) {
  gameState.activeMiniGame = gameType;
  document.getElementById("mini-game-title").textContent = getTitleCase(
    gameType
  );

  // Clear all mini-games first
  document
    .querySelectorAll(".mini-game")
    .forEach((game) => game.classList.add("hidden"));

  // Initialize the selected mini-game
  switch (gameType) {
    case "tictactoe":
      initMiniTicTacToe();
      break;
    case "wordle":
      initWordle();
      break;
    case "geography":
      initGeography();
      break;
    case "wordscramble":
      initWordScramble();
      break;
    case "math":
      initMath();
      break;
    case "trivia":
      initTrivia();
      break;
    case "dotsboxes":
      initDotsAndBoxes();
      break;
    case "connect4":
      initConnect4();
      break;
  }

  showScreen("miniGame");
}

function getTitleCase(str) {
  return str
    .split(/(?=[A-Z])|(?=\d)/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ==================== MINI-GAME: TIC-TAC-TOE ====================

function initMiniTicTacToe() {
  const boardElement = document.getElementById("mini-board-tictactoe");
  const gameContainer = document.getElementById("minigame-tictactoe");
  gameContainer.classList.remove("hidden");

  let miniBoard = Array(3)
    .fill(null)
    .map(() => Array(3).fill("N"));
  let miniCurrent = "X";

  boardElement.innerHTML = "";
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

        cell.addEventListener("click", () => handleMiniBoardClick(row, col));
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
  const size = 3;

  for (let row of board) {
    if (row[0] !== "N" && row.every((cell) => cell === row[0])) return row[0];
  }

  for (let col = 0; col < size; col++) {
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

// ==================== MINI-GAME: WORDLE ====================

function initWordle() {
  const gameContainer = document.getElementById("minigame-wordle");
  gameContainer.classList.remove("hidden");

  const words = [
    "SWIFT",
    "TAURI",
    "HELLO",
    "WORLD",
    "RUST",
    "GAMES",
    "MUSIC",
    "DANCE",
    "PAINT",
    "BUILD",
    "SOLVE",
    "THINK",
    "LEARN",
    "CHESS",
    "APPLE",
  ];
  const targetWord = words[Math.floor(Math.random() * words.length)];
  let attemptsLeft = 8 - gameState.difficulty;

  const inputEl = document.getElementById("wordle-input");
  const submitBtn = document.getElementById("wordle-submit");
  const feedbackEl = document.getElementById("wordle-feedback");
  const statusEl = document.getElementById("wordle-status");

  statusEl.textContent = `Attempts left: ${attemptsLeft}`;

  submitBtn.addEventListener("click", checkWordleGuess);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkWordleGuess();
  });

  function checkWordleGuess() {
    const guess = inputEl.value.toUpperCase().trim();

    if (guess.length !== 5) {
      feedbackEl.textContent = "Word must be 5 letters!";
      feedbackEl.className = "feedback-incorrect";
      return;
    }

    const feedback = getWordleFeedback(guess, targetWord);

    if (guess === targetWord) {
      feedbackEl.textContent = "CORRECT! You won!";
      feedbackEl.className = "feedback-correct";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 1500);
      return;
    }

    attemptsLeft--;

    if (attemptsLeft <= 0) {
      feedbackEl.innerHTML = feedback
        .map((f) => `<span class="feedback-${f}">${guess[f]}</span>`)
        .join("");
      statusEl.textContent = `Game Over! Word was: ${targetWord}`;
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }

    feedbackEl.innerHTML = feedback
      .map((f) => `<span class="feedback-${f}">${guess[f]}</span>`)
      .join("");
    statusEl.textContent = `Attempts left: ${attemptsLeft}`;
    inputEl.value = "";
  }
}

function getWordleFeedback(guess, target) {
  const feedback = new Array(5).fill("incorrect");
  const targetChars = target.split("");
  const guessChars = guess.split("");

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      feedback[i] = "correct";
      targetChars[i] = null;
      guessChars[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] !== null && targetChars.includes(guessChars[i])) {
      feedback[i] = "yellow";
      targetChars[targetChars.indexOf(guessChars[i])] = null;
    }
  }

  return feedback;
}

// ==================== MINI-GAME: GEOGRAPHY ====================

function initGeography() {
  const gameContainer = document.getElementById("minigame-geography");
  gameContainer.classList.remove("hidden");

  const categories = {
    Europe: ["FRANCE", "GERMANY", "SPAIN", "ITALY", "POLAND", "SWEDEN"],
    Asia: ["JAPAN", "CHINA", "INDIA", "KOREA", "THAILAND", "VIETNAM"],
    Africa: ["EGYPT", "SUDAN", "KENYA", "NIGERIA", "CONGO", "ETHIOPIA"],
    Americas: ["CANADA", "USA", "MEXICO", "BRAZIL", "COLOMBIA", "ARGENTINA"],
    Capitals: ["PARIS", "BERLIN", "MADRID", "ROME", "WARSAW", "STOCKHOLM"],
  };

  const categoryNames = Object.keys(categories);
  const selectedCategory =
    categoryNames[Math.floor(Math.random() * categoryNames.length)];
  const validAnswers = categories[selectedCategory];

  let found = [];
  const targetCount = 3 + gameState.difficulty * 2;

  document.getElementById("geography-category").textContent =
    `Name countries in ${selectedCategory}`;
  document.getElementById("geography-progress").textContent = `0 / ${targetCount}`;

  const inputEl = document.getElementById("geography-input");
  const submitBtn = document.getElementById("geography-submit");
  const feedbackEl = document.getElementById("geography-feedback");

  submitBtn.addEventListener("click", checkGeographyAnswer);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkGeographyAnswer();
  });

  function checkGeographyAnswer() {
    const answer = inputEl.value.toUpperCase().trim();

    if (!answer) return;

    if (found.includes(answer)) {
      feedbackEl.textContent = `You already found ${answer}!`;
      feedbackEl.className = "feedback-incorrect";
    } else if (validAnswers.includes(answer)) {
      found.push(answer);
      feedbackEl.textContent = `Correct! ${answer} found!`;
      feedbackEl.className = "feedback-correct";
      document.getElementById("geography-progress").textContent =
        `${found.length} / ${targetCount}`;

      if (found.length >= targetCount) {
        feedbackEl.textContent = `You found ${targetCount} items! You won!`;
        submitBtn.disabled = true;
        setTimeout(() => completeMiniGame(true), 1500);
        return;
      }
    } else {
      feedbackEl.textContent = `${answer} not found! Try again.`;
      feedbackEl.className = "feedback-incorrect";
    }

    inputEl.value = "";
  }
}

// ==================== MINI-GAME: WORD SCRAMBLE ====================

function initWordScramble() {
  const gameContainer = document.getElementById("minigame-wordscramble");
  gameContainer.classList.remove("hidden");

  const words = [
    "TAURI",
    "SWIFT",
    "RUST",
    "GAMES",
    "MUSIC",
    "DANCE",
    "BUILD",
    "LEARN",
    "CHESS",
    "APPLE",
  ];
  const targetWord = words[Math.floor(Math.random() * words.length)];
  const scrambled = shuffleWord(targetWord);

  document.querySelector(".scrambled-word").textContent = scrambled;

  const inputEl = document.getElementById("wordscramble-input");
  const submitBtn = document.getElementById("wordscramble-submit");
  const statusEl = document.getElementById("wordscramble-status");

  let attempts = 5 - gameState.difficulty;

  submitBtn.addEventListener("click", checkScrambleAnswer);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkScrambleAnswer();
  });

  function checkScrambleAnswer() {
    const answer = inputEl.value.toUpperCase().trim();

    if (answer === targetWord) {
      statusEl.textContent = "Correct! You won!";
      statusEl.className = "feedback-correct";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 1500);
      return;
    }

    attempts--;

    if (attempts <= 0) {
      statusEl.textContent = `Game Over! Answer was: ${targetWord}`;
      statusEl.className = "feedback-incorrect";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }

    statusEl.textContent = `Incorrect! ${attempts} attempts left.`;
    statusEl.className = "feedback-incorrect";
    inputEl.value = "";
  }
}

function shuffleWord(word) {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

// ==================== MINI-GAME: MATH ====================

function initMath() {
  const gameContainer = document.getElementById("minigame-math");
  gameContainer.classList.remove("hidden");

  const a = Math.floor(Math.random() * (10 * gameState.difficulty)) + 1;
  const b = Math.floor(Math.random() * (10 * gameState.difficulty)) + 1;
  const ops = ["+", "×", "-"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let answer;
  let question;

  if (op === "+") {
    answer = a + b;
    question = `${a} + ${b} = ?`;
  } else if (op === "×") {
    answer = a * b;
    question = `${a} × ${b} = ?`;
  } else {
    const larger = Math.max(a, b);
    const smaller = Math.min(a, b);
    answer = larger - smaller;
    question = `${larger} - ${smaller} = ?`;
  }

  document.getElementById("math-question").textContent = question;

  const inputEl = document.getElementById("math-input");
  const submitBtn = document.getElementById("math-submit");
  const statusEl = document.getElementById("math-status");

  let attempts = 3;

  submitBtn.addEventListener("click", checkMathAnswer);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkMathAnswer();
  });

  function checkMathAnswer() {
    const userAnswer = parseInt(inputEl.value);

    if (isNaN(userAnswer)) {
      statusEl.textContent = "Please enter a number!";
      statusEl.className = "feedback-incorrect";
      return;
    }

    if (userAnswer === answer) {
      statusEl.textContent = "Correct!";
      statusEl.className = "feedback-correct";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 1500);
      return;
    }

    attempts--;

    if (attempts <= 0) {
      statusEl.textContent = `Game Over! Answer was: ${answer}`;
      statusEl.className = "feedback-incorrect";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }

    statusEl.textContent = `Incorrect! ${attempts} attempts left.`;
    statusEl.className = "feedback-incorrect";
    inputEl.value = "";
  }
}

// ==================== MINI-GAME: TRIVIA ====================

function initTrivia() {
  const gameContainer = document.getElementById("minigame-trivia");
  gameContainer.classList.remove("hidden");

  const trivia = [
    {
      question: "What year was Rust released?",
      options: ["2010", "2012", "2014", "2015"],
      correct: 1,
    },
    {
      question: "What is the capital of France?",
      options: ["Lyon", "Paris", "Marseille", "Nice"],
      correct: 1,
    },
    {
      question: "How many planets are in our solar system?",
      options: ["7", "8", "9", "10"],
      correct: 1,
    },
    {
      question: "What is the largest ocean?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
    },
  ];

  const selected = trivia[Math.floor(Math.random() * trivia.length)];

  document.getElementById("trivia-question").textContent = selected.question;

  const optionsContainer = document.getElementById("trivia-options");
  optionsContainer.innerHTML = "";

  selected.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "trivia-option";
    btn.textContent = option;
    btn.addEventListener("click", () => checkTriviaAnswer(index, selected.correct));
    optionsContainer.appendChild(btn);
  });
}

function checkTriviaAnswer(selected, correct) {
  if (selected === correct) {
    document.getElementById("trivia-status").textContent = "Correct!";
    document.getElementById("trivia-status").className = "feedback-correct";
    document.querySelectorAll(".trivia-option").forEach((btn) => {
      btn.disabled = true;
    });
    setTimeout(() => completeMiniGame(true), 1500);
  } else {
    document.querySelectorAll(".trivia-option").forEach((btn) => {
      btn.disabled = true;
    });
    document.getElementById("trivia-status").textContent =
      "Incorrect! Game Over!";
    document.getElementById("trivia-status").className = "feedback-incorrect";
    setTimeout(() => completeMiniGame(false), 2000);
  }
}

// ==================== MINI-GAME: DOTS & BOXES ====================

function initDotsAndBoxes() {
  const gameContainer = document.getElementById("minigame-dotsboxes");
  gameContainer.classList.remove("hidden");

  // Simplified version - player just needs to connect dots
  document.getElementById("dotsboxes-status").textContent =
    "Connect 3 dots to win!";

  // This is a simplified implementation
  let dotsConnected = 0;

  const dots = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.addEventListener("click", () => {
        dotsConnected++;
        if (dotsConnected >= 3) {
          document.getElementById("dotsboxes-status").textContent = "You won!";
          completeMiniGame(true);
        }
      });
      dots.push(dot);
    }
  }

  const grid = document.getElementById("dotsboxes-grid");
  grid.innerHTML = "";
  dots.forEach((dot) => grid.appendChild(dot));
}

// ==================== MINI-GAME: CONNECT FOUR ====================

function initConnect4() {
  const gameContainer = document.getElementById("minigame-connect4");
  gameContainer.classList.remove("hidden");

  let board = Array(6)
    .fill(null)
    .map(() => Array(7).fill("N"));
  let currentPlayer = "X";

  function renderConnect4Board() {
    const boardEl = document.getElementById("connect4-board");
    boardEl.innerHTML = "";

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cell = document.createElement("div");
        cell.className = "connect4-cell";
        const value = board[row][col];

        if (value !== "N") {
          cell.classList.add(value.toLowerCase());
          cell.textContent = value;
        }
        boardEl.appendChild(cell);
      }
    }
  }

  window.dropPiece = function (col) {
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
        renderConnect4Board();
        return;
      }
    }
  };

  renderConnect4Board();
}

function checkConnect4Win(board) {
  const rows = board.length;
  const cols = board[0].length;

  // Horizontal
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

  // Vertical
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

  // Diagonal (top-left to bottom-right)
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

  // Diagonal (top-right to bottom-left)
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

// ==================== MINI-GAME COMPLETION ====================

function completeMiniGame(won) {
  if (won) {
    gameState.board[gameState.miniGameRow][gameState.miniGameCol] =
      gameState.currentPlayer;
    gameState.scores[gameState.currentPlayer]++;

    // Check if main game is won
    const winner = checkMainGameWinner();
    if (winner) {
      gameState.gameStatus = `${gameState.playerNames[winner]} (${winner}) won the game!`;
      showGameOver(winner);
      return;
    }

    // Check for draw
    if (isMainGameDraw()) {
      gameState.gameStatus = "Game is a draw!";
      showGameOver(null);
      return;
    }
  }

  // Switch player
  if (!gameState.playerCount === 1 || won) {
    gameState.currentPlayer =
      gameState.currentPlayer === "X" ? "O" : "X";
  }

  updateGameInfo();
  renderGameBoard();
  showScreen("game");
}

function checkMainGameWinner() {
  const size = gameState.boardSize;

  // Check rows
  for (let row = 0; row < size; row++) {
    if (
      gameState.board[row][0] !== "N" &&
      gameState.board[row].every((cell) => cell === gameState.board[row][0])
    ) {
      return gameState.board[row][0];
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    if (
      gameState.board[0][col] !== "N" &&
      gameState.board.every((row) => row[col] === gameState.board[0][col])
    ) {
      return gameState.board[0][col];
    }
  }

  // Check main diagonal
  if (
    gameState.board[0][0] !== "N" &&
    gameState.board.every((_, i) => gameState.board[i][i] === gameState.board[0][0])
  ) {
    return gameState.board[0][0];
  }

  // Check anti-diagonal
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

function updatePlayerNames() {
  if (gameState.playerCount === 1) {
    document.querySelector('label[for="player-name"]').textContent =
      "Your Name";
  } else {
    document.querySelector('label[for="player-name"]').textContent =
      "Player 1 Name";
  }
}

// ==================== GAME OVER ====================

function showGameOver(winner) {
  const gamboverTitle = document.getElementById("gameover-title");
  const gamboverWinner = document.getElementById("gameover-winner");
  const finalXScore = document.getElementById("final-x-score");
  const finalOScore = document.getElementById("final-o-score");
  const finalXName = document.getElementById("final-x-name");
  const finalOName = document.getElementById("final-o-name");

  finalXName.textContent = gameState.playerNames.X;
  finalOName.textContent = gameState.playerNames.O;
  finalXScore.textContent = gameState.scores.X;
  finalOScore.textContent = gameState.scores.O;

  if (winner) {
    gamboverTitle.textContent = "Game Over!";
    gamboverWinner.textContent = `${gameState.playerNames[winner]} (${winner}) wins!`;
  } else {
    gamboverTitle.textContent = "Draw!";
    gamboverWinner.textContent = "The game is a tie!";
  }

  showScreen("gameover");
}

// ==================== INITIALIZATION ====================

// Set default button selections
buttons.playerCount[0].click();
buttons.boardSize[0].click();
buttons.difficulty[1].click();