import java.util.*;

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

public class ExpectimaxSolver implements Solver {
  private BoardEvaluator evaluator;
  
  private int depthNewCards;
  private int depthNoNewCards;
  private MeldGame.Move nextMove;
  private Map<MeldGame, Double> seen;
  
  // Debug info
  public List<Long> times;
  public List<Integer> evalcount;
  public int evaluatedStates;
  
  public ExpectimaxSolver(BoardEvaluator evaluator, int depthNewCards, int depthNoNewCards) {
    this.evaluator = evaluator;
    this.depthNewCards = depthNewCards;
    this.depthNoNewCards = depthNoNewCards;
    this.nextMove = null;
    this.seen = new HashMap<MeldGame, Double>();
    this.times = new ArrayList<Long>();
    this.evalcount = new ArrayList<Integer>();
  }

  @Override public MeldGame.Move findBestMove(MeldGame game) {
    evaluatedStates = 0;
    long startTime = System.nanoTime();
    
    this.seen = new HashMap<MeldGame, Double>();
    this.moveScores(game, 0);
    
    long endTime = System.nanoTime();
    long elapsedTime = endTime - startTime;
    if (Main.DEBUG) System.out.printf("%5s %10d %10fs%n", this.nextMove, this.evaluatedStates, elapsedTime / 1.0e9d);
    return this.nextMove;
  }

  public double moveScores(MeldGame game, int depthGone) {
    if (depthGone <= this.depthNewCards) {
      Double score = seen.get(game);
      if (score != null) {
        return score;
      }
    }
    if (depthGone == this.depthNewCards + this.depthNoNewCards) {
      evaluatedStates++;
      return evaluator.score(game);
    }

    // If we're using the nextValue, try 1/2/3.
    // Otherwise, just use 1 and it will go unused.
    int nextPieceRange = depthGone < this.depthNewCards - 1 ? 3 : 1;
    // If the next card is a bonus card, and we're at depth 0, try all possible.
    int bonusMax = 6;
    if (depthGone == 0 && game.nextValue == MeldGame.NEXT_BONUS) {
      bonusMax = game.highestValue() / 8;
    }
    MeldGame.Move bestMove = null;
    double bestScore = evaluator.losingScore();
    for (MeldGame.Move moveDirection : MeldGame.Move.values()) {
      MeldGame tempGame = game.copy();
      int newLocations = tempGame.move(moveDirection);
      double sum = 0;
      int count = 0;
      double expectedScore;
      if (newLocations != 0) {
        if (depthGone < this.depthNewCards) {
          // Add new cards at this depth.
          for (int newLocation = 0; newLocation < 4; newLocation++) {
            if ((newLocations & (1 << newLocation)) == 0) {
              continue; 
            }
            for (int nextPiece = 1; nextPiece <= nextPieceRange; nextPiece++) {
              for (int bonus = 6; bonus <= bonusMax; bonus *= 2) {
                MeldGame randomGame = tempGame.copy();
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
        if (Main.DEBUG && depthGone == 0) {
          System.out.printf("     %5s %10f%n", moveDirection, expectedScore);
        }
      }
    }
    if (depthGone == 0) {
      this.nextMove = bestMove;
    }
    if (depthGone <= this.depthNewCards) {
      seen.put(game, bestScore); // should we also take into account depth in the search?
    }
    return bestScore;
  }
}