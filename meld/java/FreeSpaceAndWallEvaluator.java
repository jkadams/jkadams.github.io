public class FreeSpaceAndWallEvaluator implements BoardEvaluator {

  public final double LOSE_SCORE;
  public final double HI_WALL_BONUS;
  public FreeSpaceAndWallEvaluator() {
    LOSE_SCORE = 1000;
    HI_WALL_BONUS = 0.5;
  }

  static int evaluatedStates;
  @Override public double score(MeldGame game) {
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
        return LOSE_SCORE; // no possible moves
      }
    }

    int hi = game.highestValue();
    boolean onWall = false;
    boolean onCorner = false;
    if (hi > 48) {
      for (int r = 0; r < 4; r++) {
        for (int c = 0; c < 4; c++) {
          if (r == 0 || c == 0 || r == 3 || c == 3) {
            if (game.getPiece(r, c) == hi) {
              onWall = true;
              if ((r == 0 && c == 0) ||
                  (r == 0 && c == 3) ||
                  (r == 3 && c == 0) ||
                  (r == 3 && c == 3)) {
                onCorner = true;
              }
            }
          }
        }
      }
    }
    if (onCorner) {
      score -= 3 * HI_WALL_BONUS; // bonus points for leaving the high card by the wall (only once)
    } else if (onWall) {
      score -= HI_WALL_BONUS;
    }
    return score;
  }
  
  @Override public double losingScore() {
    return LOSE_SCORE;
  }
}
