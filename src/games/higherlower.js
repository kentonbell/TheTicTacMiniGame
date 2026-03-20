// Higher or Lower Mini Game

import { gameState } from '../game-utils/state.js';

export function initHigherLower(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-higherlow");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  let secretNumber, tries, range;
  
  if (gameState.difficulty === 1) {
    tries = 10;
    range = 100;
  } else if (gameState.difficulty === 2) {
    tries = 7;
    range = 100;
  } else {
    tries = 5;
    range = 50;
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
    const statusEl = document.getElementById("higherlow-status");
    
    if (isNaN(guess)) {
      statusEl.textContent = "Enter a valid number!";
      statusEl.className = "feedback-incorrect";
      return;
    }

    if (guess === secretNumber) {
      statusEl.textContent = `✓ Correct! The number was ${secretNumber}`;
      statusEl.className = "feedback-correct";
      inputEl.disabled = true;
      guessBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 2000);
      return;
    }

    attemptsLeft--;

    if (attemptsLeft <= 0) {
      statusEl.textContent = `✗ Game Over! The number was ${secretNumber}`;
      statusEl.className = "feedback-incorrect";
      inputEl.disabled = true;
      guessBtn.disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }

    if (guess < secretNumber) {
      lowBound = Math.max(lowBound, guess + 1);
      statusEl.textContent = `Too low! Guess between ${lowBound} and ${highBound} (${attemptsLeft} left)`;
    } else {
      highBound = Math.min(highBound, guess - 1);
      statusEl.textContent = `Too high! Guess between ${lowBound} and ${highBound} (${attemptsLeft} left)`;
    }
    statusEl.className = "feedback-incorrect";
    inputEl.value = "";
  }
}
