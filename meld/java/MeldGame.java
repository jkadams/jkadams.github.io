import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
 * Stores information about the state of the game in a compact way.
 * 
 * There are only 32 bit integer operations in JS, so we store the game board
 * in two separate integers according to this layout.
 * 
 *  0   4   8  12   pieces1
 * 16  20  24  28   pieces1
 *  0   4   8  12   pieces2
 * 16  20  24  28   pieces2
 * 
 * The nibble at each offset maps to the value in this way:
 * 
 * 0 : 0 (no tile)
 * 1 : 1
 * 2 : 2
 * k : 3 * 2^(k-3)
 * 
 * If a card in the game were to go over 12288, bad things would happen.
 * 
 * We store the next value to be seen in a third integer.
 * TODO: throw in the undrawn card stack to that integer if necessary
 *
 * @author jkadams
 */

public class MeldGame {
  // Number of rows and columns on a game board. Changing this will break things.
  public static int ROWS = 4;
  public static int COLUMNS = 4;
  public static int NIBBLE_SIZE = 4;

  // What MeldGame.nextValue will be if the next card is a bonus card.
  public static int NEXT_BONUS = -1;

  //Maps from 4 bit integers to the actual value of the card.
  public static int[] BITS_TO_VALUES;

  //Maps from the value of the card to a compact 4 bit integer.
  public static Map<Integer, Integer> VALUES_TO_BITS;

  static {
    int[] b = {0, 1, 2, 3, 6, 12, 24, 48, 96, 192, 384, 768, 1536, 3072, 6144, 12288};
    BITS_TO_VALUES = b;
    VALUES_TO_BITS = new HashMap<Integer, Integer>();
    for (int i = 0; i < b.length; i++) {
      VALUES_TO_BITS.put(b[i], i);
    }
  }

  // Move direction enum.
  public enum Move { LEFT, UP, RIGHT, DOWN };

  public long pieces;
  public int nextValue;

  public MeldGame(MeldGame existingGame) {
    this.pieces = existingGame.pieces;
    this.nextValue = existingGame.nextValue;
  }

  public MeldGame() {
    this.pieces = 0;
    this.nextValue = 0;
  }

  // Returns a copy of this game's state.
  public MeldGame copy() {
    return new MeldGame(this);
  }

  // Returns whether this board is equal to the given other board.
  public boolean equals(MeldGame other) {
    return this.pieces == other.pieces &&
        this.nextValue == other.nextValue;
  }

  public int getPiece(int r, int c) {
    return MeldGame.BITS_TO_VALUES[(int) this.getPieceBits(r, c)];
  }

  public long getPieceBits(int r, int c) {
    int offset = MeldGame.NIBBLE_SIZE * (MeldGame.COLUMNS * r + c);
    return 0xFl & (this.pieces >> offset);
  }

  public void setPiece(int r, int c, int v) {
    this.setPieceBits(r, c, MeldGame.VALUES_TO_BITS.get(v));
  }

  public void setPieceBits(int r, int c, long bits) {
    int offset = MeldGame.NIBBLE_SIZE * (MeldGame.COLUMNS * r + c);
    this.pieces = (this.pieces & ~(0xFl << offset)) | (bits << offset);
  }

  public int pieceCount() {
    int pieceCount = 0;
    // Should we optimize this more?
    for (int r = 0; r < MeldGame.ROWS; r++) {
      for (int c = 0; c < MeldGame.COLUMNS; c++) {
        if (this.getPieceBits(r, c) != 0) pieceCount++;
      }
    }
    return pieceCount;
  }

  public int highestValue() {
    long max = 0;
    // Should we optimize this more?
    for (int r = 0; r < MeldGame.ROWS; r++) {
      for (int c = 0; c < MeldGame.COLUMNS; c++) {
        max = Math.max(max, this.getPieceBits(r, c));
      }
    }
    return MeldGame.BITS_TO_VALUES[(int) max];
  }

  public static List<Integer> movedArray(int set) {
    List<Integer> array = new ArrayList<Integer>(); 
    for (int i = 0; i < 4; i++) {
      if ((set & 0x1) != 0) {
        array.add(i);
      }
      set >>= 1;
    }
    return array;
  }

