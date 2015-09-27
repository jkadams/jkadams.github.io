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
provide('Dance.Position');

Dance.Position = function(row, column) {
  this.row = row;
  this.column = column;
};

Dance.Position.prototype.applyMove = function(move) {
  return new Dance.Position(this.row + move.rowDelta, this.column + move.colDelta);
};

Dance.Position.prototype.movedTo = function(position) {
  var Direction = Dance.Direction;
  var r = this.row;
  var c = this.column;
  switch (position) {
    case Direction.UP:
      r--;
      break;
    case Direction.RIGHT:
      c++;
      break;
    case Direction.DOWN:
      r++;
      break;
    case Direction.LEFT:
      c--;
      break;
  }
  return new Dance.Position(r, c);
};


Dance.Position.prototype.equals = function(position) {
  return this.row == position.row && this.column == position.column;
};