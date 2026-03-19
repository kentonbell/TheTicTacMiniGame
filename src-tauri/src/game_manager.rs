use serde::{Serialize, Deserialize};
use std::sync::Mutex;

use crate::{tictactoe, connect4, dotsboxes, anagrams};

#[derive(Default)]
pub struct AppState {
    pub current_game: String,
    pub state: String,
}

static GLOBAL_STATE: Mutex<AppState> =
    Mutex::new(AppState {
        current_game: String::new(),
        state: String::new(),
    });

#[tauri::command]
pub fn start_game(game: String) -> String {
    let mut gs = GLOBAL_STATE.lock().unwrap();

    gs.current_game = game.clone();

    gs.state = match game.as_str() {
        "tictactoe" => tictactoe::new_game(),
        "connect4" => connect4::new_game(),
        "dotsboxes" => dotsboxes::new_game(),
        "anagrams" => anagrams::new_game(),
        _ => "{}".into(),
    };

    gs.state.clone()
}

#[tauri::command]
pub fn make_move(data: String) -> String {
    let mut gs = GLOBAL_STATE.lock().unwrap();

    gs.state = match gs.current_game.as_str() {
        "tictactoe" => tictactoe::make_move(&gs.state, &data),
        "connect4" => connect4::make_move(&gs.state, &data),
        "dotsboxes" => dotsboxes::make_move(&gs.state, &data),
        "anagrams" => anagrams::make_move(&gs.state, &data),
        _ => gs.state.clone(),
    };

    gs.state.clone()
}

#[tauri::command]
pub fn get_state() -> String {
    GLOBAL_STATE.lock().unwrap().state.clone()
}