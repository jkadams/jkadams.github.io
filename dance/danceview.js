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
  this.topBar = null;
  this.sprites = null;
  this.floor = null;
  this.textGrid = null;
  this.disposed = false;
  this.useSprites = true;
};

Dance.View.prototype.update = function() {
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
      this.renderTile(layout[r][c], r, c);
    }
  }
  this.renderEnemy(this.game.player);
  var enemies = this.game.getEnemies();
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    this.renderEnemy(enemy);
  }

  this.topBar.innerText = 'Health: ' + this.game.player.health + '/' + this.game.player.initialHealth;
  if (this.useSprites) {
    this.board.appendChild(this.floor);
    this.board.appendChild(this.sprites);
  } else {
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < columns; c++) {
        output += this.textGrid[r][c];
      }
      output += '\n';
    }
    this.board.innerText = output;
  }
  if (this.disposed) {
    console.log('already disposed');
  }
};
Dance.View.prototype.renderTile = function(tile, row, column) {
  if (this.useSprites) {
    var div = document.createElement('div');
    div.style.display='block';
    div.style.position='absolute';
    div.style.left=(Dance.View.TILE_PX * column) + 'px';
    div.style.top=(Dance.View.TILE_PX * row) + 'px';
    div.style.height=Dance.View.TILE_PX + 'px';
    div.style.width=Dance.View.TILE_PX + 'px';
    if (tile == Dance.Tile.EMPTY) {
      if ((row + column) % 2 == 0) {
        div.style.background = 'url(http://jkadams.github.io/dance/level/floor_dirt1.png) -27px -1px';
      } else {
        div.style.background = 'url(http://jkadams.github.io/dance/level/floor_dirt1.png) -1px -1px';
      }
    } else {
      div.style.height='48px';
      div.style.width='24px';
      div.style.left=(Dance.View.TILE_PX * column) + 'px';
      div.style.top=(Dance.View.TILE_PX * row) - 15 + 'px';
//      div.style.zIndex = 10;
      div.style.backgroundImage = 'url(http://jkadams.github.io/dance/level/wall_catacomb_crypt1.png)';
    }
    this.floor.appendChild(div);
  } else {
    if (this.textGrid[row] == null) {
      this.textGrid[row] = [];
    }
    if (tile == Dance.Tile.EMPTY) {
      this.textGrid[row][column] = '  ';
    } else if (tile == Dance.Tile.DIRT) {
      this.textGrid[row][column] = '$$';
    } else if (tile == Dance.Tile.SOLID) {
      this.textGrid[row][column] = '##';
    }
  }
};

