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
provide('Dance.Units.Skeleton');
provide('Dance.Units.WhiteSkeleton');
provide('Dance.Units.YellowSkeleton');
provide('Dance.Units.BlackSkeleton');

Dance.Units.Skeleton = function(enemyId, position) {
  base(this, enemyId, position);
  this.hasHead = true;
  this.directionHitFrom = null;
};
inherits(Dance.Units.Skeleton, Dance.Units.BaseEnemy);

Dance.Units.Skeleton.prototype.getMovementDirection = function(game) {
  if (this.hasHead) {
    return this.bestApproach(game);
  } else {
    return Dance.Move.forDirection(this.directionHitFrom);
  }
};

Dance.Units.Skeleton.prototype.onHit = function(game, move, damage) {
  if (this.hasHead) {
    if (this.health - damage < 2) {
      this.hasHead = false;
      this.beatsPerMove = 1;
      this.currentBeat = 0;
      this.directionHitFrom = move.direction; // should be a direction, not a move
    }
  }
  base(this, 'onHit', game, move, damage);
};

Dance.Units.WhiteSkeleton = function(position) {
  base(this, Dance.Units.WhiteSkeleton.ID, position);
};
inherits(Dance.Units.WhiteSkeleton, Dance.Units.Skeleton);

Dance.Units.YellowSkeleton = function(position) {
  base(this, Dance.Units.YellowSkeleton.ID, position);
};
inherits(Dance.Units.YellowSkeleton, Dance.Units.Skeleton);

Dance.Units.BlackSkeleton = function(position) {
  base(this, Dance.Units.BlackSkeleton.ID, position);
};
inherits(Dance.Units.BlackSkeleton, Dance.Units.Skeleton);

Dance.Units.WhiteSkeleton.ID = 3;
Dance.Units.YellowSkeleton.ID = 4;
Dance.Units.BlackSkeleton.ID = 5;