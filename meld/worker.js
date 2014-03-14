importScripts('meldgame.js', 'solver.js');
var solver = new Solver(3, 3);

onmessage = function(oEvent) {
  var game = ThreesGame.deserialize(oEvent.data);
  var bestMove = solver.findBestMove(game);
  postMessage(bestMove);
};
