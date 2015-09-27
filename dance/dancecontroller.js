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

Dance.Controller.prototype.createLevel = function() {
  var Units = Dance.Units;
  var player = new Units.Player(new Dance.Position(18, 4));
  var enemies = [
      new Units.BlueBat(new Dance.Position(15, 9)),
      new Units.BlueBat(new Dance.Position(14, 5)),
      new Units.BlueBat(new Dance.Position(3, 6)),
      new Units.BlueBat(new Dance.Position(9, 20)),
      new Units.Harpy(new Dance.Position(15, 11)),
      new Units.Harpy(new Dance.Position(17, 11)),
      new Units.Harpy(new Dance.Position(17, 19)),
      new Units.Harpy(new Dance.Position(2, 19)),
      new Units.Harpy(new Dance.Position(7, 14)),
      new Units.Harpy(new Dance.Position(8, 14)),
      new Units.WhiteSkeletonKnight(new Dance.Position(6, 19)),
      new Units.ApprenticeBlademaster(new Dance.Position(2, 13)),
      new Units.ApprenticeBlademaster(new Dance.Position(5, 19)),
      new Units.ApprenticeBlademaster(new Dance.Position(12, 19)),
      new Units.ApprenticeBlademaster(new Dance.Position(16, 16)),
      new Units.ApprenticeBlademaster(new Dance.Position(6, 4)),
      new Units.ApprenticeBlademaster(new Dance.Position(9, 3)),
      new Units.ApprenticeBlademaster(new Dance.Position(16, 10)),
      new Units.Lich(new Dance.Position(14, 9)),
      new Units.Lich(new Dance.Position(9, 17))
  ];
  var layout = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,2,1,2,2,1,2,1,2,1,1,2,1,1,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,2,0,1,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,1,0,0,2,0,0,0,0,0,1,0,0,0,6,2,0,0,0,0,0,0,0],
      [0,0,1,0,2,1,0,2,5,2,1,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,1,1,2,2,1,1,0,0,1,0,0,0,0,0,1,0,0,0,0,3,3,3,3,3,3,3,0],
      [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1,1,1,1,1,3,0,0,0,0,0,3,0],
      [0,0,1,0,0,0,0,1,1,2,2,1,1,1,1,1,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,2,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,3,0],
      [0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,2,0,0,0,0,2,0,0,0,1,0,0,0,2,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,2,0,0,0,0,1,1,1,1,1,1,1,2,2,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,2,2,1,1,2,1,3,0,0,0,0,0,3,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,3,3,3,3,3,3,3,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
      [0,2,1,1,2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
  var randomNumbers = [
      3,3,1,0,0,3,2,1,3,0,0,0,1,0,1,0,3,0,3,1,1,3,0,1,1,1,3,2,0,1,
      3,3,0,1,2,2,0,2,3,3,0,2,1,2,2,1,1,1,0,3,2,2,2,3,0,2,1,3,2,1,
      2,2,3,2,1,1,3,2,2,2,2,3,2,0,3,0,3,3,0,2,0,3,2,3,3,3,1,3,0,3,
      2,1,0,3,1,3,0,3,3,2,1,1,2,2,3,0,2,1,2,1,2,0,2,3,1,2,1,2,0,3,
      0,2,2,3,0,0,0,2,1,0,2,2,0,0,2,0,1,1,0,3,2,2,3,3,3,2,3,1,0,0,
      1,0,2,0,0,2,0,2,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,1,1];
  return new Dance.Game(player, enemies, layout, randomNumbers);
};

Dance.Controller.prototype.startNewGame = function() {
  Dance.Units.ids = 0;
  this.endGame();
  if (this.view) {
    this.view.board.removeEventListener('keydown', this.keyListener);
    this.view.exitDocument();
  }
  this.game = this.createLevel();
  this.game.eventTarget = document;
  this.view = new Dance.View(this.game);
  this.view.enterDocument();
  this.view.board.focus();
  this.keyListener = this.handleKeyDown.bind(this);
  this.view.board.addEventListener('keydown', this.keyListener);
  this.view.update();
//  this.replay([0, 1, 2, 3, 0, 1, 2, 3, 0]);
};

Dance.Controller.prototype.replay = function(moves) {
  this.timer = window.setInterval(this.replayTick.bind(this), 500);
  this.replayMoves = moves;
  this.replayMoveAt = 0;
}

Dance.Controller.prototype.replayTick = function() {
  if (this.replayMoveAt >= this.replayMoves.length) {
    if (this.timer != null) {
      window.clearInterval(this.timer);
    }
    return;
  }
  var moveArr = [Dance.Move.UP, Dance.Move.RIGHT, Dance.Move.DOWN, Dance.Move.LEFT];
  this.makeMoves(moveArr[this.replayMoves[this.replayMoveAt]]);
  this.replayMoveAt++;
};

Dance.Controller.prototype.makeMoves = function(userMove) {
  if (this.game.isGameOver()) {
    return;
  }
  var enemies = this.game.getEnemies();
  this.game.player.doMove(this.game, userMove);
  this.nextMove = null;

  for (var i = 0; i < enemies.length; i++) {
    enemies[i].madeCurrentMove = false;
    enemies[i].distancesToPlayer.push(
        Dance.Delta.create(enemies[i].position, this.game.player.position).size());
  }

  // Sort by: enemy type, then historical distances to player (horizontal, then vertical, in case of a tie?), then order enemy created (i.e. nothing)
  enemies.sort(function(a, b) {
    var type = b.typePriority - a.typePriority;
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
    if (ct > 150) debugger; // something has gone horribly wrong
    var remainingEnemies = [];
    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];
      if (enemy == null) debugger;
      if (enemy.health > 0 && !enemy.madeCurrentMove) {
        var madeMove = enemy.makeMove(this.game, enemy);
        enemy.madeCurrentMove = madeMove;
        if (!madeMove) {
          remainingEnemies.push(enemy);
        }
      }
    }
    if (remainingEnemies.length == enemies.length) {
      // Cycle! Should have all units bounce and fail to move, but this works for now.
      break;
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
    case 83: // s
      this.view.toggleSprites();
      return;
    case 78:
      this.startNewGame();
      return;
    default:
      return;
  }
  console.log('MOVED: ' + this.nextMove);
  this.makeMoves(this.nextMove);
  e.preventDefault();
};