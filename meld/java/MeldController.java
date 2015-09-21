import java.util.List;
import java.util.Random;

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
 * Controller for the game, responsible for updating the game state and the view,
 * and generating the random values used for the game's response to each move.
 *
 * @author jkadams
 */

public class MeldController {

  public MeldGame game;
  public int[] remaining;
  public Random random;
  public MeldController() {
    this.game = null;
    this.remaining = new int[3];
    this.random = new Random(516352);
  }

  public int randomNextValue() {
    int highestValue = this.game.highestValue();
    boolean useBonus = highestValue >= 48 && random.nextInt(21) == 0;
    if (useBonus) {
      return MeldGame.NEXT_BONUS;
    }
    int left = this.remaining[0] + this.remaining[1] + this.remaining[2];
    int nextCard = random.nextInt(left);
    int r;
    if (nextCard < this.remaining[0]) {
      r = 1;
      this.remaining[0]--;
    } else if (nextCard < this.remaining[0] + this.remaining[1]) {
      r = 2;
      this.remaining[1]--;
    } else {
      r = 3;
      this.remaining[2]--;
    }
    if (left == 1) {
      this.remaining[0] = 4;
      this.remaining[1] = 4;
      this.remaining[2] = 4;
    }
    return r;
  }

  public int randomBonusValue() {
    int highestValue = this.game.highestValue();
    int range = (int) Math.round(Math.log(highestValue / 24) / Math.log(2));
    int randBonus = 1 + random.nextInt(range);
    int r = (int) Math.pow(2, randBonus) * 3;
    return r;
  }

  public void startNewGame() {
    // This should be on MeldGame but we don't use it in the solver,
    // so I'm saving space for now.
    this.remaining[0] = 4;
    this.remaining[1] = 4;
    this.remaining[2] = 4;
    this.game = new MeldGame();
    // Is this the new-game algorithm?
    // Or is it "swipe in a random valid direction 9 times"?
    for (int i = 0; i < (MeldGame.ROWS - 1) * (MeldGame.COLUMNS - 1); i++) {
      int r = random.nextInt(4);
      int c = random.nextInt(4);
      int value = this.randomNextValue();
      while (this.game.getPiece(r, c) != 0) {
        r = random.nextInt(4);
        c = random.nextInt(4);
      }
      this.game.addPiece(r, c, value);
    }
    this.game.nextValue = this.randomNextValue();
  }

  public boolean move(MeldGame.Move m) {
    int moved = this.game.move(m);
    if (moved != 0) {
      List<Integer> movedArray = MeldGame.movedArray(moved);
      int randomEntry = movedArray.get(random.nextInt(movedArray.size()));
      int bonusValue = 0;
      if (this.game.nextValue == MeldGame.NEXT_BONUS) {
        bonusValue = this.randomBonusValue();
      }
      int randomNextValue = this.randomNextValue();
      this.game.respondToUser(m, randomEntry, randomNextValue, bonusValue);
    }
//    if (this.game.isGameOver()) {
//      System.out.println("Game over! Your score is " + this.game.finalScore() + ".");
//    }
    return moved != 0;
  }
}
