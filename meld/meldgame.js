// Number of rows and columns in the game.
MeldGame.ROWS = 4;
MeldGame.COLUMNS = 4;

// What MeldGame.nextValue will be if the next card is a bonus card.
MeldGame.NEXT_BONUS = -1;

// Move direction enum.
var Move = { LEFT : 0, UP : 1, RIGHT : 2, DOWN : 3 };

function MeldGame(opt_existingGame) {
  if (opt_existingGame) {
    this.pieces = opt_existingGame.pieces.slice(0);
    this.remaining = opt_existingGame.remaining.slice(0);
    this.nextValue = opt_existingGame.nextValue;
  } else {
    this.pieces = [];
    for (var i = 0; i < MeldGame.ROWS * MeldGame.COLUMNS; i++) {
      this.pieces.push(0);
    }
    this.remaining = [4, 4, 4];
    this.nextValue = null;
  }
}

MeldGame.deserialize = function(gameData) {
  var game = new MeldGame();
  game.pieces = gameData.pieces;
  game.remaining = gameData.remaining;
  game.nextValue = gameData.nextValue;
  return game;
};

MeldGame.prototype.copy = function() {
  return new MeldGame(this);
};

MeldGame.prototype.getPiece = function(r, c) {
  return this.pieces[r * MeldGame.COLUMNS + c];
};

MeldGame.prototype.setPiece = function(r, c, v) {
  this.pieces[r * MeldGame.COLUMNS + c] = v;
};

MeldGame.prototype.pieceCount = function() {
  var pieceCount = 0;
  for (var i = 0; i < this.pieces.length; i++) {
    if (this.pieces[i] != 0) pieceCount++;
  }
  return pieceCount;
};

MeldGame.prototype.highestValue = function() {
  var max = 0;
  for (var i = 0; i < this.pieces.length; i++) {
    max = Math.max(max, this.pieces[i]);
  }
  return max;
};

// Returns a list of rows or columns that were moved.
MeldGame.prototype.move = function(deltaR, deltaC) {
  var moved = [];
  var isVertical = deltaR != 0;
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      var rT = deltaR == 1 ? MeldGame.ROWS - 1 - r : r;
      var cT = deltaC == 1 ? MeldGame.COLUMNS - 1 - c : c;
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

MeldGame.prototype.makeNextMove = function(deltaR, deltaC, newPosition, newNextValue) {
  var newR, newC;
  if (deltaR != 0) {
    newC = newPosition;
  } else {
    newR = newPosition;
  }
  if (deltaR == 1) {
    newR = 0;
  } else if (deltaR == -1) {
    newR = MeldGame.ROWS - 1;
  } else if (deltaC == 1) {
    newC = 0;
  } else if (deltaC == -1) {
    newC = MeldGame.COLUMNS - 1;
  }
  var actualNextValue = this.nextValue;
  this.addPiece(newR, newC, actualNextValue);
  this.nextValue = newNextValue;
};

MeldGame.prototype.addPiece = function(r, c, value) {
//  if (this.getPiece(r, c) != 0) {
//    throw new Error('Can not add piece where one exists');
//  }
  this.setPiece(r, c, value);
  if (this.eventTarget) {
    var addPieceEvent = new CustomEvent(MeldAddEvent.TYPE,
      {'detail': new MeldAddEvent(r, c, value)});
    this.eventTarget.dispatchEvent(addPieceEvent);
  }
};

/**
 * @returns {boolean} Whether the piece at (r,c) can move by (deltaR,deltaC).
 * If there is no piece at this position, returns false.
 */
MeldGame.prototype.canMovePiece = function(r, c, deltaR, deltaC) {
  var fromValue = this.getPiece(r, c);
  if (fromValue == 0 || c + deltaC < 0 || c + deltaC >= MeldGame.COLUMNS ||
      r + deltaR < 0 || r + deltaR >= MeldGame.ROWS) {
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
MeldGame.prototype.movePiece = function(r, c, deltaR, deltaC) {
//  if (!this.canMovePiece(r, c, deltaR, deltaC)) {
//    throw new Error("Can't move piece");
//  }
  var toR = r + deltaR;
  var toC = c + deltaC;
  this.setPiece(toR, toC, this.getPiece(toR, toC) + this.getPiece(r, c));
  this.setPiece(r, c, 0);
  if (this.eventTarget) {
    var movePieceEvent = new CustomEvent(MeldMoveEvent.TYPE,
      {'detail': new MeldMoveEvent(r, c, toR, toC, this.getPiece(toR, toC))});
    this.eventTarget.dispatchEvent(movePieceEvent);
  }
};

MeldGame.prototype.isGameOver = function() {
  return this.copy().move(0, -1).length == 0 &&
      this.copy().move(-1, 0).length == 0 &&
      this.copy().move(0, 1).length == 0 &&
      this.copy().move(1, 0).length == 0;
};
