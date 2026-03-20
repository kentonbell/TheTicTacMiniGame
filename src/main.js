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
let dictionaries = {};
let gameList = [
  "tictactoe", "wordle", "geography", "wordscramble", "math", 
  "dotsboxes", "connect4", "spellingbee", "higherlow", "guessnumber", 
  "coinflip", "boggle", "anagrams", "filler"
];
let usedGames = new Set();

// ==================== UI ELEMENTS ====================
const screens = {
  welcome: document.getElementById("welcome-screen"),
  game: document.getElementById("game-screen"),
  miniGame: document.getElementById("mini-game-screen"),
  gameover: document.getElementById("gameover-screen"),
  settings: document.getElementById("settings-screen"),
};

const buttons = {
  playerCount: document.querySelectorAll(".player-btn"),
  boardSize: document.querySelectorAll(".size-btn"),
  difficulty: document.querySelectorAll(".difficulty-btn"),
};

// ==================== UTILITIES ====================
function getTitleCase(str) {
  return str
    .split(/(?=[A-Z])|(?=\d)/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function showAlert(title, message) {
  alert(`${title}\n\n${message}`);
}

function showHowToPlay(gameName) {
  const guides = {
    tictactoe: "Get three in a row, column, or diagonal to win!",
    wordle: "Guess the 5-letter word in 6 tries.\n🟩 Green = Correct position\n🟨 Yellow = In word, wrong position\n⬜ Grey = Not in word",
    geography: "Name countries or capitals from the region. Get 3 strikes to fail.",
    wordscramble: "Unscramble all 3 words before running out of attempts.",
    math: "Solve the math problem. You get 3 attempts.",
    dotsboxes: "Complete lines between dots to claim boxes. Most boxes wins!",
    connect4: "Get 4 in a row to win!",
    spellingbee: "Spell increasingly difficult words. Each word has one more letter.",
    higherlow: "Guess a secret number by receiving 'higher' or 'lower' hints.",
    guessnumber: "Guess the secret number between 1-10. Difficulty affects attempts.",
    coinflip: "Tap the coin to flip it, then call the result!",
    boggle: "Find 3+ words in the letter grid by selecting adjacent letters.",
    anagrams: "Rearrange 7 random letters into valid English words (3 words needed).",
    filler: "Fill more territory than your opponent with your color!",
  };
  showAlert("How to Play: " + getTitleCase(gameName), guides[gameName] || "Information not available.");
}

async function loadDictionaries() {
  try {
    const files = [
      { name: "wordle", displayName: "wordle" },
      { name: "words", displayName: "words" },
      { name: "1000topwords", displayName: "1000topwords" },
      { name: "3000topwords", displayName: "3000topwords" },
      { name: "all countries", displayName: "all%20countries" },
      { name: "capitals", displayName: "capitals" },
      { name: "europe", displayName: "europe" },
      { name: "asia", displayName: "asia" },
      { name: "africa", displayName: "africa" },
      { name: "north america", displayName: "north%20america" },
      { name: "south america", displayName: "south%20america" },
      { name: "oceania", displayName: "oceania" }
    ];

    for (const file of files) {
      try {
        const response = await fetch(`/dictionaries/${file.displayName}.txt`);
        if (response.ok) {
          const text = await response.text();
          dictionaries[file.name] = text
            .split("\n")
            .map(w => w.trim().toUpperCase())
            .filter(w => w.length > 0);
        }
      } catch (e) {
        console.warn(`Could not load ${file.name}:`, e);
      }
    }
    console.log("Dictionaries loaded:", Object.keys(dictionaries));
  } catch (e) {
    console.error("Error loading dictionaries:", e);
  }
}

function getRandomGame() {
  let availableGames = gameList.filter(g => !usedGames.has(g));
  if (availableGames.length === 0) {
    usedGames.clear();
    availableGames = gameList;
  }
  const game = availableGames[Math.floor(Math.random() * availableGames.length)];
  usedGames.add(game);
  return game;
}

function shuffleWord(word) {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

// ==================== EVENT LISTENERS ====================
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

document.getElementById("back-from-settings")?.addEventListener("click", () => {
  showScreen("game");
});

document.getElementById("quit-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to quit this game?")) {
    showScreen("welcome");
    resetGame();
  }
});

