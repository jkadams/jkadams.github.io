const LetterState = {};
LetterState.UNKNOWN = 'empty';
LetterState.ABSENT = 'absent';
LetterState.ELSEWHERE = 'elsewhere';
LetterState.CORRECT = 'correct';
const START_HELP_TEXT = 'Enter a word for someone!\nOr choose a random word.';

const GuessState = {};
GuessState.UNKNOWN = 'empty';
GuessState.HIGHLIGHTED = 'elsewhere';

const GameState = {};
GameState.CHOOSING_WORD = 'choose';
GameState.GUESSING_WORD = 'guess';
GameState.COMPLETE = 'complete';

const CORRECT_COLOR = '#F7A8B8';
const ELSEWHERE_COLOR = '#55CDFC';

const DEFAULT_WORD_SIZE = 4;

const ENTER_KEY = '\u21A9';
const BACKSPACE_KEY = '\u232B';
const KEYS = ['qwertyuiop', 'asdfghjkl', ENTER_KEY + 'zxcvbnm' + BACKSPACE_KEY];
const COLOR_CYCLE = ['blueviolet', 'orange', 'yellow', 'green'];

//const NUMBERS = ['\u24EA', '\u2460', '\u2461', '\u2462', '\u2463', '\u2464', '\u2465', '\u2466', '\u2467', '\u2468'];
const NUMBERS = ['\u0030\uFE0F\u20E3', 
'\u0031\uFE0F\u20E3', 
'\u0032\uFE0F\u20E3', 
'\u0033\uFE0F\u20E3', 
'\u0034\uFE0F\u20E3', 
'\u0035\uFE0F\u20E3', 
'\u0036\uFE0F\u20E3', 
'\u0037\uFE0F\u20E3', 
'\u0038\uFE0F\u20E3', 
'\u0039\uFE0F\u20E3'];


class Game {
  constructor() {
  }

  newGame() {
    document.activeElement.blur();
    this.stateList = [];
    this.logicList = [];
    this.guessList = [];
    this.keyStates = {};
    this.letterStates = {};
    this.letterColors = {};
    this.pendingTarget = '';
    this.guess = '';
    this.board = document.getElementsByClassName('board')[0];
    while (this.board.firstChild) {
      this.board.removeChild(this.board.firstChild);
    }
    this.board.className = 'board';
    const share = document.getElementById('share');
    share.className = 'share';
    this.gameState = GameState.CHOOSING_WORD;
    document.getElementById('head').innerText = 'Friendl';
    
    const row = document.createElement('div');
    row.className = 'row';
    this.board.appendChild(row);
    document.getElementById('random').style.display = 'unset';
    document.getElementById('enterword').style.display = 'unset';
    document.getElementsByClassName('keys')[0].style.display = 'none';
    row.innerText = START_HELP_TEXT;
    this.updateKeys();
    this.showNotification(null);
  }

  forceNewGame() {
    window.location.hash = '';
    this.newGame();
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
    this.pendingTarget = '';
    this.size = target.length;
    this.target = target;
    window.location.hash = '#' + encode(target);
    this.targetWordList = wordsByLength[this.target.length];
    this.board.removeChild(this.board.firstChild);
    this.startNewRow();
    this.gameState = GameState.GUESSING_WORD;
    document.getElementById('head').innerText = 'Friendl';
    this.logicList.push([]);
    this.hideButtons();
    this.updateGuess();
  }

  chooseRandomWord(size) {
    let target = '';
    if (size == 4) {
      // for (let i = 0; i < freq.length; i++) {
      //   let all = freq[i];
      //   if (wordsByLength[size].indexOf(all) < 0) {
      //     console.log(all);
      //   }
      // }
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
      notif.style.display = 'none';
      if (this.timer_) {
        clearTimeout(this.timer_);
      }
    } else {
      notif.innerText = text;
      notif.style.display = 'unset';
      if (this.timer_) {
        clearTimeout(this.timer_);
      }
      this.timer_ = setTimeout(() => notif.style.display = 'none', timeout);
    }
  }
  commitWord() {
    this.chooseWord(this.pendingTarget);
    this.showNotification('Press Share to send a link with this word!');
  }

