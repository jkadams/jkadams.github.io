function Solver(depthNewCards, depthNoNewCards) {
  this.depthNewCards = depthNewCards;
  this.depthNoNewCards = depthNoNewCards;
  this.nextMove = null;
}

Solver.prototype.findBestMove = function(game) {
  this.moveScores(game, 0);
  return this.nextMove;
};

Solver.LOSE_SCORE = 1000;

Solver.finalBoardScore = function(game) {
  var pieceCount = game.pieceCount();
  var score = pieceCount;
  if (pieceCount == MeldGame.ROWS * MeldGame.COLUMNS) {
    if (game.isGameOver()) {
      score = Solver.LOSE_SCORE;
    }
  }
  return score;
};

Solver.prototype.moveScores = function(game, depthRemaining) {
  var depthNewCards = this.depthNewCards;
  var depthNoNewCards = this.depthNoNewCards;
  if (game.highestValue() <= 48) {
    depthNewCards = 2;
    depthNoNewCards = 2;
  }

  if (depthRemaining == depthNewCards + depthNoNewCards) {
    return Solver.finalBoardScore(game);
  }
  var bestMove = 'NONE';
  var bestScore = Solver.LOSE_SCORE;
  for (var m in MeldGame.Move) {
    var deltaR, deltaC;
    switch (MeldGame.Move[m]) {
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
    }
    var tempGame = game.copy();
    var nextLocations = tempGame.move(deltaR, deltaC);
    var sum = 0;
    var count = 0;
    var expectedScore;
    if (nextLocations.length > 0) {
      if (depthRemaining < depthNewCards) {
        for (var i = 0; i < nextLocations.length; i++) {
          var maxNextPiece = depthRemaining < depthNewCards - 1 ? 3 : 1;
          for (var nextPiece = 1; nextPiece <= maxNextPiece; nextPiece++) {
            var randomGame = tempGame.copy();
            randomGame.respondToUser(deltaR, deltaC, nextLocations[i], nextPiece, 6);
            sum += this.moveScores(randomGame, depthRemaining + 1);
            count++;
          }
        }
        expectedScore = sum / count;
        if (depthRemaining == 0) {
          console.log(m+': '+expectedScore);
        }
      } else {
        expectedScore = this.moveScores(tempGame, depthRemaining + 1);
      }

      if (expectedScore < bestScore || bestMove == 'NONE') {
        bestScore = expectedScore;
        bestMove = m;
      }
    }
  }
  if (depthRemaining == 0) {
    this.nextMove = bestMove;
    console.log('Best move: ' + bestMove);
  }
  return bestScore;
};
