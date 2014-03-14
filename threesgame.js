ThreesGame.ROWS = 4;
ThreesGame.COLUMNS = 4;
var Move = { LEFT : 0, UP : 1, RIGHT : 2, DOWN : 3 };

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