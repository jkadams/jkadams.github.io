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
provide('Dance.Direction');

Dance.Direction = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };

Dance.Direction.opposite = function(direction) {
  switch (direction) {
    case Dance.Direction.UP:
      return Dance.Direction.DOWN;
    case Dance.Direction.RIGHT:
      return Dance.Direction.LEFT;
    case Dance.Direction.DOWN:
      return Dance.Direction.UP;
    case Dance.Direction.LEFT:
      return Dance.Direction.RIGHT;
    default:
      return null;
  }
};