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
provide('Dance.Units.ArmoredSkeleton');
provide('Dance.Units.WhiteArmoredSkeleton');
provide('Dance.Units.YellowArmoredSkeleton');
provide('Dance.Units.BlackArmoredSkeleton');

Dance.Units.ArmoredSkeleton = function(enemyId, position) {
  base(this, enemyId, position);
  switch (enemyId) {
    case Dance.Units.WhiteArmoredSkeleton.ID:
      this.replacementId = Dance.Units.WhiteSkeleton.ID;
      break;
    case Dance.Units.YellowArmoredSkeleton.ID:
      this.replacementId = Dance.Units.YellowSkeleton.ID;
      break;
    case Dance.Units.BlackArmoredSkeleton.ID:
      this.replacementId = Dance.Units.BlackSkeleton.ID;
      break;
  }
  this.directionHitFrom = null;
};
inherits(Dance.Units.ArmoredSkeleton, Dance.Units.BaseEnemy);

Dance.Units.ArmoredSkeleton.prototype.onHit = function(game, move, damage) {
  this.maybeKnockback(game, move);
  // Attacking succeeds as long as the unit wasn't attacked from the front.
  if (move.direction != Dance.Direction.opposite(this.facingDirection)) {
    var newUnit = new Dance.Units.Skeleton(this.replacementId, this.position);
    newUnit.currentBeat = 1;
    newUnit.onHit(game, move, damage);
    if (newUnit.health > 0) {
      game.addUnit(newUnit);
    }
    this.health = 0;
  } else if (damage >= this.initialHealth) {
    // Knock the shield off anyway if the attack caused enough damage.
    var newUnit = new Dance.Units.Skeleton(this.replacementId, this.position);
    newUnit.currentBeat = 1;
    game.addUnit(newUnit);
    this.health = 0;
  } else {
    this.currentBeat = 0;
  }
};

Dance.Units.WhiteArmoredSkeleton = function(position) {
  base(this, Dance.Units.WhiteArmoredSkeleton.ID, position);
};
inherits(Dance.Units.WhiteArmoredSkeleton, Dance.Units.ArmoredSkeleton);

Dance.Units.YellowArmoredSkeleton = function(position) {
  base(this, Dance.Units.YellowArmoredSkeleton.ID, position);
};
inherits(Dance.Units.YellowArmoredSkeleton, Dance.Units.ArmoredSkeleton);

Dance.Units.BlackArmoredSkeleton = function(position) {
  base(this, Dance.Units.BlackArmoredSkeleton.ID, position);
};
inherits(Dance.Units.BlackArmoredSkeleton, Dance.Units.ArmoredSkeleton);

Dance.Units.WhiteArmoredSkeleton.ID = 100;
Dance.Units.YellowArmoredSkeleton.ID = 101;
Dance.Units.BlackArmoredSkeleton.ID = 102;