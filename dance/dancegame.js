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
provide('Dance.Game');

Dance.Game = function(player, enemies, layout, randomNumbers) {
// skeles that start <= 3 space away from you move on their first turn
// initial move of enemies is the first one that works - blobs don't go up if they can't
  this.player = player;
  this.enemies = enemies;
  this.layout = layout;
  this.randomNumbers = randomNumbers;
  this.randomNumberAt = 0;
  this.board = new Dance.Board(layout);
  this.board.expose(player.position);
  this.zone = 4;
  this.level = 1;
};

Dance.Game.prototype.nextRandomNumber = function() {
  if (this.randomNumberAt >= this.randomNumbers.length) {
    return Math.floor(Math.random() * 4);
  }
  return this.randomNumbers[this.randomNumberAt++];
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
