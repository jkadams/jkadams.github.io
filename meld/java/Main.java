public class Main {
  public static Solver solver;
  public static MeldController controller;
  public static boolean DEBUG = false;
  
  public static void main(String[] args) {
//    Solver slowSolver = new ExpectimaxSolver(new FreeSpaceAndWallEvaluator(), 3, 1);
//    Solver fastSolver = new ExpectimaxSolver(new FreeSpaceAndWallEvaluator(), 3, 1);
//    Solver testSolver = new QuickStartSolver(96, fastSolver, slowSolver);
//    solver = new ExpectimaxSolver(new FreeSpaceAndWallEvaluator(), 4, 2);
    solver = new ExpectimaxSolver(new FreeSpaceEvaluator(), 4, 2);
    controller = new MeldController();
    int[] highestCounts = new int[6400];
    for (int game = 0; game < 100; game++) {
      controller.startNewGame();
      MeldGame.Move move = requestBestMove();
      int m = 0;
      while (move != null) {
        if (DEBUG) controller.game.printBoard();
        if (!controller.move(move)) {
          System.out.println("Move did nothing!");
          break;
        }
        m++;
        move = requestBestMove();
//        if (DEBUG) testSolver.findBestMove(controller.game.copy());
      }
      int hi = controller.game.highestValue();
      System.out.println("Hi: "+ hi +" / Moves: " + m);
      highestCounts[hi]++;
    }
    System.out.println("Counts:");
    for (int hi = 96; hi < highestCounts.length; hi *= 2) {
      System.out.println(hi + "\t" + highestCounts[hi]);
    }
  }

  public static MeldGame.Move requestBestMove() {
    return solver.findBestMove(controller.game.copy());
  }
}
