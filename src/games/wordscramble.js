// Word Scramble Mini Game

import { shuffleWord } from './utils.js';
import { dictionaries, gameState } from './state.js';

export function initWordScramble(completeMiniGame) {
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
