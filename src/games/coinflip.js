// Coin Flip Mini Game

export function initCoinFlip(completeMiniGame) {
  const gameContainer = document.getElementById("minigame-coinflip");
  if (!gameContainer) return;
  
  gameContainer.classList.remove("hidden");
  
  let flipResult = null;
  const coin = document.getElementById("coin-display");
  coin.textContent = "🪙 Tap to flip!";
  coin.style.cursor = "pointer";
  coin.style.fontSize = "3em";
  coin.style.margin = "20px";
  
  coin.onclick = () => {
    flipResult = Math.random() > 0.5 ? "heads" : "tails";
    coin.textContent = flipResult === "heads" ? "🪙 HEADS" : "🪙 TAILS";
    coin.style.cursor = "default";
    document.getElementById("coinflip-options").style.display = "block";
  };
  
  window.callCoinFlip = function(call) {
    window.callCoinFlip = null;
    
    const won = (call === "heads" && flipResult === "heads") || (call === "tails" && flipResult === "tails");
    
    const resultEl = document.getElementById("coinflip-result");
    resultEl.textContent = won ? `✓ You called ${call} and won!` : `✗ You called ${call} but it was ${flipResult}!`;
    resultEl.className = won ? "feedback-correct" : "feedback-incorrect";
    resultEl.style.display = "block";
    
    document.getElementById("coinflip-options").style.display = "none";
    
    setTimeout(() => completeMiniGame(won), 2000);
  };
}
