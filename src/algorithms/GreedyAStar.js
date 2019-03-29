/**
 * Adapted from https://github.com/anvaka/ngraph.path/blob/master/a-star/a-greedy-star.js
 * 
 * Faster than NBA*, but is not gauranteed to return shortest path.
 */

import { NodeHeap, SearchStatePool, heuristics } from '../helpers';

const TIMEOUT = 2000;
const BY_FROM = 1;
const BY_TO = 2;
const NO_PATH = [];
const ROOT_2 = Math.sqrt(2);
const DISTANCE = (a, b) => (a.x !== b.x && a.y !== b.y) ? ROOT_2 : 1;
const TILE = (grid, i, j) => {
  const tile = grid[i] && grid[i][j];

  return (tile && tile.weight) ? { tile, i, j } : null;
};

const pool = SearchStatePool.create();

export default class GreedyAStar {

  static closestNeighbor(grid, i, j, from, heuristic) {
    const neighbors = [];
    let closestScore = Infinity;
    let a, b, l, item, closest;

    for (a = -1; a < 2; a++) {
      for (b = -1; b < 2; b++) {
        if (!a && !b) continue;
        item = TILE(grid, i + a, j + b);
        if (item) {
          item = { tile: item.tile, score: heuristic(from, item.tile), i: i + a, j: j + b };
          if (item.score < closestScore) {
            closestScore = item.score;
            closest = item;
          }
          neighbors.push(item);
        }
      }
    }
    if (closest.tile.weight) return [ closest.i, closest.j, closest.tile ];
    neighbors.sort((a, b) => a.score < b.score ? -1 : a.score > b.score ? 1 : 0);
    for (a = 0, l = neighbors.length; a < l; a++) if (neighbors[a].tile.weight) return [ neighbors[a].i, neighbors[a].j, neighbors[a].tile ];
    return this.closestNeighbor(grid, neighbors[0].pos, neighbors[0].tile, from, heuristic);
  }

  static search(grid, [ i2, j2 ], [ i1, j1 ], { heuristic='manhattan', timeout=TIMEOUT }={}) {
    const h = heuristics.get(heuristic);
    const from = grid[i1][j1];
    let to = grid[i2][j2];
    let iFinal = i2;
    let jFinal = j2;

    if (from === to) return NO_PATH;

    if (!to.weight) [ iFinal, jFinal, to ] = this.closestNeighbor(grid, iFinal, jFinal, from, h);

    if (from === to) return NO_PATH;
    pool.reset();
    
    const stopTime = timeout ? Date.now() + timeout : 0;
    const openSetFrom = NodeHeap.create(null, { compareKey: 'fScore' });
    const openSetTo = NodeHeap.create(null, { compareKey: 'fScore' });
    const startNode = pool.createNewState(from, i1, j1);
    const endNode = pool.createNewState(to, iFinal, jFinal);
    let lMin = Infinity;
    let currentSet = openSetFrom;
    let currentOpener = BY_FROM;
    let minFrom, minTo, current, i, j, potentialLMin, tentativeDistance, neighbor, target, newFScore;

    startNode.fScore = h(from, to);
    startNode.distanceToSource = 0;
    openSetFrom.push(startNode);
    startNode.open = BY_FROM;
    endNode.fScore = h(to, from);
    endNode.distanceToSource = 0;
    openSetTo.push(endNode);
    endNode.open = BY_TO;

    while (openSetFrom.length && openSetTo.length) {
      if (stopTime && Date.now() > stopTime) throw new Error('Pathfinding operating took too long.');

      if (openSetFrom.length < openSetTo.length) {
        currentOpener = BY_FROM;
        currentSet = openSetFrom;
      } else {
        currentOpener = BY_TO;
        currentSet = openSetTo;
      }

      current = currentSet.pop();
      current.closed = true;

      if (current.distanceToSource > lMin) continue;
      
      for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
          if (!j && !i) continue;
          neighbor = pool.getOrCreateFromTile(TILE(grid, current.i + i, current.j + j));
          if (!neighbor || neighbor.closed) continue;
    
          if (neighbor.open && neighbor.open !== currentOpener) {
            potentialLMin = neighbor.distanceToSource + current.distanceToSource;

            if (potentialLMin < lMin) {
              minFrom = neighbor;
              minTo = current
              lMin = potentialLMin;
            }

            continue;
          }
    
          tentativeDistance = current.distanceToSource + DISTANCE(neighbor.node, current.node);
          if (tentativeDistance >= neighbor.distanceToSource) continue;
          target = (currentOpener === BY_FROM) ? to : from;
          newFScore = tentativeDistance + h(neighbor.node, target);
          if (newFScore >= lMin) continue;
          neighbor.fScore = newFScore;
    
          if (neighbor.open === 0) {
            currentSet.push(neighbor);
            currentSet.updateItem(neighbor.heapIndex);
            neighbor.open = currentOpener;
          }
    
          neighbor.parent = current;
          neighbor.distanceToSource = tentativeDistance;
        }
      }

      if (minFrom && minTo) {
        const path = [];
        let parent;

        for (parent = minFrom; parent; parent = parent.parent) path.push(parent.node);
        for (parent = minTo; parent; parent = parent.parent) path.unshift(parent.node);

        return path;
      }
    }

    return NO_PATH;
  }

  constructor() { throw new Error('GreedyAStar is a Static class and cannot be instantiated. Use GreedyAStar.search.'); }
};
