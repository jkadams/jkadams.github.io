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
provide('Dance.Game');
provide('Dance.Board');
provide('Dance.Delta');
provide('Dance.Tile');
/**
Test case that currently passes with 1 skeleton knight.
MOVED: 3
 MOVED: 1
 MOVED: null
2 MOVED: 0
2 MOVED: 1
2 MOVED: 2
2 MOVED: 1
2 MOVED: 0
3 MOVED: 3
 MOVED: 2
 MOVED: 3
 MOVED: 2
2 MOVED: 3
2 MOVED: 0
4 MOVED: 1
2 MOVED: 2
2 MOVED: 3
2 MOVED: 0
2 MOVED: 1
 MOVED: 0
3 MOVED: 1
 MOVED: 0
3 MOVED: 3
2 MOVED: 2
2 MOVED: 3
2 MOVED: 0
2 MOVED: 1
2 MOVED: 2
2 MOVED: 1
2 MOVED: 2
3 MOVED: 3
2 MOVED: 0
3 MOVED: 3
2 MOVED: 2
 MOVED: 1

   this.player = new Dance.Units.Aria(new Dance.Position(6, 6));
   this.addUnit(new Dance.Units.SkeletonKnight(new Dance.Position(6, 1)));
   this.board = new Dance.Board([
       [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
       [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]]);
*/

/**
Test case passes with 8 skeletons
MOVED: 0
2 MOVED: 3
2 MOVED: 0
2 MOVED: 3
 MOVED: 2
 MOVED: 3
2 MOVED: 2
2 MOVED: 1

  this.player = new Dance.Units.Aria(new Dance.Position(6, 6));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(1, 7)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(2, 5)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(5, 1)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(5, 10)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(7, 2)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(7, 11)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(10, 7)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(11, 5)));
  this.board = new Dance.Board([
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]]);
*/

/**
Test move dependencies

//  this.player = new Dance.Units.Aria(new Dance.Position(4, 10));
//  this.addUnit(new Dance.Units.SkeletonKnight(new Dance.Position(4, 4)));
//  this.addUnit(new Dance.Units.SkeletonKnight(new Dance.Position(4, 5)));
//  this.addUnit(new Dance.Units.SkeletonKnight(new Dance.Position(4, 6)));
//  this.addUnit(new Dance.Units.SkeletonKnight(new Dance.Position(4, 7)));
//  this.addUnit(new Dance.Units.SkeletonKnight(new Dance.Position(4, 8)));
//  this.board = new Dance.Board([
//      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
//      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]]);
*/

Dance.Move = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };

Dance.Move.opposite = function(direction) {
  switch (direction) {
    case Dance.Move.UP:
      return Dance.Move.DOWN;
    case Dance.Move.RIGHT:
      return Dance.Move.LEFT;
    case Dance.Move.DOWN:
      return Dance.Move.UP;
    case Dance.Move.LEFT:
      return Dance.Move.RIGHT;
    default:
      return null;
  }
};

Dance.Game = function() {

// skeles that start <= 3 space away from you move on their first turn

  this.newEnemies = [];
  this.enemies = [];

  this.player = new Dance.Units.Aria(new Dance.Position(6, 6));
  this.addUnit(new Dance.Units.GreenSlime(new Dance.Position(11, 8)));
  this.addUnit(new Dance.Units.BlueSlime(new Dance.Position(3, 2)));
//  this.addUnit(new Dance.Units.BlueSlime(new Dance.Position(4, 2)));
//  this.addUnit(new Dance.Units.BlueSlime(new Dance.Position(5, 2)));
  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(3, 7)));
//  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(3, 8)));
//  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(4, 7)));
//  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(4, 8)));

  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(10, 7)));
  this.addUnit(new Dance.Units.Skeleton(new Dance.Position(11, 5)));
  this.addUnit(new Dance.Units.SkeletonKnight(new Dance.Position(4, 8)));
  this.board = new Dance.Board([
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]]);
};

Dance.Game.prototype.doPlayerMove = function(direction) {
  if (direction == null) {
    return false;
  }
  var newPosition = this.player.position.movedTo(direction);
  // Dig
  var tile = this.board.getTileAt(newPosition);
  if (tile == Dance.Tile.DIRT) {
    this.board.setTileAt(newPosition, Dance.Tile.EMPTY);
    return true;
  }
  // Attack
  var enemy = this.getEnemyAt(newPosition);
  if (enemy != null) {
    this.player.attack(this, enemy, direction);
    return true;
  }
  // Move
  if (this.isPositionFree(newPosition)) {
    this.player.move(this, direction);
    return true;
  }
  // Failed to do anything, but change direction if necessary.
  this.facingDirection = direction;
  return false;
};

Dance.Game.prototype.getEnemies = function() {
  var arr = [];
  for (var i = 0; i < this.enemies.length; i++) {
    if (this.enemies[i]) {
      if (this.enemies[i].health <= 0) {
        throw new Error('dead enemy');
      }
      arr.push(this.enemies[i]);
    }
  }
  return arr;
};

Dance.Game.prototype.addUnit = function(unit) {
  this.enemies.push(unit);
};

Dance.Game.prototype.removeUnit = function(unit) {
  if (this.player == unit) {
    console.log('You died.');
    return;
  }
  for (var i = 0; i < this.enemies.length; i++) {
    if (unit == this.enemies[i]) {
      console.log('Enemy ' + i + ' died :)');
      this.enemies[i] = null;
      return;
    }
  }
  console.log('???');
};

Dance.Game.prototype.doEnemyMove = function(enemy) {
  return enemy.makeNextMove(this, enemy);
};

Dance.Delta = function(rows, columns) {
  this.rows = rows;
  this.columns = columns;
};

Dance.Delta.create = function(from, to) {
  return new Dance.Delta(to.row - from.row, to.column - from.column);
};

Dance.Delta.prototype.size = function() {
  return this.rows * this.rows + this.columns * this.columns;
};

Dance.Game.prototype.getEnemyAt = function(position) {
  var enemies = this.getEnemies();
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].isOnPosition(position)) {
      return enemies[i];
    }
  }
  return null;
};

Dance.Game.prototype.isPositionFree = function(position) {
  var unit = this.unitAtPosition(position);
  if (unit != null) {
    return false;
  }
  return this.board.isTileEmpty(position);
};

Dance.Game.prototype.unitAtPosition = function(position) {
  if (this.player.isOnPosition(position)) {
    return this.player;
  }
  return this.getEnemyAt(position);
};

Dance.Game.prototype.isGameOver = function() {
  return this.player.health <= 0;
};

Dance.Position = function(row, column) {
  this.row = row;
  this.column = column;
};

Dance.Position.prototype.movedTo = function(position) {
  var Move = Dance.Move;
  var r = this.row;
  var c = this.column;
  switch (position) {
    case Move.UP:
      r--;
      break;
    case Move.RIGHT:
      c++;
      break;
    case Move.DOWN:
      r++;
      break;
    case Move.LEFT:
      c--;
      break;
  }
  return new Dance.Position(r, c);
};


Dance.Position.prototype.equals = function(position) {
  return this.row == position.row && this.column == position.column;
};

Dance.Board = function(layout) {
  this.layout = layout;
};

Dance.Tile = { EMPTY: 0, DIRT: 1, SOLID: 2 };

Dance.Board.prototype.getTileAt = function(position) {
  return this.layout[position.row][position.column];
};

Dance.Board.prototype.setTileAt = function(position, newTile) {
  this.layout[position.row][position.column] = newTile;
};

Dance.Board.prototype.isTileEmpty = function(position) {
  return this.getTileAt(position) == Dance.Tile.EMPTY;
};