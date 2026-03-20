// Filler Mini Game

import { gameState } from '../game-utils/state.js';

export function initFiller(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-filler");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"];
  let colorCount = { "#FF6B6B": 0 };
  
  const board = document.getElementById("filler-board");
  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(5, 50px)";
  board.style.gap = "4px";
  board.style.margin = "20px auto";
  board.style.maxHeight = "300px";
  board.style.overflowY = "auto";
  
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    cell.style.width = "50px";
    cell.style.height = "50px";
    cell.style.backgroundColor = color;
    cell.style.border = "1px solid rgba(0,0,0,0.2)";
    cell.style.cursor = "pointer";
    
    if (color === "#FF6B6B") colorCount[color] = (colorCount[color] || 0) + 1;
    
    cell.onclick = () => {
      cell.style.backgroundColor = "#FF6B6B";
      colorCount["#FF6B6B"]++;
      
      if (colorCount["#FF6B6B"] >= 13) {
        document.getElementById("filler-status").textContent = "You filled 13 squares and won!";
        board.style.pointerEvents = "none";
        setTimeout(() => completeMiniGame(true), 1500);
      } else {
        document.getElementById("filler-status").textContent = `${colorCount["#FF6B6B"]}/13 squares filled`;
      }
    };
    
    board.appendChild(cell);
  }
  
  document.getElementById("filler-status").textContent = `${colorCount["#FF6B6B"]}/13 squares filled. Click to fill with red!`;
}
