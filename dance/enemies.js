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
provide('Dance.Units.GreenSlime');
provide('Dance.Units.BlueSlime');
provide('Dance.Units.OrangeSlime');
provide('Dance.Units.BlueBat');
provide('Dance.Units.RedBat');
provide('Dance.Units.GreenBat');
provide('Dance.Units.Skeleton');
provide('Dance.Units.WhiteSkeleton');
provide('Dance.Units.YellowSkeleton');
provide('Dance.Units.BlackSkeleton');
provide('Dance.Units.WhiteArmoredSkeleton');
provide('Dance.Units.YellowArmoredSkeleton');
provide('Dance.Units.BlackArmoredSkeleton');
provide('Dance.Units.SkeletonKnight');
provide('Dance.Units.WhiteSkeletonKnight');
provide('Dance.Units.YellowSkeletonKnight');
provide('Dance.Units.BlackSkeletonKnight');
provide('Dance.Units.GreenBanshee');
provide('Dance.Units.BlueBanshee');

Dance.Units.ids = 0;

Dance.Units.BaseUnit = function(enemyId, position) {
  var stats = Dance.Enemies[enemyId].getElementsByTagName('stats')[0];
  this.enemyId = enemyId;
  this.initialHealth = Number(stats.getAttribute('health'));
  this.strength = 1; // Number(stats.getAttribute('damagePerHit'));
  this.beatsPerMove = Number(stats.getAttribute('beatsPerMove'));
  this.currentBeat = 0;
  this.coinsToDrop = Number(stats.getAttribute('coinsToDrop'));
  this.typePriority = Number(stats.getAttribute('priority'));
  this.movement = stats.getAttribute('custom');

  this.distancesToPlayer = [];
  this.id = Dance.Units.ids++;
  this.position = position;
  this.facingDirection = Dance.Direction.LEFT;
  this.facingHorizontal = Dance.Direction.LEFT;
  this.lastPosition = null;
  this.momentum = null;
  this.health = this.initialHealth;
  this.status = 0;
  this.madeCurrentMove = true;
};

