public class Main {
  public static Solver solver;
  public static MeldController controller;
  public static void main(String[] args) {
    solver = new Solver(4, 2);
    controller = new MeldController();
    int[] highestCounts = new int[6400];
    for (int game = 0; game < 100; game++) {
      controller.startNewGame();
      MeldGame.Move move = requestBestMove();
      int m = 0;
      while (move != null) {
        if (!controller.move(move)) {
          System.out.println("Move did nothing!");
          break;
        }
        m++;
        move = requestBestMove();
      }
      int hi = controller.game.highestValue();
      System.out.println("Hi: "+ hi +" / Moves: " + m);
      highestCounts[hi]++;
      System.out.println(highestCounts[hi]);
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
