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
provide('Dance.Board');
provide('Dance.Tile');

Dance.Board = function(layout) {
  this.layout = layout;
  this.rows = layout.length;
  this.columns = layout[0].length;
  this.exposed = this.create2D(false);
  this.currentlyVisible;
};

Dance.Tile = { EMPTY: 0, DIRT: 1, DIRT_WITH_TORCH: 11, STONE: 2, CATACOMB: 5,
    SHOP: 3, SHOP_WITH_TORCH: 13, SOLID: 4, STAIRS: 6 };

Dance.Tile.strength = function(tile) {
  var Tile = Dance.Tile;
  switch (tile) {
    case Tile.EMPTY:
    case Tile.STAIRS:
      return 0;
    case Tile.DIRT:
    case Tile.DIRT_WITH_TORCH:
      return 1;
    case Tile.STONE:
      return 2;
    case Tile.CATACOMB:
      return 3;
    case Tile.SHOP:
    case Tile.SHOP_WITH_TORCH:
      return 4;
    case Tile.SOLID:
      return 999;
  }
};

Dance.Tile.hasTorch = function(tile) {
  return tile == Dance.Tile.DIRT_WITH_TORCH || tile == Dance.Tile.SHOP_WITH_TORCH;
};

Dance.Board.prototype.create2D = function(initialValue) {
  var arr2D = [];
  for (var r = 0; r < this.rows; r++) {
    var arr = [];
    for (var c = 0; c < this.columns; c++) {
      arr.push(initialValue);
    }
    arr2D.push(arr);
  }
  return arr2D;
};

// no torch: sqrt(16) sight, sqrt(5) sight for not just eyes. see sqrt(2) into walls
// torch 1: sqrt(16) sight, sqrt(10) sight for not just eyes. can see sqrt(9) into walls
// torch 2: sqrt(20) sight, full enemies. can see sqrt(16) into walls.
// torch 3: sqrt(32) sight, full enemies. can see sqrt(25) into walls.
// wall torch: sqrt(8)

Dance.Board.prototype.expose = function(position) {
  // Flood fill, starting from position. SHOULD also take into account light?
//  var currentExposed = this.create2D(false);
//  var stack = [position];
//  while (stack.length > 0) {
//    var p = stack.pop();
//    for (var dir = 0; dir < 4; dir++) {
//      var newP = p.movedTo(dir);
//      if (this.isTileEmpty(newP)) {
//        if (!currentExposed[newP.row][newP.column]) {
//          this.exposed[newP.row][newP.column] = true;
//          currentExposed[newP.row][newP.column] = true;
//          stack.push(newP);
//        }
//      } else {
//        this.exposed[newP.row][newP.column] = true;
//        currentExposed[newP.row][newP.column] = true;
//      }
//    }
//  }
  this.currentlyVisible = this.create2D(false);
  this.exposed[position.row][position.column] = true;
  this.currentlyVisible[position.row][position.column] = true;
  var logg = false;
  // 5,12 to 12,10
  for (var r = -1; r < this.rows + 1; r++) {
    for (var c = -1; c < this.columns + 1; c++) {
//      logg = (position.row == 5 && position.column == 10 && r == 13 && c == 15);
//      logg = (position.row == 5 && position.column == 14 && r == 13 && c == 10);
//      logg = (position.row == 5 && position.column == 14 && r == 13 && c == 10);
//      if (!logg) continue;
//      debugger;
//      console.log((position.row * 2 + 1)+","+(position.column * 2 + 1)+" to " + (r*2) + ","+ (c*2));
      var y0 = position.row * 2 + 1;
      var x0 = position.column * 2 + 1;
      var y1 = r * 2;
      var x1 = c * 2;
      Dance.Board.castRay(y0, x0, y1, x1,
      function(x, y, corner) {
        if (logg) console.log(">>>"+x+","+y+":"+corner);
        var row = Math.floor(y / 2);
        var column = Math.floor(x / 2);
        if (row < 0 || column < 0 || column >= this.columns || row >= this.rows) {
          return false;
        }
        if (corner) {
          var cornerX = x + ((x1 - x0 < 0) ? 1 : 0);
          var cornerY = y + ((y1 - y0 < 0) ? 1 : 0);
          if (logg) console.log("XXX"+cornerX+","+cornerY+":"+corner);
          if (cornerX % 2 == 0 && cornerY % 2 == 0) {
            var cornerRow = Math.floor(cornerY / 2);
            var cornerColumn = Math.floor(cornerX / 2);
            for (var dr = 0; dr <= 1; dr++) {
              for (var dc = 0; dc <= 1; dc++) {
                if (cornerRow - dr >= 0 && cornerColumn - dc >= 0) {
                  this.currentlyVisible[cornerRow - dr][cornerColumn - dc] = true;
                  this.exposed[cornerRow - dr][cornerColumn - dc] = true;
                }
              }
            }
            return !this.isTileEmpty(new Dance.Position(row, column)); // returns true if the ray casting should stop
          }
        } else {
          // Tiles that are visible this turn.
          this.currentlyVisible[row][column] = true;
          // Tiles that have ever been visible.
          this.exposed[row][column] = true;
          return !this.isTileEmpty(new Dance.Position(row, column)); // returns true if the ray casting should stop
        }
      }.bind(this));
    }
  }
};