  /**
   * Moves the board in the given direction.
   * 
   * This moves the 4 cards on each row/column in the direction from v3 -> v0.
   * Merges v1 onto v0 if possible.
   * Then merges v2 onto v1 if possible.
   * Then merges v3 onto v2 if possible.
   * 
   * Returns a 4 element bit set containing the rows or columns that changed.
   */
  public int move(Move moveDirection) {
    int moved = 0;
    for (int i = 0; i < 4; i++) { // the dimension perpendicular to the movement
      // We want to move the 4 cards in the direction from v3 -> v0.
      long v0, v1, v2, v3;
      int whatMoved = 0;
      switch (moveDirection) {
      case LEFT:
        v0 = this.getPieceBits(i, 0);
        v1 = this.getPieceBits(i, 1);
        v2 = this.getPieceBits(i, 2);
        v3 = this.getPieceBits(i, 3);
        break;
      case UP:
        v0 = this.getPieceBits(0, i);
        v1 = this.getPieceBits(1, i);
        v2 = this.getPieceBits(2, i);
        v3 = this.getPieceBits(3, i);
        break;
      case RIGHT:      
        v0 = this.getPieceBits(i, 3);
        v1 = this.getPieceBits(i, 2);
        v2 = this.getPieceBits(i, 1);
        v3 = this.getPieceBits(i, 0);
        break;
      case DOWN:
        v0 = this.getPieceBits(3, i);
        v1 = this.getPieceBits(2, i);
        v2 = this.getPieceBits(1, i);
        v3 = this.getPieceBits(0, i);
        break;
      default:
        throw new IllegalStateException("Bad move");
      }

      long newV = MeldGame.combineValues(v1, v0);
      if (newV != v0) {
        v0 = newV;
        v1 = 0;
        whatMoved |= 3; // changed 0 and 1
      }
      newV = MeldGame.combineValues(v2, v1);
      if (newV != v1) {
        v1 = newV;
        v2 = 0;
        whatMoved |= 6; // changed 1 and 2
      }
      newV = MeldGame.combineValues(v3, v2);
      if (newV != v2) {
        v2 = newV;
        v3 = 0;
        whatMoved |= 12; // changed 2 and 3
      }
      if (whatMoved != 0) {
        moved |= (1 << i);
      }

      switch (moveDirection) {
      case LEFT:
        if ((whatMoved & 1) != 0) this.setPieceBits(i, 0, v0);
        if ((whatMoved & 2) != 0) this.setPieceBits(i, 1, v1);
        if ((whatMoved & 4) != 0) this.setPieceBits(i, 2, v2);
        if ((whatMoved & 8) != 0) this.setPieceBits(i, 3, v3);
        break;
      case UP:
        if ((whatMoved & 1) != 0) this.setPieceBits(0, i, v0);
        if ((whatMoved & 2) != 0) this.setPieceBits(1, i, v1);
        if ((whatMoved & 4) != 0) this.setPieceBits(2, i, v2);
        if ((whatMoved & 8) != 0) this.setPieceBits(3, i, v3);
        break;
      case RIGHT:     
        if ((whatMoved & 1) != 0) this.setPieceBits(i, 3, v0);
        if ((whatMoved & 2) != 0) this.setPieceBits(i, 2, v1);
        if ((whatMoved & 4) != 0) this.setPieceBits(i, 1, v2);
        if ((whatMoved & 8) != 0) this.setPieceBits(i, 0, v3); 
        break;
      case DOWN:
        if ((whatMoved & 1) != 0) this.setPieceBits(3, i, v0);
        if ((whatMoved & 2) != 0) this.setPieceBits(2, i, v1);
        if ((whatMoved & 4) != 0) this.setPieceBits(1, i, v2);
        if ((whatMoved & 8) != 0) this.setPieceBits(0, i, v3);
        break;
      }
    }
    return moved;
  }

  /**
   * Returns the new toValue when combining the two fromValue and toValue pieces.
   * If the move is not allowed, toValue is returned.
   * @param {Number} fromValue
   * @param {Number} toValue
   * @returns {Number}
   */
  public static long combineValues(long fromValue, long toValue) {
    if (fromValue == 0) {
      return toValue;
    }
    if (toValue < 3) {
      if (toValue == 0 || fromValue + toValue == 3) {
        return fromValue + toValue;  
      } else {
        return toValue;
      }
    } else if (fromValue == toValue) {
      return toValue + 1;
    } else {
      return toValue;
    }
  }

