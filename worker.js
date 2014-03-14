importScripts('threesgame.js', 'solver.js');
var solver = new Solver(7);

onmessage = function(oEvent) {
  var game = ThreesGame.deserialize(oEvent.data);
  var bestMove = solver.findBestMove(game);
  postMessage(bestMove);
};