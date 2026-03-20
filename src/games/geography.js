// Geography Mini Game

import { dictionaries, gameState } from '../game-utils/state.js';

export function initGeography(completeMiniGame) {
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
