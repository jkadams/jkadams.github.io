/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
 * The nibble at each offset maps to the value in this way:
 * 
 * 0 : 0 (no tile)
 * 1 : 1
 * 2 : 2
 * k : 3 * 2^(k-3)
 * 
 * If a card in the game were to go over 12288, bad things would happen.
 * 
 * We store the next value to be seen in a third integer.
 * TODO: throw in the undrawn card stack to that integer if necessary
 *
 * @author jkadams
 */

// Number of rows and columns on a game board. Changing this will break things.
MeldGame.ROWS = 4;
MeldGame.COLUMNS = 4;
MeldGame.NIBBLE_SIZE = 4;

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

// Returns whether this board is equal to the given other board.
MeldGame.prototype.equals = function(other) {
  return this.pieces1 == other.pieces1 &&
      this.pieces2 == other.pieces2 &&
      this.nextValue == other.nextValue;
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
    offset = MeldGame.NIBBLE_SIZE * (MeldGame.COLUMNS * r + c);
  } else {
    whichPiece = this.pieces2;
    offset = MeldGame.NIBBLE_SIZE * (MeldGame.COLUMNS * (r - 2) + c);
  }
  return 0xF & (whichPiece >> offset);
};

MeldGame.prototype.setPiece = function(r, c, v) {
  this.setPieceBits(r, c, MeldGame.VALUES_TO_BITS[v]);
};

