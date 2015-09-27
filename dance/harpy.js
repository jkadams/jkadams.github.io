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

/**
 * @author jkadams
 */
provide('Dance.Units.Harpy');

Dance.Units.Harpy = function(position) {
  base(this, Dance.Units.Harpy.ID, position);
};
inherits(Dance.Units.Harpy, Dance.Units.BaseEnemy);

Dance.Units.Harpy.ID = 308;

Dance.Units.Harpy.prototype.getMovementDirection = function(game) {
  var Move = Dance.Move;
  var player = game.player;
  var posAt = this.position;
  var totalMove = Dance.Move.STAY;
  for (var i = 0; i < 3; i++) {
    var moves = Dance.Units.BaseEnemy.approachMoves(posAt, player.position);
    if (moves.length == 0) {
      return totalMove;
    }
    var nextTotalMove = new Dance.Move(totalMove.rowDelta + moves[0].rowDelta,
        totalMove.colDelta + moves[0].colDelta,
        moves[0].direction);
    var nextPos = posAt.applyMove(moves[0]);
    if (player.isOnPosition(nextPos)) {
      return i == 0 ? nextTotalMove : totalMove;
    }
    posAt = nextPos;
    totalMove = nextTotalMove;
  }
  return totalMove;
};