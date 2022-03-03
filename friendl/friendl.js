const LetterState = {};
LetterState.UNKNOWN = 'empty';
LetterState.ABSENT = 'absent';
LetterState.ELSEWHERE = 'elsewhere';
LetterState.CORRECT = 'correct';

const ENTER_KEY = '\u21A9';
const BACKSPACE_KEY = '\u232B';
const keys = ['qwertyuiop', 'asdfghjkl', ENTER_KEY + 'zxcvbnm' + BACKSPACE_KEY];

const wordsByLength = {};
const words = ['the', 'of', 'to', 'and', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'with', 'as', 'I', 'his', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'or', 'had', 'by', 'not', 'word', 'but', 'what', 'some', 'we', 'can', 'out', 'other', 'were', 'all', 'there', 'when', 'up', 'use', 'your', 'how', 'said', 'an', 'each', 'she', 'which', 'do', 'their', 'time', 'if', 'will', 'way', 'about', 'many', 'then', 'them', 'write', 'would', 'like', 'so', 'these', 'her', 'long', 'make', 'thing', 'see', 'him', 'two', 'has', 'look', 'more', 'day', 'could', 'go', 'come', 'did', 'number', 'sound', 'no', 'most', 'people', 'my', 'over', 'know', 'water', 'than', 'call', 'first', 'who', 'may', 'down', 'side', 'been', 'now', 'find', 'any', 'new', 'work', 'part', 'take', 'get', 'place', 'made', 'live', 'where', 'after', 'back', 'little', 'only', 'round', 'man', 'year', 'came', 'show', 'every', 'good', 'me', 'give', 'our', 'under', 'name', 'very', 'through', 'just', 'form', 'sentence', 'great', 'think', 'say', 'help', 'low', 'line', 'differ', 'turn', 'cause', 'much', 'mean', 'before', 'move', 'right', 'boy', 'old', 'too', 'same', 'tell', 'does', 'set', 'three', 'want', 'air', 'well', 'also', 'play', 'small', 'end', 'put', 'home', 'read', 'hand', 'port', 'large', 'spell', 'add', 'even', 'land', 'here', 'must', 'big', 'high', 'such', 'follow', 'act', 'why', 'ask', 'men', 'change', 'went', 'light', 'kind', 'off', 'need', 'house', 'picture', 'try', 'us', 'again', 'animal', 'point', 'mother', 'world', 'near', 'build', 'self', 'earth', 'father', 'head', 'stand', 'own', 'page', 'should', 'country', 'found', 'answer', 'school', 'grow', 'study', 'still', 'learn', 'plant', 'cover', 'food', 'sun', 'four', 'between', 'state', 'keep', 'eye', 'never', 'last', 'let', 'thought', 'city', 'tree', 'cross', 'farm', 'hard', 'start', 'might', 'story', 'saw', 'far', 'sea', 'draw', 'left', 'late', 'run', 'while', 'press', 'close', 'night', 'real', 'life', 'few', 'north', 'open', 'seem', 'together', 'next', 'white', 'children', 'begin', 'got', 'walk', 'example', 'ease', 'paper', 'group', 'always', 'music', 'those', 'both', 'mark', 'often', 'letter', 'until', 'mile', 'river', 'car', 'feet', 'care', 'second', 'book', 'carry', 'took', 'science', 'eat', 'room', 'friend', 'began', 'idea', 'fish', 'mountain', 'stop', 'once', 'base', 'hear', 'horse', 'cut', 'sure', 'watch', 'color', 'face', 'wood', 'main', 'enough', 'plain', 'girl', 'usual', 'young', 'ready', 'above', 'ever', 'red', 'list', 'though', 'feel', 'talk', 'bird', 'soon', 'body', 'dog', 'family', 'direct', 'pose', 'leave', 'song', 'measure', 'door', 'product', 'black', 'short', 'numeral', 'class', 'wind', 'question', 'happen', 'complete', 'ship', 'area', 'half', 'rock', 'order', 'fire', 'south', 'problem', 'piece', 'told', 'knew', 'pass', 'since', 'top', 'whole', 'king', 'space', 'heard', 'best', 'hour', 'better', 'true', 'during', 'hundred', 'five', 'remember', 'step', 'early', 'hold', 'west', 'ground', 'interest', 'reach', 'fast', 'verb', 'sing', 'listen', 'six', 'table', 'travel', 'less', 'morning', 'ten', 'simple', 'several', 'vowel', 'toward', 'war', 'lay', 'against', 'pattern', 'slow', 'center', 'love', 'person', 'money', 'serve', 'appear', 'road', 'map', 'rain', 'rule', 'govern', 'pull', 'cold', 'notice', 'voice', 'unit', 'power', 'town', 'fine', 'certain', 'fly', 'fall', 'lead', 'cry', 'dark', 'machine', 'note', 'wait', 'plan', 'figure', 'star', 'box', 'noun', 'field', 'rest', 'correct', 'able', 'pound', 'done', 'beauty', 'drive', 'stood', 'contain', 'front', 'teach', 'week', 'final', 'gave', 'green', 'oh', 'quick', 'develop', 'ocean', 'warm', 'free', 'minute', 'strong', 'special', 'mind', 'behind', 'clear', 'tail', 'produce', 'fact', 'street', 'inch', 'multiply', 'nothing', 'course', 'stay', 'wheel', 'full', 'force', 'blue', 'object', 'decide', 'surface', 'deep', 'moon', 'island', 'foot', 'system', 'busy', 'test', 'record', 'boat', 'common', 'gold', 'possible', 'plane', 'stead', 'dry', 'wonder', 'laugh', 'thousand', 'ago', 'ran', 'check', 'game', 'shape', 'equate', 'hot', 'miss', 'brought', 'heat', 'snow', 'tire', 'bring', 'yes', 'distant', 'fill', 'east', 'paint', 'language', 'among', 'grand', 'ball', 'yet', 'wave', 'drop', 'heart', 'am', 'present', 'heavy', 'dance', 'engine', 'position', 'arm', 'wide', 'sail', 'material', 'size', 'vary', 'settle', 'speak', 'weight', 'general', 'ice', 'matter', 'circle', 'pair', 'include', 'divide', 'syllable', 'felt', 'perhaps', 'pick', 'sudden', 'count', 'square', 'reason', 'length', 'represent', 'art', 'subject', 'region', 'energy', 'hunt', 'probable', 'bed', 'brother', 'egg', 'ride', 'cell', 'believe', 'fraction', 'forest', 'sit', 'race', 'window', 'store', 'summer', 'train', 'sleep', 'prove', 'lone', 'leg', 'exercise', 'wall', 'catch', 'mount', 'wish', 'sky', 'board', 'joy', 'winter', 'sat', 'written', 'wild', 'instrument', 'kept', 'glass', 'grass', 'cow', 'job', 'edge', 'sign', 'visit', 'past', 'soft', 'fun', 'bright', 'gas', 'weather', 'month', 'million', 'bear', 'finish', 'happy', 'hope', 'flower', 'clothe', 'strange', 'gone', 'jump', 'baby', 'eight', 'village', 'meet', 'root', 'buy', 'raise', 'solve', 'metal', 'whether', 'push', 'seven', 'paragraph', 'third', 'shall', 'held', 'hair', 'describe', 'cook', 'floor', 'either', 'result', 'burn', 'hill', 'safe', 'cat', 'century', 'consider', 'type', 'law', 'bit', 'coast', 'copy', 'phrase', 'silent', 'tall', 'sand', 'soil', 'roll', 'temperature', 'finger', 'industry', 'value', 'fight', 'lie', 'beat', 'excite', 'natural', 'view', 'sense', 'ear', 'else', 'quite', 'broke', 'case', 'middle', 'kill', 'son', 'lake', 'moment', 'scale', 'loud', 'spring', 'observe', 'child', 'straight', 'consonant', 'nation', 'dictionary', 'milk', 'speed', 'method', 'organ', 'pay', 'age', 'section', 'dress', 'cloud', 'surprise', 'quiet', 'stone', 'tiny', 'climb', 'cool', 'design', 'poor', 'lot', 'experiment', 'bottom', 'key', 'iron', 'single', 'stick', 'flat', 'twenty', 'skin', 'smile', 'crease', 'hole', 'trade', 'melody', 'trip', 'office', 'receive', 'row', 'mouth', 'exact', 'symbol', 'die', 'least', 'trouble', 'shout', 'except', 'wrote', 'seed', 'tone', 'join', 'suggest', 'clean', 'break', 'lady', 'yard', 'rise', 'bad', 'blow', 'oil', 'blood', 'touch', 'grew', 'cent', 'mix', 'team', 'wire', 'cost', 'lost', 'brown', 'wear', 'garden', 'equal', 'sent', 'choose', 'fell', 'fit', 'flow', 'fair', 'bank', 'collect', 'save', 'control', 'decimal', 'gentle', 'woman', 'captain', 'practice', 'separate', 'difficult', 'doctor', 'please', 'protect', 'noon', 'whose', 'locate', 'ring', 'character', 'insect', 'caught', 'period', 'indicate', 'radio', 'spoke', 'atom', 'human', 'history', 'effect', 'electric', 'expect', 'crop', 'modern', 'element', 'hit', 'student', 'corner', 'party', 'supply', 'bone', 'rail', 'imagine', 'provide', 'agree', 'thus', 'capital', 'chair', 'danger', 'fruit', 'rich', 'thick', 'soldier', 'process', 'operate', 'guess', 'necessary', 'sharp', 'wing', 'create', 'neighbor', 'wash', 'bat', 'rather', 'crowd', 'corn', 'compare', 'poem', 'string', 'bell', 'depend', 'meat', 'rub', 'tube', 'famous', 'dollar', 'stream', 'fear', 'sight', 'thin', 'triangle', 'planet', 'hurry', 'chief', 'colony', 'clock', 'mine', 'tie', 'enter', 'major', 'fresh', 'search', 'send', 'yellow', 'gun', 'allow', 'print', 'dead', 'spot', 'desert', 'suit', 'current', 'lift', 'rose', 'continue', 'block', 'chart', 'hat', 'sell', 'success', 'company', 'subtract', 'event', 'particular', 'deal', 'swim', 'term', 'opposite', 'wife', 'shoe', 'shoulder', 'spread', 'arrange', 'camp', 'invent', 'cotton', 'born', 'determine', 'quart', 'nine', 'truck', 'noise', 'level', 'chance', 'gather', 'shop', 'stretch', 'throw', 'shine', 'property', 'column', 'molecule', 'select', 'wrong', 'gray', 'repeat', 'require', 'broad', 'prepare', 'salt', 'nose', 'plural', 'anger', 'claim', 'continent', 'oxygen', 'sugar', 'death', 'pretty', 'skill', 'women', 'season', 'solution', 'magnet', 'silver', 'thank', 'branch', 'match', 'suffix', 'especially', 'fig', 'afraid', 'huge', 'sister', 'steel', 'discuss', 'forward', 'similar', 'guide', 'experience', 'score', 'apple', 'bought', 'led', 'pitch', 'coat', 'mass', 'card', 'band', 'rope', 'slip', 'win', 'dream', 'evening', 'condition', 'feed', 'tool', 'total', 'basic', 'smell', 'valley', 'nor', 'double', 'seat', 'arrive', 'master', 'track', 'parent', 'shore', 'division', 'sheet', 'substance', 'favor', 'connect', 'post', 'spend', 'chord', 'fat', 'glad', 'original', 'share', 'station', 'dad', 'bread', 'charge', 'proper', 'bar', 'offer', 'segment', 'slave', 'duck', 'instant', 'market', 'degree', 'populate', 'chick', 'dear', 'enemy', 'reply', 'drink', 'occur', 'support', 'speech', 'nature', 'range', 'steam', 'motion', 'path', 'liquid', 'log', 'meant', 'quotient', 'teeth', 'shell', 'neck', 'butts'];
for (let i in words) {
  const word = words[i];
  const list = wordsByLength[word.length] || [];
  list.push(word);
  wordsByLength[word.length] = list;
}

