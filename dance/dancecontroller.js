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
  this.useSprites = true;
  this.nextNewGame = 0;
};

Dance.Controller.prototype.createLevelTorches2 = function() {
  var Units = Dance.Units;
  var player = new Units.Player(new Dance.Position(5, 12));
  var enemies = [];
  var layout = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
  var randomNumbers = [];
  return new Dance.Game(player, enemies, layout, randomNumbers);
};

Dance.Controller.prototype.createLevelTorches = function() {
  var Units = Dance.Units;
  var player = new Units.Player(new Dance.Position(5, 12));
  var enemies = [];
  var layout = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,2,2,2,0,2,2,2,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
  var randomNumbers = [];
  return new Dance.Game(player, enemies, layout, randomNumbers);
};


Dance.Controller.prototype.createLevel = function() {
  var Units = Dance.Units;
  var player = new Units.Player(new Dance.Position(13, 13));
  var enemies = [
      new Units.BlueBat(new Dance.Position(18, 8)),
      new Units.WhiteArmoredSkeleton(new Dance.Position(8, 13)),
      new Units.Warlock(new Dance.Position(22, 15)),
      new Units.RedDragon(new Dance.Position(20, 6)),
      new Units.WhiteSkeletonKnight(new Dance.Position(20, 13)),
  ];
  var layout = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,3,3,3,3,3,3,3,2,1,0,0,0,0,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,3,2,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,3,1,1,1,1,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,3,2,1,12,1,0,0,1,2,1,2,1,1,0,0,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,3,1,1,0,0,0,0,0,1,2,1,1,1,0,0,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,3,1,1,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,3,1,1,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,3,1,1,0,0,0,0,0,2,1,1,0,0,0,0,0,0,0,0,0,0],
      [0,0,3,3,3,3,3,0,3,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,11,0,1,1,1,1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,1,0,2,2,0,0,0,11,1,2,1,1,1,1,0,1,1,0,0,0,0,0],
      [0,0,11,0,0,0,1,0,0,2,0,0,0,2,1,2,2,1,2,1,2,1,1,0,0,0,0,0],
      [0,0,1,1,1,2,2,0,0,1,1,1,2,2,1,2,11,1,2,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,11,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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

Dance.Controller.prototype.createLevel41 = function() {
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
      new Units.Harpy(new Dance.Position(4, 14)),
      new Units.Harpy(new Dance.Position(7, 14)),
      new Units.Harpy(new Dance.Position(8, 14)),
      new Units.Warlock(new Dance.Position(2, 18)),
      new Units.Warlock(new Dance.Position(6, 14)),
      new Units.SleepingGoblin(new Dance.Position(3, 3)),
      new Units.SleepingGoblin(new Dance.Position(11, 4)),
      new Units.SleepingGoblin(new Dance.Position(11, 20)),
      new Units.GoblinBomber(new Dance.Position(7, 19)),
      new Units.GreenBanshee(new Dance.Position(4, 20)),
      new Units.Gargoyle3(new Dance.Position(9, 4)),
      new Units.Gargoyle1(new Dance.Position(9, 5)),
      new Units.Gargoyle3(new Dance.Position(13, 4)),
      new Units.Gargoyle3(new Dance.Position(13, 5)),
      new Units.WhiteSkeletonKnight(new Dance.Position(6, 19)),
      new Units.WhiteSarcophagus(new Dance.Position(6, 20)),
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
      [0,0,1,11,1,1,1,1,1,2,1,2,2,1,2,1,2,1,1,2,11,1,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,2,0,1,1,0,11,0,0,1,0,0,0,0,0,11,0,0,0,0,2,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,1,0,0,2,0,0,0,0,0,1,0,0,0,0,2,0,0,0,0,0,0,0],
      [0,0,11,0,2,1,0,2,0,2,1,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,1,1,2,2,1,1,0,0,1,0,0,0,0,0,1,0,0,0,0,13,3,3,3,3,3,13,0],
      [0,0,1,0,0,0,0,11,0,0,1,0,0,0,0,0,1,1,1,1,1,3,0,0,0,0,0,3,0],
      [0,0,11,0,0,0,0,1,1,2,2,11,1,1,1,11,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,2,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,3,0],
      [0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,2,0,0,0,0,2,0,0,0,1,0,0,0,2,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,2,0,0,0,0,1,11,1,1,1,1,11,2,2,1,0,0,0,0,3,0,0,0,0,0,3,0],
      [0,0,11,0,0,0,0,1,0,0,0,0,0,0,0,2,2,1,11,2,1,3,0,0,0,0,0,13,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,3,3,3,3,3,3,3,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,11,0,0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,11,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,11,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,1,1,2,1,11,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
      [0,2,11,1,2,1,1,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
  switch (this.nextNewGame) {
    case 0:
    default:
      this.game = this.createLevel();
      break;
    case 1:
      this.game = this.createLevel41();
      break;
    case 2:
      this.game = this.createLevelTorches();
      break;
    case 3:
      this.game = this.createLevelTorches2();
      break;
  }
  this.nextNewGame = (this.nextNewGame + 1) % 4;
  this.game.eventTarget = document;
  this.view = new Dance.View(this.game);
  this.view.enterDocument();
  this.view.board.focus();
  this.keyListener = this.handleKeyDown.bind(this);
  this.view.board.addEventListener('keydown', this.keyListener);
  this.view.update();
  this.replay([0,1,1,1,1,1,3,1,1,3,1,1,1,1,0,1,3,3,0,0,3,1,1,1,2,0,1,0,0,0,3,3,0,0,0,3,0,0,3,3,0,3,2,3,1,0,1,3,3,1,3,3,0,1,0,0,0,1,2,1,1,1,3,1,1,3,1,1,1,3,1,0,0,0,0,2,2,0,0,1,3,3,0,3,3,3,2,2,3,3,3,3,3,3,3,0,0,3,3,2,0,1,0,2,2,2,2,3,2,2,3,2,2,2,2,2,2,1,0,1,2,0,2,2,2,2,2,2,2,2,1,1,1,1,2,2,1,0,1,1,1,1,1,1,1,0,3,1,1,3,1,1,0,2,2,1,1,0,1,0,3,3,3,0,1,1,1,1,2,1,1,8,2,2,1,0,0,0,1,3,0,0,2,0,0,2,0,0,0,0,3,2,1,0,2,0,3,3,0,1,0,2,2,2,0,0,2,0,2,0,3,0,3,0,2,0,0,3,2,2,0,0,0,0,0,0,0,0,2,0,0,0,2,3,0,0,2,0,2,2,1,2,2,1,1,2,1,1,3,3,3,0,3,3,2,2,3,0,0,0,0,0,0,0,1,0,3,3,3,0,0,3,3,0,1,1,1,2,2,1]);
};

Dance.Controller.prototype.replay = function(moves) {
//  this.timer = window.setInterval(this.replayTick.bind(this), 500);
  this.replayMoves = moves;
  this.replayMoveAt = 0;
}

Dance.Controller.prototype.replayTick = function() {
//  if (this.replayMoveAt >= this.replayMoves.length) {
//    if (this.timer != null) {
//      window.clearInterval(this.timer);
//    }
//    return;
//  }
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
  this.game.board.expose(this.game.player.position);
  this.nextMove = null;

  var exposedEnemies = [];
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if (this.game.board.isTileExposed(enemy.position)) {
      enemy.madeCurrentMove = false;
      enemy.distancesToPlayer.push(
          Dance.Delta.create(enemy.position, this.game.player.position).size());
      exposedEnemies.push(enemy);
    }
  }
  enemies = exposedEnemies;

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

Dance.Controller.prototype.move = function(m) {
  this.nextMove = m;
  console.log('MOVED: ' + this.nextMove);
  this.makeMoves(this.nextMove);
};

Dance.Controller.prototype.handleKeyDown = function(e) {
  if (e.shiftKey || e.ctrlKey) return;
  switch (e.keyCode) {
    case 32: // space
      this.move(null);
      break;
    case 37: // left
      this.move(Dance.Move.LEFT);
      break;
    case 38: // up
      this.move(Dance.Move.UP);
      break;
    case 39: // right
      this.move(Dance.Move.RIGHT);
      break;
    case 40: // down
      this.move(Dance.Move.DOWN);
      break;
    case 82: // r
      this.replayTick();
      break;
    case 83: // s
      this.toggleSprites();
      break;
    case 78:
      this.startNewGame();
      break;
    default:
      return;
  }
  e.preventDefault();
};

Dance.Controller.prototype.toggleSprites = function() {
  this.useSprites = !this.useSprites;
  this.view.exitDocument();
  this.view = this.useSprites ? new Dance.View(this.game) : new Dance.ViewOld(this.game);
  this.view.enterDocument();
  this.view.board.focus();
  this.view.resizeBoard();
  this.view.update();
};
