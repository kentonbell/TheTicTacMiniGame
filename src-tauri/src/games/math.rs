use serde::{Deserialize, Serialize};
use rand::Rng;

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
