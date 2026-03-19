use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetaGameState {
    pub board: Vec<Vec<String>>,
    pub current_player: String,
    pub game_status: String,
    pub scores: HashMap<String, i32>,
    pub difficulty: i32,
    pub player_names: Vec<String>,
}

impl MetaGameState {
    pub fn new(board_size: usize, difficulty: i32) -> Self {
        let board = vec![vec!["N".to_string(); board_size]; board_size];
        let mut scores = HashMap::new();
        scores.insert("X".to_string(), 0);
        scores.insert("O".to_string(), 0);
        
        MetaGameState {
            board,
            current_player: "X".to_string(),
            game_status: "playing".to_string(),
            scores,
            difficulty,
            player_names: vec!["Player 1".to_string(), "Player 2".to_string()],
        }
    }

    pub fn make_move(&mut self, row: usize, col: usize, player: String) -> bool {
        if row < self.board.len() && col < self.board[0].len() && self.board[row][col] == "N" {
            self.board[row][col] = player;
            return true;
        }
        false
    }

    pub fn check_win(&self) -> Option<String> {
        let size = self.board.len();
        
        // Check rows
        for row in &self.board {
            if row[0] != "N" && row.iter().all(|cell| cell == &row[0]) {
                return Some(row[0].clone());
            }
        }
        
        // Check columns
        for col in 0..size {
            if self.board[0][col] != "N" && (0..size).all(|row| self.board[row][col] == self.board[0][col]) {
                return Some(self.board[0][col].clone());
            }
        }
        
        // Check diagonals
        if self.board[0][0] != "N" && (0..size).all(|i| self.board[i][i] == self.board[0][0]) {
            return Some(self.board[0][0].clone());
        }
        
        if self.board[0][size - 1] != "N" && (0..size).all(|i| self.board[i][size - 1 - i] == self.board[0][size - 1]) {
            return Some(self.board[0][size - 1].clone());
        }
        
        None
    }

    pub fn is_draw(&self) -> bool {
        self.board.iter().all(|row| row.iter().all(|cell| cell != "N"))
    }

    pub fn switch_player(&mut self) {
        self.current_player = if self.current_player == "X" {
            "O".to_string()
        } else {
            "X".to_string()
        };
    }
}
