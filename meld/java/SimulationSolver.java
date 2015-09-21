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

public class SimulationSolver implements Solver {
  private BoardEvaluator evaluator;
  
  private int depthNewCards;
  private int trials;
  private Random random;
  
  // Debug info
  public List<Long> times;
  public List<Integer> evalcount;
  public int evaluatedStates;
  
  public SimulationSolver(BoardEvaluator evaluator, int depthNewCards, int trials) {
    this.evaluator = evaluator;
    this.depthNewCards = depthNewCards;
    this.trials = trials;
    this.times = new ArrayList<Long>();
    this.evalcount = new ArrayList<Integer>();
  }

  @Override public MeldGame.Move findBestMove(MeldGame game) {
    evaluatedStates = 0;
    long startTime = System.nanoTime();

    Random randomSeeds = new Random(67823);
    int[] counts = new int[4];
    for (int i = 0; i < this.trials; i++) {
      MeldGame.Move bestMove = this.tryAllMoves(game, randomSeeds.nextLong());
      if (bestMove == null) {
        return null;
      }
      counts[bestMove.ordinal()]++;
    }
    
    long endTime = System.nanoTime();
    long elapsedTime = endTime - startTime;
    if (Main.DEBUG) System.out.println(Arrays.toString(counts));

    int max = 0;
    MeldGame.Move bestMove = null;
    for (MeldGame.Move moveDirection : MeldGame.Move.values()) {
      int c = counts[moveDirection.ordinal()]; // maybe a weighted average instead?
      if (c > max) {
        max = c;
        bestMove = moveDirection;
      }
    }

    if (Main.DEBUG) System.out.printf("%5s %10d %10fs%n", bestMove, this.evaluatedStates, elapsedTime / 1.0e9d);
    return bestMove;
  }
  
  public MeldGame.Move tryAllMoves(MeldGame game, long randomSeed) {
    MeldGame.Move bestMove = null;
    double bestScore = evaluator.losingScore();
    for (MeldGame.Move moveDirection : MeldGame.Move.values()) {
      random = new Random(randomSeed);
      int bonusMax = 6;
      if (game.nextValue == MeldGame.NEXT_BONUS) {
        bonusMax = game.highestValue() / 8;
      }
      MeldGame tempGame = game.copy();
      int newLocations = tempGame.move(moveDirection);
      double sum = 0;
      int count = 0;
      double expectedScore;
      if (newLocations != 0) {
          // Add new cards at this depth.
          List<Integer> newLocs = MeldGame.movedArray(newLocations); // optimize
          int newLocation = newLocs.get(random.nextInt(newLocs.size()));
          int nextPiece = random.nextInt(3) + 1;
          for (int bonus = 6; bonus <= bonusMax; bonus *= 2) {
            MeldGame randomGame = tempGame.copy();
            randomGame.respondToUser(moveDirection, newLocation, nextPiece, bonus);
            sum += this.moveScores(randomGame, 1);
            count++;
          }
          expectedScore = sum / count; // should we use the undrawn stack instead?

        if (bestMove == null || expectedScore < bestScore) {
          bestScore = expectedScore;
          bestMove = moveDirection;
        }
//        if (Main.DEBUG) System.out.printf("     %5s %10f%n", moveDirection, expectedScore);
      }
    }
    return bestMove;
  }

  public double moveScores(MeldGame game, int depthGone) {
    if (depthGone == this.depthNewCards) {
      evaluatedStates++;
      return evaluator.score(game);
    }
    MeldGame.Move bestMove = null;
    double bestScore = evaluator.losingScore();
    for (MeldGame.Move moveDirection : MeldGame.Move.values()) {
      MeldGame tempGame = game.copy();
      int newLocations = tempGame.move(moveDirection);
      double expectedScore;
      if (newLocations != 0) {
        // Add new cards at this depth.
        List<Integer> newLocs = MeldGame.movedArray(newLocations); // optimize
        int newLocation = newLocs.get(random.nextInt(newLocs.size()));
        int nextPiece = random.nextInt(3) + 1;
        MeldGame randomGame = tempGame.copy();
        randomGame.respondToUser(moveDirection, newLocation, nextPiece, 6);
        expectedScore = this.moveScores(randomGame, depthGone + 1);

        if (bestMove == null || expectedScore < bestScore) {
          bestScore = expectedScore;
          bestMove = moveDirection;
        }
      }
    }
    return bestScore;
  }
}