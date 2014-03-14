function MeldController() {
  this.game = null;
  this.view = null;
}

MeldController.prototype.randomNextValue = function() {
  var highestValue = this.game.highestValue();
  var useBonus = highestValue >= 48 && Math.random() < 1/21;
  if (useBonus) {
    return MeldGame.NEXT_BONUS;
  }
  var left = this.game.remaining[0] + this.game.remaining[1] + this.game.remaining[2];
  var nextCard = Math.floor(Math.random() * left);
  var r;
  if (nextCard < this.game.remaining[0]) {
    r = 1;
    this.game.remaining[0]--;
  } else if (nextCard < this.game.remaining[0] + this.game.remaining[1]) {
    r = 2;	
    this.game.remaining[1]--;
  } else {
    r = 3;
    this.game.remaining[2]--;
  }
  if (left == 1) {
    this.game.remaining = [4, 4, 4];	
  }
  this.nextValueString += r + ',';
  return r;
};

MeldController.prototype.randomBonusValue = function() {
  var range = Math.round(Math.log(highestValue / 24) / Math.LN2);
  var randBonus = 1 + Math.floor(Math.random() * range);
  var r = Math.pow(2, randBonus) * 24;
  this.nextValueString += r + ',';
  return r;
};

MeldController.prototype.startNewGame = function() {
  if (this.view) {
    this.view.exitDocument();
  }
  this.nextValueString = '';
  this.game = new MeldGame();
  this.game.eventTarget = document;
  this.view = new MeldView(this.game);
  this.view.enterDocument();
  this.view.board.focus();
  this.view.board.addEventListener('keydown', this.handleKeyDown.bind(this)); 

  for (var i = 0; i < (MeldGame.ROWS - 1) * (MeldGame.COLUMNS - 1); i++) {
    var r = Math.floor(Math.random() * 4);
    var c = Math.floor(Math.random() * 4);
    var value = this.randomNextValue();
    while (this.game.getPiece(r, c) != 0) {	
      r = Math.floor(Math.random() * 4);
      c = Math.floor(Math.random() * 4);
    }
    this.game.addPiece(r, c, value);
  }
  this.game.nextValue = this.randomNextValue();
  this.view.showNextValue(); // handle with an event?
};

MeldController.prototype.handleKeyDown = function(e) {
  this.view.validateState();
  var m;
  switch (e.keyCode) {
    case 37: // left
      m = MeldGame.Move.LEFT;
      break;
    case 38: // up
      m = MeldGame.Move.UP;
      break;
    case 39: // right
      m = MeldGame.Move.RIGHT;
      break;
    case 40: // down
      m = MeldGame.Move.DOWN;
      break;
    case 78:
      this.startNewGame();
      return;
    default:
      return;
  }
  this.move(m);
  e.preventDefault();
};

MeldController.prototype.move = function(m) {
  var deltaR, deltaC;
  switch (m) {
    case MeldGame.Move.LEFT: // left
      deltaR = 0;
      deltaC = -1;
      break;
    case MeldGame.Move.UP: // up
      deltaR = -1;
      deltaC = 0;
      break;
    case MeldGame.Move.RIGHT: // right
      deltaR = 0;
      deltaC = 1;
      break;
    case MeldGame.Move.DOWN: // down
      deltaR = 1;
      deltaC = 0;
      break;
    default:
      throw new Error('Invalid move: ' + m);
  }
  var moved = this.game.move(deltaR, deltaC);
  if (moved.length != 0) {
    var randomEntry = moved[Math.floor(Math.random() * moved.length)];
    var bonusValue = null;
    if (this.game.nextValue == MeldGame.NEXT_BONUS) {
      bonusValue = this.randomBonusValue();
    }
    var randomNextValue = this.randomNextValue();
    this.game.respondToUser(deltaR, deltaC, randomEntry, randomNextValue, bonusValue);
    this.view.showNextValue(); // handle with an event?
  }
  return moved.length != 0;
};
