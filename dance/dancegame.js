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
provide('Dance.Direction');
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
   this.addUnit(new Dance.Units.WhiteSkeletonKnight(new Dance.Position(6, 1)));
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
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(1, 7)));
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(2, 5)));
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(5, 1)));
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(5, 10)));
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(7, 2)));
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(7, 11)));
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(10, 7)));
  this.addUnit(new Dance.Units.WhiteSkeleton(new Dance.Position(11, 5)));
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
//  this.addUnit(new Dance.Units.WhiteSkeletonKnight(new Dance.Position(4, 4)));
//  this.addUnit(new Dance.Units.WhiteSkeletonKnight(new Dance.Position(4, 5)));
//  this.addUnit(new Dance.Units.WhiteSkeletonKnight(new Dance.Position(4, 6)));
//  this.addUnit(new Dance.Units.WhiteSkeletonKnight(new Dance.Position(4, 7)));
//  this.addUnit(new Dance.Units.WhiteSkeletonKnight(new Dance.Position(4, 8)));
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

Dance.Direction = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };

Dance.Direction.opposite = function(direction) {
  switch (direction) {
    case Dance.Direction.UP:
      return Dance.Direction.DOWN;
    case Dance.Direction.RIGHT:
      return Dance.Direction.LEFT;
    case Dance.Direction.DOWN:
      return Dance.Direction.UP;
    case Dance.Direction.LEFT:
      return Dance.Direction.RIGHT;
    default:
      return null;
  }
};

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

Dance.Game = function() {

// skeles that start <= 3 space away from you move on their first turn

  this.newEnemies = [];
  this.enemies = [];

  this.player = new Dance.Units.Aria(new Dance.Position(6, 6));
  this.addUnit(new Dance.Units.BlueBat(new Dance.Position(3, 6)));
  this.addUnit(new Dance.Units.BlueBat(new Dance.Position(19, 18)));
  this.addUnit(new Dance.Units.RedBat(new Dance.Position(19, 9)));


//  this.addUnit(new Dance.Units.WhiteArmoredSkeleton(new Dance.Position(9, 6)));
//  this.addUnit(new Dance.Units.YellowArmoredSkeleton(new Dance.Position(6, 9)));
//  this.addUnit(new Dance.Units.BlackArmoredSkeleton(new Dance.Position(3, 6)));


  this.addUnit(new Dance.Units.GreenSlime(new Dance.Position(11, 18)));
  this.addUnit(new Dance.Units.BlueSlime(new Dance.Position(3, 2)));
//  this.addUnit(new Dance.Units.BlueSlime(new Dance.Position(4, 2)));
//  this.addUnit(new Dance.Units.BlueSlime(new Dance.Position(5, 2)));
  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(3, 17)));
//  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(3, 8)));
//  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(4, 7)));
//  this.addUnit(new Dance.Units.OrangeSlime(new Dance.Position(4, 8)));
  this.addUnit(new Dance.Units.WhiteArmoredSkeleton(new Dance.Position(10, 22)));
  this.addUnit(new Dance.Units.YellowArmoredSkeleton(new Dance.Position(11, 5)));
  this.addUnit(new Dance.Units.BlackArmoredSkeleton(new Dance.Position(20, 11)));
  this.addUnit(new Dance.Units.WhiteSkeletonKnight(new Dance.Position(6, 14)));
  this.addUnit(new Dance.Units.YellowSkeletonKnight(new Dance.Position(20, 10)));
  this.addUnit(new Dance.Units.GreenBanshee(new Dance.Position(23, 18)));
  this.addUnit(new Dance.Units.GreenDragon(new Dance.Position(22, 4)));
  var layout = [];
  for (var i = 0; i <= 24; i++) {
    var arr = [];
    for (var j = 0; j <= 24; j++) {
      arr.push((i==0 || i==12 || i==24 || j==0 || j==24) ? 2 : 0);
    }
    layout.push(arr);
  }
  layout[12][1] = 0;
  layout[12][23] = 0;
  this.board = new Dance.Board(layout);
};

Dance.Game.prototype.doPlayerMove = function(move) {
  if (move == null) {
    return false;
  }
  var newPosition = this.player.position.applyMove(move);
  // Dig
  var tile = this.board.getTileAt(newPosition);
  if (tile == Dance.Tile.DIRT) {
    this.board.setTileAt(newPosition, Dance.Tile.EMPTY);
    return true;
  }
  // Attack
  var enemy = this.getEnemyAt(newPosition);
  if (enemy != null) {
    this.player.attack(this, enemy, move);
    return true;
  }
  // Move
  if (this.isPositionFree(newPosition)) {
    this.player.move(this, move);
    return true;
  }
  // Failed to do anything, but change direction if necessary.
  this.facingDirection = move.direction;
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
  return enemy.makeMove(this, enemy);
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