// Scaled up 2x, because the position of the ray origin is in the middle of a tile.
Dance.Board.castRay = function(y0, x0, y1, x1, plot) {
  var dx = x1 - x0;
  var dy = y1 - y0;
  if (dx < 0) {
    x0--;
    x1--;
  }
  if (dy < 0) {
    y0--;
    y1--;
  }
  var x = x0;
  var y = y0;
  plot(x0, y0, true);
  while (x != x1 || y != y1) {
    var tx = dx == 0 ? 1e50 : (x + Math.sign(dx) - x0) / dx;
    var ty = dy == 0 ? 1e50 : (y + Math.sign(dy) - y0) / dy;
    var corner = Math.abs(tx - ty) < 1e-13;
    if (corner) {
      x += Math.sign(dx);
      y += Math.sign(dy);
    } else if (tx < ty) {
      x += Math.sign(dx);
    } else {
      y += Math.sign(dy);
    }
    if (plot(x, y, corner, dx < 0, dy < 0)) {
      return;
    }
  }
//  plot(x0, y0, 0);
//  var octant = Dance.Board.octant(x1 - x0, y1 - y0);
//  var arr0 = Dance.Board.switchToOctantZeroFrom(octant, x0, y0);
//  var arr1 = Dance.Board.switchToOctantZeroFrom(octant, x1, y1);
//  x0 = arr0[0];
//  y0 = arr0[1];
//  x1 = arr1[0];
//  y1 = arr1[1];
//  var dx = x1 - x0;
//  var dy = y1 - y0;
//
//  var D = 2 * dy - dx;
//  var y = y0;
//  for (var x = x0 + 1; x <= x1; x++) {
//    if (D > 0) {
//      y++;
//      var reverse = Dance.Board.switchFromOctantZeroTo(octant, x, y);
//      if (plot(reverse[0], reverse[1], D)) {
//        return;
//      }
//      D += (2 * dy - 2 * dx);
//    } else {
//      var reverse = Dance.Board.switchFromOctantZeroTo(octant, x, y);
//      if (plot(reverse[0], reverse[1], D)) {
//        return;
//      }
//      D += 2 * dy;
//    }
//  }

//  var dx = x1 - x0;
//  var dy = y1 - y0;
//  var error = 0;
//  var deltaError = Math.abs(dy / dx);
//
//  var D = 2 * dy - dx;
//  var y = y0;
//  for (var x = x0; x <= x1; x++) {
//    var reverse = Dance.Board.switchFromOctantZeroTo(octant, x, y);
//    if (plot(reverse[0], reverse[1], error)) {
//      return;
//    }
//    error += deltaError;
//    while (error >= 0.5) {
//      var reverse = Dance.Board.switchFromOctantZeroTo(octant, x, y);
//      if (plot(reverse[0], reverse[1], error)) {
//        return;
//      }
//      y += 1;
//      error--;
//    }
//  }
};

Dance.Board.octant = function(x, y) {
  if (y >= 0) {
    if (x >= 0) {
      if (x >= y) {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (y >= -x) {
        return 2;
      } else {
        return 3;
      }
    }
  } else {
    if (x < 0) {
      if (-x >= -y) {
        return 4;
      } else {
        return 5;
      }
    } else {
      if (-y >= x) {
        return 6;
      } else {
        return 7;
      }
    }
  }
};

Dance.Board.switchToOctantZeroFrom = function(octant, x, y) {
  switch(octant) {
    case 0: return [x, y];
    case 1: return [y, x];
    case 2: return [y, -x];
    case 3: return [-x, y];
    case 4: return [-x, -y];
    case 5: return [-y, -x];
    case 6: return [-y, x];
    case 7: return [x, -y];
  }
};

Dance.Board.switchFromOctantZeroTo = function(octant, x, y) {
  switch(octant) {
    case 0: return [x, y];
    case 1: return [y, x];
    case 2: return [-y, x];
    case 3: return [-x, y];
    case 4: return [-x, -y];
    case 5: return [-y, -x];
    case 6: return [y, -x];
    case 7: return [x, -y];
  }
};

Dance.Board.castRay(0, 0, 1, 11, function(x, y, error) {
  console.log("TEST 1,11 : " + x+","+y+","+error);
});
Dance.Board.castRay(0, 0, 2, 3, function(x, y, error) {
  console.log("TEST 2,3 : " + x+","+y+","+error);
});
Dance.Board.castRay(0, 0, 3, 2, function(x, y, error) {
  console.log("TEST 3,2 : " + x+","+y+","+error);
});
Dance.Board.castRay(0, 0, -2, 3, function(x, y, error) {
  console.log("TEST -2,3 : " + x+","+y+","+error);
});
Dance.Board.castRay(0, 0, -3, 2, function(x, y, error) {
  console.log("TEST -3,2 : " + x+","+y+","+error);
});
Dance.Board.castRay(0, 0, 0, 3, function(x, y, error) {
  console.log("TEST 0,3 : " + x+","+y+","+error);
});
Dance.Board.castRay(0, 0, 3, 0, function(x, y, error) {
  console.log("TEST 3,0 : " + x+","+y+","+error);
});

Dance.Board.prototype.isTileExposed = function(position) {
  return this.exposed[position.row][position.column];
};

Dance.Board.prototype.getTileAt = function(position) {
  if (position.row < 0 || position.row >= this.rows ||
      position.column < 0 || position.column >= this.columns) {
    return Dance.Tile.SOLID;
  }
  return this.layout[position.row][position.column];
};

Dance.Board.prototype.setTileAt = function(position, newTile) {
  this.layout[position.row][position.column] = newTile;
};

Dance.Board.prototype.isTileEmpty = function(position) {
  var tile = this.getTileAt(position);
  return tile == Dance.Tile.EMPTY || tile == Dance.Tile.STAIRS;
};