class Game {
  constructor() {
  }

  newGame(size) {
    const max = wordsByLength[size].length;
    this.target = 'read'; //wordsByLength[size][Math.floor(Math.random() * max)];
    this.targetWordList = wordsByLength[this.target.length];
    this.stateList = [];
    this.guessList = [];
    this.keyStates = {};
    this.guess = '';
    this.board = document.getElementsByClassName('board')[0];
    while (this.board.firstChild) {
      this.board.removeChild(this.board.firstChild);
    }
    this.board.className = 'board';
    this.gameComplete = false;
    this.startNewRow();
  }

  startNewRow() {
    const row = document.createElement('div');
    row.className = 'row';
    this.board.appendChild(row);
    this.updateGuess();
    this.currentRow = this.board.lastChild;
  }

  letterCounts(word) {
    const counts = {};
    for (let i = 0; i < word.length; i++) {
      let count = counts[word[i]] || 0;
      counts[word[i]] = count + 1;
    }
    return counts;
  }

  guessWord() {
    const input = this.guess.toLowerCase();
    const states = this.wordStates(input);
    if (states == null) {
      // Invalid word

      return;
    }
    this.updateGuess(states);
    this.guessList.push(this.guess);
    this.stateList.push(states);

    this.updateKeys();
    if (this.guess === this.target) {
      this.board.className = 'board won';
      this.gameComplete = true;
    } else {
      this.guess = '';
      this.startNewRow();
    }
  }
  updateKeys() {
    for (let i = 0; i < this.guessList.length; i++) {
      // find 'max' for each letter or something
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
    if (this.guess.length < 5) {
      this.guess += letter;
    }
    this.updateGuess();
  }

  deleteLetter() {
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
    const player = document.createElement('div');
    player.className = 'player';
    player.appendChild(document.createTextNode('' + (this.stateList.length % 2 + 1)));
    row.appendChild(player);
    for (let i = 0; i < this.target.length; i++) {
      row.appendChild(this.makeLetter(states ? states[i] : LetterState.UNKNOWN, this.guess[i]));
    }
  }

  wordStates(input) {
    if (input.length != this.target.length) {
      return null;
    } else if (this.targetWordList.indexOf(input)<0) {
      return null; // invalid word
    }
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
      if (countsByLetter[input[i]] > 0) {
        states[i] = LetterState.ELSEWHERE;
        countsByLetter[input[i]]--;
      }
    }
    return states;
  }
}

