use serde::{Deserialize, Serialize};
use rand::Rng;

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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WordleGame {
    pub word: String,
    pub guesses_remaining: i32,
    pub guesses_made: Vec<String>,
    pub feedback: Vec<Vec<String>>,
    pub game_status: String,
}

impl WordleGame {
    pub fn new(difficulty: i32) -> Self {
        let words = vec![
            "SWIFT", "TAURI", "HELLO", "WORLD", "RUST",
            "GAMES", "MUSIC", "DANCE", "PAINT", "BUILD",
            "SOLVE", "THINK", "LEARN", "CHESS", "APPLE"
        ];
        let mut rng = rand::thread_rng();
        let word = words[rng.gen_range(0..words.len())].to_string();
        let guesses_remaining = 8 - difficulty;
        
        WordleGame {
            word,
            guesses_remaining,
            guesses_made: Vec::new(),
            feedback: Vec::new(),
            game_status: "playing".to_string(),
        }
    }

    pub fn make_guess(&mut self, guess: &str) -> Vec<String> {
        let guess = guess.to_uppercase();
        if guess.len() != 5 {
            return vec!["error".to_string()];
        }

        let mut feedback = vec!["gray".to_string(); 5];
        let word_chars: Vec<char> = self.word.chars().collect();
        let guess_chars: Vec<char> = guess.chars().collect();
        let mut word_used = vec![false; 5];

        // First pass: mark correct positions
        for i in 0..5 {
            if guess_chars[i] == word_chars[i] {
                feedback[i] = "green".to_string();
                word_used[i] = true;
            }
        }

        // Second pass: mark wrong positions
        for i in 0..5 {
            if feedback[i] != "green" {
                for j in 0..5 {
                    if !word_used[j] && guess_chars[i] == word_chars[j] {
                        feedback[i] = "yellow".to_string();
                        word_used[j] = true;
                        break;
                    }
                }
            }
        }

        self.guesses_made.push(guess.clone());
        self.feedback.push(feedback.clone());
        self.guesses_remaining -= 1;

        if guess == self.word {
            self.game_status = "won".to_string();
        } else if self.guesses_remaining <= 0 {
            self.game_status = "lost".to_string();
        }

        feedback
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeographyGame {
    pub category: String,
    pub target_count: i32,
    pub current_count: i32,
    pub found_items: Vec<String>,
    pub attempts_remaining: i32,
    pub game_status: String,
}

impl GeographyGame {
    pub fn new(difficulty: i32) -> Self {
        let categories = vec!["Europe", "Asia", "Africa", "Americas", "Capitals"];
        let mut rng = rand::thread_rng();
        let category = categories[rng.gen_range(0..categories.len())].to_string();
        let target_count = 3 + difficulty * 2;
        
        GeographyGame {
            category,
            target_count,
            current_count: 0,
            found_items: Vec::new(),
            attempts_remaining: 3,
            game_status: "playing".to_string(),
        }
    }

    pub fn check_answer(&mut self, answer: &str) -> bool {
        let answer = answer.to_uppercase();
        
        // Simple geography database
        let valid_items = match self.category.as_str() {
            "Europe" => vec!["FRANCE", "GERMANY", "SPAIN", "ITALY", "POLAND", "SWEDEN"],
            "Asia" => vec!["JAPAN", "CHINA", "INDIA", "KOREA", "THAILAND", "VIETNAM"],
            "Africa" => vec!["EGYPT", "SUDAN", "KENYA", "NIGERIA", "CONGO", "ETHIOPIA"],
            "Americas" => vec!["CANADA", "USA", "MEXICO", "BRAZIL", "COLOMBIA", "ARGENTINA"],
            "Capitals" => vec!["PARIS", "BERLIN", "MADRID", "ROME", "WARSAW", "STOCKHOLM"],
            _ => vec![],
        };

        if valid_items.contains(&answer.as_str()) && !self.found_items.contains(&answer) {
            self.found_items.push(answer);
            self.current_count += 1;
            
            if self.current_count >= self.target_count {
                self.game_status = "won".to_string();
                return true;
            }
            return true;
        }

        if valid_items.contains(&answer.as_str()) && self.found_items.contains(&answer) {
            self.attempts_remaining -= 1;
            if self.attempts_remaining <= 0 {
                self.game_status = "lost".to_string();
            }
        } else {
            self.attempts_remaining -= 1;
            if self.attempts_remaining <= 0 {
                self.game_status = "lost".to_string();
            }
        }
        false
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WordScrambleGame {
    pub word: String,
    pub scrambled: String,
    pub attempts_remaining: i32,
    pub game_status: String,
}

impl WordScrambleGame {
    pub fn new(difficulty: i32) -> Self {
        let words = vec![
            "TAURI", "SWIFT", "RUST", "GAMES", "MUSIC",
            "DANCE", "BUILD", "LEARN", "CHESS", "APPLE"
        ];
        let mut rng = rand::thread_rng();
        let word = words[rng.gen_range(0..words.len())].to_string();
        let mut chars: Vec<char> = word.chars().collect();
        
        // Shuffle the word
        for i in 0..chars.len() {
            let j = rng.gen_range(i..chars.len());
            chars.swap(i, j);
        }
        
        let scrambled: String = chars.iter().collect();
        let attempts_remaining = 5 - difficulty;
        
        WordScrambleGame {
            word,
            scrambled,
            attempts_remaining,
            game_status: "playing".to_string(),
        }
    }

    pub fn check_answer(&mut self, answer: &str) -> bool {
        let answer = answer.to_uppercase();
        if answer == self.word {
            self.game_status = "won".to_string();
            return true;
        }
        
        self.attempts_remaining -= 1;
        if self.attempts_remaining <= 0 {
            self.game_status = "lost".to_string();
        }
        false
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DotsAndBoxesGame {
    pub grid: Vec<Vec<i32>>,
    pub edges_h: Vec<Vec<bool>>,
    pub edges_v: Vec<Vec<bool>>,
    pub game_status: String,
}

impl DotsAndBoxesGame {
    pub fn new() -> Self {
        let size = 4;
        DotsAndBoxesGame {
            grid: vec![vec![0; size]; size],
            edges_h: vec![vec![false; size]; size + 1],
            edges_v: vec![vec![false; size + 1]; size],
            game_status: "playing".to_string(),
        }
    }

    pub fn make_move(&mut self, row: usize, col: usize, direction: String) -> (bool, bool) {
        let mut box_completed = false;
        let mut current_player_scored = false;

        if direction == "h" && row < self.edges_h.len() && col < self.edges_h[0].len() {
            if !self.edges_h[row][col] {
                self.edges_h[row][col] = true;
                (box_completed, current_player_scored) = self.check_boxes();
            }
        } else if direction == "v" && row < self.edges_v.len() && col < self.edges_v[0].len() {
            if !self.edges_v[row][col] {
                self.edges_v[row][col] = true;
                (box_completed, current_player_scored) = self.check_boxes();
            }
        }

        (box_completed, current_player_scored)
    }

    fn check_boxes(&mut self) -> (bool, bool) {
        (false, false)  // Simplified for now
    }
}

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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MathGame {
    pub question: String,
    pub answer: i32,
    pub attempts_remaining: i32,
    pub game_status: String,
}

impl MathGame {
    pub fn new(difficulty: i32) -> Self {
        let mut rng = rand::thread_rng();
        let a = rng.gen_range(1..10 * difficulty);
        let b = rng.gen_range(1..10 * difficulty);
        let op_idx = rng.gen_range(0..3);
        
        let (question, answer) = match op_idx {
            0 => {
                let ans = a + b;
                (format!("{} + {} = ?", a, b), ans)
            }
            1 => {
                let ans = a * b;
                (format!("{} × {} = ?", a, b), ans)
            }
            _ => {
                let ans = a.max(b) - a.min(b);
                (format!("{} - {} = ?", a.max(b), a.min(b)), ans as i32)
            }
        };

        MathGame {
            question,
            answer,
            attempts_remaining: 3,
            game_status: "playing".to_string(),
        }
    }

    pub fn check_answer(&mut self, user_answer: i32) -> bool {
        if user_answer == self.answer {
            self.game_status = "won".to_string();
            return true;
        }
        
        self.attempts_remaining -= 1;
        if self.attempts_remaining <= 0 {
            self.game_status = "lost".to_string();
        }
        false
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TriviaGame {
    pub question: String,
    pub options: Vec<String>,
    pub correct_answer: usize,
    pub attempts_remaining: i32,
    pub game_status: String,
}

impl TriviaGame {
    pub fn new(_difficulty: i32) -> Self {
        let trivia = vec![
            (
                "What year was Rust released?".to_string(),
                vec!["2010".to_string(), "2012".to_string(), "2014".to_string(), "2015".to_string()],
                1,
            ),
            (
                "What is the capital of France?".to_string(),
                vec!["Lyon".to_string(), "Paris".to_string(), "Marseille".to_string(), "Nice".to_string()],
                1,
            ),
        ];
        
        let mut rng = rand::thread_rng();
        let (question, options, correct) = &trivia[rng.gen_range(0..trivia.len())];
        
        TriviaGame {
            question: question.clone(),
            options: options.clone(),
            correct_answer: *correct,
            attempts_remaining: 1,
            game_status: "playing".to_string(),
        }
    }

    pub fn check_answer(&mut self, user_answer: usize) -> bool {
        if user_answer == self.correct_answer {
            self.game_status = "won".to_string();
            return true;
        }
        
        self.attempts_remaining -= 1;
        self.game_status = "lost".to_string();
        false
    }
}
