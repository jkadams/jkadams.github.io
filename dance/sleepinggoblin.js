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
provide('Dance.Units.SleepingGoblin');

Dance.Units.SleepingGoblin = function(position) {
  base(this, Dance.Units.SleepingGoblin.ID, position);
  this.knockedOutTurns = 0;
};
inherits(Dance.Units.SleepingGoblin, Dance.Units.BaseEnemy);

Dance.Units.SleepingGoblin.ID = 301;


// sleep until distance < 8. then wait 3 turns, then start running away
// after hitting a wall, wait 6, then move
// only when hitting something does it get knocked out
Dance.Units.SleepingGoblin.prototype.getMovementDirection = function(game) {
  if (this.knockedOutTurns > 0) {
    this.knockedOutTurns--;
    return Dance.Move.STAY;
  }
  var bestMove = this.bestApproach(game);
  return bestMove.opposite();
};

Dance.Units.SleepingGoblin.prototype.onMoveFail = function(game) {
  this.knockedOutTurns = 4;
};
