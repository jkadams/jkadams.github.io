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
  this.board.appendChild(this.floor);
  this.board.appendChild(this.sprites);
  if (this.disposed) {
    console.log('already disposed');
  }
};
Dance.View.prototype.renderTile = function(tile, row, column, exposed, currentlyVisible) {
  var top = Dance.View.TILE_PX * row;
  var left = Dance.View.TILE_PX * column;
  var height = Dance.View.TILE_PX;
  var width = Dance.View.TILE_PX;
  var background;
  var torch = Dance.Tile.hasTorch(tile);
  if (!exposed) {
    background = 'black';
  } else if (tile == Dance.Tile.EMPTY) {
    if ((row + column) % 2 == 0) {
      background = 'url(https://jkadams.github.io/dance/level/zone4_floor.png) -27px -1px';
    } else {
      background = 'url(https://jkadams.github.io/dance/level/zone4_floor.png) -1px -1px';
    }
  } else if (tile == Dance.Tile.STAIRS) {
    background = 'url(https://jkadams.github.io/dance/level/stairs.png)';
  } else {
    height = 48;
    width = 24;
    top = Dance.View.TILE_PX * row - 15;
    if (tile == Dance.Tile.DIRT || tile == Dance.Tile.DIRT_WITH_TORCH) {
      background = 'url(https://jkadams.github.io/dance/level/zone4_wall_dirt.png)';
    } else if (tile == Dance.Tile.STONE || tile == Dance.Tile.STONE_WITH_TORCH) {
      background = 'url(https://jkadams.github.io/dance/level/zone4_wall_rock_A.png)';
    } else if (tile == Dance.Tile.CATACOMB) {
      background = 'url(https://jkadams.github.io/dance/level/zone4_wall_catacomb_A.png)';
    } else if (tile == Dance.Tile.SHOP || tile == Dance.Tile.SHOP_WITH_TORCH) {
      background = 'url(https://jkadams.github.io/dance/level/wall_shop_crypt.png)';
    } else {
      background = 'url(https://jkadams.github.io/dance/level/end_of_world.png)';
    }
  }

  var div = document.createElement('div');
  div.style.display='block';
  div.style.position='absolute';
  div.style.left=left + 'px';
  div.style.top=top + 'px';
  var imageDiv = document.createElement('div');
  imageDiv.style.height=height + 'px';
  imageDiv.style.width=width + 'px';
  imageDiv.style.background = background;
  imageDiv.style.position = 'absolute';
  div.appendChild(imageDiv);
  if (exposed && torch) {
    var torchDiv = document.createElement('div');
    torchDiv.className = 'torch';
    div.appendChild(torchDiv);
  }
  if (exposed && !currentlyVisible) {
    var overlayDiv = document.createElement('div');
    overlayDiv.style.height=height + 'px';
    overlayDiv.style.width=width + 'px';
    overlayDiv.style.background = 'rgba(50,0,0,0.6)';
    overlayDiv.style.position = 'absolute';
    div.appendChild(overlayDiv);
  }
  this.floor.appendChild(div);
};



Dance.View.prototype.renderPlayer = function(player) {
  var row = player.position.row;
  var column = player.position.column;

  var head = document.createElement('div');
  var frameHeight = 24;
  var frameWidth = 24;
  var spriteImage = 'entities/char' + player.character + '_heads.png';
  head.style.height=frameHeight + 'px';
  head.style.width=frameWidth + 'px';
  var frameX = 0;
  var frameY = 0;
  var xOff = 0;
  var yOff = 0;
  if (player.facingHorizontal == Dance.Direction.LEFT) {
    head.style.transform = 'scaleX(-1)';
  }
  head.style.background = 'url(https://jkadams.github.io/dance/' + spriteImage + ') ' +
      -frameX * frameWidth + 'px ' +
      -frameY * frameHeight + 'px';
  head.className = 'enemySprite';
  
  var armor = document.createElement('div');
  var frameHeight = 24;
  var frameWidth = 24;
  var spriteImage = 'entities/char' + player.character + '_armor_body.png';
  armor.style.height=frameHeight + 'px';
  armor.style.width=frameWidth + 'px';
  var frameX = 0;
  var frameY = 0;
  var xOff = 0;
  var yOff = 0;
  if (player.facingHorizontal == Dance.Direction.LEFT) {
    armor.style.transform = 'scaleX(-1)';
  }
  armor.style.background = 'url(https://jkadams.github.io/dance/' + spriteImage + ') ' +
      -frameX * frameWidth + 'px ' +
      -frameY * frameHeight + 'px';
  armor.className = 'enemySprite';

  var health = document.createElement('div');
  health.className = 'healthHover';
  for (var i = 0; i < player.initialHealth; i++) {
    var heart = document.createElement('img');
    heart.src = i < player.health ?
        'https://jkadams.github.io/dance/gui/TEMP_heart_small.png' :
        'https://jkadams.github.io/dance/gui/TEMP_heart_empty_small.png';
    health.appendChild(heart);
  }
  var heartWidth = 12 * player.initialHealth;
  health.style.left = '4px';
  health.style.top = '4px';
  health.style.width = heartWidth + 'px';
  health.style.zIndex = 100;
  var enemyDiv = document.createElement('div');
  enemyDiv.style.position='absolute';
  enemyDiv.style.left=(Dance.View.TILE_PX * column + xOff) + 'px';
  enemyDiv.style.top=(Dance.View.TILE_PX * row + yOff) - 12 + 'px';
  enemyDiv.appendChild(armor);
  enemyDiv.appendChild(head);
  this.board.appendChild(health);
  this.sprites.appendChild(enemyDiv);
};

