var piecePadding = 10;
var pieceHeight = 70;
var pieceWidth = 50;

ThreesGame.ROWS = 4;
ThreesGame.COLUMNS = 4;

var Move = { LEFT : 0, UP : 1, RIGHT : 2, DOWN : 3 };

function ThreesController() {
  this.game = null;
  this.view = null;
}

ThreesController.prototype.randomNextValue = function() {
  var highestValue = this.game.highestValue();
  var useBonus = highestValue >= 48 && Math.random() < 1/21;
  if (useBonus) {
    var range = Math.round(Math.log(highestValue / 24) / Math.LN2);
    var randBonus = 1 + Math.floor(Math.random() * range);
    return Math.pow(2, randBonus) * 24;
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
  return r;
};

ThreesController.prototype.startNewGame = function() {
  if (this.view) {
    this.view.exitDocument();
  }
  this.nextValueString = '';
  this.game = new ThreesGame();
  this.game.eventTarget = document;
  this.view = new ThreesView(this.game);
  this.view.enterDocument();
  this.view.board.focus();
  this.view.board.addEventListener('keydown', this.handleKeyDown.bind(this)); 
  
  for (var i = 0; i < (ThreesGame.ROWS - 1) * (ThreesGame.COLUMNS - 1); i++) {
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

ThreesView.prototype.validateState = function() {
  for (var r = 0; r < ThreesGame.ROWS; r++) {
    for (var c = 0; c < ThreesGame.COLUMNS; c++) {
      if (this.pieces[r][c] == null) {
        if (this.game.getPiece(r, c) != 0) {
          throw new Error('Invalid state @ ' + r + ',' + c);
        }
      } else {
        if (this.pieces[r][c].firstChild.innerText != this.game.getPiece(r, c)) {
          throw new Error('Invalid state @ ' + r + ',' + c);
        }
      }
    }
  }
};

ThreesController.prototype.handleKeyDown = function(e) {
  this.view.validateState();
  var m;
  switch (e.keyCode) {
    case 37: // left
      m = Move.LEFT;
      break;
    case 38: // up
      m = Move.UP;
      break;
    case 39: // right
      m = Move.RIGHT;
      break;
    case 40: // down
      m = Move.DOWN;
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

ThreesController.prototype.move = function(m) {
  var deltaR, deltaC;
  switch (m) {
    case Move.LEFT: // left
      deltaR = 0;
      deltaC = -1;
      break;
    case Move.UP: // up
      deltaR = -1;
      deltaC = 0;
      break;
    case Move.RIGHT: // right
      deltaR = 0;
      deltaC = 1;
      break;
    case Move.DOWN: // down
      deltaR = 1;
      deltaC = 0;
      break;
    default:
      throw new Error('Invalid move: ' + m);
  }
  var moved = this.game.move(deltaR, deltaC);
  if (moved.length != 0) {
    var randomEntry = moved[Math.floor(Math.random() * moved.length)];
    var randomNextValue = this.randomNextValue();
    this.nextValueString += randomNextValue + ',';
    this.game.makeNextMove(deltaR, deltaC, randomEntry, randomNextValue);
    this.view.showNextValue(); // handle with an event?
  }
  return moved.length != 0;
};

function ThreesMoveEvent(fromR, fromC, toR, toC, newValue) {
  this.fromR = fromR;
  this.fromC = fromC;
  this.toR = toR;
  this.toC = toC;
  this.newValue = newValue;
};

ThreesMoveEvent.TYPE = 'MovePiece';

function ThreesAddEvent(r, c, value) {
  this.r = r;
  this.c = c;
  this.value = value;
};

ThreesAddEvent.TYPE = 'AddPiece';

function ThreesView(game) {
  this.game = game;
  this.pieces = [];
  for (var r = 0; r < ThreesGame.ROWS; r++) {
    var row = [];
    for (var c = 0; c < ThreesGame.COLUMNS; c++) {
      if (this.game.getPiece(r, c) == 0) {
        row.push(null);
      } else {
        throw new Error("Unsupported view from non-empty game");
      }
    }
    this.pieces.push(row);
  }
}

ThreesView.prototype.exitDocument = function() {
  document.body.removeChild(this.nextPieceContainer);
  document.body.removeChild(this.board);
  document.removeEventListener(ThreesMoveEvent.TYPE, this.handleMovePiece.bind(this), false);
  document.removeEventListener(ThreesAddEvent.TYPE, this.handleAddPiece.bind(this), false);
};

ThreesView.prototype.enterDocument = function() {
  this.nextPieceContainer = document.createElement('div');
  this.nextPieceContainer.className = 'nextPiece';
  document.body.appendChild(this.nextPieceContainer);
  this.nextPiece = document.createElement('div');
  var content = document.createElement('div');
  content.className = 'pieceContent';
  this.nextPiece.appendChild(content);
  this.nextPieceContainer.appendChild(this.nextPiece);
  this.showNextValue();
  
  this.board = document.createElement('div');
  this.board.tabIndex = 0;
  this.board.className = 'gameBoard';
  for (var r = 0; r < ThreesGame.ROWS; r++) {
    for (var c = 0; c < ThreesGame.COLUMNS; c++) {
      var emptyPiece = document.createElement('div');
      emptyPiece.className = 'gamePiece emptyPiece';
      this.board.appendChild(emptyPiece);
      this.updatePiece(emptyPiece, r, c, null);
    }
  }
  document.body.appendChild(this.board);
  document.addEventListener(ThreesMoveEvent.TYPE, this.handleMovePiece.bind(this), false);
  document.addEventListener(ThreesAddEvent.TYPE, this.handleAddPiece.bind(this), false);
};

ThreesView.prototype.handleMovePiece = function(event) {
  var e = event.detail;
  var piece = this.pieces[e.fromR][e.fromC];
  this.updatePiece(piece, e.toR, e.toC, e.newValue);
  var pieceToRemove = this.pieces[e.toR][e.toC];
  if (pieceToRemove) {
    pieceToRemove.style.zIndex = 3;
    
    var board = this.board;
    // Wait until the animation has finished. This fails if you do a bunch of moves at once.
    window.setTimeout(function() {
      board.removeChild(pieceToRemove);
    }, 750);
  }
  this.pieces[e.fromR][e.fromC] = null;
  this.pieces[e.toR][e.toC] = piece;
};

ThreesView.prototype.handleAddPiece = function(event) {
  var e = event.detail;
  var newPiece = document.createElement('div');
  var content = document.createElement('div');
  content.className = 'pieceContent';
  newPiece.appendChild(content);
  this.board.appendChild(newPiece);
  this.updatePiece(newPiece, e.r, e.c, e.value);
  this.pieces[e.r][e.c] = newPiece;
};

ThreesView.prototype.showNextValue = function() {
  this.updatePieceValue(this.nextPiece, this.game.nextValue);
};

ThreesView.prototype.updatePiece = function(piece, r, c, value) {
  var left = c * (pieceWidth + piecePadding) + piecePadding;
  var top = r * (pieceHeight + piecePadding) + piecePadding;
  piece.style.left = left + 'px';
  piece.style.top = top + 'px';
  if (value != null) {
    this.updatePieceValue(piece, value);
  }
};

ThreesView.prototype.updatePieceValue = function(piece, value) {
  piece.firstChild.innerText = value;
  piece.className = 'gamePiece';
  if (value == 1) {
    piece.className += ' onePiece';
  } else if (value == 2) {
    piece.className += ' twoPiece';
  }
};

function ThreesGame(opt_existingGame) {
  if (opt_existingGame) {
    this.pieces = opt_existingGame.pieces.slice(0);
    this.remaining = opt_existingGame.remaining.slice(0);
    this.nextValue = opt_existingGame.nextValue;
  } else {
    this.pieces = [];
    for (var i = 0; i < ThreesGame.ROWS * ThreesGame.COLUMNS; i++) {
      this.pieces.push(0);
    }
    this.remaining = [4, 4, 4];
    this.nextValue = null;
  }
}

ThreesGame.deserialize = function(gameData) {
  var game = new ThreesGame();
  game.pieces = gameData.pieces;
  game.remaining = gameData.remaining;
  game.nextValue = gameData.nextValue;
  return game;
};

ThreesGame.prototype.copy = function() {
  return new ThreesGame(this);
};

ThreesGame.prototype.getPiece = function(r, c) {
  return this.pieces[r * ThreesGame.COLUMNS + c];
};

ThreesGame.prototype.setPiece = function(r, c, v) {
  this.pieces[r * ThreesGame.COLUMNS + c] = v;
};

ThreesGame.prototype.pieceCount = function() {
  var pieceCount = 0;
  for (var i = 0; i < this.pieces.length; i++) {
    if (this.pieces[i] != 0) pieceCount++;
  }
  return pieceCount;
};

ThreesGame.prototype.highestValue = function() {
  var max = 0;
  for (var i = 0; i < this.pieces.length; i++) {
    max = Math.max(max, this.pieces[i]);
  }
  return max;
};

// Returns a list of rows or columns that were moved.
ThreesGame.prototype.move = function(deltaR, deltaC) {
//  if (Math.abs(deltaC) + Math.abs(deltaR) !== 1) {
//    throw new Error("Invalid delta " + deltaR + ", " + deltaC);
//  }
  var moved = [];
  var isVertical = deltaR != 0;
  for (var r = 0; r < ThreesGame.ROWS; r++) {
    for (var c = 0; c < ThreesGame.COLUMNS; c++) {
      var rT = deltaR == 1 ? ThreesGame.ROWS - 1 - r : r;
      var cT = deltaC == 1 ? ThreesGame.COLUMNS - 1 - c : c;
      if (this.canMovePiece(rT, cT, deltaR, deltaC)) {
        this.movePiece(rT, cT, deltaR, deltaC);
        var movedEntry = isVertical ? cT : rT;
        if (moved.indexOf(movedEntry) == -1) {
          moved.push(movedEntry);
        }
      }
    }
  }
  return moved;
};

ThreesGame.prototype.makeNextMove = function(deltaR, deltaC, newPosition, newNextValue) {
  var newR, newC;
  if (deltaR != 0) {
    newC = newPosition;
  } else {
    newR = newPosition;
  }
  if (deltaR == 1) {
    newR = 0;
  } else if (deltaR == -1) {
    newR = ThreesGame.ROWS - 1;
  } else if (deltaC == 1) {
    newC = 0;
  } else if (deltaC == -1) {
    newC = ThreesGame.COLUMNS - 1;
  }
  var actualNextValue = this.nextValue;
  this.addPiece(newR, newC, actualNextValue);
  this.nextValue = newNextValue;
};

ThreesGame.prototype.addPiece = function(r, c, value) {
//  if (this.getPiece(r, c) != 0) {
//    throw new Error('Can not add piece where one exists');
//  }
  this.setPiece(r, c, value);
  if (this.eventTarget) {
    var addPieceEvent = new CustomEvent(ThreesAddEvent.TYPE,
      {'detail': new ThreesAddEvent(r, c, value)});
    this.eventTarget.dispatchEvent(addPieceEvent);
  }
};

/**
 * @returns {boolean} Whether the piece at (r,c) can move by (deltaR,deltaC).
 * If there is no piece at this position, returns false.
 */
ThreesGame.prototype.canMovePiece = function(r, c, deltaR, deltaC) {
  var fromValue = this.getPiece(r, c);
  if (fromValue == 0 || c + deltaC < 0 || c + deltaC >= ThreesGame.COLUMNS ||
      r + deltaR < 0 || r + deltaR >= ThreesGame.ROWS) {
    return false;
  }
  
  var toValue = this.getPiece(r + deltaR, c + deltaC);
  return toValue == 0 ||
          (toValue >= 3 && fromValue == toValue) ||
          (toValue < 3 && fromValue + toValue == 3);
};

/**
 * Moves the given piece at (r,c) by (deltaR,deltaC).
 */
ThreesGame.prototype.movePiece = function(r, c, deltaR, deltaC) {
//  if (!this.canMovePiece(r, c, deltaR, deltaC)) {
//    throw new Error("Can't move piece");
//  }
  var toR = r + deltaR;
  var toC = c + deltaC;
  this.setPiece(toR, toC, this.getPiece(toR, toC) + this.getPiece(r, c));
  this.setPiece(r, c, 0);
  if (this.eventTarget) {
    var movePieceEvent = new CustomEvent(ThreesMoveEvent.TYPE,
      {'detail': new ThreesMoveEvent(r, c, toR, toC, this.getPiece(toR, toC))});
    this.eventTarget.dispatchEvent(movePieceEvent);
  }
};