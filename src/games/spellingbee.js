// Spelling Bee Mini Game

import { dictionaries, gameState } from '../game-utils/state.js';

export function initSpellingBee(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-spellingbee");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const wordList = dictionaries["1000topwords"] || dictionaries["wordle"] || ["SPELLING", "DIFFICULT"];
  let wordLength = 3;
  let strikes = 0;
  
  playNextSpellingWord();
  
  function playNextSpellingWord() {
    if (strikes >= 3) {
      document.getElementById("spellingbee-status").textContent = "Game Over! 3 strikes reached.";
      document.getElementById("spellingbee-status").className = "feedback-incorrect";
      document.getElementById("spellingbee-input").disabled = true;
      document.getElementById("spellingbee-submit").disabled = true;
      setTimeout(() => completeMiniGame(false), 2000);
      return;
    }

    const validWords = wordList.filter(w => w.length === wordLength);
    if (validWords.length === 0) {
      completeMiniGame(true);
      return;
    }

    const word = validWords[Math.floor(Math.random() * validWords.length)];
    
    document.getElementById("spellingbee-word").textContent = `Spell a ${wordLength}-letter word`;
    document.getElementById("spellingbee-strikes").textContent = `Strikes: ${strikes}/3`;
    document.getElementById("spellingbee-input").value = "";
    document.getElementById("spellingbee-input").disabled = false;
    document.getElementById("spellingbee-submit").disabled = false;
    
    document.getElementById("spellingbee-submit").onclick = () => checkSpelling(word);
    document.getElementById("spellingbee-input").onkeypress = (e) => {
      if (e.key === "Enter") checkSpelling(word);
    };

    function checkSpelling(targetWord) {
      const answer = document.getElementById("spellingbee-input").value.toUpperCase().trim();
      const statusEl = document.getElementById("spellingbee-status");
      
      if (!answer) return;
      
      if (answer === targetWord) {
        statusEl.textContent = `✓ Correct! ${targetWord}`;
        statusEl.className = "feedback-correct";
        wordLength++;
        setTimeout(playNextSpellingWord, 1500);
      } else {
        strikes++;
        statusEl.textContent = `✗ Wrong! The word was ${targetWord}`;
        statusEl.className = "feedback-incorrect";
        setTimeout(playNextSpellingWord, 1500);
      }
    }
  }
}
