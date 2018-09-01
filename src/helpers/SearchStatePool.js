/**
 * Based on https://github.com/anvaka/ngraph.path/blob/master/a-star/makeSearchStatePool.js
 */

export default class SearchStatePool {

  static create() { return new this(); }

  currentInCache = 0;
  nodeCache = [];
  stateCache = {};

  get cached() { return this.nodeCache[this.currentInCache]; }
  set cached(v) { this.nodeCache[this.currentInCache] = v; }

  getOrCreateFromTile(item) {
    return (item) ? (this.getState(item.i, item.j) || this.createNewState(item.tile, item.i, item.j)) : null;
  }
  getOrCreateNBAFromTile(item) {
    return (item) ? (this.getState(item.i, item.j) || this.createNewNBAState(item.tile, item.i, item.j)) : null;
  }

  getState(i, j) { return this.stateCache[`${i},${j}`]; }
  setState(state, i, j) { this.stateCache[`${i},${j}`] = state; }

  createNewNBAState(node, i, j) {
    const newState = {
      node,
      i,
      j,
      p2: null,
      p2: null,
      closed: false,
      g1: Infinity,
      g2: Infinity,
      f1: Infinity,
      f2: Infinity,
      h1: -1,
      h2: -1,
    };

    this.cached = newState;
    this.currentInCache++;
    this.setState(newState, i, j);
    return newState;
  }

  createNewState(node, i, j) {
    const newState = {
      node,
      i,
      j,
      parent: null,
      closed: false,
      open: 0,
      distanceToSource: Infinity,
      fScore: Infinity,
      heapIndex: -1,
    };

    this.cached = newState;
    this.currentInCache++;
    this.setState(newState, i, j);
    return newState;
  }

  reset() {
    this.currentInCache = 0;
    this.stateCache = {};
  }
};
