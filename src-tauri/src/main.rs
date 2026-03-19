// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod games;
mod state;

use serde::{Deserialize, Serialize};
use games::*;
use state::*;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GameResponse {
    pub board: Vec<Vec<String>>,
    pub current_player: String,
    pub game_status: String,
    pub scores: std::collections::HashMap<String, i32>,
    pub mini_game_active: Option<MiniGameState>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MiniGameState {
    pub game_type: String,
    pub puzzle: String,
    pub attempts_remaining: i32,
    pub feedback: String,
}

#[tauri::command]
fn initialize_game(board_size: i32, difficulty: i32) -> GameResponse {
    let state = MetaGameState::new(board_size as usize, difficulty);
    state_to_response(&state)
}

#[tauri::command]
fn make_meta_move(_row: i32, _col: i32, _game_type: String) -> GameResponse {
    GameResponse {
        board: vec![vec!["".to_string(); 3]; 3],
        current_player: "X".to_string(),
        game_status: "error".to_string(),
        scores: std::collections::HashMap::new(),
        mini_game_active: None,
    }
}

#[tauri::command]
fn make_mini_game_move(move_data: String) -> MiniGameState {
    MiniGameState {
        game_type: "processing".to_string(),
        puzzle: String::new(),
        attempts_remaining: 0,
        feedback: move_data,
    }
}

#[tauri::command]
fn get_game_state() -> GameResponse {
    GameResponse {
        board: vec![vec!["".to_string(); 3]; 3],
        current_player: "X".to_string(),
        game_status: "playing".to_string(),
        scores: std::collections::HashMap::new(),
        mini_game_active: None,
    }
}

fn state_to_response(state: &MetaGameState) -> GameResponse {
    GameResponse {
        board: state.board.clone(),
        current_player: state.current_player.clone(),
        game_status: state.game_status.clone(),
        scores: state.scores.clone(),
        mini_game_active: None,
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            initialize_game,
            make_meta_move,
            make_mini_game_move,
            get_game_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
