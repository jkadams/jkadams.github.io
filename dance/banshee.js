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
provide('Dance.Units.Banshee');
provide('Dance.Units.BlueBanshee');
provide('Dance.Units.GreenBanshee');

Dance.Units.Banshee = function(enemyId, position) {
  base(this, enemyId, position);
};
inherits(Dance.Units.Banshee, Dance.Units.BaseEnemy);

Dance.Units.BlueBanshee = function(position) {
  base(this, Dance.Units.BlueBanshee.ID, position);
};
inherits(Dance.Units.BlueBanshee, Dance.Units.Banshee);

Dance.Units.GreenBanshee = function(position) {
  base(this, Dance.Units.GreenBanshee.ID, position);
};
inherits(Dance.Units.GreenBanshee, Dance.Units.Banshee);

Dance.Units.BlueBanshee.ID = 405;
Dance.Units.GreenBanshee.ID = 406;

Dance.Units.Banshee.prototype.onHit = function(game, move, damage) {
  this.maybeKnockback(game, move);
  this.advanceBeat(-1);
  base(this, 'onHit', game, move, damage);
};