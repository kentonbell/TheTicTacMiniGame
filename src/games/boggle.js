// Boggle Mini Game

import { dictionaries } from '../game-utils/state.js';
import { shuffleWord } from '../game-utils/utils.js';

export function initBoggle(completeMiniGame) {
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
    
    if (!word) return;

    if (foundWords.includes(word)) {
      statusEl.textContent = "Already found!";
      statusEl.className = "feedback-incorrect";
      inputEl.value = "";
      return;
    }

    const hasValidLetters = word.split("").every(letter => shuffled.includes(letter));
    
    if (!hasValidLetters) {
      statusEl.textContent = "Word contains letters not in the grid!";
      statusEl.className = "feedback-incorrect";
      inputEl.value = "";
      return;
    }

    if (validWords.includes(word)) {
      foundWords.push(word);
      document.getElementById("boggle-words").textContent = `Words found: ${foundWords.join(", ")}`;
      statusEl.textContent = `✓ ${word}!`;
      statusEl.className = "feedback-correct";

      if (foundWords.length >= targetWords) {
        inputEl.disabled = true;
        submitBtn.disabled = true;
        setTimeout(() => completeMiniGame(true), 1500);
        return;
      }
    } else {
      statusEl.textContent = "Word not in dictionary!";
      statusEl.className = "feedback-incorrect";
    }

    inputEl.value = "";
  };
  
  inputEl.onkeypress = (e) => {
    if (e.key === "Enter") submitBtn.onclick();
  };
}