Dance.View.prototype.renderEnemy = function(enemy) {
  var enemyId = enemy.enemyId;
  var row = enemy.position.row;
  var column = enemy.position.column;
  var div = document.createElement('div');
  var sprite = Dance.Enemies[enemyId].getElementsByTagName('spritesheet')[0];
  var spriteImage = sprite.childNodes[0].data;
  var frameHeight = Number(sprite.getAttribute('frameH'));
  var frameWidth = Number(sprite.getAttribute('frameW'));
  var xOff = Number(sprite.getAttribute('xOff'));
  var yOff = Number(sprite.getAttribute('yOff'));
  var zOff = Number(sprite.getAttribute('zOff')) || 0;
  div.style.height=frameHeight + 'px';
  div.style.width=frameWidth + 'px';
  div.style.zIndex = zOff;
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
  if (enemyId == 304 || enemyId == 305) {
    if (enemy.state == Dance.Units.BaseBlademaster.State.LUNGING) {
      frameX = 8;
    } else if (enemy.state == Dance.Units.BaseBlademaster.State.LUNGED) {
      frameX = 16;
    }
  }

  if (enemyId >= 4 && enemyId <= 5) {
    if (!enemy.hasHead) {
      frameX = 8;
    }
  }

  if (flipHorizontal) {
    div.style.transform = 'scaleX(-1)';
  }
  div.style.background = 'url(https://jkadams.github.io/dance/' + spriteImage + ') ' +
      -frameX * frameWidth + 'px ' +
      -frameY * frameHeight + 'px';
  div.className = 'enemySprite';

  var enemyDiv = document.createElement('div');
  enemyDiv.style.position='absolute';
  enemyDiv.style.left=(Dance.View.TILE_PX * column + xOff) + 'px';
  enemyDiv.style.top=(Dance.View.TILE_PX * row + yOff) - 12 + 'px';
  enemyDiv.appendChild(div);

  if (enemy.initialHealth != enemy.health) {
    var health = document.createElement('div');
    health.className = 'healthHover';
    for (var i = 0; i < enemy.initialHealth; i++) {
      var heart = document.createElement('img');
      heart.src = i < enemy.health ?
          'https://jkadams.github.io/dance/gui/TEMP_heart_small.png' :
          'https://jkadams.github.io/dance/gui/TEMP_heart_empty_small.png';
      health.appendChild(heart);
    }
    var heartWidth = 12 * enemy.initialHealth;
    health.style.left = Math.floor(-heartWidth+frameWidth) / 2 + 'px';
    health.style.width = heartWidth + 'px';
    enemyDiv.appendChild(health);
  }
  this.sprites.appendChild(enemyDiv);
};

Dance.View.TILE_PX = 24;

Dance.View.prototype.resizeBoard = function() {
  this.board.style.background = 'white';
  this.board.style.border = 'none';
  this.board.style.width = Dance.View.TILE_PX * this.game.board.layout[0].length + 'px';
  this.board.style.height = Dance.View.TILE_PX * this.game.board.layout.length + 'px';
};

Dance.View.prototype.enterDocument = function() {
  this.topBar = document.getElementById('topBar');
  this.board = document.getElementById('gameBoard');
  this.sprites = document.getElementById('sprites');
  this.floor = document.getElementById('floor');
  this.board.style.background = 'white';
  this.board.style.border = 'none';
  this.board.style.width = Dance.View.TILE_PX * this.game.board.layout[0].length + 'px';
  this.board.style.height = Dance.View.TILE_PX * this.game.board.layout.length + 'px';
};

Dance.View.prototype.exitDocument = function() {
  while (this.board.firstChild) {
    this.board.removeChild(this.board.firstChild);
  }
  this.disposed = true;
};