document.getElementById("back-from-minigame").addEventListener("click", () => {
  if (confirm("Forfeit this round? The square goes to your opponent.")) {
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
    miniGameState = null;
  }
});

document.getElementById("play-again-btn").addEventListener("click", () => {
  resetGame();
  initializeGame();
  showScreen("game");
});

document.getElementById("main-menu-btn").addEventListener("click", () => {
  resetGame();
  showScreen("welcome");
});

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

// ==================== GAME INITIALIZATION ====================
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
  miniGameState = null;
  usedGames.clear();
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

  document.getElementById("player-x-score").textContent = gameState.scores.X;
  document.getElementById("player-o-score").textContent = gameState.scores.O;
  document.getElementById("player-x-name").textContent = gameState.playerNames.X;
  document.getElementById("player-o-name").textContent = gameState.playerNames.O;
}

// ==================== SQUARE SELECTION ====================
function selectSquare(row, col) {
  if (gameState.board[row][col] === "N") {
    gameState.miniGameRow = row;
    gameState.miniGameCol = col;
    const game = getRandomGame();
    startMiniGame(game);
  }
}

// ==================== MINI-GAME MANAGEMENT ====================
function startMiniGame(gameType) {
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
    case "dotsboxes":
      initDotsAndBoxes();
      break;
    case "connect4":
      initConnect4();
      break;
    case "spellingbee":
      initSpellingBee();
      break;
    case "higherlow":
      initHigherLower();
      break;
    case "guessnumber":
      initGuessNumber();
      break;
    case "coinflip":
      initCoinFlip();
      break;
    case "boggle":
      initBoggle();
      break;
    case "anagrams":
      initAnagrams();
      break;
    case "filler":
      initFiller();
      break;
  }

  showScreen("miniGame");
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

// ==================== MINI-GAME: WORDLE ====================
function initWordle() {
  const gameContainer = document.getElementById("minigame-wordle");
  gameContainer.classList.remove("hidden");

  const words = dictionaries["wordle"] || ["SWIFT", "TAURI", "HELLO", "WORLD", "RUST"];
  const targetWord = words[Math.floor(Math.random() * words.length)];
  let attemptsLeft = 6;
  let currentGuess = "";
  let rowIndex = 0;

  const inputEl = document.getElementById("wordle-input");
  const submitBtn = document.getElementById("wordle-submit");

  if (!inputEl) return;

  inputEl.maxLength = 5;
  inputEl.value = "";
  inputEl.disabled = false;

  inputEl.oninput = (e) => {
    currentGuess = e.target.value.toUpperCase();
    updateWordleDisplay(currentGuess);
  };

  submitBtn.disabled = false;
  submitBtn.onclick = checkWordleGuess;
  inputEl.onkeypress = (e) => {
    if (e.key === "Enter") checkWordleGuess();
  };

  function updateWordleDisplay(guess) {
    const rows = document.querySelectorAll(".wordle-row");
    if (rows.length > 0 && rowIndex < rows.length) {
      const cells = rows[rowIndex].querySelectorAll(".wordle-cell");
      for (let i = 0; i < 5; i++) {
        cells[i].textContent = guess[i] || "";
        cells[i].className = "wordle-cell";
      }
    }
  }

  function checkWordleGuess() {
    if (currentGuess.length !== 5) return;

    const wordList = dictionaries["words"] || dictionaries["wordle"] || [];
    if (wordList.length > 0 && !wordList.includes(currentGuess)) {
      showAlert("Not a valid word", "That word is not in the dictionary.");
      return;
    }

    const feedback = getWordleFeedback(currentGuess, targetWord);

    const rows = document.querySelectorAll(".wordle-row");
    if (rows.length > 0 && rowIndex < rows.length) {
      const cells = rows[rowIndex].querySelectorAll(".wordle-cell");
      cells.forEach((cell, i) => {
        cell.textContent = currentGuess[i];
        cell.className = "wordle-cell";
        if (feedback[i] === "green") cell.classList.add("green");
        else if (feedback[i] === "yellow") cell.classList.add("yellow");
        else cell.classList.add("grey");
      });
    }

    if (currentGuess === targetWord) {
      setTimeout(() => completeMiniGame(true), 500);
      return;
    }

    attemptsLeft--;
    rowIndex++;

    if (attemptsLeft <= 0) {
      showAlert("Game Over", `The word was: ${targetWord}`);
      setTimeout(() => completeMiniGame(false), 500);
      return;
    }

    inputEl.value = "";
    currentGuess = "";
  }
}