Dance.View.prototype.renderEnemy = function(enemy) {
  var enemyId = enemy.enemyId;
  var row = enemy.position.row;
  var column = enemy.position.column;
  if (this.useSprites) {
    var div = document.createElement('div');
    var sprite = Dance.Enemies[enemyId].getElementsByTagName('spritesheet')[0];
    var spriteImage = sprite.childNodes[0].data;
    var frameHeight = Number(sprite.getAttribute('frameH'));
    var frameWidth = Number(sprite.getAttribute('frameW'));
    var xOff = Number(sprite.getAttribute('xOff'));
    var yOff = Number(sprite.getAttribute('yOff'));
    var zOff = Number(sprite.getAttribute('zOff')) + 100;
    div.style.height=frameHeight + 'px';
    div.style.width=frameWidth + 'px';
    var frames = Dance.Enemies[enemyId].getElementsByTagName('frame');
    var tellFrames = [];
    for (var i = 0; i < frames.length; i++) {
      var animType = frames[i].getAttribute('animType');
      if (animType == 'tell') {
        tellFrames.push(frames[i]);
      }
    }
    var frameX = 0;
    var frameY = 0;

    var flipHorizontal = false;
    if (enemy.currentBeat == enemy.beatsPerMove - 1 && tellFrames.length > 0) {
      frameX = Number(tellFrames[0].getAttribute('inSheet'));
    }
    if (enemyId >= 100 && enemyId <= 102) {
      if (enemy.facingDirection == Dance.Direction.LEFT) {
        frameX = 2;
      } else if (enemy.facingDirection == Dance.Direction.UP) {
        frameX = 0;
      } else if (enemy.facingDirection == Dance.Direction.RIGHT) {
        frameX = 2;
        flipHorizontal = true;
      } else if (enemy.facingDirection == Dance.Direction.DOWN) {
        frameX = 5;
      }
    } else {
      flipHorizontal = enemy.facingHorizontal == Dance.Direction.RIGHT;
    }
    if (enemyId >= 4 && enemyId <= 5) {
      if (!enemy.hasHead) {
        frameX = 8;
      }
    }

    if (flipHorizontal) {
      div.style.transform = 'scaleX(-1)';
    }
    div.style.background = 'url(http://jkadams.github.io/dance/' + spriteImage + ') ' +
        -frameX * frameWidth + 'px ' +
        -frameY * frameHeight + 'px';
    div.style.display='block';
    div.style.position='absolute';
    div.style.left=(Dance.View.TILE_PX * column + xOff) + 'px';
    div.style.top=(Dance.View.TILE_PX * row + yOff) - 12 + 'px';
    this.sprites.appendChild(div);
  } else {
    var symbol;
    if (enemyId == Dance.Units.WhiteSkeleton.ID) {
      symbol = 's' + enemy.id;
    } else if (enemyId == Dance.Units.YellowSkeleton.ID) {
      symbol = 'y' + enemy.id;
    } else if (enemyId == Dance.Units.BlackSkeleton.ID) {
      symbol = 'b' + enemy.id;
    } else if (enemyId == Dance.Units.WhiteSkeletonKnight.ID) {
      symbol = 'S' + enemy.id;
    } else if (enemyId == Dance.Units.YellowSkeletonKnight.ID) {
      symbol = 'Y' + enemy.id;
    } else if (enemyId == Dance.Units.GreenSlime.ID) {
      symbol = 'G' + enemy.id;
    } else if (enemyId == Dance.Units.BlueSlime.ID) {
      symbol = 'B' + enemy.id;
    } else if (enemyId == Dance.Units.OrangeSlime.ID) {
      symbol = 'O' + enemy.id;
    } else {
      symbol = '?' + enemy.id;
    }
    if (this.textGrid[row] == null) {
      this.textGrid[row] = [];
    }
    this.textGrid[row][column] = symbol;
  }
};

Dance.View.TILE_PX = 24;

Dance.View.prototype.toggleSprites = function() {
  this.useSprites = !this.useSprites;
  this.resizeBoard();
  this.update();
};

Dance.View.prototype.resizeBoard = function() {
  if (this.useSprites) {
    this.board.style.background = 'white';
    this.board.style.border = 'none';
    this.board.style.width = Dance.View.TILE_PX * this.game.board.layout[0].length + 'px';
    this.board.style.height = Dance.View.TILE_PX * this.game.board.layout.length + 'px';
  } else {
    this.board.style.background = 'black';
    this.board.style.border = '2px solid #37229F';
    this.board.style.width = 24 * this.game.board.layout[0].length + 'px';
    this.board.style.height = 20 * this.game.board.layout.length + 'px';
  }
};

Dance.View.prototype.enterDocument = function() {
  this.topBar = document.getElementById('topBar');
  this.board = document.getElementById('gameBoard');
  this.sprites = document.getElementById('sprites');
  this.floor = document.getElementById('floor');
  if (this.useSprites) {
    this.board.style.background = 'white';
    this.board.style.border = 'none';
    this.board.style.width = Dance.View.TILE_PX * this.game.board.layout[0].length + 'px';
    this.board.style.height = Dance.View.TILE_PX * this.game.board.layout.length + 'px';
  }
};

Dance.View.prototype.exitDocument = function() {
  while (this.board.firstChild) {
    this.board.removeChild(this.board.firstChild);
  }
  this.disposed = true;
};
