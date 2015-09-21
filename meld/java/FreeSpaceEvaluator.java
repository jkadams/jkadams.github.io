public class FreeSpaceEvaluator implements BoardEvaluator {

  public final int LOSE_SCORE;
  public FreeSpaceEvaluator() {
    LOSE_SCORE = 1000;
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
        score = LOSE_SCORE; // no possible moves
      }
    }
    return score;
  }
  
  @Override public double losingScore() {
    return LOSE_SCORE;
  }
}
