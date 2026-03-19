function renderTicTacToe(game) {
  const div = document.getElementById("game");
  div.innerHTML = "";

  game.board.forEach((v, i) => {
    const cell = document.createElement("button");
    cell.textContent = v;
    cell.onclick = () => move(i.toString());
    div.appendChild(cell);
  });
}