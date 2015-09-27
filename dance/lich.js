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
provide('Dance.Units.Lich');
provide('Dance.Units.RedLich');
provide('Dance.Units.BlackLich');

Dance.Units.BaseLich = function(enemyId, position) {
  base(this, enemyId, position);
};
inherits(Dance.Units.BaseLich, Dance.Units.BaseEnemy);

Dance.Units.Lich = function(position) {
  base(this, Dance.Units.Lich.ID, position);
};
inherits(Dance.Units.Lich, Dance.Units.BaseLich);

Dance.Units.RedLich = function(position) {
  base(this, Dance.Units.RedLich.ID, position);
};
inherits(Dance.Units.RedLich, Dance.Units.BaseLich);

Dance.Units.BlackLich = function(position) {
  base(this, Dance.Units.BlackLich.ID, position);
};
inherits(Dance.Units.BlackLich, Dance.Units.BaseLich);

Dance.Units.Lich.ID = 309;
Dance.Units.RedLich.ID = 310;
Dance.Units.BlackLich.ID = 311;

Dance.Units.BaseLich.prototype.getMovementDirection = function(game) {
  // If 2 units away, confuse the player.
  return this.bestApproach(game);
};