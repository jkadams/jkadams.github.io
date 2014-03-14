var piecePadding = 0.5;
var pieceHeight = 3;
var pieceWidth = 3;

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
  piece.style.left = left + 'em';
  piece.style.top = top + 'em';
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