function getWordleFeedback(guess, target) {
  const feedback = new Array(5).fill("grey");
  const targetChars = target.split("");
  const guessChars = guess.split("");

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      feedback[i] = "green";
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

  const categories = [
    { key: "all countries", label: "Countries" },
    { key: "europe", label: "European Countries" },
    { key: "asia", label: "Asian Countries" },
    { key: "africa", label: "African Countries" },
    { key: "north america", label: "North American Countries" },
    { key: "south america", label: "South American Countries" },
    { key: "oceania", label: "Oceania Countries" },
    { key: "capitals", label: "World Capitals" }
  ];

  const available = categories.filter(c => dictionaries[c.key] && dictionaries[c.key].length > 0);
  const selected = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : { key: "all countries", label: "Countries" };
  const validAnswers = dictionaries[selected.key] || [];

  let found = [];
  const targetCount = 3 + gameState.difficulty;

  document.getElementById("geography-category").textContent = `Name ${selected.label}`;
  document.getElementById("geography-progress").textContent = `0 / ${targetCount}`;

  const inputEl = document.getElementById("geography-input");
  const submitBtn = document.getElementById("geography-submit");
  const feedbackEl = document.getElementById("geography-feedback");

  inputEl.value = "";
  submitBtn.disabled = false;
  feedbackEl.textContent = "";

  submitBtn.onclick = checkGeographyAnswer;
  inputEl.onkeypress = (e) => {
    if (e.key === "Enter") checkGeographyAnswer();
  };

  function checkGeographyAnswer() {
    const answer = inputEl.value.toUpperCase().trim();

    if (!answer) return;

    if (found.includes(answer)) {
      feedbackEl.textContent = `Already found!`;
      feedbackEl.className = "feedback-incorrect";
    } else if (validAnswers.includes(answer)) {
      found.push(answer);
      feedbackEl.textContent = `✓ ${answer}!`;
      feedbackEl.className = "feedback-correct";
      document.getElementById("geography-progress").textContent = `${found.length} / ${targetCount}`;

      if (found.length >= targetCount) {
        feedbackEl.textContent = `Won!`;
        submitBtn.disabled = true;
        setTimeout(() => completeMiniGame(true), 1500);
        return;
      }
    } else {
      feedbackEl.textContent = `Not in the list!`;
      feedbackEl.className = "feedback-incorrect";
    }

    inputEl.value = "";
  }
}

