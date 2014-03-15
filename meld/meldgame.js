/**
 * Stores information about the state of the game in a compact way.
 * 
 * There are only 32 bit integer operations in JS, so we store the game board
 * in two separate integers according to this layout.
 * 
 *  0   4   8  12   pieces1
 * 16  20  24  28   pieces1
 *  0   4   8  12   pieces2
 * 16  20  24  28   pieces2
 * 
 * The 4-bit number at each offset maps to the value in this way:
 * 
 * 0 : 0 (no tile)
 * 1 : 1
 * 2 : 2
 * k : 3 * 2^(k-3)
 * 
 * We store the next value to be seen in a third integer.
 * TODO: throw in the undrawn card stack to that integer if necessary
 */

// Number of rows and columns on a game board.
MeldGame.ROWS = 4;
MeldGame.COLUMNS = 4;

// What MeldGame.nextValue will be if the next card is a bonus card.
MeldGame.NEXT_BONUS = -1;

// Move direction enum.
MeldGame.Move = { LEFT : 0, UP : 1, RIGHT : 2, DOWN : 3 };

function MeldGame(opt_existingGame) {
  if (opt_existingGame) {
    this.pieces1 = opt_existingGame.pieces1;
    this.pieces2 = opt_existingGame.pieces2;
    this.nextValue = opt_existingGame.nextValue;
  } else {
    this.pieces1 = 0;
    this.pieces2 = 0;
    this.nextValue = 0;
  }
}

// Deserializes an object containing the game state. Used in the web worker.
MeldGame.deserialize = function(gameData) {
  var game = new MeldGame();
  game.pieces1 = gameData.pieces1;
  game.pieces2 = gameData.pieces2;
  game.nextValue = gameData.nextValue;
  return game;
};

// Returns a copy of this game's state.
MeldGame.prototype.copy = function() {
  return new MeldGame(this);
};

// Maps from 4 bit integers to the actual value of the card.
MeldGame.BITS_TO_VALUES = [0, 1, 2, 3, 6, 12, 24, 48, 96, 192, 384, 768, 1536, 3072, 6144, 12288];

// Maps from the value of the card to a compact 4 bit integer.
MeldGame.VALUES_TO_BITS = {0: 0, 1: 1, 2: 2, 3: 3, 6: 4, 12: 5, 24: 6, 48: 7, 96: 8, 192: 9, 384: 10, 768: 11, 1536: 12, 3072: 13, 6144: 14, 12288: 15};

MeldGame.prototype.getPiece = function(r, c) {
  return MeldGame.BITS_TO_VALUES[this.getPieceBits(r, c)];
};

MeldGame.prototype.getPieceBits = function(r, c) {
  var whichPiece;
  var offset;
  if (r < 2) {
    whichPiece = this.pieces1;
    offset = 4 * (MeldGame.COLUMNS * r + c);
  } else {
    whichPiece = this.pieces2;
    offset = 4 * (MeldGame.COLUMNS * (r - 2) + c);
  }
  return 0xF & (whichPiece >> offset);
};

MeldGame.prototype.setPiece = function(r, c, v) {
  this.setPieceBits(r, c, MeldGame.VALUES_TO_BITS[v]);
};

MeldGame.prototype.setPieceBits = function(r, c, bits) {
  var offset;
  if (r < 2) {
    offset = 4 * (MeldGame.COLUMNS * r + c);
    this.pieces1 = (this.pieces1 & ~(0xF << offset)) | (bits << offset);
  } else {
    offset = 4 * (MeldGame.COLUMNS * (r - 2) + c);
    this.pieces2 = (this.pieces2 & ~(0xF << offset)) | (bits << offset);
  }
};

MeldGame.prototype.pieceCount = function() {
  var pieceCount = 0;
  // Should we optimize this more?
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      if (this.getPieceBits(r, c) != 0) pieceCount++;
    }
  }
  return pieceCount;
};

