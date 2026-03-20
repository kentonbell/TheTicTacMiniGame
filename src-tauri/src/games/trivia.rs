use serde::{Deserialize, Serialize};
use rand::Rng;

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