// ==================== MINI-GAME: WORD SCRAMBLE ====================
function initWordScramble() {
  const gameContainer = document.getElementById("minigame-wordscramble");
  gameContainer.classList.remove("hidden");

  const words = dictionaries["1000topwords"] || dictionaries["wordle"] || ["TAURI", "SWIFT", "RUST"];
  
  let wordIndex = 0;
  let wordsFound = 0;
  const targetWords = 3;
  let attempts = 5 - gameState.difficulty;

  playNextScrambleWord();

  function playNextScrambleWord() {
    if (wordsFound >= targetWords) {
      document.getElementById("wordscramble-status").textContent = "You won!";
      document.getElementById("wordscramble-status").className = "feedback-correct";
      document.getElementById("wordscramble-input").disabled = true;
      document.getElementById("wordscramble-submit").disabled = true;
      setTimeout(() => completeMiniGame(true), 1500);
      return;
    }

    attempts = 5 - gameState.difficulty;
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = shuffleWord(word);

    document.querySelector(".scrambled-word").textContent = scrambled;
    document.getElementById("wordscramble-status").textContent = `Word ${wordsFound + 1}/3 - ${attempts} attempts`;
    document.getElementById("wordscramble-input").value = "";
    document.getElementById("wordscramble-input").disabled = false;
    document.getElementById("wordscramble-submit").disabled = false;

    document.getElementById("wordscramble-submit").onclick = () => checkScrambleAnswer(word);
    document.getElementById("wordscramble-input").onkeypress = (e) => {
      if (e.key === "Enter") document.getElementById("wordscramble-submit").click();
    };

    function checkScrambleAnswer(targetWord) {
      const userAnswer = document.getElementById("wordscramble-input").value.toUpperCase().trim();

      if (userAnswer === targetWord) {
        wordsFound++;
        if (wordsFound < targetWords) {
          playNextScrambleWord();
        } else {
          document.getElementById("wordscramble-status").textContent = "You won!";
          document.getElementById("wordscramble-status").className = "feedback-correct";
          document.getElementById("wordscramble-input").disabled = true;
          document.getElementById("wordscramble-submit").disabled = true;
          setTimeout(() => completeMiniGame(true), 1500);
        }
        return;
      }

      attempts--;

      if (attempts <= 0) {
        document.getElementById("wordscramble-status").textContent = `Game Over! Word: ${targetWord}`;
        document.getElementById("wordscramble-status").className = "feedback-incorrect";
        document.getElementById("wordscramble-input").disabled = true;
        document.getElementById("wordscramble-submit").disabled = true;
        setTimeout(() => completeMiniGame(false), 2000);
        return;
      }

      document.getElementById("wordscramble-status").textContent = `Word ${wordsFound + 1}/3 - ${attempts} attempts`;
      document.getElementById("wordscramble-input").value = "";
    }
  }
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

  inputEl.type = "number";
  inputEl.value = "";
  inputEl.disabled = false;
  submitBtn.disabled = false;
  statusEl.textContent = "";

  let attempts = 3;

  submitBtn.onclick = checkMathAnswer;
  inputEl.onkeypress = (e) => {
    if (e.key === "Enter") checkMathAnswer();
  };

  function checkMathAnswer() {
    const userAnswer = parseInt(inputEl.value);

    if (isNaN(userAnswer)) {
      statusEl.textContent = "Enter a number!";
      statusEl.className = "feedback-incorrect";
      return;
    }

    if (userAnswer === answer) {
      statusEl.textContent = "✓ Correct!";
      statusEl.className = "feedback-correct";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 1500);
      return;
    }

    attempts--;

    if (attempts <= 0) {
      statusEl.textContent = `Game Over! Answer: ${answer}`;
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

// ==================== MINI-GAME: DOTS & BOXES ====================
function initDotsAndBoxes() {
  const gameContainer = document.getElementById("minigame-dotsboxes");
  gameContainer.classList.remove("hidden");

  const grid = document.getElementById("dotsboxes-grid");
  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(3, 60px)";
  grid.style.gap = "8px";
  grid.style.margin = "20px auto";
  grid.style.maxHeight = "200px";
  grid.style.overflowY = "auto";

  let linesCompleted = 0;
  const currentPlayerColor = gameState.currentPlayer === "X" ? "#FF6B6B" : "#4ECDC4";

  for (let i = 0; i < 9; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.width = "30px";
    dot.style.height = "30px";
    dot.style.borderRadius = "50%";
    dot.style.backgroundColor = "#f8efc5";
    dot.style.border = "2px solid rgba(255,255,255,0.3)";
    dot.style.cursor = "pointer";
    dot.style.transition = "all 0.3s";
    
    dot.onclick = () => {
      linesCompleted++;
      dot.style.backgroundColor = currentPlayerColor;
      dot.style.transform = "scale(0.8)";
      
      if (linesCompleted >= 5) {
        document.getElementById("dotsboxes-status").textContent = "You completed the grid!";
        setTimeout(() => completeMiniGame(true), 1000);
      }
    };
    grid.appendChild(dot);
  }

  document.getElementById("dotsboxes-status").textContent = "Click dots to complete lines (5 lines needed)";
}

// ==================== MINI-GAME: CONNECT 4 ====================
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

// ==================== NEW MINI-GAMES ====================

function initSpellingBee() {
  const gameContainer = document.getElementById("minigame-spellingbee");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const wordList = dictionaries["1000topwords"] || dictionaries["wordle"] || ["SPELLING", "DIFFICULT"];
  let wordLength = 3;
  let strikes = 0;
  
  playNextSpellingWord();
  
  function playNextSpellingWord() {
    const words = wordList.filter(w => w.length === wordLength);
    if (words.length === 0 || strikes >= 3) {
      if (strikes >= 3) {
        document.getElementById("spellingbee-status").textContent = "Game Over - 3 strikes!";
        document.getElementById("spellingbee-status").className = "feedback-incorrect";
        document.getElementById("spellingbee-submit").disabled = true;
        setTimeout(() => completeMiniGame(false), 2000);
      } else {
        document.getElementById("spellingbee-status").textContent = "You won!";
        document.getElementById("spellingbee-status").className = "feedback-correct";
        document.getElementById("spellingbee-submit").disabled = true;
        setTimeout(() => completeMiniGame(true), 1500);
      }
      return;
    }
    
    const word = words[Math.floor(Math.random() * words.length)];
    document.getElementById("spellingbee-word").textContent = `Spell a ${wordLength}-letter word`;
    document.getElementById("spellingbee-status").textContent = `Strikes: ${strikes}/3`;
    document.getElementById("spellingbee-input").value = "";
    document.getElementById("spellingbee-input").disabled = false;
    document.getElementById("spellingbee-submit").disabled = false;
    
    document.getElementById("spellingbee-submit").onclick = () => {
      const answer = document.getElementById("spellingbee-input").value.toUpperCase().trim();
      
      if (answer === word) {
        wordLength++;
        playNextSpellingWord();
      } else {
        strikes++;
        if (strikes >= 3) {
          document.getElementById("spellingbee-status").textContent = "Game Over - 3 strikes!";
          document.getElementById("spellingbee-status").className = "feedback-incorrect";
          document.getElementById("spellingbee-submit").disabled = true;
          setTimeout(() => completeMiniGame(false), 2000);
        } else {
          document.getElementById("spellingbee-status").textContent = `Wrong! Strikes: ${strikes}/3`;
          document.getElementById("spellingbee-input").value = "";
        }
      }
    };
  }
}

function initHigherLower() {
  const gameContainer = document.getElementById("minigame-higherlow");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  let secretNumber, tries, range;
  
  if (gameState.difficulty === 1) {
    range = 100;
    tries = 6;
  } else if (gameState.difficulty === 2) {
    range = 1000;
    tries = 9;
  } else if (gameState.difficulty === 3) {
    range = 10000;
    tries = 13;
  } else if (gameState.difficulty === 4) {
    range = 1000000;
    tries = 19;
  }
  
  secretNumber = Math.floor(Math.random() * range) + 1;
  let lowBound = 1;
  let highBound = range;
  let attemptsLeft = tries;
  
  document.getElementById("higherlow-current").textContent = `Guess between ${lowBound} and ${highBound}`;
  document.getElementById("higherlow-status").textContent = `${attemptsLeft} attempts left`;
  
  const container = document.querySelector(".higherlow-container");
  const inputWrap = document.createElement("div");
  inputWrap.style.margin = "10px";
  
  const inputEl = document.createElement("input");
  inputEl.type = "number";
  inputEl.placeholder = "Enter your guess";
  inputEl.style.padding = "8px";
  inputEl.style.fontSize = "1em";
  inputEl.style.marginRight = "5px";
  
  const guessBtn = document.createElement("button");
  guessBtn.textContent = "Guess";
  guessBtn.className = "btn-primary";
  guessBtn.style.padding = "8px 15px";
  
  inputWrap.appendChild(inputEl);
  inputWrap.appendChild(guessBtn);
  container.appendChild(inputWrap);
  
  guessBtn.onclick = submitGuess;
  inputEl.onkeypress = (e) => {
    if (e.key === "Enter") submitGuess();
  };
  
  function submitGuess() {
    const guess = parseInt(inputEl.value);
    
    if (isNaN(guess) || guess < lowBound || guess > highBound) {
      document.getElementById("higherlow-status").textContent = `Enter a number between ${lowBound} and ${highBound}`;
      return;
    }
    
    if (guess === secretNumber) {
      document.getElementById("higherlow-status").textContent = "✓ You got it!";
      document.getElementById("higherlow-status").className = "feedback-correct";
      inputEl.disabled = true;
      guessBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 1500);
      return;
    }
    
    if (guess < secretNumber) {
      lowBound = guess + 1;
      document.getElementById("higherlow-current").textContent = "Higher!";
    } else {
      highBound = guess - 1;
      document.getElementById("higherlow-current").textContent = "Lower!";
    }
    
    attemptsLeft--;
    if (attemptsLeft <= 0) {
      document.getElementById("higherlow-status").textContent = `Game Over! Number was ${secretNumber}`;
      document.getElementById("higherlow-status").className = "feedback-incorrect";
      inputEl.disabled = true;
      guessBtn.disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }
    
    document.getElementById("higherlow-status").textContent = `${attemptsLeft} attempts left. Guess between ${lowBound} and ${highBound}`;
    inputEl.value = "";
  }
}

function initGuessNumber() {
  const gameContainer = document.getElementById("minigame-guessnumber");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const secretNumber = Math.floor(Math.random() * 10) + 1;
  let attempts = gameState.difficulty === 1 ? 6 : gameState.difficulty === 2 ? 5 : gameState.difficulty === 3 ? 4 : 3;
  
  const inputEl = document.getElementById("guessnumber-input");
  const submitBtn = document.getElementById("guessnumber-submit");
  const statusEl = document.getElementById("guessnumber-status");
  
  inputEl.type = "number";
  inputEl.min = "1";
  inputEl.max = "10";
  inputEl.value = "";
  inputEl.disabled = false;
  submitBtn.disabled = false;
  statusEl.textContent = `${attempts} attempts left`;
  
  submitBtn.onclick = () => {
    const guess = parseInt(inputEl.value);
    
    if (isNaN(guess)) {
      statusEl.textContent = "Enter a valid number!";
      return;
    }
    
    if (guess === secretNumber) {
      statusEl.textContent = `✓ Correct! It was ${secretNumber}`;
      statusEl.className = "feedback-correct";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 1500);
      return;
    }
    
    attempts--;
    if (attempts <= 0) {
      statusEl.textContent = `Game Over! Number: ${secretNumber}`;
      statusEl.className = "feedback-incorrect";
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }
    
    const hint = guess < secretNumber ? "Too low" : "Too high";
    statusEl.textContent = `${hint}! ${attempts} attempts left`;
    inputEl.value = "";
  };
}

