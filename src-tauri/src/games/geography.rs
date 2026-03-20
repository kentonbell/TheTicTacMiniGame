use serde::{Deserialize, Serialize};
use rand::Rng;

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
