// Coin Flip Mini Game

export function initCoinFlip(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-coinflip");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  const coin = document.getElementById("coin-display");
  const options = document.getElementById("coinflip-options");
  const resultEl = document.getElementById("coinflip-result");
  
  // Reset state
  coin.textContent = "Call heads or tails!";
  coin.style.cursor = "default";
  coin.onclick = null;
  options.style.display = "block";
  resultEl.style.display = "none";
  
  let userCall = null;
  let flipResult = null;
  
  window.callCoinFlip = function(call) {
    userCall = call;
    coin.textContent = "🪙 Tap to flip!";
    coin.style.cursor = "pointer";
    options.style.display = "none";
    
    coin.onclick = () => {
      if (flipResult !== null) return; // Prevent multiple flips
      
      flipResult = Math.random() > 0.5 ? "heads" : "tails";
      coin.textContent = flipResult === "heads" ? "🪙 HEADS" : "🪙 TAILS";
      coin.style.cursor = "default";
      coin.onclick = null;
      
      const won = userCall === flipResult;
      resultEl.textContent = won ? `✓ You called ${userCall} and won!` : `✗ You called ${userCall} but it was ${flipResult}!`;
      resultEl.className = won ? "feedback-correct" : "feedback-incorrect";
      resultEl.style.display = "block";
      
      setTimeout(() => completeMiniGame(won), 2000);
    };
  };
}
