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
provide('Dance.Units.GreenDragon');
provide('Dance.Units.RedDragon');
provide('Dance.Units.BlueDragon');

Dance.Units.GreenDragon = function(position) {
  base(this, Dance.Units.GreenDragon.ID, position);
};
inherits(Dance.Units.GreenDragon, Dance.Units.BaseEnemy);

Dance.Units.RedDragon = function(position) {
  base(this, Dance.Units.RedDragon.ID, position);
};
inherits(Dance.Units.RedDragon, Dance.Units.BaseEnemy);

Dance.Units.BlueDragon = function(position) {
  base(this, Dance.Units.BlueDragon.ID, position);
};
inherits(Dance.Units.BlueDragon, Dance.Units.BaseEnemy);

Dance.Units.GreenDragon.ID = 402;
Dance.Units.RedDragon.ID = 403;
Dance.Units.BlueDragon.ID = 404;