function initCoinFlip() {
  const gameContainer = document.getElementById("minigame-coinflip");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  let flipResult = null;
  const coin = document.getElementById("coin-display");
  coin.textContent = "🪙 Tap to flip!";
  coin.style.cursor = "pointer";
  coin.style.fontSize = "3em";
  coin.style.margin = "20px";
  
  coin.onclick = () => {
    flipResult = Math.random() > 0.5 ? "heads" : "tails";
    coin.textContent = flipResult === "heads" ? "😊" : "🤔";
  };
  
  window.callCoinFlip = function(call) {
    if (!flipResult) {
      showAlert("Flip first!", "Tap the coin to flip it first!");
      return;
    }
    
    const statusEl = document.getElementById("coinflip-status");
    if (flipResult === call) {
      statusEl.textContent = "✓ You called it right!";
      statusEl.className = "feedback-correct";
      document.querySelectorAll(".coinflip-buttons button").forEach(b => b.disabled = true);
      setTimeout(() => completeMiniGame(true), 1500);
    } else {
      statusEl.textContent = `✗ Wrong! It was ${flipResult}`;
      statusEl.className = "feedback-incorrect";
      document.querySelectorAll(".coinflip-buttons button").forEach(b => b.disabled = true);
      setTimeout(() => completeMiniGame(false), 2000);
    }
  };
}

