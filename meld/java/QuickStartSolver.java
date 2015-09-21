public class QuickStartSolver implements Solver {
  int slowThreshold;
  Solver fastSolver;
  Solver slowSolver;
  
  public QuickStartSolver(int fastThreshold, Solver fastSolver, Solver slowSolver) {
    this.slowThreshold = fastThreshold;
    this.fastSolver = fastSolver;
    this.slowSolver = slowSolver;
  }

  @Override public MeldGame.Move findBestMove(MeldGame game) {
    if (game.highestValue() >= slowThreshold) {
      return slowSolver.findBestMove(game);
    } else {
      return fastSolver.findBestMove(game);
    }
  }
}
