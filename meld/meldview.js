var piecePadding = 10;
var pieceHeight = 50;
var pieceWidth = 50;

function MeldMoveEvent(fromR, fromC, toR, toC, newValue) {
  this.fromR = fromR;
  this.fromC = fromC;
  this.toR = toR;
  this.toC = toC;
  this.newValue = newValue;
};

MeldMoveEvent.TYPE = 'MovePiece';

function MeldAddEvent(r, c, value) {
  this.r = r;
  this.c = c;
  this.value = value;
};

MeldAddEvent.TYPE = 'AddPiece';

function MeldView(game) {
  this.game = game;
  this.pieces = [];
  for (var r = 0; r < MeldGame.ROWS; r++) {
    var row = [];
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      if (this.game.getPiece(r, c) == 0) {
        row.push(null);
      } else {
        throw new Error("Unsupported view from non-empty game");
      }
    }
    this.pieces.push(row);
  }
}

MeldView.prototype.enterDocument = function() {
  this.nextPieceContainer = document.getElementById('nextPieceContainer');
  this.nextPiece = document.createElement('div');
  var content = document.createElement('div');
  content.className = 'pieceContent';
  this.nextPiece.appendChild(content);
  this.nextPieceContainer.appendChild(this.nextPiece);
  this.showNextValue();

  this.board = document.getElementById('gameBoard');
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
      var emptyPiece = document.createElement('div');
      emptyPiece.className = 'gamePiece emptyPiece';
      this.board.appendChild(emptyPiece);
      this.updatePiece(emptyPiece, r, c, null);
    }
  }
  this.moveEventListener = this.handleMovePiece.bind(this);
  this.addEventListener = this.handleAddPiece.bind(this);
  document.addEventListener(MeldMoveEvent.TYPE, this.moveEventListener, false);
  document.addEventListener(MeldAddEvent.TYPE, this.addEventListener, false);
};

MeldView.prototype.exitDocument = function() {
  while (this.board.firstChild) {
    this.board.removeChild(this.board.firstChild);
  }
  this.nextPieceContainer.removeChild(this.nextPiece);
  document.removeEventListener(MeldMoveEvent.TYPE, this.moveEventListener, false);
  document.removeEventListener(MeldAddEvent.TYPE, this.addEventListener, false);
};

MeldView.prototype.handleMovePiece = function(event) {
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

MeldView.prototype.handleAddPiece = function(event) {
  var e = event.detail;
  var newPiece = document.createElement('div');
  var content = document.createElement('div');
  content.className = 'pieceContent';
  newPiece.appendChild(content);
  this.board.appendChild(newPiece);
  this.updatePiece(newPiece, e.r, e.c, e.value);
  this.pieces[e.r][e.c] = newPiece;
};

MeldView.prototype.showNextValue = function() {
  var nextValue = this.game.nextValue;
  if (nextValue == MeldGame.NEXT_BONUS) {
    nextValue = '+';
  }
  this.updatePieceValue(this.nextPiece, nextValue);
};

MeldView.prototype.updatePiece = function(piece, r, c, value) {
  var left = c * (pieceWidth + piecePadding) + piecePadding;
  var top = r * (pieceHeight + piecePadding) + piecePadding;
  piece.style.left = left + 'px';
  piece.style.top = top + 'px';
  if (value != null) {
    this.updatePieceValue(piece, value);
  }
};

MeldView.prototype.updatePieceValue = function(piece, value) {
  piece.firstChild.innerText = value;
  piece.className = 'gamePiece';
  if (value == 1) {
    piece.className += ' onePiece';
  } else if (value == 2) {
    piece.className += ' twoPiece';
  }
};

MeldView.prototype.validateState = function() {
  for (var r = 0; r < MeldGame.ROWS; r++) {
    for (var c = 0; c < MeldGame.COLUMNS; c++) {
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
