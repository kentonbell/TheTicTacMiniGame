// Math Mini Game

import { gameState } from './state.js';

export function initMath(completeMiniGame) {
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