Dance.Units.BaseUnit.prototype.makeMove = function(game) {
  if (!this.advanceBeat(1)) {
    // Waiting
    return true;
  }
  var move = this.getMovementDirection(game);
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

Dance.Units.BaseUnit.prototype.face = function(direction) {
  this.facingDirection = direction;
  if (direction == Dance.Direction.LEFT || direction == Dance.Direction.RIGHT) {
    this.facingHorizontal = direction;
  }
};

Dance.Units.BaseUnit.prototype.getMovementDirection = function(game) {
  // Default behavior is basic seek.
  return this.bestApproach(game);
};

Dance.Units.BaseUnit.prototype.attack = function(game, target, move) {
  this.face(move.direction);
  this.momentum = null;
  target.onHit(game, move, this.strength);
  if (target.health <= 0) {
    target.health = 0;
    target.onDeath(game, move);
  }
};

Dance.Units.BaseUnit.prototype.onHit = function(game, move, damage) {
  this.health -= damage;
};

Dance.Units.BaseUnit.prototype.onDeath = function(game, move) {
  game.removeUnit(this);
};

Dance.Units.BaseUnit.prototype.move = function(game, move) {
  var newPosition = this.position.applyMove(move);
  this.face(move.direction);
  if (!this.position.equals(newPosition)) {
    this.lastPosition = this.position;
  }
  this.position = newPosition;
  this.momentum = move.direction;
};

Dance.Units.BaseUnit.prototype.isOnPosition = function(position) {
  return this.position.equals(position);
};

// Returns whether the unit should make a move.
Dance.Units.BaseUnit.prototype.advanceBeat = function(incr) {
  this.currentBeat += incr;
  if (this.currentBeat >= this.beatsPerMove) {
    this.currentBeat = 0;
    return true;
  }
  return false;
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

Dance.Units.BaseUnit.prototype.maybeKnockback = function(game, move) {
  var knockback = this.position.applyMove(move);
  if (game.isPositionFree(knockback)) {
    this.position = knockback;
  }
};




Dance.Units.Aria = function(position) {
  base(this, 601, position);
  this.weapon = null;
  this.shovel = null;
};
inherits(Dance.Units.Aria, Dance.Units.BaseUnit);




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

Dance.Units.GreenSlime.prototype.getMovementDirection = function(game) {
  return Dance.Move.STAY;
};

Dance.Units.BlueSlime.prototype.getMovementDirection = function(game) {
  if (this.lastPosition && this.lastPosition.row > this.position.row) {
    return Dance.Move.DOWN;
  } else {
    return Dance.Move.UP;
  }
};

Dance.Units.OrangeSlime.prototype.getMovementDirection = function(game) {
  var Move = Dance.Move;
  if (this.lastPosition) {
    if (this.lastPosition.column > this.position.column) {
      return Move.UP;
    } else if (this.lastPosition.row < this.position.row) {
      return Move.LEFT;
    } else if (this.lastPosition.column < this.position.column) {
      return Move.DOWN;
    } else if (this.lastPosition.row > this.position.row) {
      return Move.RIGHT;
    }
  } else {
    return Move.RIGHT;
  }
};



Dance.Units.Bat = function(enemyId, position) {
  base(this, enemyId, position);
};
inherits(Dance.Units.Bat, Dance.Units.BaseUnit);

Dance.Units.Bat.prototype.getMovementDirection = function(game) {
  var Move = Dance.Move;
  var rand = Math.floor(Math.random() * 4);
  var possibleMoves = [Move.RIGHT, Move.LEFT, Move.DOWN, Move.UP, Move.RIGHT, Move.LEFT, Move.DOWN, Move.UP];
  for (var i = 0; i < 4; i++) {
    var tryMove = possibleMoves[rand + i];
    var newPosition = this.position.applyMove(tryMove);
    if (game.isPositionFree(newPosition) || game.player.isOnPosition(newPosition)) {
      return tryMove;
    }
  }
  console.log('stuck');
  return Move.STAY;
};

Dance.Units.BlueBat = function(position) {
  base(this, Dance.Units.BlueBat.ID, position);
};
inherits(Dance.Units.BlueBat, Dance.Units.Bat);

Dance.Units.RedBat = function(position) {
  base(this, Dance.Units.RedBat.ID, position);
};
inherits(Dance.Units.RedBat, Dance.Units.Bat);

Dance.Units.GreenBat = function(position) {
  base(this, Dance.Units.GreenBat.ID, position);
};
inherits(Dance.Units.GreenBat, Dance.Units.Bat);

Dance.Units.BlueBat.ID = 6;
Dance.Units.RedBat.ID = 7;
Dance.Units.GreenBat.ID = 8;



Dance.Units.Skeleton = function(enemyId, position) {
  base(this, enemyId, position);
  this.hasHead = true;
  this.directionHitFrom = null;
};
inherits(Dance.Units.Skeleton, Dance.Units.BaseUnit);

Dance.Units.Skeleton.prototype.getMovementDirection = function(game) {
  if (this.hasHead) {
    return this.bestApproach(game);
  } else {
    return this.directionHitFrom;
  }
};

Dance.Units.Skeleton.prototype.onHit = function(game, move, damage) {
  if (this.hasHead) {
    if (this.health - damage < 2) {
      this.hasHead = false;
      this.beatsPerMove = 1;
      this.currentBeat = 0;
      this.directionHitFrom = move; // should be a direction, not a move
    }
  }
  base(this, 'onHit', game, move, damage);
};

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



Dance.Units.ArmoredSkeleton = function(enemyId, position) {
  base(this, enemyId, position);
  switch (enemyId) {
    case Dance.Units.WhiteArmoredSkeleton.ID:
      this.replacementId = Dance.Units.WhiteSkeleton.ID;
      break;
    case Dance.Units.YellowArmoredSkeleton.ID:
      this.replacementId = Dance.Units.YellowSkeleton.ID;
      break;
    case Dance.Units.BlackArmoredSkeleton.ID:
      this.replacementId = Dance.Units.BlackSkeleton.ID;
      break;
  }
  this.directionHitFrom = null;
};
inherits(Dance.Units.ArmoredSkeleton, Dance.Units.BaseUnit);

Dance.Units.ArmoredSkeleton.prototype.onHit = function(game, move, damage) {
  this.maybeKnockback(game, move);
  // Attacking succeeds as long as the unit wasn't attacked from the front.
  if (move.direction != Dance.Direction.opposite(this.facingDirection)) {
    var newUnit = new Dance.Units.Skeleton(this.replacementId, this.position);
    newUnit.currentBeat = 1;
    newUnit.onHit(game, move, damage);
    if (newUnit.health > 0) {
      game.addUnit(newUnit);
    }
    this.health = 0;
  } else if (damage >= this.initialHealth) {
    // Knock the shield off anyway if the attack caused enough damage.
    var newUnit = new Dance.Units.Skeleton(this.replacementId, this.position);
    newUnit.currentBeat = 1;
    game.addUnit(newUnit);
    this.health = 0;
  } else {
    this.currentBeat = 0;
  }
};

Dance.Units.WhiteArmoredSkeleton = function(position) {
  base(this, Dance.Units.WhiteArmoredSkeleton.ID, position);
};
inherits(Dance.Units.WhiteArmoredSkeleton, Dance.Units.ArmoredSkeleton);

Dance.Units.YellowArmoredSkeleton = function(position) {
  base(this, Dance.Units.YellowArmoredSkeleton.ID, position);
};
inherits(Dance.Units.YellowArmoredSkeleton, Dance.Units.ArmoredSkeleton);

Dance.Units.BlackArmoredSkeleton = function(position) {
  base(this, Dance.Units.BlackArmoredSkeleton.ID, position);
};
inherits(Dance.Units.BlackArmoredSkeleton, Dance.Units.ArmoredSkeleton);

Dance.Units.WhiteArmoredSkeleton.ID = 100;
Dance.Units.YellowArmoredSkeleton.ID = 101;
Dance.Units.BlackArmoredSkeleton.ID = 102;




Dance.Units.SkeletonKnight = function(enemyId, position) {
  base(this, enemyId, position);
  switch (enemyId) {
    case Dance.Units.WhiteSkeletonKnight.ID:
      this.replacementId = Dance.Units.WhiteArmoredSkeleton.ID;
      break;
    case Dance.Units.YellowSkeletonKnight.ID:
      this.replacementId = Dance.Units.YellowArmoredSkeleton.ID;
      break;
    case Dance.Units.BlackSkeletonKnight.ID:
      this.replacementId = Dance.Units.BlackArmoredSkeleton.ID;
      break;
  }
};
inherits(Dance.Units.SkeletonKnight, Dance.Units.BaseUnit);

Dance.Units.WhiteSkeletonKnight = function(position) {
  base(this, Dance.Units.WhiteSkeletonKnight.ID, position);
};
inherits(Dance.Units.WhiteSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.YellowSkeletonKnight = function(position) {
  base(this, Dance.Units.YellowSkeletonKnight.ID, position);
};
inherits(Dance.Units.YellowSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.BlackSkeletonKnight = function(position) {
  base(this, Dance.Units.BlackSkeletonKnight.ID, position);
};
inherits(Dance.Units.BlackSkeletonKnight, Dance.Units.SkeletonKnight);

Dance.Units.WhiteSkeletonKnight.ID = 202;
Dance.Units.YellowSkeletonKnight.ID = 203;
Dance.Units.BlackSkeletonKnight.ID = 204;

Dance.Units.SkeletonKnight.prototype.onHit = function(game, move, damage) {
  this.maybeKnockback(game, move);
  var newUnit = new Dance.Units.ArmoredSkeleton(this.replacementId, this.position);
  newUnit.currentBeat = 1;
  game.addUnit(newUnit);
  this.health = 0;
//  game.removeUnit(this);
// replaceUnit?
  // what if the unit died? what if not?
};



Dance.Units.GreenDragon = function(position) {
  base(this, Dance.Units.GreenDragon.ID, position);
};
inherits(Dance.Units.GreenDragon, Dance.Units.BaseUnit);

Dance.Units.RedDragon = function(position) {
  base(this, Dance.Units.RedDragon.ID, position);
};
inherits(Dance.Units.RedDragon, Dance.Units.BaseUnit);

Dance.Units.BlueDragon = function(position) {
  base(this, Dance.Units.BlueDragon.ID, position);
};
inherits(Dance.Units.BlueDragon, Dance.Units.BaseUnit);

Dance.Units.GreenDragon.ID = 402;
Dance.Units.RedDragon.ID = 403;
Dance.Units.BlueDragon.ID = 404;






Dance.Units.Banshee = function(enemyId, position) {
  base(this, enemyId, position);
};
inherits(Dance.Units.Banshee, Dance.Units.BaseUnit);

Dance.Units.BlueBanshee = function(position) {
  base(this, Dance.Units.BlueBanshee.ID, position);
};
inherits(Dance.Units.BlueBanshee, Dance.Units.Banshee);

Dance.Units.GreenBanshee = function(position) {
  base(this, Dance.Units.GreenBanshee.ID, position);
};
inherits(Dance.Units.GreenBanshee, Dance.Units.Banshee);

Dance.Units.BlueBanshee.ID = 405;
Dance.Units.GreenBanshee.ID = 406;

Dance.Units.Banshee.prototype.onHit = function(game, move, damage) {
  this.maybeKnockback(game, move);
  this.advanceBeat(-1);
  base(this, 'onHit', game, move, damage);
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
