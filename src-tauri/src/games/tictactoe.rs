use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TicTacToeGame {
    pub board: Vec<Vec<String>>,
    pub current_player: String,
    pub game_status: String,
}

impl TicTacToeGame {
    pub fn new(size: usize) -> Self {
        TicTacToeGame {
            board: vec![vec!["N".to_string(); size]; size],
            current_player: "X".to_string(),
            game_status: "playing".to_string(),
        }
    }

    pub fn make_move(&mut self, row: usize, col: usize) -> bool {
        if row < self.board.len() && col < self.board[0].len() && self.board[row][col] == "N" {
            self.board[row][col] = self.current_player.clone();
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
            if self.board[0][col] != "N" {
                let first = &self.board[0][col];
                if (0..size).all(|row| &self.board[row][col] == first) {
                    return Some(first.clone());
                }
            }
        }
        
        // Check main diagonal
        if self.board[0][0] != "N" {
            let first = &self.board[0][0];
            if (0..size).all(|i| &self.board[i][i] == first) {
                return Some(first.clone());
            }
        }
        
        // Check anti-diagonal
        if self.board[0][size - 1] != "N" {
            let first = &self.board[0][size - 1];
            if (0..size).all(|i| &self.board[i][size - 1 - i] == first) {
                return Some(first.clone());
            }
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