MeldGame.prototype.highestValue = function() {
  var max = 0;
  // Should we optimize this more?
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      max = Math.max(max, this.getPieceBits(r, c));
    }
  }
  return MeldGame.BITS_TO_VALUES[max];
};

MeldGame.movedArray = function(set) {
  var array = [];
  for (var i = 0; i < 4; i++) {
    if ((set & 0x1) != 0) {
      array.push(i);
    }
    set >>= 1;
  }
  return array;
}

// Returns a 4 element bit set containing the rows or columns that moved.
MeldGame.prototype.move = function(deltaR, deltaC) {
  var moved = 0;
  var isVertical = deltaR != 0;
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      var rT = deltaR == 1 ? MeldGame.ROWS - 1 - r : r;
      var cT = deltaC == 1 ? MeldGame.COLUMNS - 1 - c : c;
      if (this.canMovePiece(rT, cT, deltaR, deltaC)) {
        this.movePiece(rT, cT, deltaR, deltaC);
        var movedEntry = isVertical ? cT : rT;
        moved |= (1 << movedEntry);
      }
    }
  }
  return moved;
};


// Returns whether any piece can move in a given direction.
MeldGame.prototype.canMoveAnyPiece = function(deltaR, deltaC) {
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      var rT = deltaR == 1 ? MeldGame.ROWS - 1 - r : r;
      var cT = deltaC == 1 ? MeldGame.COLUMNS - 1 - c : c;
      if (this.canMovePiece(rT, cT, deltaR, deltaC)) {
        return true;
      }
    }
  }
  return false;
};

MeldGame.prototype.respondToUser = function(
        deltaR, deltaC, newPosition, nextValue, bonusValue) {
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
  var newValue = this.nextValue;
  if (newValue == MeldGame.NEXT_BONUS) {
    newValue = bonusValue;
  }
  this.addPiece(newR, newC, newValue);
  this.nextValue = nextValue;
};

MeldGame.prototype.addPiece = function(r, c, value) {
  if (this.getPiece(r, c) != 0) {
    throw new Error('Can not add piece where one exists');
  }
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
  if (c + deltaC < 0 || c + deltaC >= MeldGame.COLUMNS ||
      r + deltaR < 0 || r + deltaR >= MeldGame.ROWS) {
    return false;
  }
  var fromValue = this.getPieceBits(r, c);
  if (fromValue == 0) {
    return false;
  }

  var toValue = this.getPieceBits(r + deltaR, c + deltaC);
  return toValue == 0 ||
    (toValue >= 3 && fromValue == toValue) ||
    (toValue < 3 && fromValue + toValue == 3);
};

/**
 * Moves the given piece at (r,c) by (deltaR,deltaC).
 */
MeldGame.prototype.movePiece = function(r, c, deltaR, deltaC) {
  if (!this.canMovePiece(r, c, deltaR, deltaC)) {
    throw new Error("Can't move piece");
  }
  var toR = r + deltaR;
  var toC = c + deltaC;
  var toValue = this.getPieceBits(toR, toC);
  var newValue;
  if (toValue < 3) {
    var fromValue = this.getPieceBits(r, c);
    newValue = fromValue + toValue;
  } else {
    newValue = toValue + 1;
  }
  this.setPieceBits(toR, toC, newValue);
  this.setPieceBits(r, c, 0);
  if (this.eventTarget) {
    var movePieceEvent = new CustomEvent(MeldMoveEvent.TYPE,
        {'detail': new MeldMoveEvent(r, c, toR, toC, this.getPiece(toR, toC))});
    this.eventTarget.dispatchEvent(movePieceEvent);
  }
};

MeldGame.prototype.isGameOver = function() {
  return !(this.canMoveAnyPiece(0, -1) ||
      this.canMoveAnyPiece(-1, 0) ||
      this.canMoveAnyPiece(0, 1) ||
      this.canMoveAnyPiece(1, 0));
};