MeldGame.prototype.setPieceBits = function(r, c, bits) {
  var offset;
  if (r < 2) {
    offset = MeldGame.NIBBLE_SIZE * (MeldGame.COLUMNS * r + c);
    this.pieces1 = (this.pieces1 & ~(0xF << offset)) | (bits << offset);
  } else {
    offset = MeldGame.NIBBLE_SIZE * (MeldGame.COLUMNS * (r - 2) + c);
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
};

// Returns a 4 element bit set containing the rows or columns that moved.
// Also fires events that update the view.
MeldGame.prototype.moveWithEvents = function(moveDirection) {
  var deltaR, deltaC;
  switch (moveDirection) {
    case MeldGame.Move.LEFT:
      deltaR = 0;
      deltaC = -1;
      break;
    case MeldGame.Move.UP:
      deltaR = -1;
      deltaC = 0;
      break;
    case MeldGame.Move.RIGHT:
      deltaR = 0;
      deltaC = 1;
      break;
    case MeldGame.Move.DOWN:
      deltaR = 1;
      deltaC = 0;
      break;
    default:
      throw new Error('Invalid move: ' + m);
  }
  var moved = 0;
  var isVertical = deltaR != 0;
  for (var r = 0; r < MeldGame.ROWS; r++) {
    var rT = deltaR == 1 ? MeldGame.ROWS - 1 - r : r;
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
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

/**
 * Moves the board in the given direction.
 * 
 * This moves the 4 cards on each row/column in the direction from v3 -> v0.
 * Merges v1 onto v0 if possible.
 * Then merges v2 onto v1 if possible.
 * Then merges v3 onto v2 if possible.
 * 
 * Returns a 4 element bit set containing the rows or columns that changed.
 */
MeldGame.prototype.move = function(moveDirection) {
  var moved = 0;
  for (var i = 0; i < 4; i++) { // the dimension perpendicular to the movement
    // We want to move the 4 cards in the direction from v3 -> v0.
    var v0, v1, v2, v3;
    var whatMoved = 0;
    switch (moveDirection) {
      case MeldGame.Move.LEFT:
        v0 = this.getPieceBits(i, 0);
        v1 = this.getPieceBits(i, 1);
        v2 = this.getPieceBits(i, 2);
        v3 = this.getPieceBits(i, 3);
        break;
      case MeldGame.Move.UP:
        v0 = this.getPieceBits(0, i);
        v1 = this.getPieceBits(1, i);
        v2 = this.getPieceBits(2, i);
        v3 = this.getPieceBits(3, i);
        break;
      case MeldGame.Move.RIGHT:      
        v0 = this.getPieceBits(i, 3);
        v1 = this.getPieceBits(i, 2);
        v2 = this.getPieceBits(i, 1);
        v3 = this.getPieceBits(i, 0);
        break;
      case MeldGame.Move.DOWN:
        v0 = this.getPieceBits(3, i);
        v1 = this.getPieceBits(2, i);
        v2 = this.getPieceBits(1, i);
        v3 = this.getPieceBits(0, i);
        break;
    }

    var newV = MeldGame.combineValues(v1, v0);
    if (newV != v0) {
      v0 = newV;
      v1 = 0;
      whatMoved |= 3; // changed 0 and 1
    }
    newV = MeldGame.combineValues(v2, v1);
    if (newV != v1) {
      v1 = newV;
      v2 = 0;
      whatMoved |= 6; // changed 1 and 2
    }
    newV = MeldGame.combineValues(v3, v2);
    if (newV != v2) {
      v2 = newV;
      v3 = 0;
      whatMoved |= 12; // changed 2 and 3
    }
    if (whatMoved) {
      moved |= (1 << i);
    }
    
    switch (moveDirection) {
      case MeldGame.Move.LEFT:
        if (whatMoved & 1) this.setPieceBits(i, 0, v0);
        if (whatMoved & 2) this.setPieceBits(i, 1, v1);
        if (whatMoved & 4) this.setPieceBits(i, 2, v2);
        if (whatMoved & 8) this.setPieceBits(i, 3, v3);
        break;
      case MeldGame.Move.UP:
        if (whatMoved & 1) this.setPieceBits(0, i, v0);
        if (whatMoved & 2) this.setPieceBits(1, i, v1);
        if (whatMoved & 4) this.setPieceBits(2, i, v2);
        if (whatMoved & 8) this.setPieceBits(3, i, v3);
        break;
      case MeldGame.Move.RIGHT:     
        if (whatMoved & 1) this.setPieceBits(i, 3, v0);
        if (whatMoved & 2) this.setPieceBits(i, 2, v1);
        if (whatMoved & 4) this.setPieceBits(i, 1, v2);
        if (whatMoved & 8) this.setPieceBits(i, 0, v3); 
        break;
      case MeldGame.Move.DOWN:
        if (whatMoved & 1) this.setPieceBits(3, i, v0);
        if (whatMoved & 2) this.setPieceBits(2, i, v1);
        if (whatMoved & 4) this.setPieceBits(1, i, v2);
        if (whatMoved & 8) this.setPieceBits(0, i, v3);
        break;
    }
  }
  return moved;
};

/**
 * Returns the new toValue when combining the two fromValue and toValue pieces.
 * If the move is not allowed, toValue is returned.
 * @param {Number} fromValue
 * @param {Number} toValue
 * @returns {Number}
 */
MeldGame.combineValues = function(fromValue, toValue) {
  if (fromValue == 0) {
    return toValue;
  }
  if (toValue < 3) {
    if (toValue == 0 || fromValue + toValue == 3) {
      return fromValue + toValue;  
    } else {
      return toValue;
    }
  } else if (fromValue == toValue) {
    return toValue + 1;
  } else {
    return toValue;
  }
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

MeldGame.prototype.respondToUser = function(
        moveDirection, newPosition, nextValue, bonusValue) {
  var newR, newC;
  switch (moveDirection) {
    case MeldGame.Move.LEFT:
      newR = newPosition;
      newC = MeldGame.COLUMNS - 1;
      break;
    case MeldGame.Move.UP:
      newR = MeldGame.ROWS - 1;
      newC = newPosition;
      break;
    case MeldGame.Move.RIGHT:
      newR = newPosition;
      newC = 0;
      break;
    case MeldGame.Move.DOWN:
      newR = 0;
      newC = newPosition;
      break;
    default:
      throw new Error('Invalid move: ' + m);
  }
  var newValue = this.nextValue;
  if (newValue == MeldGame.NEXT_BONUS) {
    newValue = bonusValue;
  }
  this.addPiece(newR, newC, newValue);
  this.nextValue = nextValue;
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

MeldGame.prototype.isGameOver = function() {
  return !(this.canMoveAnyPiece(0, -1) ||
      this.canMoveAnyPiece(-1, 0) ||
      this.canMoveAnyPiece(0, 1) ||
      this.canMoveAnyPiece(1, 0));
};

MeldGame.prototype.finalScore = function() {
  var score = 0;
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      var piece = this.getPiece(r, c);
      if (piece >= 3) {
        score += Math.pow(3, Math.round(Math.log(piece / 3) / Math.LN2) + 1)
      }
    }
  }
  return score;
};
