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
provide('Dance.Units.Player');

Dance.Units.Player = function(position) {
  base(this, position);
  this.character = 2; // Aria

  this.initialHealth = 8;
  this.strength = 1;
  this.facingDirection = Dance.Direction.RIGHT;
  this.facingHorizontal = Dance.Direction.RIGHT;
  this.lastPosition = null;
  this.momentum = null;
  this.health = this.initialHealth;
  this.status = 0;
  this.weapon = null; // Dagger
  this.shovel = null; // Shovel
};
inherits(Dance.Units.Player, Dance.Units.BaseUnit);

Dance.Units.Player.prototype.doMove = function(game, move) {
  if (move == null) {
    return false;
  }
  var newPosition = this.position.applyMove(move);
  // Dig
  var tile = game.board.getTileAt(newPosition);
  if (Dance.Tile.strength(tile) > 0 && Dance.Tile.strength(tile) <= 1) {
    game.board.setTileAt(newPosition, Dance.Tile.EMPTY);
    if (game.zone == 4) {
      // In Zone 4, digging dirt also takes out perpendicular tiles as well.
      var perpMoves;
      if (move.direction == Dance.Direction.UP || move.direction == Dance.Direction.DOWN) {
        perpMoves = [Dance.Move.LEFT, Dance.Move.RIGHT];
      } else {
        perpMoves = [Dance.Move.UP, Dance.Move.DOWN];
      }
      for (var i = 0; i < perpMoves.length; i++) {
        var pos2 = newPosition.applyMove(perpMoves[i]);
        var tileStr2 = Dance.Tile.strength(game.board.getTileAt(pos2));
        if (tileStr2 > 0 && tileStr2 <= 1) {
          game.board.setTileAt(pos2, Dance.Tile.EMPTY);
        }
      }
    }
    return true;
  }
  // Attack
  var enemy = game.getEnemyAt(newPosition);
  if (enemy != null) {
    this.attack(game, enemy, move);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.move(game, move);
    return true;
  }
  // Failed to do anything, but change direction if necessary.
  this.facingDirection = move.direction;
  return false;
};
