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
provide('Dance.Units.BaseEnemy');

Dance.Units.BaseEnemy = function(enemyId, position) {
  base(this, position);

  var stats = Dance.Enemies[enemyId].getElementsByTagName('stats')[0];
  this.enemyId = enemyId;
  this.initialHealth = Number(stats.getAttribute('health'));
  this.strength = Number(stats.getAttribute('damagePerHit'));
  this.beatsPerMove = Number(stats.getAttribute('beatsPerMove'));
  this.currentBeat = 0;
  this.coinsToDrop = Number(stats.getAttribute('coinsToDrop'));
  this.typePriority = Number(stats.getAttribute('priority'));
  this.movement = stats.getAttribute('custom');

  this.distancesToPlayer = [];
  this.id = Dance.Units.BaseEnemy.ids++;
  this.facingDirection = Dance.Direction.LEFT;
  this.facingHorizontal = Dance.Direction.LEFT;
  this.lastPosition = null;
  this.momentum = null;
  this.health = this.initialHealth;
  this.status = 0;
  this.madeCurrentMove = true;
};
inherits(Dance.Units.BaseEnemy, Dance.Units.BaseUnit);

Dance.Units.BaseEnemy.ids = 0;

Dance.Units.BaseEnemy.prototype.makeMove = function(game) {
  if (!this.advanceBeat(1)) {
    // Waiting
    return true;
  }
  var move = this.getMovementDirection(game);
  // Should this return a sequence of moves? We need to stop when hitting something if size > 1.

  if (move.rowDelta == 0 && move.colDelta == 0) {
    this.face(move.direction);
    this.momentum = null;
    return true;
  }
  var newPosition = this.position.applyMove(move);
  var player = game.player;
  // Attack
  if (player.isOnPosition(newPosition)) {
    this.attack(game, player, move);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.move(game, move);
    return true;
  } else {
    var unitAtPosition = game.unitAtPosition(newPosition);
    if (unitAtPosition && !unitAtPosition.madeCurrentMove) {
      return false;
    }
  }

  // Move fails
  this.face(move.direction);
  this.momentum = null;
  return true;
};


Dance.Units.BaseEnemy.prototype.getMovementDirection = function(game) {
  // Default behavior is basic seek.
  return this.bestApproach(game);
};


// Returns whether the unit should make a move.
Dance.Units.BaseEnemy.prototype.advanceBeat = function(incr) {
  this.currentBeat += incr;
  if (this.currentBeat >= this.beatsPerMove) {
    this.currentBeat = 0;
    return true;
  }
  return false;
};


Dance.Units.BaseEnemy.prototype.bestApproach = function(game) {
  console.log('Approaching for ' + this.id);
  var Move = Dance.Move;
  var player = game.player;
  var moves = Dance.Units.BaseEnemy.approachMoves(this.position, player.position);
  if (moves.length == 1) {
    console.log('Chose only approaching move: ' + moves[0]);
    return moves[0];
  }
  var validMoves = [];
  for (var i = 0; i < moves.length; i++) {
    var move = moves[i];
    var newPosition = this.position.applyMove(move);
    if (player.isOnPosition(newPosition)) {
      return move;
    }
    if (game.isPositionFree(newPosition)) {
      validMoves.push(move);
    } else {
      var unitAtPosition = game.unitAtPosition(newPosition);
      if (unitAtPosition && !unitAtPosition.madeCurrentMove) {
        // Want to move to a space where another enemy is, but that enemy has not moved this turn.
        validMoves.push(move);
      }
    }
  }
  if (validMoves.length == 1) {
    console.log('Chose only valid move: ' + validMoves[0]);
    return validMoves[0];
  }

  if (player.lastPosition != null) {
    var movesToPrevPosition = Dance.Units.BaseEnemy.approachMoves(this.position, player.lastPosition);
    var preferredMoves = [];
    console.log('Moves to last position: ' + movesToPrevPosition);
    if (movesToPrevPosition.length == 1 && validMoves.indexOf(movesToPrevPosition[0]) != -1) {
      return movesToPrevPosition[0];
    }
  }

  // Prefer momentum.
  if (this.momentum != null && validMoves.indexOf(this.momentum) != -1) {
    console.log('Momentum: ' + this.momentum + '(' + validMoves + ')');
    return this.momentum;
  }

  if (moves.length == 0) {
    debugger;
    throw new Error('!');
  }
  // Prefer to close the longer distance if not the first move.
  if (this.lastPosition != null) {
    console.log('Close the longer distance: ' + moves);
    var delta = Dance.Delta.create(this.position, player.position);
    if (Math.abs(delta.rows) > Math.abs(delta.columns)) {
      if (validMoves.indexOf(Move.UP) != -1) {
        return Move.UP;
      } else if (validMoves.indexOf(Move.DOWN) != -1) {
        return Move.DOWN;
      }
    }
    if (Math.abs(delta.rows) < Math.abs(delta.columns)) {
      if (validMoves.indexOf(Move.LEFT) != -1) {
        return Move.LEFT;
      } else if (validMoves.indexOf(Move.RIGHT) != -1) {
        return Move.RIGHT;
      }
    }
    console.log('L > D > R > U: ' + moves);
    return moves.sort()[moves.length - 1]; // L > D > R > U
  } else {
    console.log('Prefer horizontal for first move: ' + moves);
    return moves[0];
  }
};


Dance.Units.BaseEnemy.approachMoves = function(from, to) {
  var Move = Dance.Move;
  var delta = Dance.Delta.create(from, to);
  var moves = [];
  if (delta.columns < 0) {
    moves.push(Move.LEFT);
  } else if (delta.columns > 0) {
    moves.push(Move.RIGHT);
  }
  if (delta.rows < 0) {
    moves.push(Move.UP);
  } else if (delta.rows > 0) {
    moves.push(Move.DOWN);
  }
  return moves;
};
