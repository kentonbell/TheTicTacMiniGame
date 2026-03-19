use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Game {
    letters: Vec<char>,
    score: u32,
}

pub fn new_game()->String{
    serde_json::to_string(&Game{
        letters: vec!['T','A','C','T','I','C'],
        score:0
    }).unwrap()
}

pub fn make_move(state:&str,data:&str)->String{
    let mut g:Game=serde_json::from_str(state).unwrap();

    if data.len()>=3 {
        g.score += data.len() as u32;
    }

    serde_json::to_string(&g).unwrap()
}