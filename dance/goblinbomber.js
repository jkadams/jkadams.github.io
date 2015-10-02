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
provide('Dance.Units.GoblinBomber');

Dance.Units.GoblinBomber = function(position) {
  base(this, Dance.Units.GoblinBomber.ID, position);
  this.knockedOutTurns = 0;
};
inherits(Dance.Units.GoblinBomber, Dance.Units.BaseEnemy);

Dance.Units.GoblinBomber.ID = 300;

Dance.Units.GoblinBomber.prototype.getMovementDirection = function(game) {
  var bestMoves = Dance.Units.BaseEnemy.approachMoves(this.position, game.player.lastPosition);
  if (bestMoves.length == 2) {
    return bestMoves[0].combine(bestMoves[1]);
  }
  return bestMoves[0].combine(Dance.Move.DOWN);
};