  // Returns whether any piece can move in a given direction.
  public boolean canMoveAnyPiece(int deltaR, int deltaC) {
    for (int r = 0; r < MeldGame.ROWS; r++) {
      for (int c = 0; c < MeldGame.COLUMNS; c++) {
        int rT = deltaR == 1 ? MeldGame.ROWS - 1 - r : r;
        int cT = deltaC == 1 ? MeldGame.COLUMNS - 1 - c : c;
        if (this.canMovePiece(rT, cT, deltaR, deltaC)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @returns {boolean} Whether the piece at (r,c) can move by (deltaR,deltaC).
   * If there is no piece at this position, returns false.
   */
  public boolean canMovePiece(int r, int c, int deltaR, int deltaC) {
    if (c + deltaC < 0 || c + deltaC >= MeldGame.COLUMNS ||
        r + deltaR < 0 || r + deltaR >= MeldGame.ROWS) {
      return false;
    }
    long fromValue = this.getPieceBits(r, c);
    if (fromValue == 0) {
      return false;
    }

    long toValue = this.getPieceBits(r + deltaR, c + deltaC);
    return toValue == 0 ||
        (toValue >= 3 && fromValue == toValue) ||
        (toValue < 3 && fromValue + toValue == 3);
  }

  /**
   * Moves the given piece at (r,c) by (deltaR,deltaC).
   */
  public void movePiece(int r, int c, int deltaR, int deltaC) {
    int toR = r + deltaR;
    int toC = c + deltaC;
    long toValue = this.getPieceBits(toR, toC);
    long newValue;
    if (toValue < 3) {
      long fromValue = this.getPieceBits(r, c);
      newValue = fromValue + toValue;
    } else {
      newValue = toValue + 1;
    }
    this.setPieceBits(toR, toC, newValue);
    this.setPieceBits(r, c, 0);
  }

  public void respondToUser(
      Move moveDirection, int newPosition, int nextValue, int bonusValue) {
    int newR, newC;
    switch (moveDirection) {
    case LEFT:
      newR = newPosition;
      newC = MeldGame.COLUMNS - 1;
      break;
    case UP:
      newR = MeldGame.ROWS - 1;
      newC = newPosition;
      break;
    case RIGHT:
      newR = newPosition;
      newC = 0;
      break;
    case DOWN:
      newR = 0;
      newC = newPosition;
      break;
    default:
      throw new IllegalStateException("Bad move");
    }
    int newValue = this.nextValue;
    if (newValue == MeldGame.NEXT_BONUS) {
      newValue = bonusValue;
    }
    this.addPiece(newR, newC, newValue);
    this.nextValue = nextValue;
  }

  public void addPiece(int r, int c, int value) {
    this.setPiece(r, c, value);
  }

  public boolean isGameOver() {
    return !(this.canMoveAnyPiece(0, -1) ||
        this.canMoveAnyPiece(-1, 0) ||
        this.canMoveAnyPiece(0, 1) ||
        this.canMoveAnyPiece(1, 0));
  }

  public int finalScore() {
    int score = 0;
    for (int r = 0; r < MeldGame.ROWS; r++) {
      for (int c = 0; c < MeldGame.COLUMNS; c++) {
        int piece = this.getPiece(r, c);
        if (piece >= 3) {
          score += Math.pow(3, Math.round(Math.log(piece / 3) / Math.log(2)) + 1);
        }
      }
    }
    return score;
  }

  public void printBoard() {
    for (int r = 0; r < MeldGame.ROWS; r++) {
      if (r == 0) {
        System.out.print("(" + (this.nextValue == MeldGame.NEXT_BONUS ? "+" : this.nextValue) + ")");
      } else {
        System.out.print("   ");
      }
      for (int c = 0; c < MeldGame.COLUMNS; c++) {
        System.out.printf("%5d ",this.getPiece(r, c));
      }
      System.out.println();
    }
  }
}
