function Solver(depthNewCards, depthNoNewCards) {
  this.depthNewCards = depthNewCards;
  this.depthNoNewCards = depthNoNewCards;
  this.nextMove = null;
}

var evaluated = 0;
var times = [];
var evalcount = [];

Solver.prototype.findBestMove = function(game) {
  var startTime = new Date();
  evaluated = 0;
  this.moveScores(game, 0);
  var endTime = new Date();
  times.push(endTime-startTime);
  evalcount.push(evaluated);
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
  evaluated++;
  return score;
};

Solver.prototype.moveScores = function(game, depthGone) {
//  var depthNewCards = this.depthNewCards;
//  var depthNoNewCards = this.depthNoNewCards;
//  if (game.highestValue() <= 48) {
//    // Go fast at the beginning of the game, it doesn't matter as much.
//    depthNewCards = 2;
//    depthNoNewCards = 2;
//  }

  if (depthGone == this.depthNewCards + this.depthNoNewCards) {
    return Solver.finalBoardScore(game);
  }
  var bestMove = 'NONE';
  var bestScore = Solver.LOSE_SCORE;
  for (var m in MeldGame.Move) {
    var moveDirection = MeldGame.Move[m];
    var tempGame = game.copy();
    var newLocations = tempGame.move(moveDirection);
    var sum = 0;
    var count = 0;
    var expectedScore;
    if (newLocations != 0) {
      if (depthGone < this.depthNewCards) {
        var newLocationsArray = MeldGame.movedArray(newLocations);
        for (var i = 0; i < newLocationsArray.length; i++) {
          // If we're using the nextValue, try all three types.
          // Otherwise, just use one and it will go unused.
          var newLocation = newLocationsArray[i];
          var maxNextPiece = depthGone < this.depthNewCards - 1 ? 3 : 1;
          for (var nextPiece = 1; nextPiece <= maxNextPiece; nextPiece++) {
            var randomGame = tempGame.copy();
            randomGame.respondToUser(moveDirection, newLocation, nextPiece, 6);
            sum += this.moveScores(randomGame, depthGone + 1);
            count++;
          }
        }
        expectedScore = sum / count;
//        if (depthGone == 0) {
//           console.log(m+': '+expectedScore);
//        }
      } else {
        expectedScore = this.moveScores(tempGame, depthGone + 1);
      }

      if (expectedScore < bestScore || bestMove == 'NONE') {
        bestScore = expectedScore;
        bestMove = m;
      }
    }
  }
  if (depthGone == 0) {
    this.nextMove = bestMove;
    // console.log('Best move: ' + bestMove);
  }
  return bestScore;
};
