use serde::{Deserialize, Serialize};

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
