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
provide('Dance.Move');

Dance.Move = function(rowDelta, colDelta, direction) {
  this.rowDelta = rowDelta;
  this.colDelta = colDelta;
  this.direction = direction;
};

Dance.Move.UP = new Dance.Move(-1, 0, Dance.Direction.UP);
Dance.Move.RIGHT = new Dance.Move(0, 1, Dance.Direction.RIGHT);
Dance.Move.DOWN = new Dance.Move(1, 0, Dance.Direction.DOWN);
Dance.Move.LEFT = new Dance.Move(0, -1, Dance.Direction.LEFT);
Dance.Move.STAY = new Dance.Move(0, 0, Dance.Direction.DOWN);

Dance.Move.prototype.opposite = function() {
  return new Dance.Move(-this.rowDelta, -this.colDelta,
      Dance.Direction.opposite(this.direction));
};

Dance.Move.forDirection = function(direction) {
  switch (direction) {
    case Dance.Direction.UP:
      return Dance.Move.UP;
    case Dance.Direction.RIGHT:
      return Dance.Move.RIGHT;
    case Dance.Direction.DOWN:
      return Dance.Move.DOWN;
    case Dance.Direction.LEFT:
      return Dance.Move.LEFT;
    default:
      throw new Error('Invalid direction ' + direction);
  }
};

Dance.Move.prototype.combine = function(newMove) {
  return new Dance.Move(this.rowDelta + newMove.rowDelta,
      this.colDelta + newMove.colDelta,
      newMove.direction);
};