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
 * The class responsible for trying to find the best next move.
 *
 * @author jkadams
 */

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
  switch (this.nextMove) {
    case 0:
      return 'LEFT';
    case 1:
      return 'UP';
    case 2:
      return 'RIGHT';
    case 3:
      return 'DOWN';
    default:
      return 'NONE';
  }
};

Solver.LOSE_SCORE = 1000;

Solver.finalBoardScore = function(game) {
  var score = 0;
  var pieces1 = game.pieces1;
  var pieces2 = game.pieces2;
  for (var c = 0; c < MeldGame.COLUMNS; c++) {
    if (pieces1 & 0xF) score++;
    if ((pieces1 >> 16) & 0xF) score++;
    if (pieces2 & 0xF) score++;
    if ((pieces2 >> 16) & 0xF) score++;
    pieces1 >>= 4;
    pieces2 >>= 4;
  }
  if (score == 16) {
    if (game.isGameOver()) {
      score = Solver.LOSE_SCORE; // no possible moves
    }
  }
//  evaluated++;
  return score;
};

Solver.prototype.moveScores = function(game, depthGone) {
  if (depthGone == this.depthNewCards + this.depthNoNewCards) {
    return Solver.finalBoardScore(game);
  }
  
  // If we're using the nextValue, try 1/2/3.
  // Otherwise, just use 1 and it will go unused.
  var nextPieceRange = depthGone < this.depthNewCards - 1 ? 3 : 1;
  // If the next card is a bonus card, and we're at depth 0, try all possible.
  var bonusMax = 6;
  if (depthGone == 0 && game.nextValue == MeldGame.NEXT_BONUS) {
    bonusMax = game.highestValue() / 8;
  }
  var bestMove = null;
  var bestScore = Solver.LOSE_SCORE;
  for (var moveDirection = 0; moveDirection < 4; moveDirection++) {
    var tempGame = game.copy();
    var newLocations = tempGame.move(moveDirection);
    var sum = 0;
    var count = 0;
    var expectedScore;
    if (newLocations != 0) {
      if (depthGone < this.depthNewCards) {
        // Add new cards at this depth.
        for (var newLocation = 0; newLocation < 4; newLocation++) {
          if ((newLocations & (1 << newLocation)) == 0) {
            continue; 
          }
          for (var nextPiece = 1; nextPiece <= nextPieceRange; nextPiece++) {
            for (var bonus = 6; bonus <= bonusMax; bonus *= 2) {
              var randomGame = tempGame.copy();
              randomGame.respondToUser(moveDirection, newLocation, nextPiece, bonus);
              sum += this.moveScores(randomGame, depthGone + 1);
              count++;
            }
          }
        }
        expectedScore = sum / count; // should we use the undrawn stack instead?
      } else {
        // Ignore new cards, just try to get rid of existing cards.
        expectedScore = this.moveScores(tempGame, depthGone + 1);
      }

      if (bestMove == null || expectedScore < bestScore) {
        bestScore = expectedScore;
        bestMove = moveDirection;
      }
    }
  }
  if (depthGone == 0) {
    this.nextMove = bestMove;
  }
  return bestScore;
};