function initBoggle() {
  const gameContainer = document.getElementById("minigame-boggle");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const letters = "TRESGOLIN";
  const shuffled = shuffleWord(letters);
  const validWords = dictionaries["1000topwords"] || dictionaries["wordle"] || [];
  let foundWords = [];
  const targetWords = 3;
  
  document.getElementById("boggle-board").textContent = `Find words using: ${shuffled}`;
  document.getElementById("boggle-words").textContent = "Words found: ";
  
  const inputEl = document.getElementById("boggle-input");
  const submitBtn = document.getElementById("boggle-submit");
  const statusEl = document.getElementById("boggle-status");
  
  inputEl.value = "";
  inputEl.disabled = false;
  submitBtn.disabled = false;
  statusEl.textContent = "";
  
  submitBtn.onclick = () => {
    const word = inputEl.value.toUpperCase().trim();
    
    if (!word || word.length < 3) {
      statusEl.textContent = "Word must be at least 3 letters!";
      statusEl.className = "feedback-incorrect";
      return;
    }
    
    if (foundWords.includes(word)) {
      statusEl.textContent = "Already found!";
      statusEl.className = "feedback-incorrect";
      return;
    }
    
    const letters_array = shuffled.split("");
    for (let char of word) {
      if (letters_array.includes(char)) {
        letters_array.splice(letters_array.indexOf(char), 1);
      } else {
        statusEl.textContent = "Can't use those letters!";
        statusEl.className = "feedback-incorrect";
        return;
      }
    }
    
    if (validWords.includes(word)) {
      foundWords.push(word);
      document.getElementById("boggle-words").textContent = `Words found: ${foundWords.join(", ")}`;
      statusEl.textContent = `✓ ${word}!`;
      statusEl.className = "feedback-correct";
      
      if (foundWords.length >= targetWords) {
        statusEl.textContent = "You won!";
        submitBtn.disabled = true;
        setTimeout(() => completeMiniGame(true), 1500);
        return;
      }
    } else {
      statusEl.textContent = "Not a valid word!";
      statusEl.className = "feedback-incorrect";
    }
    
    inputEl.value = "";
  };
}

