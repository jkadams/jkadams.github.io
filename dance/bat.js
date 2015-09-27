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
provide('Dance.Units.BlueBat');
provide('Dance.Units.RedBat');
provide('Dance.Units.GreenBat');

Dance.Units.Bat = function(enemyId, position) {
  base(this, enemyId, position);
};
inherits(Dance.Units.Bat, Dance.Units.BaseEnemy);

Dance.Units.Bat.prototype.getMovementDirection = function(game) {
  var Move = Dance.Move;
  var rand = game.nextRandomNumber()
  var possibleMoves = [Move.RIGHT, Move.LEFT, Move.DOWN, Move.UP, Move.RIGHT, Move.LEFT, Move.DOWN, Move.UP];
  for (var i = 0; i < 4; i++) {
    var tryMove = possibleMoves[rand + i];
    var newPosition = this.position.applyMove(tryMove);
    if (game.isPositionFree(newPosition) || game.player.isOnPosition(newPosition)) {
      return tryMove;
    }
  }
  return Move.STAY;
};

Dance.Units.BlueBat = function(position) {
  base(this, Dance.Units.BlueBat.ID, position);
};
inherits(Dance.Units.BlueBat, Dance.Units.Bat);

Dance.Units.RedBat = function(position) {
  base(this, Dance.Units.RedBat.ID, position);
};
inherits(Dance.Units.RedBat, Dance.Units.Bat);

Dance.Units.GreenBat = function(position) {
  base(this, Dance.Units.GreenBat.ID, position);
};
inherits(Dance.Units.GreenBat, Dance.Units.Bat);

Dance.Units.BlueBat.ID = 6;
Dance.Units.RedBat.ID = 7;
Dance.Units.GreenBat.ID = 8;
