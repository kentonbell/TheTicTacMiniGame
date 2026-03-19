const { invoke } = window.__TAURI__.core;

async function start(name) {
  const state = await invoke("start_game", { game: name });
  render(name, JSON.parse(state));
}

async function move(data) {
  const state = await invoke("make_move", { data });
  render(currentGame, JSON.parse(state));
}