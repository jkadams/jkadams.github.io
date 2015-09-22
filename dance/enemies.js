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
provide('Dance.Units.YellowSkeleton');
provide('Dance.Units.SkeletonKnight');
provide('Dance.Units.YellowSkeletonKnight');
provide('Dance.Units.GreenSlime');
provide('Dance.Units.BlueSlime');
provide('Dance.Units.OrangeSlime');

Dance.Units.ids = 0;

//var xhr = new XMLHttpRequest();
//xhr.onload = function() {
//  dump(xhr.responseXML.documentElement.nodeName);
//}
//xhr.onerror = function() {
//  dump("Error while getting XML.");
//}
//xhr.open("GET", "necrodancer.xml");
//xhr.responseType = "document";
//xhr.send();

Dance.Units.BaseUnit = function(position, baseProperties) {
  this.initialHealth = baseProperties.initialHealth || 1;
  this.typePriority = baseProperties.typePriority || 0;
  this.strength = baseProperties.strength || 1;
  this.numStates = baseProperties.numStates || 1;
  this.currentState = baseProperties.initialState || 0;
  this.distancesToPlayer = [];
  this.id = Dance.Units.ids++;
  this.position = position;
  this.facingDirection = Dance.Move.DOWN;
  this.lastPosition = null;
  this.momentum = null;
  this.health = baseProperties.initialHealth;
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

Dance.Units.Aria = function(position) {
  base(this, position, {initialHealth: 5, typePriority: 0});
  this.weapon = null;
  this.shovel = null;
};
inherits(Dance.Units.Aria, Dance.Units.BaseUnit);




Dance.Units.BaseSkeleton = function(position, baseProperties) {
  base(this, position, baseProperties);
  this.isWaiting = false;
};
inherits(Dance.Units.BaseSkeleton, Dance.Units.BaseUnit);

Dance.Units.BaseSkeleton.prototype.makeNextMove = function(game) {
  var player = game.player;
  var direction = this.bestApproach(game);
  if (this.isWaiting) {
    this.isWaiting = false;
    return true;
  }

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

Dance.Units.Skeleton = function(position) {
  base(this, position, {initialHealth: 1, typePriority: 1});
};
inherits(Dance.Units.Skeleton, Dance.Units.BaseSkeleton);

Dance.Units.YellowSkeleton = function(position) {
  base(this, position, {initialHealth: 2, typePriority: 2});
};
inherits(Dance.Units.YellowSkeleton, Dance.Units.BaseSkeleton);




Dance.Units.BaseSkeletonKnight = function(position, baseProperties, replaceWithConstructor) {
  base(this, position, baseProperties);
  this.createReplacement = function() {
    return new replaceWithConstructor(this.position);
  };
};
inherits(Dance.Units.BaseSkeletonKnight, Dance.Units.BaseUnit);

Dance.Units.BaseSkeletonKnight.prototype.makeNextMove = function(game) {
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

Dance.Units.BaseSkeletonKnight.prototype.onDeath = function(game) {
  base(this, 'onDeath', game);
  // Should actually add a shield skeleton.
  // Also position should be knocked back in the direction of the attack.
  game.addUnit(this.createReplacement());
};

Dance.Units.SkeletonKnight = function(position) {
  base(this, position, {initialHealth: 1, typePriority: 3}, Dance.Units.Skeleton);
};
inherits(Dance.Units.SkeletonKnight, Dance.Units.BaseSkeletonKnight);

Dance.Units.YellowSkeletonKnight = function(position) {
  base(this, position, {initialHealth: 1, typePriority: 4}, Dance.Units.YellowSkeleton);
};
inherits(Dance.Units.YellowSkeletonKnight, Dance.Units.BaseSkeletonKnight);





Dance.Units.GreenSlime = function(position) {
  base(this, position, {initialHealth: 1, typePriority: 1, strength: 50});
};
inherits(Dance.Units.GreenSlime, Dance.Units.BaseUnit);

Dance.Units.GreenSlime.prototype.makeNextMove = function(game) {
  return true;
};

Dance.Units.BaseUnit.prototype.advanceState = function(incr) {
  this.currentState = (this.currentState + incr) % this.numStates;
}

Dance.Units.BlueSlime = function(position) {
  base(this, position, {initialHealth: 2, typePriority: 2, strength: 1, numStates: 4});
};
inherits(Dance.Units.BlueSlime, Dance.Units.BaseUnit);

Dance.Units.BlueSlime.prototype.makeNextMove = function(game) {
  var player = game.player;
  if (this.currentState % 2 == 0) {
    this.advanceState(1);
    return true;
  }

  var direction;
  if (this.currentState == 1) {
    direction = Dance.Move.DOWN;
  } else {
    direction = Dance.Move.UP;
  }
  var newPosition = this.position.movedTo(direction);
  // Attack
  if (player.isOnPosition(newPosition)) {
    this.attack(game, player);
    this.advanceState(3);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.move(game, direction);
    this.advanceState(1);
    return true;
  } else {
    var unitAtPosition = game.unitAtPosition(newPosition);
    if (unitAtPosition && !unitAtPosition.madeCurrentMove) {
      return false;
    }
  }

  // Failed to do anything, but change direction if necessary.
  this.facingDirection = direction;
  this.advanceState(3);
  return true;
};

Dance.Units.OrangeSlime = function(position) {
  base(this, position, {initialHealth: 1, typePriority: 3, strength: 0.5, numStates: 4});
};
inherits(Dance.Units.OrangeSlime, Dance.Units.BaseUnit);

Dance.Units.OrangeSlime.prototype.makeNextMove = function(game) {
  var player = game.player;
  // ??
  var direction = (this.currentState + 1) % 4;
  var newPosition = this.position.movedTo(direction);
  // Attack
  if (player.isOnPosition(newPosition)) {
    this.attack(game, player);
    return true;
  }
  // Move
  if (game.isPositionFree(newPosition)) {
    this.move(game, direction);
    this.advanceState(1);
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
