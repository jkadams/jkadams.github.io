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
provide('Dance.Board');
provide('Dance.Tile');

Dance.Board = function(layout) {
  this.layout = layout;
};

Dance.Tile = { EMPTY: 0, DIRT: 1, STONE: 2, CATACOMB: 5, SHOP: 3, SOLID: 4, STAIRS: 6 };

Dance.Board.prototype.getTileAt = function(position) {
  return this.layout[position.row][position.column];
};

Dance.Board.prototype.setTileAt = function(position, newTile) {
  this.layout[position.row][position.column] = newTile;
};

Dance.Board.prototype.isTileEmpty = function(position) {
  var tile = this.getTileAt(position);
  return tile == Dance.Tile.EMPTY || tile == Dance.Tile.STAIRS;
};