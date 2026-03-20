// Games module - contains all mini-game implementations

pub mod tictactoe;
pub mod wordle;
pub mod geography;
pub mod word_scramble;
pub mod dots_and_boxes;
pub mod connect_four;
pub mod math;
pub mod trivia;

// Re-export all game types for convenient access
#[allow(unused_imports)]
pub use tictactoe::TicTacToeGame;
#[allow(unused_imports)]
pub use wordle::WordleGame;
#[allow(unused_imports)]
pub use geography::GeographyGame;
#[allow(unused_imports)]
pub use word_scramble::WordScrambleGame;
#[allow(unused_imports)]
pub use dots_and_boxes::DotsAndBoxesGame;
#[allow(unused_imports)]
pub use connect_four::ConnectFourGame;
#[allow(unused_imports)]
pub use math::MathGame;
#[allow(unused_imports)]
pub use trivia::TriviaGame;
