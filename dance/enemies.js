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
provide('Dance.Units.BaseUnit');
provide('Dance.Units.Aria');
provide('Dance.Units.Skeleton');
provide('Dance.Units.WhiteSkeleton');
provide('Dance.Units.YellowSkeleton');
provide('Dance.Units.BlackSkeleton');
provide('Dance.Units.SkeletonKnight');
provide('Dance.Units.WhiteSkeletonKnight');
provide('Dance.Units.YellowSkeletonKnight');
provide('Dance.Units.BlackSkeletonKnight');
provide('Dance.Units.GreenSlime');
provide('Dance.Units.BlueSlime');
provide('Dance.Units.OrangeSlime');

Dance.Units.ids = 0;

Dance.Units.BaseUnit = function(enemyId, position) {
  var stats = Dance.Enemies[enemyId].getElementsByTagName('stats')[0];
  this.initialHealth = Number(stats.getAttribute('health'));
  this.strength = Number(stats.getAttribute('damagePerHit'));
  this.beatsPerMove = Number(stats.getAttribute('beatsPerMove'));
  this.currentBeat = 0;
  this.coinsToDrop = Number(stats.getAttribute('coinsToDrop'));
  this.typePriority = stats.getAttribute('priority');
  this.movement = stats.getAttribute('custom');

  this.numStates = 1;
  this.currentState = 0;
  this.distancesToPlayer = [];
  this.id = Dance.Units.ids++;
  this.position = position;
  this.facingDirection = Dance.Move.DOWN;
  this.lastPosition = null;
  this.momentum = null;
  this.health = this.initialHealth;
  this.status = 0;
  this.madeCurrentMove = true;
};

Dance.Units.BaseUnit.prototype.attack = function(game, target, direction) {
  this.facingDirection = direction;
//  console.log(this.id + ' : Attack kills momentum');
  this.momentum = null;
  target.health -= this.strength;
  if (target.health <= 0) {
    target.health = 0;
    target.onDeath(game);
  }
};

Dance.Units.BaseUnit.prototype.onDeath = function(game) {
  game.removeUnit(this);
};

Dance.Units.BaseUnit.prototype.move = function(game, direction) {
  var newPosition = this.position.movedTo(direction);
  this.facingDirection = direction;
  if (!this.position.equals(newPosition)) {
    this.lastPosition = this.position;
  }
  this.position = newPosition;
  this.momentum = direction;
};

Dance.Units.BaseUnit.prototype.isOnPosition = function(position) {
  return this.position.equals(position);
};

Dance.Units.BaseUnit.prototype.advanceBeat = function(incr) {
  this.currentBeat = (this.currentBeat + incr) % this.beatsPerMove;
  return this.currentBeat;
};

Dance.Units.BaseUnit.prototype.makeMove = function(game) {
  console.log(this.id + ":" + this.currentBeat);
  if (this.advanceBeat(1) == 0) {
    return this.makeNextMove(game);
  } else {
    // Waiting
    return true;
  }
};

Dance.Units.Aria = function(position) {
  base(this, 5, position);
  this.weapon = null;
  this.shovel = null;
};
inherits(Dance.Units.Aria, Dance.Units.BaseUnit);

Dance.Units.Skeleton = function(enemyId, position) {
  base(this, enemyId, position);
  this.isWaiting = false;
};
inherits(Dance.Units.Skeleton, Dance.Units.BaseUnit);

Dance.Units.WhiteSkeleton = function(position) {
  base(this, Dance.Units.WhiteSkeleton.ID, position);
};
inherits(Dance.Units.WhiteSkeleton, Dance.Units.Skeleton);

Dance.Units.YellowSkeleton = function(position) {
  base(this, Dance.Units.YellowSkeleton.ID, position);
};
inherits(Dance.Units.YellowSkeleton, Dance.Units.Skeleton);

Dance.Units.BlackSkeleton = function(position) {
  base(this, Dance.Units.BlackSkeleton.ID, position);
};
inherits(Dance.Units.BlackSkeleton, Dance.Units.Skeleton);

Dance.Units.WhiteSkeleton.ID = 3;
Dance.Units.YellowSkeleton.ID = 4;
Dance.Units.BlackSkeleton.ID = 5;

Dance.Units.Skeleton.prototype.makeNextMove = function(game) {
  var player = game.player;
  var direction = this.bestApproach(game);
  var newPosition = this.position.movedTo(direction);
  // Attack
  if (player.isOnPosition(newPosition)) {
    this.isWaiting = true;
    this.attack(game, player);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.isWaiting = true;
    this.move(game, direction);
    return true;
  } else {
    var unitAtPosition = game.unitAtPosition(newPosition);
    if (unitAtPosition && !unitAtPosition.madeCurrentMove) {
      // Want to move to a space where another enemy is, but that enemy has not moved this turn.
      // TODO: what about loops?
      return false;
    }
  }

  // Failed to do anything, but change direction if necessary.
  this.facingDirection = direction;
  console.log(this.id + ' : No action kills momentum');
  this.momentum = null;
  return true;
};

Dance.Units.SkeletonKnight = function(enemyId, replacementId, position) {
  base(this, enemyId, position);
  this.createReplacement = function() {
    return new Dance.Units.Skeleton(replacementId, this.position);
  };
};
inherits(Dance.Units.SkeletonKnight, Dance.Units.BaseUnit);

