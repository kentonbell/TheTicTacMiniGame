use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Game {
    board: Vec<Vec<char>>,
    player: char,
}

pub fn new_game() -> String {
    let board = vec![vec![' ';7];6];

    serde_json::to_string(&Game {
        board,
        player: 'R'
    }).unwrap()
}

pub fn make_move(state:&str, data:&str)->String{
    let mut g:Game = serde_json::from_str(state).unwrap();
    let col:usize = data.parse().unwrap();

    for row in (0..6).rev() {
        if g.board[row][col]==' ' {
            g.board[row][col]=g.player;
            break;
        }
    }

    g.player = if g.player=='R'{'Y'}else{'R'};

    serde_json::to_string(&g).unwrap()
}