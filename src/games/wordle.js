// Wordle Mini Game

import { getWordleFeedback } from './utils.js';
import { dictionaries, gameState } from './state.js';

export function initWordle(completeMiniGame) {
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
      alert("Not a valid word!\n\nThat word is not in the dictionary.");
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
      alert("Game Over\n\nThe word was: " + targetWord);
      setTimeout(() => completeMiniGame(false), 500);
      return;
    }

    inputEl.value = "";
    currentGuess = "";
  }
}
