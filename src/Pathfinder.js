import * as algorithms from './algorithms';

/**
 * Example Usage:
 *  import Pathfinder from 'pathfinder';
 *  
 *  const pathFinder = Pathfinder.create();
 *  const createTile = (x, y, { weight=1, ...data }={}) => ({ x, y, weight, ...data });
 *  const createGrid = (rows, cols, configurationMap={}) => Array(rows).fill(0).map(
 *    (_, i) => Array(cols).fill(0).map(
 *      (_, j) => createTile(j, i, configurationMap[`${j},${i}`])
 *    );
 *  );
 *  const grid = createGrid(100, 100, {
 *    '42,42': { weight: 0, entities: [ 'tree' ] },
 *    '40,40': { weight: 0 },
 *  });
 * 
 *  const path = Pathfinder.search(grid, [ 45, 45 ], [ 39, 37 ], 45, 45);
 *  console.log(path ? path.join(' <- ') : 'no path'); // 45,45 <- ... <- 40,38
 */

export default class Pathfinder {

  /** Alias for new Pathfinder **/
  static create(alg, opts) { return new this(alg, opts); }

  /**
   * Static alias for pathfinder.search. (See instance `search` method below).
   * 
   * Performance gained from creating the instance first is negligable, and is really only there
   * as a bonus for the public API, since some people like to instantiate everything as a shortcut.
   * Personally, I follow object composition patterns whenever possible and avoid the `new` keyword
   * like the plague -- so I prefer static class methods operating on plain-object state. But to
   * each, their own.
   */
  static search(grid, to, from, startX=from[1], startY=from[0], algName='NBAStar', algOpts) {
    const algorithm = algorithms[algName];

    if (!algorithm) throw new Error(`Could not find pathfinder algorith: ${algName}`);
    return this.processPath(algorithm.search(grid, to, from, algOpts), startX, startY);
  }

  static pathMapper(tile) {
    return [ tile.x, tile.y ];
  }

  /**
   * Removes starting point from path and gaurantees order of [ endPosition, ..., firstPosition ]
   *  top optimize processing. For Array(N >= 5), Reversing an array, then popping all elements is
   *  faster than just shifting all the elements off the front.
   */
  static processPath(path, startX, startY) {
    if (!path || path.length < 2) return null;

    return (path[0].x === startX && path[0].y === startY)
      ? path.slice(1).reverse().map(this.pathMapper)
      : path.slice(0, -1).map(this.pathMapper)
  }

  /**
   * Instantiate a pathfinder object.
   * @param {string} [algName='NBAStar'] Can be 'NBAStar' or 'GreedyAStar'. See respective files for more info.
   * @param {Object} [algOpts] Options object passed to algorithm's search method.
   */
  constructor(algName='NBAStar', algOpts) {
    this.opts = algOpts;
    this.algorithm = algorithms[algName];
    if (!this.algorithm) throw new Error(`Could not find pathfinder algorith: ${algName}`);
  }

  /**
   * Generates a path to and from the specified tiles.
   * 
   * @param {Object[][]} grid The 2-dimensional array that represents the grid.
   *   @prop {number} [grid[][].weight] Can be any number: 0 (or falsy) means the tile is obstructed, anything else is currently treated as 1. (TODO: Add weighting to algorithms)
   *   @prop {number} grid[][].x The x coordinate. Does not necessarily correspond to the `j` index of the tile in the grid, but should correspond 1:1.
   *      Example: A tile at grid[2][4] may have an `x` value of 14, although the `j` value is 4. However, the tile at grid[2][5] should have an x value of 15.
   *        You may have a step larger than 1, but the relation of `x` -> `j` (and `y` -> `i`) must be linear (e.g., grid[0][0].x == 0, grid[0][1].x == 4, grid[0][2].x == 8).
   *   @prop {number} grid[][].y Same as `x`, but corresponds to `i` instead of `j`.
   *   Note: The global `x`/`y` values are used in the returned path, NOT the local grid `i`/`j` values.
   * @param {number[]} to The `[ i, j ]` pair of the ending grid tile.
   * @param {*} from  The `[ i, j ]` pair of the starting grid tile.
   * @param {*} startX The `x` value of the starting grid tile.
   * @param {*} startY The `y` value of the starting grid tile.
   * 
   * @return {number[][]} An array of tuples containing the `[ x, y ]` values of each node in the path, ordered by last node to first node.
   */
  search(grid, to, from, startX=from[1], startY=from[0]) {
    return Pathfinder.processPath(this.algorithm.search(grid, to, from, this.opts), startX, startY);
  }
};
