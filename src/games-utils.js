// Game utilities and shared functions
export const COLORS = {
  PRIMARY: '#FF6B6B',
  SECONDARY: '#4ECDC4',
  ACCENT: '#FFE66D',
  X: '#FF6B6B',
  O: '#4ECDC4',
};

export const GAME_TYPES = [
  'tictactoe',
  'wordle',
  'geography',
  'wordscramble',
  'math',
  'trivia',
  'dotsboxes',
  'connect4',
  'spellingbee',
  'higherlow',
  'guessnumber',
  'coinflip',
  'boggle',
  'anagrams',
  'filler',
];

let dictionaries = {};

export async function loadDictionaries() {
  try {
    const categories = [
      'wordle',
      'all countries',
      'capitals',
      'europe',
      'asia',
      'africa',
      'north america',
      'south america',
      'oceania',
    ];

    for (const category of categories) {
      const filename = category.replace(' ', '-').toLowerCase();
      const response = await fetch(`/dictionaries/${filename}.txt`);
      if (response.ok) {
        const text = await response.text();
        dictionaries[category] = text.split('\n').filter((w) => w.trim());
      }
    }
    console.log('Dictionaries loaded:', Object.keys(dictionaries));
  } catch (error) {
    console.error('Failed to load dictionaries:', error);
  }
}

export function getDictionary(name) {
  return dictionaries[name] || [];
}

export function showAlert(title, message) {
  alert(`${title}\n\n${message}`);
}

export function showHowToPlay(gameName) {
  const guides = {
    tictactoe: 'Get three X\'s or O\'s in a row, column, or diagonal.',
    wordle:
      'Guess the 5-letter word in 6 tries. Green = correct position, Yellow = wrong position, Grey = not in word.',
    geography: 'Name countries or capitals from the selected region. Get 3 strikes and you lose.',
    wordscramble: 'Unscramble all 3 words before running out of attempts.',
    math: 'Solve the math problem. You get 3 attempts.',
    dotsboxes:
      'Complete lines between dots to claim boxes. The player with the most boxes wins.',
    connect4: 'Get 4 in a row horizontally, vertically, or diagonally to win.',
    spellingbee: 'Spell words with increasing difficulty. Miss 3 times and you lose.',
    higherlow:
      'Guess if the next number is higher or lower than the current one. You get a limited number of guesses.',
    guessnumber: 'Guess the secret number between 1 and 10.',
    coinflip: 'Tap to flip a coin! Call it correctly to win.',
    boggle: 'Find 3 or more words in the 4x4 letter grid. Words must be adjacent.',
    anagrams: 'Rearrange 7 letters to form valid words. Make 3 words to win.',
    filler:
      'Select colors to fill your territory. Block your opponent from expanding. First to a threshold wins.',
    trivia: 'Answer the trivia question correctly.',
  };

  showAlert('How to Play: ' + gameName, guides[gameName] || 'Information not available.');
}

export function getTitleCase(str) {
  return str
    .split(/(?=[A-Z])|(?=\d)/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
