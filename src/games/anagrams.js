// Anagrams Mini Game

export function initAnagrams(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-anagrams");
  gameContainer.classList.remove("hidden");

  const words = ["LISTEN", "EVIL", "HEART", "SILENT", "VILE", "EARTH"];
  let currentIndex = 0;
  let score = 0;

  function shuffleWord(word) {
    return word.split("").sort(() => Math.random() - 0.5).join("");
  }

  function renderAnagrams() {
    const wordEl = document.getElementById("anagrams-word");
    const feedbackEl = document.getElementById("anagrams-feedback");
    const inputEl = document.getElementById("anagrams-input");
    const scoreEl = document.getElementById("anagrams-score");

    if (currentIndex < words.length) {
      wordEl.textContent = shuffleWord(words[currentIndex]);
      scoreEl.textContent = `Score: ${score}/${words.length}`;
      feedbackEl.textContent = "";
      inputEl.value = "";
      inputEl.focus();
    } else {
      completeMiniGame(score > words.length / 2);
    }
  }

  window.submitAnagram = function () {
    const inputEl = document.getElementById("anagrams-input");
    const feedbackEl = document.getElementById("anagrams-feedback");
    const answer = inputEl.value.toUpperCase().trim();

    if (answer === words[currentIndex]) {
      feedbackEl.textContent = "✓ Correct!";
      feedbackEl.style.color = "#4ECDC4";
      score++;
    } else {
      feedbackEl.textContent = `✗ Wrong! The answer was ${words[currentIndex]}`;
      feedbackEl.style.color = "#FF6B6B";
    }

    currentIndex++;
    setTimeout(renderAnagrams, 1500);
  };

  renderAnagrams();
}
