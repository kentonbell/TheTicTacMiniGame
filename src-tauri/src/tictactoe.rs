use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Game {
    board: Vec<char>,
    player: char,
}

pub fn new_game() -> String {
    let g = Game {
        board: vec![' '; 9],
        player: 'X',
    };

    serde_json::to_string(&g).unwrap()
}

pub fn make_move(state: &str, data: &str) -> String {
    let mut game: Game = serde_json::from_str(state).unwrap();
    let index: usize = data.parse().unwrap();

    if game.board[index] == ' ' {
        game.board[index] = game.player;
        game.player = if game.player == 'X' { 'O' } else { 'X' };
    }

    serde_json::to_string(&game).unwrap()
}