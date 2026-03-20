// Games Module - Exports all game initializers

export { initMiniTicTacToe } from '../games/tictactoe.js';
export { initWordle } from '../games/wordle.js';
export { initGeography } from '../games/geography.js';
export { initWordScramble } from '../games/wordscramble.js';
export { initMath } from '../games/math.js';
export { initDotsAndBoxes } from '../games/dotsboxes.js';
export { initConnect4 } from '../games/connect4.js';
export { initAnagrams } from '../games/anagrams.js';
export { initSpellingBee } from '../games/spellingbee.js';
export { initHigherLower } from '../games/higherlower.js';
export { initGuessNumber } from '../games/guessnumber.js';
export { initCoinFlip } from '../games/coinflip.js';
export { initBoggle } from '../games/boggle.js';
export { initFiller } from '../games/filler.js';

export { getTitleCase, showAlert, showHowToPlay, loadDictionaries } from './utils.js';
export { gameState, dictionaries, getRandomGame } from './state.js';
