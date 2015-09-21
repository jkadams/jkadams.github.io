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
 * The class responsible for updating the html view of the game state.
 *
 * @author jkadams
 */
provide('Dance.View');

Dance.View = function(game) {
  this.game = game;
  this.board = null;
  this.disposed = false;
};

Dance.View.prototype.update = function() {
  var output = '';
  var layout = this.game.board.layout;
  var rows = layout.length;
  var columns = layout[0].length;
  var chars = [];
  for (var r = 0; r < rows; r++) {
    chars[r] = [];
    for (var c = 0; c < columns; c++) {
      if (layout[r][c] == Dance.Tile.EMPTY) {
        chars[r][c] = '  ';
      } else if (layout[r][c] == Dance.Tile.DIRT) {
        chars[r][c] = '$$';
      } else if (layout[r][c] == Dance.Tile.SOLID) {
        chars[r][c] = '##';
      } else {
        throw new Error('bad tile');
      }
    }
  }
  var p = this.game.player.position;
  chars[p.row][p.column] = this.game.player.health > 0 ? '@' + Math.min(Math.round(this.game.player.health),9) : 'x0';
  var enemies = this.game.getEnemies();
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    var e = enemy.position;
    var symbol;
    if (enemy instanceof Dance.Units.Skeleton) {
      symbol = 's' + enemy.id;
    } else if (enemy instanceof Dance.Units.YellowSkeleton) {
      symbol = 'y' + enemy.id;
    } else if (enemy instanceof Dance.Units.SkeletonKnight) {
      symbol = 'S' + enemy.id;
    } else if (enemy instanceof Dance.Units.YellowSkeletonKnight) {
      symbol = 'Y' + enemy.id;
    } else if (enemy instanceof Dance.Units.GreenSlime) {
      symbol = 'G' + enemy.id;
    } else if (enemy instanceof Dance.Units.BlueSlime) {
      symbol = 'B' + enemy.id;
    } else if (enemy instanceof Dance.Units.OrangeSlime) {
      symbol = 'O' + enemy.id;
    } else {
      symbol = '?' + enemy.id;
    }
    chars[e.row][e.column] = symbol;
  }
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < columns; c++) {
      output += chars[r][c];
    }
    output += '\n';
  }
  if (this.disposed) {
    console.log('already disposed');
  }
  this.board.innerText = output;
};

Dance.View.prototype.enterDocument = function() {
  this.board = document.getElementById('gameBoard');
};

Dance.View.prototype.exitDocument = function() {
  while (this.board.firstChild) {
    this.board.removeChild(this.board.firstChild);
  }
  this.disposed = true;
};
