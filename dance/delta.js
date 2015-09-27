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
provide('Dance.Delta');

Dance.Delta = function(rows, columns) {
  this.rows = rows;
  this.columns = columns;
};

Dance.Delta.create = function(from, to) {
  return new Dance.Delta(to.row - from.row, to.column - from.column);
};

Dance.Delta.prototype.size = function() {
  return this.rows * this.rows + this.columns * this.columns;
};