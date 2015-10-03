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
 * The class responsible for updating an ASCII view of the game state.
 *
 * @author jkadams
 */
provide('Dance.ViewOld');

Dance.ViewOld = function(game) {
  this.game = game;
  this.board = null;
  this.topBar = null;
  this.sprites = null;
  this.floor = null;
  this.textGrid = null;
  this.disposed = false;
};

Dance.ViewOld.prototype.update = function() {
  if (this.disposed) {
    console.log('already disposed');
  }
  while (this.board.firstChild) {
    this.board.removeChild(this.board.firstChild);
  }
  this.floor = document.createElement('div');
  this.sprites = document.createElement('div');
  this.textGrid = [];

  var output = '';
  var layout = this.game.board.layout;
  var rows = layout.length;
  var columns = layout[0].length;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < columns; c++) {
      this.renderTile(layout[r][c], r, c, this.game.board.exposed[r][c], this.game.board.currentlyVisible[r][c]);
    }
  }
  this.renderPlayer(this.game.player);
  var enemies = this.game.getEnemies();
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    this.renderEnemy(enemy);
  }

  this.topBar.innerText = 'Health: ' + this.game.player.health + '/' + this.game.player.initialHealth;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < columns; c++) {
      output += this.textGrid[r][c];
    }
    output += '\n';
  }
  this.board.innerText = output;
  if (this.disposed) {
    console.log('already disposed');
  }
};
Dance.ViewOld.prototype.renderTile = function(tile, row, column, exposed, currentlyVisible) {
  if (this.textGrid[row] == null) {
    this.textGrid[row] = [];
  }
  var Tile = Dance.Tile;
  var str = '??';
  switch (tile) {
    case Tile.EMPTY:
      str = '  ';
      break;
    case Tile.STAIRS:
      str = '>>';
      break;
    case Tile.DIRT:
      str = 'DD';
      break;
    case Tile.DIRT_WITH_TORCH:
      str = 'D*';
      break;
    case Tile.STONE:
      str = 'RR';
      break;
    case Tile.CATACOMB:
      str = 'CC';
      break;
    case Tile.SHOP:
      str = 'SS';
      break;
    case Tile.SHOP_WITH_TORCH:
      str = 'S*';
      break;
    case Tile.SOLID:
      str = 'XX';
      break;
  }
  this.textGrid[row][column] = str;
};



Dance.ViewOld.prototype.renderPlayer = function(player) {
  var row = player.position.row;
  var column = player.position.column;
  this.textGrid[row][column] = '@@';
};

Dance.ViewOld.prototype.renderEnemy = function(enemy) {
  var enemyId = enemy.enemyId;
  var row = enemy.position.row;
  var column = enemy.position.column;
  var symbol;
  if (enemyId == Dance.Units.WhiteSkeleton.ID) {
    symbol = 'ws';
  } else if (enemyId == Dance.Units.YellowSkeleton.ID) {
    symbol = 'ys';
  } else if (enemyId == Dance.Units.BlackSkeleton.ID) {
    symbol = 'bs';
  } else if (enemyId == Dance.Units.WhiteSkeletonKnight.ID) {
    symbol = 'SK';
  } else if (enemyId == Dance.Units.YellowSkeletonKnight.ID) {
    symbol = 'YK';
  } else if (enemyId == Dance.Units.GreenSlime.ID) {
    symbol = 'GS';
  } else if (enemyId == Dance.Units.BlueSlime.ID) {
    symbol = 'BS';
  } else if (enemyId == Dance.Units.OrangeSlime.ID) {
    symbol = 'OS';
  } else if (enemyId == Dance.Units.ApprenticeBlademaster.ID) {
    symbol = 'bm';
  } else if (enemyId == Dance.Units.Blademaster.ID) {
    symbol = 'BM';
  } else {
    symbol = '??';
  }
  if (this.textGrid[row] == null) {
    this.textGrid[row] = [];
  }
  this.textGrid[row][column] = symbol;
};

Dance.ViewOld.TILE_PX = 24;

Dance.ViewOld.prototype.resizeBoard = function() {
  this.board.style.background = 'black';
  this.board.style.border = '2px solid #37229F';
  this.board.style.width = 24 * this.game.board.layout[0].length + 'px';
  this.board.style.height = 20 * this.game.board.layout.length + 'px';
};

Dance.ViewOld.prototype.enterDocument = function() {
  this.topBar = document.getElementById('topBar');
  this.board = document.getElementById('gameBoard');
  this.sprites = document.getElementById('sprites');
  this.floor = document.getElementById('floor');
};

Dance.ViewOld.prototype.exitDocument = function() {
  while (this.board.firstChild) {
    this.board.removeChild(this.board.firstChild);
  }
  this.disposed = true;
};
