// Dots and Boxes Mini Game

import { gameState } from '../game-utils/state.js';

export function initDotsAndBoxes(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-dotsboxes");
  gameContainer.classList.remove("hidden");

  const grid = document.getElementById("dotsboxes-grid");
  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(3, 60px)";
  grid.style.gap = "8px";
  grid.style.margin = "20px auto";
  grid.style.maxHeight = "200px";
  grid.style.overflowY = "auto";

  let linesCompleted = 0;
  const currentPlayerColor = gameState.currentPlayer === "X" ? "#FF6B6B" : "#4ECDC4";

  for (let i = 0; i < 9; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.width = "30px";
    dot.style.height = "30px";
    dot.style.borderRadius = "50%";
    dot.style.backgroundColor = "#f8efc5";
    dot.style.border = "2px solid rgba(255,255,255,0.3)";
    dot.style.cursor = "pointer";
    dot.style.transition = "all 0.3s";
    
    dot.onclick = () => {
      linesCompleted++;
      dot.style.backgroundColor = currentPlayerColor;
      dot.style.transform = "scale(0.8)";
      
      if (linesCompleted >= 5) {
        document.getElementById("dotsboxes-status").textContent = "You completed the grid!";
        setTimeout(() => completeMiniGame(true), 1000);
      }
    };
    grid.appendChild(dot);
  }

  document.getElementById("dotsboxes-status").textContent = "Click dots to complete lines (5 lines needed)";
}
