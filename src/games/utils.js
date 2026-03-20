// ==================== UTILITIES ====================

export function getTitleCase(str) {
  return str
    .split(/(?=[A-Z])|(?=\d)/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function showAlert(title, message) {
  alert(`${title}\n\n${message}`);
}

export function showHowToPlay(gameName) {
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

export async function loadDictionaries() {
  try {
    const { dictionaries } = await import('./state.js');
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
    return dictionaries;
  } catch (e) {
    console.error("Error loading dictionaries:", e);
    return {};
  }
}

export function shuffleWord(word) {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

export function getWordleFeedback(guess, target) {
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

export function checkConnect4Win(board) {
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

export function checkMiniWinner(board) {
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

export function isMiniBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== "N"));
}
