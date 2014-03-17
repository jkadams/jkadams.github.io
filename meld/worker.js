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

importScripts('meldgame.js', 'solver.js');

/**
 * The web worker that calls into the solver to find the best move, and
 * posts the message back to the main thread.
 *
 * @author jkadams
 */

var solver = new Solver(3, 2);

onmessage = function(oEvent) {
  var game = MeldGame.deserialize(oEvent.data);
  var bestMove = solver.findBestMove(game);
  postMessage(bestMove);
};
