// Guess The Number Mini Game

import { gameState } from '../game-utils/state.js';

export function initGuessNumber(completeMiniGame) {
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
    
    if (isNaN(guess) || guess < 1 || guess > 10) {
      statusEl.textContent = "Enter a number from 1-10!";
      statusEl.className = "feedback-incorrect";
      return;
    }

    if (guess === secretNumber) {
      statusEl.textContent = `✓ You got it! The number was ${secretNumber}`;
      statusEl.className = "feedback-correct";
      inputEl.disabled = true;
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(true), 2000);
      return;
    }

    attempts--;

    if (attempts <= 0) {
      statusEl.textContent = `✗ Game Over! The number was ${secretNumber}`;
      statusEl.className = "feedback-incorrect";
      inputEl.disabled = true;
      submitBtn.disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }

    statusEl.textContent = `${guess > secretNumber ? 'Too high' : 'Too low'}! ${attempts} attempts left`;
    statusEl.className = "feedback-incorrect";
    inputEl.value = "";
  };
  
  inputEl.onkeypress = (e) => {
    if (e.key === "Enter") submitBtn.onclick();
  };
}
