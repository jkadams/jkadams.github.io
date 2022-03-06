const LetterState = {};
LetterState.UNKNOWN = 'empty';
LetterState.ABSENT = 'absent';
LetterState.ELSEWHERE = 'elsewhere';
LetterState.CORRECT = 'correct';
const START_HELP_TEXT = 'Enter a word for someone to guess!\nOr choose a random word.';

const GameState = {};
GameState.CHOOSING_WORD = 'choose';
GameState.GUESSING_WORD = 'guess';
GameState.COMPLETE = 'complete';

const CORRECT_COLOR = '#F7A8B8';
const ELSEWHERE_COLOR = '#55CDFC';

const DEFAULT_WORD_SIZE = 4;

const ENTER_KEY = '\u21A9';
const BACKSPACE_KEY = '\u232B';
const keys = ['qwertyuiop', 'asdfghjkl', ENTER_KEY + 'zxcvbnm' + BACKSPACE_KEY];


class Game {
  constructor() {
  }

  newGame() {
    this.stateList = [];
    this.guessList = [];
    this.keyStates = {};
    this.pendingTarget = '';
    this.guess = '';
    this.board = document.getElementsByClassName('board')[0];
    while (this.board.firstChild) {
      this.board.removeChild(this.board.firstChild);
    }
    this.board.className = 'board';
    this.gameState = GameState.CHOOSING_WORD;
    
    const row = document.createElement('div');
    row.className = 'row';
    this.board.appendChild(row);
    const randomButton = document.getElementById('random');
    randomButton.style.visibility = 'visible';
    row.innerText = START_HELP_TEXT;
  }

  chooseWord(target) {
    if (words.indexOf(target) < 0) {
      if (target.length == 0) {
        this.showNotification(START_HELP_TEXT);
      } else {
        this.showNotification('Unknown word ' + target.toUpperCase() + '');
      }
      return null;
    }
    this.size = target.length;
    this.target = target;
    this.targetWordList = wordsByLength[this.target.length];
    this.board.removeChild(this.board.firstChild);
    this.startNewRow();
    this.gameState = GameState.GUESSING_WORD;
    const randomButton = document.getElementById('random');
    randomButton.style.visibility = 'hidden';
    this.updateGuess();
  }

  chooseRandomWord(size) {
    let target = '';
    if (size == 4) {
      let attemptedTarget = null;
      while (!attemptedTarget) {
        attemptedTarget = freq[Math.floor(Math.random() * freq.length)];
        if (wordsByLength[size].indexOf(attemptedTarget) < 0) {
          attemptedTarget = null;
        }
      }
      target = attemptedTarget;
    } else {
      const max = wordsByLength[size].length;
      target = wordsByLength[size][Math.floor(Math.random() * max)];
    }
    this.chooseWord(target);
  }

  startNewRow() {
    const row = document.createElement('div');
    row.className = 'row';
    this.board.appendChild(row);
    this.updateGuess();
  }

  letterCounts(word) {
    const counts = {};
    for (let i = 0; i < word.length; i++) {
      let count = counts[word[i]] || 0;
      counts[word[i]] = count + 1;
    }
    return counts;
  }

  showNotification(text, timeout = 10000) {
    const notif = document.getElementsByClassName('notification')[0];
    if (!text || text === '') {
      notif.style.visibility = 'hidden';
      if (this.timer_) {
        clearTimeout(this.timer_);
      }
    } else {
      notif.innerText = text;
      notif.style.visibility = 'visible';
      if (this.timer_) {
        clearTimeout(this.timer_);
      }
      this.timer_ = setTimeout(() => notif.style.visibility = 'hidden', timeout);
    }
  }
  commitWord() {
    this.chooseWord(this.pendingTarget);
    this.pendingTarget = '';
  }