function showKeyboard() {
  const keyboard = document.getElementsByClassName('keys')[0];
  for (var i = 0; i < keys.length; i++) {
    const row = document.createElement('div');
    row.className = 'keyrow';
    for (var j = 0; j < keys[i].length; j++) {
      const character = keys[i].charAt(j);
      row.appendChild(createKey(character));
    }
    keyboard.appendChild(row);
  }
}

function createKey(letter) {
  const singleKey = document.createElement('button');
  singleKey.innerText = letter;
  singleKey.className = 'key';
  singleKey.addEventListener('click', (event) => {
    if (g.gameComplete) {
      if (letter === 'r') {
        g.newGame(GAME_SIZE);
      }
    } else {
      if (letter === BACKSPACE_KEY) {
        g.deleteLetter();
      } else if (letter === ENTER_KEY) {
        g.guessWord();
      } else {
        g.typeLetter(letter);
      }
    }
  }, false);

  return singleKey;
}

const GAME_SIZE = 4;
const g = new Game();
function start() {
  showKeyboard();
  g.newGame(GAME_SIZE);
}

document.addEventListener('keydown', (event) => {
  const keyName = event.key.toLowerCase();
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }
  if (g.gameComplete) {
    if (keyName === 'r') {
      g.newGame(GAME_SIZE);
    }
  } else {
    if (keyName.length === 1 && keyName[0] >= 'a' && keyName[0] <= 'z') {
      g.typeLetter(keyName);
    } else if (keyName === 'backspace') {
      g.deleteLetter();
    } else if (keyName === 'enter') {
      g.guessWord();
    }
  }
}, false);
