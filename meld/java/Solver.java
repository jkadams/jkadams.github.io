import java.util.ArrayList;
import java.util.List;

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

public class Solver {
  public int depthNewCards;
  public int depthNoNewCards;
  public MeldGame.Move nextMove;
  public Solver(int depthNewCards, int depthNoNewCards) {
    this.depthNewCards = depthNewCards;
    this.depthNoNewCards = depthNoNewCards;
    this.nextMove = null;
  }

  static int evaluated = 0;
  static List<Long> times = new ArrayList<Long>();
  static List<Integer> evalcount = new ArrayList<Integer>();

  public MeldGame.Move findBestMove(MeldGame game) {
    long startTime = System.nanoTime();
    evaluated = 0;
    this.moveScores(game, 0);
    long endTime = System.nanoTime();
    times.add(endTime-startTime);
    evalcount.add(evaluated);
    return this.nextMove;
  }

  public static final int LOSE_SCORE = 1000;

  public static int finalBoardScore(MeldGame game) {
    int score = 0;
    long pieces = game.pieces;
    for (int c = 0; c < MeldGame.COLUMNS; c++) {
      if ((pieces & 0xF) != 0) score++;
      if (((pieces >> 16) & 0xF) != 0) score++;
      if (((pieces >> 32) & 0xF) != 0) score++;
      if (((pieces >> 48) & 0xF) != 0) score++;
      pieces >>= 4;
    }
    if (score == 16) {
      if (game.isGameOver()) {
        score = Solver.LOSE_SCORE; // no possible moves
      }
    }
    //  evaluated++;
    return score;
  }

  public double moveScores(MeldGame game, int depthGone) {
    if (depthGone == this.depthNewCards + this.depthNoNewCards) {
      return Solver.finalBoardScore(game);
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
    double bestScore = Solver.LOSE_SCORE;
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
        //      if (depthGone == 0) {
        //        console.log(moveDirection + ': ' + expectedScore);
        //      }
      }
    }
    if (depthGone == 0) {
      this.nextMove = bestMove;
      //    console.log('Best move: ' + bestMove);
    }
    return bestScore;
  }
}