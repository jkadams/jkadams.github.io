import java.io.IOException;

public class AndroidPlayer {
  public static Solver solver;
  public static AndroidThreesController controller;
  public static boolean DEBUG = true;
  
  public static void main(String[] args) throws IOException {
    solver = new ExpectimaxSolver(new FreeSpaceEvaluator(), 4, 2);
    controller = new AndroidThreesController();
    int[] highestCounts = new int[6400];
    controller.startNewGame();
    MeldGame.Move move = requestBestMove();
    int m = 0;
    while (move != null) {
      if (!controller.move(move)) {
        System.out.println("Move did nothing!");
        break;
      }
      if (DEBUG) controller.game.printBoard();
      m++;
      move = requestBestMove();
    }
    int hi = controller.game.highestValue();
    System.out.println("Hi: "+ hi +" / Moves: " + m);
    highestCounts[hi]++;
  }

  public static MeldGame.Move requestBestMove() {
    return solver.findBestMove(controller.game.copy());
  }
}