  guessWord() {
    const input = this.guess.toLowerCase();
    if (input.length !== this.size) {
      return;
    }
    const states = this.wordStates(input);
    if (states == null) {
      // Invalid word
      this.showNotification('Unknown word ' + input.toUpperCase());
      return;
    }
    this.showNotification(null);
    this.updateGuess(states);
    this.guessList.push(this.guess);
    this.stateList.push(states);

    this.updateKeys();
    if (this.guess === this.target) {
      this.board.className = 'board won';
      this.gameState = GameState.COMPLETE;
      this.showNotification('Got it in ' + this.stateList.length +'! Press R or Enter to restart.');
    } else {
      this.guess = '';
      this.startNewRow();
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
  updateKeys() {
    for (let i = 0; i < this.guessList.length; i++) {
      const guess = this.guessList[i];
      for (let j = 0; j < guess.length; j++) {
        const letter = guess.charAt(j);
        keyMap[letter].className = 'key used';
      }
    }
  }

  makeLetter(state, l) {
    const letter = document.createElement('div');
    letter.className = 'letter ' + state;
    if (l) {
      letter.appendChild(document.createTextNode(l.toUpperCase()));
    }
    return letter;
  }

  typeLetter(letter) {
    if (this.gameState == GameState.CHOOSING_WORD) {
      this.pendingTarget += letter;
    } else {
      if (this.guess.length < this.size) {
        this.guess += letter;
      }
    }
    this.updateGuess();

  }

  deleteLetterTarget() {
    if (this.pendingTarget.length >= 1) {
      this.pendingTarget = this.pendingTarget.substring(0, this.pendingTarget.length - 1);
    }
    this.updateGuess();
    if (this.pendingTarget.length === 0) {
      const row = this.board.lastChild;
      row.innerText = START_HELP_TEXT;
    }
  }

  deleteLetterGuess() {
    if (this.guess.length >= 1) {
      this.guess = this.guess.substring(0, this.guess.length - 1);
    }
    this.updateGuess();
  }

  updateGuess(states) {
    const row = this.board.lastChild;
    while (row.firstChild) {
      row.removeChild(row.firstChild);
    }
    if (this.gameState == GameState.CHOOSING_WORD) {
      for (let i = 0; i < this.pendingTarget.length; i++) {
        row.appendChild(this.makeLetter(LetterState.UNKNOWN, this.pendingTarget[i]));
      }
      return;
    }
    // const player = document.createElement('div');
    // player.className = 'counter';
    // player.appendChild(document.createTextNode(this.stateList.length + 1));
    // row.appendChild(player);
    for (let i = 0; i < this.target.length; i++) {
      // row.appendChild(this.makeLetter(states ? states[i] : LetterState.UNKNOWN, this.guess[i]));
      row.appendChild(this.makeLetter(LetterState.UNKNOWN, this.guess[i]));
    }
    let correct = '';
    let elsewhere = '';
    if (states) {
      correct = 0;
      elsewhere = 0;
      for (let i = 0; i < states.length; i++) {
        if (states[i] === LetterState.CORRECT) {
          correct++;
        } else if (states[i] === LetterState.ELSEWHERE) {
          elsewhere++;
        }
      }
    }
    row.appendChild(this.createCountNode(correct, CORRECT_COLOR));
    row.appendChild(this.createCountNode(elsewhere, ELSEWHERE_COLOR));
  }

  createCountNode(count, color) {
    const player = document.createElement('div');
    player.className = 'state';
    player.style.backgroundColor = color;
    player.appendChild(document.createTextNode(count));
    return player;
  }

  wordStates(input) {
    if (input.length !== this.target.length) {
      return null;
    } else if (this.targetWordList.indexOf(input)<0) {
      return null;
    }
    return this.wordMatches(input, this.target);
  }

  wordMatches(input, target) {
    const states = [];
    for (let i = 0; i < input.length; i++) {
      states[i] = LetterState.ABSENT;
    }
    const countsByLetter = this.letterCounts(this.target);
    // First check for exact matches
    for (let i = 0; i < input.length; i++) {
      if (input[i] === this.target[i]) {
        states[i] = LetterState.CORRECT;
        countsByLetter[input[i]]--;
      }
    }
    // Then check for right-letter-wrong-place
    for (let i = 0; i < input.length; i++) {
      if (countsByLetter[input[i]] > 0 && states[i] !== LetterState.CORRECT) {
        states[i] = LetterState.ELSEWHERE;
        countsByLetter[input[i]]--;
      }
    }
    return states;
  }

  showHelp(event) {
    this.showNotification('To start, enter a word for someone else to guess, or choose a random word.\n' +
    'Pink (left): correct letter, correct location\n' +
        'Blue (right): correct letter, wrong location');
  }

  setup() {
    const help = document.getElementById('help');
    help.addEventListener('click', (event) => this.showHelp(), false);
    const randomButton = document.getElementById('random');
    randomButton.addEventListener('click',
    (event) => this.chooseRandomWord(DEFAULT_WORD_SIZE), false); 
  }

  handleKeyPress(letter) {
    if (g.gameState == GameState.COMPLETE) {
      if (letter === 'r' || letter === ENTER_KEY) {
        g.newGame(DEFAULT_WORD_SIZE);
      }
    } else if (g.gameState == GameState.GUESSING_WORD) {
      if (letter === BACKSPACE_KEY) {
        g.deleteLetterGuess();
      } else if (letter === ENTER_KEY) {
        g.guessWord();
      } else {
        g.typeLetter(letter);
      }
    } else {
      if (letter === BACKSPACE_KEY) {
        g.deleteLetterTarget();
      } else if (letter === ENTER_KEY) {
        g.commitWord();
      } else {
        g.typeLetter(letter);
      }
    }
  }
}

function createKey(letter) {
  const singleKey = document.createElement('button');
  singleKey.innerText = letter;
  singleKey.className = 'key';
  if (letter === BACKSPACE_KEY || letter === ENTER_KEY) {
      singleKey.style.width = '70px';
  }
  singleKey.addEventListener('click', (event) => g.handleKeyPress(letter), false);
  return singleKey;
}

const keyMap = {};
function showKeyboard() {
  const keyboard = document.getElementsByClassName('keys')[0];
  for (var i = 0; i < keys.length; i++) {
    const row = document.createElement('div');
    row.className = 'keyrow';
    for (var j = 0; j < keys[i].length; j++) {
      const character = keys[i].charAt(j);
      const element = createKey(character);
      row.appendChild(element);
      keyMap[character] = element;
    }
    keyboard.appendChild(row);
  }
}

const g = new Game();
function start() {
  showKeyboard();
  g.setup();
  g.newGame();
  // g.chooseRandomWord(DEFAULT_WORD_SIZE);
}

document.addEventListener('keydown', (event) => {
  const keyName = event.key.toLowerCase();
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }
  let letter = '';
  if (keyName.length === 1 && keyName[0] >= 'a' && keyName[0] <= 'z') {
    letter = keyName;
  } else if (keyName === 'backspace') {
    letter = BACKSPACE_KEY;
  } else if (keyName === 'enter') {
    letter = ENTER_KEY;
  }
  if (letter !== '') {
    g.handleKeyPress(letter);
  }
}, false);
