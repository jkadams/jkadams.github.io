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
 * Controller for the game, responsible for updating the game state and the view,
 * and generating the random values used for the game's response to each move.
 *
 * @author jkadams
 */
provide('Dance.Controller');

Dance.Controller = function() {
  this.game = null;
  this.view = null;
  this.nextMove = null;
};

Dance.Controller.prototype.startNewGame = function() {
  Dance.Units.ids = 0;
  this.endGame();
  if (this.view) {
    this.view.board.removeEventListener('keydown', this.keyListener);
    this.view.exitDocument();
  }
  this.game = new Dance.Game();
  this.game.eventTarget = document;
  this.view = new Dance.View(this.game);
  this.view.enterDocument();
  this.view.board.focus();
//  this.keyListener = this.handleKeyDown.bind(this);
//  this.view.board.addEventListener('keydown', this.keyListener);

//  this.game.init();
  this.keyListener = this.handleKeyDown.bind(this);
  this.view.board.addEventListener('keydown', this.keyListener);
  this.view.update();
//  this.timer = window.setInterval(this.tick.bind(this), 10000);
};

Dance.Controller.prototype.tick = function() {
//  console.log('Tick at ' + new Date().getTime());
  this.makeMoves();
};

Dance.Controller.prototype.makeMoves = function() {
  if (this.game.isGameOver()) {
    return;
  }

  var enemies = this.game.getEnemies();


  this.game.doPlayerMove(this.nextMove);
  this.nextMove = null;

  for (var i = 0; i < enemies.length; i++) {
    enemies[i].madeCurrentMove = false;
    enemies[i].distancesToPlayer.push(
        Dance.Delta.create(enemies[i].position, this.game.player.position).size());
  }

  // Sort by: enemy type, then historical distances to player (horizontal, then vertical, in case of a tie?), then order enemy created (i.e. nothing)
  enemies.sort(function(a, b) {
    var type = a.typePriority - b.typePriority;
    if (type != 0) {
      return type;
    }
    for (var i = a.distancesToPlayer.length - 1, j = b.distancesToPlayer.length - 1;
        i >= 0 && j >= 0;
        i--, j--) {
      var comp = a.distancesToPlayer[i] - b.distancesToPlayer[j];
      if (comp != 0) {
        return comp;
      }
    }
    return 0;
  });

  var str = '';
  for (var i = 0; i < enemies.length; i++) {
    str += enemies[i].id + '(' + enemies[i].distancesToPlayer + '), ';
  }
  console.log(str);

  var ct = 0;
  while (enemies.length > 0 && ct++ < 200) {
    if (ct > 20) debugger; // something has gone horribly wrong
    var remainingEnemies = [];
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i] == null) debugger;
      if (enemies[i].health > 0 && !enemies[i].madeCurrentMove) {
        var madeMove = this.game.doEnemyMove(enemies[i]);
        enemies[i].madeCurrentMove = madeMove;
        if (!madeMove) {
          remainingEnemies.push(enemies[i]);
        }
      }
    }
    enemies = remainingEnemies;
  }

  this.view.update();
  if (this.game.isGameOver()) {
    console.log('You lose :(');
    this.endGame();
  }
};

Dance.Controller.prototype.endGame = function() {
  if (this.timer != null) {
    window.clearInterval(this.timer);
  }
};

Dance.Controller.prototype.handleKeyDown = function(e) {
  switch (e.keyCode) {
    case 32: // space
      this.nextMove = null;
      break;
    case 37: // left
      this.nextMove = Dance.Move.LEFT;
      break;
    case 38: // up
      this.nextMove = Dance.Move.UP;
      break;
    case 39: // right
      this.nextMove = Dance.Move.RIGHT;
      break;
    case 40: // down
      this.nextMove = Dance.Move.DOWN;
      break;
    case 78:
      this.startNewGame();
      return;
    default:
      return;
  }
  console.log('MOVED: ' + this.nextMove);
  this.makeMoves();
  e.preventDefault();
};