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
provide('Dance.Units.GreenSlime');
provide('Dance.Units.BlueSlime');
provide('Dance.Units.OrangeSlime');

Dance.Units.GreenSlime = function(position) {
  base(this, Dance.Units.GreenSlime.ID, position);
};
inherits(Dance.Units.GreenSlime, Dance.Units.BaseEnemy);

Dance.Units.BlueSlime = function(position) {
  base(this, Dance.Units.BlueSlime.ID, position);
};
inherits(Dance.Units.BlueSlime, Dance.Units.BaseEnemy);

Dance.Units.OrangeSlime = function(position) {
  base(this, Dance.Units.OrangeSlime.ID, position);
};
inherits(Dance.Units.OrangeSlime, Dance.Units.BaseEnemy);

Dance.Units.IceSlime = function(position) {
  base(this, Dance.Units.IceSlime.ID, position);
};
inherits(Dance.Units.IceSlime, Dance.Units.BaseEnemy);

Dance.Units.FireSlime = function(position) {
  base(this, Dance.Units.FireSlime.ID, position);
};
inherits(Dance.Units.FireSlime, Dance.Units.BaseEnemy);

Dance.Units.GreenSlime.ID = 0;
Dance.Units.BlueSlime.ID = 1;
Dance.Units.OrangeSlime.ID = 2;
Dance.Units.IceSlime.ID = 201;
Dance.Units.FireSlime.ID = 200;

Dance.Units.GreenSlime.prototype.getMovementDirection = function(game) {
  return Dance.Move.STAY;
};

Dance.Units.BlueSlime.prototype.getMovementDirection = function(game) {
  if (this.lastPosition && this.lastPosition.row > this.position.row) {
    return Dance.Move.DOWN;
  } else {
    return Dance.Move.UP;
  }
};

Dance.Units.OrangeSlime.prototype.getMovementDirection = function(game) {
  var Move = Dance.Move;
  if (this.lastPosition) {
    if (this.lastPosition.column > this.position.column) {
      return Move.UP;
    } else if (this.lastPosition.row < this.position.row) {
      return Move.LEFT;
    } else if (this.lastPosition.column < this.position.column) {
      return Move.DOWN;
    } else if (this.lastPosition.row > this.position.row) {
      return Move.RIGHT;
    }
  } else {
    return Move.RIGHT;
  }
};

Dance.Units.FireSlime.prototype.getMovementDirection = function(game) {
  var Move = Dance.Move;
  if (this.lastPosition) {
    if (this.lastPosition.column > this.position.column) {
      return Move.UP;
    } else if (this.lastPosition.row < this.position.row) {
      return Move.LEFT;
    } else if (this.lastPosition.column < this.position.column) {
      return Move.DOWN;
    } else if (this.lastPosition.row > this.position.row) {
      return Move.RIGHT;
    }
  } else {
    return Move.DOWN_RIGHT;
  }
};