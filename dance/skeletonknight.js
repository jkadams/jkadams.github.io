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
provide('Dance.Units.SkeletonKnight');
provide('Dance.Units.WhiteSkeletonKnight');
provide('Dance.Units.YellowSkeletonKnight');
provide('Dance.Units.BlackSkeletonKnight');

Dance.Units.SkeletonKnight = function(enemyId, position) {
  base(this, enemyId, position);
  switch (enemyId) {
    case Dance.Units.WhiteSkeletonKnight.ID:
      this.replacementId = Dance.Units.WhiteArmoredSkeleton.ID;
      break;
    case Dance.Units.YellowSkeletonKnight.ID:
      this.replacementId = Dance.Units.YellowArmoredSkeleton.ID;
      break;
    case Dance.Units.BlackSkeletonKnight.ID:
      this.replacementId = Dance.Units.BlackArmoredSkeleton.ID;
      break;
  }
};
inherits(Dance.Units.SkeletonKnight, Dance.Units.BaseEnemy);

Dance.Units.SkeletonKnight.prototype.onHit = function(game, move, damage) {
  this.maybeKnockback(game, move);
  var newUnit = new Dance.Units.ArmoredSkeleton(this.replacementId, this.position);
  newUnit.currentBeat = 1;
  game.addUnit(newUnit);
  this.health = 0;
//  game.removeUnit(this);
// replaceUnit?
  // what if the unit died? what if not?
};

Dance.Units.WhiteSkeletonKnight = function(position) {
  base(this, Dance.Units.WhiteSkeletonKnight.ID, position);
};
inherits(Dance.Units.WhiteSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.YellowSkeletonKnight = function(position) {
  base(this, Dance.Units.YellowSkeletonKnight.ID, position);
};
inherits(Dance.Units.YellowSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.BlackSkeletonKnight = function(position) {
  base(this, Dance.Units.BlackSkeletonKnight.ID, position);
};
inherits(Dance.Units.BlackSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.WhiteSkeletonKnight.ID = 202;
Dance.Units.YellowSkeletonKnight.ID = 203;
Dance.Units.BlackSkeletonKnight.ID = 204;