  guessWord() {
    document.activeElement.blur();
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
    this.logicList.push([]);

    this.updateKeys();
    if (this.guess === this.target) {
      this.board.className = 'board won';
      const share = document.getElementById('share');
      share.className = 'share won';
      document.getElementById('head').innerText = 'In ' + this.stateList.length + (this.stateList.length > 9 ? '...' : '!');
      this.gameState = GameState.COMPLETE;
      window.location.hash = '';
      this.showNotification('Got it in ' + this.stateList.length +'! Press R or Enter to restart.');
    } else {
      this.guess = '';
      this.startNewRow();
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  updateKeys() {
    for (let key in keyMap) {
      keyMap[key].className = 'key';
    }
    for (let i = 0; i < this.guessList.length; i++) {
      const guess = this.guessList[i];
      for (let j = 0; j < guess.length; j++) {
        const letter = guess.charAt(j);
        keyMap[letter].className = 'key used';
      }
    }
  }

  toggleLetterState(state) {
    if (!state) {
      state = GuessState.UNKNOWN;
    }
    switch (state) {
      case GuessState.UNKNOWN:
        return GuessState.HIGHLIGHTED;
      case GuessState.HIGHLIGHTED:
        return GuessState.UNKNOWN;
    }
  }

  getNewColor() {
    let used = [];
    for (let i = 0; i < COLOR_CYCLE.length; i++) {
      used[i] = 0;
    }
    for (let k in this.letterColors) {
      if (this.letterColors[k] !== undefined) {
        used[this.letterColors[k]]++;
      }
    }
    for (let i = 0; i < used.length - 1; i++) {
      if (used[i] < used[i + 1]) {
        return i;
      }
      if (used[i] > used[i + 1]) {
        return i + 1;
      }
    }
    return 0;
  }

  updateAllLetters() {
      const letters = document.getElementsByClassName('letter');
      for (let p = 0; p < letters.length; p++) {
        const letter = letters[p];
        const l = letter.innerText.toLowerCase();
        let state = this.letterStates[l];
        if (state === LetterState.ELSEWHERE) {
          let color = this.letterColors[l];
          if (color === undefined) {
            color = this.getNewColor();
            this.letterColors[l] = color;
          }
          letter.style.backgroundColor = COLOR_CYCLE[color];
        } else {
          letter.style.backgroundColor = null;
          this.letterColors[l] = undefined;
        }
        if (!state) {
          state = LetterState.UNKNOWN;
        }
        letter.className = 'letter ' + state;
      }
  }

  makeLetter(state, l) {
    const letter = document.createElement('button');
    letter.className = 'letter ' + state;
    if (l) {
      letter.appendChild(document.createTextNode(l.toUpperCase()));
    }
    // const row = r;
    // const index = i;
    const le = l;

    letter.addEventListener('click', (event) => {
      if (le) {
        const lower = le.toLowerCase();
        const newState = this.toggleLetterState(this.letterStates[lower]);
        this.letterStates[lower] = newState;
        this.updateAllLetters();
      }
    }, false);
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
        row.appendChild(this.makeLetter(GuessState.UNKNOWN, this.pendingTarget[i]));
      }
      return;
    }
    // const player = document.createElement('div');
    // player.className = 'counter';
    // player.appendChild(document.createTextNode(this.stateList.length + 1));
    // row.appendChild(player);
    const r = this.logicList.length - 1;
    for (let i = 0; i < this.target.length; i++) {
      const l = this.guess[i];
      // const state = this.logicList[r][i];
      // row.appendChild(this.makeLetter(states ? states[i] : LetterState.UNKNOWN, this.guess[i]));
      //row.appendChild(this.makeLetter(state ? state : LetterState.UNKNOWN, this.guess[i], r, i));
      row.appendChild(this.makeLetter(this.letterStates[l] ? this.letterStates[l] : LetterState.UNKNOWN, l));
    }
    let correct = '!';
    let elsewhere = '?';
    let pendingRow = ' pending';
    if (states) {
      pendingRow = '';
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
    row.appendChild(this.createCountNode(correct, 'right' + pendingRow));
    row.appendChild(this.createCountNode(elsewhere, 'else' + pendingRow));
    this.updateAllLetters();
  }

  createCountNode(count, kind) {
    const player = document.createElement('button');
    player.className = 'state ' + kind;
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
    if (this.gameState === GameState.CHOOSING_WORD) {
      this.showNotification('Enter a word for someone else to guess, or choose a random word.');
    } else if (this.gameState === GameState.GUESSING_WORD) {
      this.showNotification(
        'Green (left !): correct letter, correct location\n' +
        'Yellow (right ?): correct letter, wrong location');
    }
  }

  share(event) {
    let text = '';
    if (this.gameState === GameState.GUESSING_WORD) {
      text = 'Here you go! ' + window.location;
    } else if (this.gameState == GameState.COMPLETE) {
      for (let i = 0; i < this.stateList.length; i++) {
        const states = this.stateList[i];
        let correct = 0;
        let elsewhere = 0;
        for (let i = 0; i < states.length; i++) {
          if (states[i] === LetterState.CORRECT) {
            correct++;
          } else if (states[i] === LetterState.ELSEWHERE) {
            elsewhere++;
          }
        }
        text += NUMBERS[correct];
        text += NUMBERS[elsewhere];
        text += '\n';
      }
      text += '\n';
      text += 'https://jkadams.github.io/friendl/#' + encode(this.target);
    }
    if (navigator) {
      if (navigator.share) {
        navigator.share({
          title: 'Friendl',
          text: text
          // url: window.location + '#' + encode(this.target)
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        this.showNotification('Copied to clipboard!');
      } else {
        g.showNotification(text, 1000000);
      }
    }
  }

  hideButtons() {
    document.getElementById('random').style.display = 'none';
    document.getElementById('enterword').style.display = 'none';
    document.getElementsByClassName('keys')[0].style.display = 'unset';
  }

  setup() {
    const help = document.getElementById('help');
    help.addEventListener('click', (event) => this.showHelp(), false);
    const share = document.getElementById('share');
    share.addEventListener('click', (event) => this.share(), false);
    const restart = document.getElementById('restart');
    restart.addEventListener('click', (event) => this.forceNewGame(), false);
    const randomButton = document.getElementById('random');
    randomButton.addEventListener('click',
    (event) => this.chooseRandomWord(DEFAULT_WORD_SIZE), false);
    const enterWordButton = document.getElementById('enterword');
    enterWordButton.addEventListener('click',
    (event) => this.hideButtons(), false); 
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
  for (var i = 0; i < KEYS.length; i++) {
    const row = document.createElement('div');
    row.className = 'keyrow';
    for (var j = 0; j < KEYS[i].length; j++) {
      const character = KEYS[i].charAt(j);
      const element = createKey(character);
      row.appendChild(element);
      keyMap[character] = element;
    }
    keyboard.appendChild(row);
  }
}

function encode(word) {
  let encoded = '';
  let achar = 'a'.charCodeAt(0);
  word = word.toLowerCase();
  for (let i = 0; i < word.length; i++) {
    let newLet = ((word.charCodeAt(i) - achar) + 11 + 13 * i + 17 * i * i) % 26;
    if (newLet < 10) {
      encoded += '0' + newLet;
    } else {
      encoded += newLet;
    }
  }
  return encoded;
}

function decode(word) {
  let decoded = '';
  let achar = 'a'.charCodeAt(0);
  word = word.toLowerCase();
  try {
    for (let i = 0; i < word.length; i += 2) {
      let newLet = (parseInt(word.substring(i, i + 2), 10) - 11 - 13 * (i / 2) - 17 * (i / 2) * (i / 2) + 260) % 26;
      decoded += String.fromCharCode(achar + newLet);
    }
  } catch (e) {
    return null;
  }
  return decoded;
}

const g = new Game();
function start() {
  showKeyboard();
  g.setup();
  g.newGame();
  if (window.location.hash) {
    const decoded = decode(window.location.hash.substring(1));
    if (decoded) {
      g.chooseWord(decoded);
    }
  }
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
