use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectFourGame {
    pub board: Vec<Vec<String>>,
    pub current_player: String,
    pub game_status: String,
}

impl ConnectFourGame {
    pub fn new() -> Self {
        ConnectFourGame {
            board: vec![vec!["N".to_string(); 7]; 6],
            current_player: "X".to_string(),
            game_status: "playing".to_string(),
        }
    }

    pub fn make_move(&mut self, col: usize) -> bool {
        for row in (0..self.board.len()).rev() {
            if self.board[row][col] == "N" {
                self.board[row][col] = self.current_player.clone();
                return true;
            }
        }
        false
    }

    pub fn check_win(&self) -> Option<String> {
        let rows = self.board.len();
        let cols = self.board[0].len();

        // Check horizontal
        for row in 0..rows {
            for col in 0..cols - 3 {
                if self.board[row][col] != "N"
                    && self.board[row][col] == self.board[row][col + 1]
                    && self.board[row][col] == self.board[row][col + 2]
                    && self.board[row][col] == self.board[row][col + 3]
                {
                    return Some(self.board[row][col].clone());
                }
            }
        }

        // Check vertical
        for row in 0..rows - 3 {
            for col in 0..cols {
                if self.board[row][col] != "N"
                    && self.board[row][col] == self.board[row + 1][col]
                    && self.board[row][col] == self.board[row + 2][col]
                    && self.board[row][col] == self.board[row + 3][col]
                {
                    return Some(self.board[row][col].clone());
                }
            }
        }

        // Check diagonal (top-left to bottom-right)
        for row in 0..rows - 3 {
            for col in 0..cols - 3 {
                if self.board[row][col] != "N"
                    && self.board[row][col] == self.board[row + 1][col + 1]
                    && self.board[row][col] == self.board[row + 2][col + 2]
                    && self.board[row][col] == self.board[row + 3][col + 3]
                {
                    return Some(self.board[row][col].clone());
                }
            }
        }

        // Check diagonal (top-right to bottom-left)
        for row in 0..rows - 3 {
            for col in 3..cols {
                if self.board[row][col] != "N"
                    && self.board[row][col] == self.board[row + 1][col - 1]
                    && self.board[row][col] == self.board[row + 2][col - 2]
                    && self.board[row][col] == self.board[row + 3][col - 3]
                {
                    return Some(self.board[row][col].clone());
                }
            }
        }

        None
    }

    pub fn switch_player(&mut self) {
        self.current_player = if self.current_player == "X" {
            "O".to_string()
        } else {
            "X".to_string()
        };
    }
}
