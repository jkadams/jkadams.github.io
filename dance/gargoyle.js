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
provide('Dance.Units.Gargoyle1');

Dance.Units.BaseGargoyle = function(enemyId, position) {
  base(this, enemyId, position);
  this.isActive = false;
};
inherits(Dance.Units.BaseGargoyle, Dance.Units.BaseEnemy);

Dance.Units.Gargoyle1 = function(position) {
  base(this, Dance.Units.Gargoyle1.ID, position);
};
inherits(Dance.Units.Gargoyle1, Dance.Units.BaseGargoyle);

Dance.Units.Gargoyle2 = function(position) {
  base(this, Dance.Units.Gargoyle2.ID, position);
};
inherits(Dance.Units.Gargoyle2, Dance.Units.BaseGargoyle);

Dance.Units.Gargoyle3 = function(position) {
  base(this, Dance.Units.Gargoyle3.ID, position);
};
inherits(Dance.Units.Gargoyle3, Dance.Units.BaseGargoyle);

Dance.Units.Gargoyle4 = function(position) {
  base(this, Dance.Units.Gargoyle4.ID, position);
};
inherits(Dance.Units.Gargoyle4, Dance.Units.BaseGargoyle);

Dance.Units.Gargoyle5 = function(position) {
  base(this, Dance.Units.Gargoyle5.ID, position);
};
inherits(Dance.Units.Gargoyle5, Dance.Units.BaseGargoyle);

Dance.Units.Gargoyle1.ID = 322;
Dance.Units.Gargoyle2.ID = 323;
Dance.Units.Gargoyle3.ID = 324;
Dance.Units.Gargoyle4.ID = 325;
Dance.Units.Gargoyle5.ID = 326;

Dance.Units.BaseGargoyle.prototype.getMovementDirection = function(game) {
  return Dance.Move.STAY;
};