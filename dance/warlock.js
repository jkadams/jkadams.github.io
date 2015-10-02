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
provide('Dance.Units.Warlock');
provide('Dance.Units.NeonWarlock');

Dance.Units.BaseWarlock = function(enemyId, position) {
  base(this, enemyId, position);
};
inherits(Dance.Units.BaseWarlock, Dance.Units.BaseEnemy);

Dance.Units.Warlock = function(position) {
  base(this, Dance.Units.Warlock.ID, position);
};
inherits(Dance.Units.Warlock, Dance.Units.BaseWarlock);

Dance.Units.NeonWarlock = function(position) {
  base(this, Dance.Units.NeonWarlock.ID, position);
};
inherits(Dance.Units.NeonWarlock, Dance.Units.BaseWarlock);

Dance.Units.Warlock.ID = 319;
Dance.Units.NeonWarlock.ID = 320;

Dance.Units.BaseWarlock.prototype.onDeath = function(game, move) {
  // Teleport!
  var teleportTo = this.position;
  base(this, 'onDeath', game, move);
  game.player.position = teleportTo;
};