Dance.Units.WhiteSkeletonKnight = function(position) {
  base(this, Dance.Units.WhiteSkeletonKnight.ID, Dance.Units.WhiteSkeleton.ID, position);
};
inherits(Dance.Units.WhiteSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.YellowSkeletonKnight = function(position) {
  base(this, Dance.Units.YellowSkeletonKnight.ID, Dance.Units.YellowSkeleton.ID, position);
};
inherits(Dance.Units.YellowSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.BlackSkeletonKnight = function(position) {
  base(this, Dance.Units.BlackSkeletonKnight.ID, Dance.Units.BlackSkeleton.ID, position);
};
inherits(Dance.Units.BlackSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.WhiteSkeletonKnight.ID = 202;
Dance.Units.YellowSkeletonKnight.ID = 203;
Dance.Units.BlackSkeletonKnight.ID = 204;

Dance.Units.SkeletonKnight.prototype.makeNextMove = function(game) {
  var direction = this.bestApproach(game);
  var player = game.player;

  var newPosition = this.position.movedTo(direction);
  // Attack
  if (player.isOnPosition(newPosition)) {
    this.attack(game, player);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.move(game, direction);
    return true;
  } else {
    var unitAtPosition = game.unitAtPosition(newPosition);
    if (unitAtPosition && !unitAtPosition.madeCurrentMove) {
      // Want to move to a space where another enemy is, but that enemy has not moved this turn.
      // TODO: what about loops?
      return false;
    }
  }

  // Failed to do anything, but change direction if necessary.
  this.facingDirection = direction;
  console.log(this.id + ' : No action kills momentum');
  this.momentum = null;
  return true;
};

Dance.Units.SkeletonKnight.prototype.onDeath = function(game) {
  base(this, 'onDeath', game);
  // Should actually add a shield skeleton.
  // Also position should be knocked back in the direction of the attack.
  game.addUnit(this.createReplacement());
};

Dance.Units.GreenSlime = function(position) {
  base(this, Dance.Units.GreenSlime.ID, position);
};
inherits(Dance.Units.GreenSlime, Dance.Units.BaseUnit);

Dance.Units.BlueSlime = function(position) {
  base(this, Dance.Units.BlueSlime.ID, position);
};
inherits(Dance.Units.BlueSlime, Dance.Units.BaseUnit);

Dance.Units.OrangeSlime = function(position) {
  base(this, Dance.Units.OrangeSlime.ID, position);
};
inherits(Dance.Units.OrangeSlime, Dance.Units.BaseUnit);

Dance.Units.GreenSlime.ID = 0;
Dance.Units.BlueSlime.ID = 1;
Dance.Units.OrangeSlime.ID = 2;

Dance.Units.GreenSlime.prototype.makeNextMove = function(game) {
  return true;
};

Dance.Units.BlueSlime.prototype.makeNextMove = function(game) {
  var player = game.player;
  var direction;
  if (this.lastPosition && this.lastPosition.row > this.position.row) {
    direction = Dance.Move.DOWN;
  } else {
    direction = Dance.Move.UP;
  }

  var newPosition = this.position.movedTo(direction);
  // Attack
  if (player.isOnPosition(newPosition)) {
    this.attack(game, player);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.move(game, direction);
    return true;
  } else {
    var unitAtPosition = game.unitAtPosition(newPosition);
    if (unitAtPosition && !unitAtPosition.madeCurrentMove) {
      return false;
    }
  }

  // Failed to do anything, but change direction if necessary.
  this.facingDirection = direction;
  return true;
};

Dance.Units.OrangeSlime.prototype.makeNextMove = function(game) {
  var Move = Dance.Move;
  var player = game.player;
  var direction = Move.RIGHT;
  if (this.lastPosition) {
    if (this.lastPosition.column > this.position.column) {
      direction = Move.UP;
    } else if (this.lastPosition.row < this.position.row) {
      direction = Move.LEFT;
    } else if (this.lastPosition.column < this.position.column) {
      direction = Move.DOWN;
    }
  }
  var newPosition = this.position.movedTo(direction);
  // Attack
  if (player.isOnPosition(newPosition)) {
    this.attack(game, player);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.move(game, direction);
    return true;
  } else {
    var unitAtPosition = game.unitAtPosition(newPosition);
    if (unitAtPosition && !unitAtPosition.madeCurrentMove) {
      return false;
    }
  }

  // Failed to do anything, but change direction if necessary.
  this.facingDirection = direction;
  return true;
};

Dance.Units.approachMoves = function(from, to) {
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

Dance.Units.BaseUnit.prototype.bestApproach = function(game) {
  console.log('Approaching for ' + this.id);
  var Move = Dance.Move;
  var player = game.player;
  var moves = Dance.Units.approachMoves(this.position, player.position);
  if (moves.length == 1) {
    console.log('Chose only approaching move: ' + moves[0]);
    return moves[0];
  }
  var validMoves = [];
  for (var i = 0; i < moves.length; i++) {
    var move = moves[i];
    var newPosition = this.position.movedTo(move);
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
    var movesToPrevPosition = Dance.Units.approachMoves(this.position, player.lastPosition);
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
