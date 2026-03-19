use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Game {
    lines: Vec<(u8,u8)>,
}

pub fn new_game() -> String {
    serde_json::to_string(&Game{ lines: vec![] }).unwrap()
}

pub fn make_move(state:&str,data:&str)->String{
    let mut g:Game = serde_json::from_str(state).unwrap();

    let parts:Vec<u8>=data.split(',')
        .map(|x|x.parse().unwrap())
        .collect();

    g.lines.push((parts[0],parts[1]));

    serde_json::to_string(&g).unwrap()
}