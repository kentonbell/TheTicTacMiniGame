# The Tic-Tac Mini Game

![Tauri](https://img.shields.io/badge/Tauri_2-cross--platform-24C8D8?style=for-the-badge&logo=tauri&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-14_mini--games-F7DF1E?style=flat-square&logo=javascript&logoColor=111)
![Rust](https://img.shields.io/badge/Rust-native_shell-000?style=flat-square&logo=rust)

A cross-platform strategy game where every move becomes another game. Players compete on a 3×3, 4×4, or 5×5 outer board; selecting a square launches one of 14 mini-games, and the mini-game result determines who claims that square.

![Desktop match configuration with players, board size, and difficulty](<images/Screenshot 2026-09-12 at 2.46.28 PM.png>)

## Why it is different

Ordinary tic-tac-toe asks whether a square is strategically useful. The Tic-Tac Mini Game adds a second question: can you earn it? Word knowledge, geography, arithmetic, pattern recognition, classic board games, and chance all feed into the same larger match.

```text
select outer square
        ↓
random mini-game
        ↓
 win                 lose / forfeit
  ↓                         ↓
current player       opposing player
claims square        claims square
        ↘             ↙
        evaluate outer board
```

## Responsive setup

The configuration screen supports one-player CPU matches and local two-player matches, four difficulty levels, custom names, and three board sizes. The layout scales from a compact desktop window to a phone-sized Android build.

![Android setup on a narrow screen](<images/Screenshot 2026-09-12 at 3.01.47 PM.png>)

![Two-player Android setup with a larger board and harder difficulty](<images/Screenshot 2026-09-12 at 3.03.19 PM.png>)

## Outer-board strategy

The central board keeps ownership, current player, match status, and quit/settings actions visible. The same rendering logic supports the different board sizes, while row, column, and diagonal checks determine the winner.

![Desktop outer board during a match](<images/Screenshot 2026-09-12 at 2.50.00 PM.png>)

![A later board state showing competing square ownership](<images/Screenshot 2026-09-12 at 2.51.55 PM.png>)

When the match ends, a dedicated result screen reports the winner and final square totals before offering replay or return to the main menu.

![Game-over screen and final score](<images/Screenshot 2026-09-12 at 2.52.05 PM.png>)

## Fourteen mini-games

Every mini-game has its own initialization and completion logic but reports the same win/loss contract back to the outer board.

| Mini-game | Challenge |
|---|---|
| Tic-Tac-Toe | Win a compact 3×3 board |
| Wordle | Solve a five-letter word with positional feedback |
| Geography | Name valid countries or capitals from a selected region |
| Word Scramble | Recover words from shuffled letters |
| Math | Solve difficulty-scaled arithmetic |
| Dots & Boxes | Capture enough points in a simplified dot grid |
| Connect Four | Build a horizontal, vertical, or diagonal line of four |
| Spelling Bee | Continue through increasingly long words before three strikes |
| Higher or Lower | Narrow a difficulty-scaled numeric range |
| Guess Number | Find a secret number with limited attempts |
| Coin Flip | Call heads or tails |
| Boggle | Trace and validate words on a 4×4 letter grid |
| Anagrams | Build valid words from seven letters |
| Filler | Control a majority of a 5×5 color grid |

The mobile captures show how very different interaction styles remain visually consistent within the same shell.

![Filler territory-control mini-game](<images/Screenshot 2026-09-12 at 3.03.56 PM.png>)

![Coin-flip mini-game](<images/Screenshot 2026-09-12 at 3.04.21 PM.png>)

![Geography knowledge challenge](<images/Screenshot 2026-09-12 at 3.07.03 PM.png>)

![Connect Four challenge in the desktop shell](<images/Screenshot 2026-09-12 at 2.48.16 PM.png>)

## Architecture

The project separates shared flow from individual game rules:

```text
src/
├── main.js                            # Startup, event wiring, square selection
├── game-board.js                      # Outer-board initialization and rendering
├── game-flow.js                       # Turn resolution, CPU move, win/draw logic
├── ui-management.js                  # Screens, settings, dialogs, responsive state
├── game-utils/                        # Shared state and utilities
├── games/                             # One module per mini-game
├── assets/dictionaries/               # Word and geography validation data
├── index.html                         # All screen structures
└── styles.css                         # Theme, grids, animations, responsive rules
```

The frontend is vanilla ES modules. Tauri 2 supplies the native Rust shell, packaging configuration, and generated Apple/Android projects. Keeping mini-games in separate modules makes the codebase easier to navigate and allows a new game to join the existing flow through one initializer and one completion callback.

## Run locally

Prerequisites: Node.js, pnpm, Rust, and the platform prerequisites for Tauri 2.

```bash
pnpm install
pnpm tauri dev
```

Build a distributable application with:

```bash
pnpm tauri build
```

The detailed manual verification matrix is available in [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Skills demonstrated

JavaScript modules, state machines, responsive UI, procedural grid rendering, reusable game contracts, algorithmic win detection, dictionary-backed validation, local multiplayer, CPU behavior, Rust/Tauri packaging, and adapting one product across desktop and mobile.
