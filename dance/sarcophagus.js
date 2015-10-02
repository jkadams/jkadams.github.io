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
provide('Dance.Units.WhiteSarcophagus');
provide('Dance.Units.YellowSarcophagus');
provide('Dance.Units.BlackSarcophagus');

Dance.Units.BaseSarcophagus = function(enemyId, position) {
  base(this, enemyId, position);
  switch (enemyId) {
    case Dance.Units.WhiteSarcophagus.ID:
      this.spawns = [Dance.Units.WhiteSkeletonKnight.ID,
          Dance.Units.WhiteArmoredSkeleton.ID,
          Dance.Units.WhiteSkeleton.ID];
      break;
    case Dance.Units.YellowSarcophagus.ID:
      this.spawns = [Dance.Units.YellowSkeletonKnight.ID,
          Dance.Units.YellowArmoredSkeleton.ID,
          Dance.Units.YellowSkeleton.ID];
      break;
    case Dance.Units.BlackSarcophagus.ID:
      this.spawns = [Dance.Units.BlackSkeletonKnight.ID,
          Dance.Units.BlackArmoredSkeleton.ID,
          Dance.Units.BlackSkeleton.ID];
      break;
  }
};
inherits(Dance.Units.BaseSarcophagus, Dance.Units.BaseEnemy);

Dance.Units.BaseSarcophagus.prototype.getMovementDirection = function(game) {
  if (!this.spawnedEnemy || this.spawnedEnemy.health <= 0) {
    // SkeletonKnight -> ArmoredSkeleton should count as still alive.
    var newPosition = this.position.movedTo(Dance.Direction.LEFT);
    this.spawnedEnemy = new Dance.Units.WhiteSkeletonKnight(newPosition);
    game.addUnit(this.spawnedEnemy);
  }
  return Dance.Move.STAY;
};

Dance.Units.WhiteSarcophagus = function(position) {
  base(this, Dance.Units.WhiteSarcophagus.ID, position);
};
inherits(Dance.Units.WhiteSarcophagus, Dance.Units.BaseSarcophagus);

Dance.Units.YellowSarcophagus = function(position) {
  base(this, Dance.Units.YellowSarcophagus.ID, position);
};
inherits(Dance.Units.YellowSarcophagus, Dance.Units.BaseSarcophagus);

Dance.Units.BlackSarcophagus = function(position) {
  base(this, Dance.Units.BlackSarcophagus.ID, position);
};
inherits(Dance.Units.BlackSarcophagus, Dance.Units.BaseSarcophagus);

Dance.Units.WhiteSarcophagus.ID = 315;
Dance.Units.YellowSarcophagus.ID = 316;
Dance.Units.BlackSarcophagus.ID = 317;