use serde::{Deserialize, Serialize};
use rand::Rng;

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
