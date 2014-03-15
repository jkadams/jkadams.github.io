importScripts('meldgame.js', 'solver.js');
var solver = new Solver(3, 2);

onmessage = function(oEvent) {
  var game = MeldGame.deserialize(oEvent.data);
  var bestMove = solver.findBestMove(game);
  postMessage(bestMove);
};
