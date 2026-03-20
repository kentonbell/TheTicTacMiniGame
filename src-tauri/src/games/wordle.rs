use serde::{Deserialize, Serialize};
use rand::Rng;

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
