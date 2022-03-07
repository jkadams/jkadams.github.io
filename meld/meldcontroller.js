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

function MeldController() {
  this.game = null;
  this.view = null;
}

MeldController.prototype.randomNextValue = function() {
  var highestValue = this.game.highestValue();
  var useBonus = highestValue >= 48 && Math.random() < 1/21;
  if (useBonus) {
    return MeldGame.NEXT_BONUS;
  }
  var left = this.remaining[0] + this.remaining[1] + this.remaining[2];
  var nextCard = Math.floor(Math.random() * left);
  var r;
  if (nextCard < this.remaining[0]) {
    r = 1;
    this.remaining[0]--;
  } else if (nextCard < this.remaining[0] + this.remaining[1]) {
    r = 2;
    this.remaining[1]--;
  } else {
    r = 3;
    this.remaining[2]--;
  }
  if (left == 1) {
    this.remaining = [4, 4, 4];
  }
  this.nextValueList.push(r);
  return r;
};

MeldController.prototype.randomBonusValue = function() {
  var highestValue = this.game.highestValue();
  var range = Math.round(Math.log(highestValue / 24) / Math.LN2);
  var randBonus = 1 + Math.floor(Math.random() * range);
  var r = Math.pow(2, randBonus) * 3;
  this.nextValueList.push(r);
  return r;
};

MeldController.prototype.startNewGame = function() {
  if (this.view) {
    this.view.board.removeEventListener('keydown', this.keyListener);
    this.view.exitDocument();
  }
  var scoreElement = document.getElementById('score');
  scoreElement.textContent = '';
  scoreElement.style.display = 'none';
  // For logging purposes
  this.nextValueList = [];
  // This should be on MeldGame but we don't use it in the solver,
  // so I'm saving space for now.
  this.remaining = [4, 4, 4];
  this.game = new MeldGame();
  this.game.eventTarget = document;
  this.view = new MeldView(this.game);
  this.view.enterDocument();
  this.view.board.focus();
  this.keyListener = (e) => this.handleKeyDown(e);
  this.view.board.addEventListener('keydown', this.keyListener);

  // Is this the new-game algorithm?
  // Or is it "swipe in a random valid direction 9 times"?
  for (var i = 0; i < (MeldGame.ROWS - 1) * (MeldGame.COLUMNS - 1); i++) {
    var r = Math.floor(Math.random() * 4);
    var c = Math.floor(Math.random() * 4);
    var value = this.randomNextValue();
    while (this.game.getPiece(r, c) != 0) {
      r = Math.floor(Math.random() * 4);
      c = Math.floor(Math.random() * 4);
    }
    this.game.addPiece(r, c, value);
  }
  this.game.nextValue = this.randomNextValue();
  this.view.showNextValue(); // handle with an event?
};

MeldController.prototype.handleKeyDown = function(e) {
  this.view.validateState();
  var m;
  switch (e.keyCode) {
    case 37: // left
      m = MeldGame.Move.LEFT;
      break;
    case 38: // up
      m = MeldGame.Move.UP;
      break;
    case 39: // right
      m = MeldGame.Move.RIGHT;
      break;
    case 40: // down
      m = MeldGame.Move.DOWN;
      break;
    case 78:
      this.startNewGame();
      return;
    default:
      return;
  }
  this.move(m);
  e.preventDefault();
};

MeldController.prototype.move = function(m) {
  var moved = this.game.moveWithEvents(m);
  if (moved != 0) {
    var movedArray = MeldGame.movedArray(moved);
    var randomEntry = movedArray[Math.floor(Math.random() * movedArray.length)];
    var bonusValue = null;
    if (this.game.nextValue == MeldGame.NEXT_BONUS) {
      bonusValue = this.randomBonusValue();
    }
    var randomNextValue = this.randomNextValue();
    this.game.respondToUser(m, randomEntry, randomNextValue, bonusValue);
    this.view.showNextValue(); // handle with an event?
  }
  if (this.game.isGameOver()) {
    var score = this.game.finalScore();
    var scoreElement = document.getElementById('score');
    scoreElement.textContent = 'Game over! Your score is ' + score + '.';
    scoreElement.style.display = '';
  }
  return moved.length != 0;
};
