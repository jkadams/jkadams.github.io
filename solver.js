function Solver(ply) {
  this.ply = ply;
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
  if (pieceCount == ThreesGame.ROWS * ThreesGame.COLUMNS) {
    if (game.copy().move(0, -1).length == 0 &&
        game.copy().move(-1, 0).length == 0 &&
        game.copy().move(0, 1).length == 0 &&
        game.copy().move(1, 0).length == 0) {
      score = Solver.LOSE_SCORE;
    }
  }
  return score;
};

Solver.prototype.moveScores = function(game, depthRemaining) {
  if (depthRemaining == this.ply) {
    return Solver.finalBoardScore(game);
  }
  var bestMove = 'NONE';
  var bestScore = Solver.LOSE_SCORE;
  for (var m in Move) {
    var deltaR, deltaC;
    switch (Move[m]) {
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
    }
    var tempGame = game.copy();
    var nextLocations = tempGame.move(deltaR, deltaC);
    var sum = 0;
    var count = 0;
    var expectedScore;
    var RANDOM_NEXT_MOVES = 3;
    if (nextLocations.length > 0) {
	    if (depthRemaining < RANDOM_NEXT_MOVES) {
	      for (var i = 0; i < nextLocations.length; i++) {
	      	var maxNextPiece = depthRemaining < RANDOM_NEXT_MOVES - 1 ? 3 : 1;
	        for (var nextPiece = 1; nextPiece <= maxNextPiece; nextPiece++) {
	          var randomGame = tempGame.copy();
	          randomGame.makeNextMove(deltaR, deltaC, nextLocations[i], nextPiece);
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