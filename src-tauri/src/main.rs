// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod game_manager;
mod tictactoe;
mod anagrams;
mod dotsboxes;
mod connect4;

use game_manager::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_game,
            make_move,
            get_state
        ])
        .run(tauri::generate_context!())
        .expect("error running app");
}