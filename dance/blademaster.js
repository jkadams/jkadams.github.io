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
provide('Dance.Units.ApprenticeBlademaster');
provide('Dance.Units.Blademaster');

Dance.Units.BaseBlademaster = function(enemyId, position) {
  base(this, enemyId, position);
  this.state = Dance.Units.BaseBlademaster.State.READY;
  this.directionHitFrom = null;
};
inherits(Dance.Units.BaseBlademaster, Dance.Units.BaseEnemy);

Dance.Units.BaseBlademaster.State = { READY : 0, PARRIED : 1, LUNGING : 2, LUNGED : 3 };

Dance.Units.ApprenticeBlademaster = function(position) {
  base(this, Dance.Units.ApprenticeBlademaster.ID, position);
};
inherits(Dance.Units.ApprenticeBlademaster, Dance.Units.BaseBlademaster);

Dance.Units.Blademaster = function(position) {
  base(this, Dance.Units.Blademaster.ID, position);
};
inherits(Dance.Units.Blademaster, Dance.Units.BaseBlademaster);

Dance.Units.ApprenticeBlademaster.ID = 304;
Dance.Units.Blademaster.ID = 305;

Dance.Units.BaseBlademaster.prototype.getMovementDirection = function(game) {
  var State = Dance.Units.BaseBlademaster.State;
  console.log('State: ' + this.state);
  if (this.state == State.READY) {
    return this.bestApproach(game);
  } else if (this.state == State.PARRIED) {
    this.state = State.LUNGING;
    this.currentBeat = 1;
    return Dance.Move.STAY;
  } else if (this.state == State.LUNGING) {
    // move 2 spaces opposite the direction of the hit
    this.state = State.LUNGED;
    var lunge = Dance.Move.forDirection(Dance.Direction.opposite(this.directionHitFrom));
    var newPosition = this.position.applyMove(lunge);
    if (game.player.isOnPosition(newPosition)) {
      return lunge;
    }
    // check madeCurrentMove?
    // if obstacle, don't move
    var fullLunge = lunge.combine(lunge);
    return fullLunge;
  } else if (this.state == State.LUNGED) {
    this.state = State.READY;
    return this.bestApproach(game);
  }
};

Dance.Units.BaseBlademaster.prototype.onHit = function(game, move, damage) {
  var State = Dance.Units.BaseBlademaster.State;
  if (this.state != State.LUNGED) {
    this.maybeKnockback(game, move);
    this.directionHitFrom = move.direction;
    this.currentBeat = 1;
    // if player was not right next to this unit, go to READY instead
    this.state = State.PARRIED;
  } else {
    base(this, 'onHit', game, move, damage);
  }
};