function initAnagrams() {
  const gameContainer = document.getElementById("minigame-anagrams");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const wordList = dictionaries["1000topwords"] || dictionaries["wordle"] || [];
  const targetWords = [];
  for (let i = 0; i < 3; i++) {
    targetWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  
  const allLetters = targetWords.join("");
  const scrambled = shuffleWord(allLetters);
  
  document.getElementById("anagrams-letters").textContent = scrambled;
  document.getElementById("anagrams-found").textContent = "Words: 0/3";
  
  let foundCount = 0;
  const inputEl = document.getElementById("anagrams-input");
  const submitBtn = document.getElementById("anagrams-submit");
  const statusEl = document.getElementById("anagrams-status");
  
  inputEl.value = "";
  inputEl.disabled = false;
  submitBtn.disabled = false;
  statusEl.textContent = "";
  
  submitBtn.onclick = () => {
    const answer = inputEl.value.toUpperCase().trim();
    
    if (targetWords.includes(answer)) {
      targetWords.splice(targetWords.indexOf(answer), 1);
      foundCount++;
      document.getElementById("anagrams-found").textContent = `Words: ${foundCount}/3`;
      statusEl.textContent = `✓ ${answer}!`;
      statusEl.className = "feedback-correct";
      
      if (foundCount >= 3) {
        statusEl.textContent = "You won!";
        submitBtn.disabled = true;
        setTimeout(() => completeMiniGame(true), 1500);
        return;
      }
    } else {
      statusEl.textContent = "Not a target word!";
      statusEl.className = "feedback-incorrect";
    }
    
    inputEl.value = "";
  };
}

function initFiller() {
  const gameContainer = document.getElementById("minigame-filler");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"];
  let colorCount = { "#FF6B6B": 0 };
  
  const board = document.getElementById("filler-board");
  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(5, 50px)";
  board.style.gap = "4px";
  board.style.margin = "20px auto";
  board.style.maxHeight = "300px";
  board.style.overflowY = "auto";
  
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "filler-cell";
    cell.style.width = "50px";
    cell.style.height = "50px";
    cell.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    cell.style.borderRadius = "5px";
    cell.style.cursor = "pointer";
    cell.style.transition = "all 0.3s";
    
    cell.onclick = () => {
      cell.style.backgroundColor = "#FF6B6B";
      colorCount["#FF6B6B"]++;
      if (colorCount["#FF6B6B"] >= 13) {
        document.getElementById("filler-status").textContent = "You won!";
        setTimeout(() => completeMiniGame(true), 1000);
      }
    };
    board.appendChild(cell);
  }
  
  document.getElementById("filler-status").textContent = "Fill 13 squares to win!";
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

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  buttons.playerCount[0].click();
  buttons.boardSize[0].click();
  buttons.difficulty[1].click();
  updatePlayerNameFields();
  loadDictionaries();
});
