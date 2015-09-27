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
provide('Dance.Units.BaseUnit');

Dance.Units.BaseUnit = function(position) {
  this.position = position;
};

Dance.Units.BaseUnit.prototype.face = function(direction) {
  this.facingDirection = direction;
  if (direction == Dance.Direction.LEFT || direction == Dance.Direction.RIGHT) {
    this.facingHorizontal = direction;
  }
};


Dance.Units.BaseUnit.prototype.onHit = function(game, move, damage) {
  this.health -= damage;
};


Dance.Units.BaseUnit.prototype.onDeath = function(game, move) {
  game.removeUnit(this);
};


Dance.Units.BaseUnit.prototype.attack = function(game, target, move) {
  this.face(move.direction);
  this.momentum = null;
  target.onHit(game, move, this.strength);
  if (target.health <= 0) {
    target.health = 0;
    target.onDeath(game, move);
  }
};


Dance.Units.BaseUnit.prototype.move = function(game, move) {
  var newPosition = this.position.applyMove(move);
  this.face(move.direction);
  if (!this.position.equals(newPosition)) {
    this.lastPosition = this.position;
  }
  this.position = newPosition;
  this.momentum = move.direction;
};


Dance.Units.BaseUnit.prototype.isOnPosition = function(position) {
  return this.position.equals(position);
};


Dance.Units.BaseUnit.prototype.maybeKnockback = function(game, move) {
  var knockback = this.position.applyMove(move);
  if (game.isPositionFree(knockback)) {
    this.position = knockback;
  }
};