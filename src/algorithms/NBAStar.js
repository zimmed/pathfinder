/**
 * Adapted from https://github.com/anvaka/ngraph.path/blob/master/a-star/nba/index.js
 * 
 * Extremely efficient bi-directional path-finding.
 */

import { NodeHeap, SearchStatePool, heuristics } from '../helpers';

const TIMEOUT = 2000;
const NO_PATH = [];
const ROOT_2 = Math.sqrt(2);
const DISTANCE = (a, b) => (a.x !== b.x && a.y !== b.y) ? ROOT_2 : 1;
const TILE = (grid, i, j) => {
  const tile = grid[i] && grid[i][j];

  return (tile && tile.weight) ? { tile, i, j } : null;
};

const pool = SearchStatePool.create();

export default class NBAStar {

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

  static search(grid, [ i2, j2 ], [ i1, j1 ], { heuristic='manhattan', timeout=TIMEOUT, quitFast }={}) {
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
    const open1Set = NodeHeap.create(null, { compareKey: 'f1', index: 'h1' });
    const open2Set = NodeHeap.create(null, { compareKey: 'f2', index: 'h2' });
    const startNode = pool.createNewNBAState(from, i1, j1);
    const endNode = pool.createNewNBAState(to, iFinal, jFinal);
    let lMin = Infinity;
    let f1 = h(from, to);
    let f2 = f1;
    let minNode, cameFrom, currentSet, tentativeDistance, pKey, fKey, gKey,
        hKey, endpoint, startpoint, f, neighbor, potentialMin, i, j;

    startNode.g1 = 0;
    startNode.f1 = f1;
    open1Set.push(startNode);
    endNode.g2 = 0;
    endNode.f2 = f2;
    open2Set.push(endNode);

    while (open1Set.length && open2Set.length) {
      if (stopTime && Date.now() > stopTime) throw new Error('Pathfinding operating took too long.');

      if (open1Set.length < open2Set.length) {
        currentSet = open1Set;
        pKey = 'p1';
        fKey = 'f1';
        gKey = 'g1';
        hKey = 'h1';
        f = f2;
        startpoint = from;
        endpoint = to;
      } else {
        currentSet = open2Set;
        pKey = 'p2';
        fKey = 'f2';
        gKey = 'g2';
        hKey = 'h2';
        f = f1;
        startpoint = to;
        endpoint = from;
      }

      cameFrom = currentSet.pop();
      
      if (!cameFrom.closed) {
        cameFrom.closed = true;
        if (cameFrom[fKey] < lMin && (cameFrom[gKey] + f - h(startpoint, cameFrom.node)) < lMin) {
          for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
              if (!j && !i) continue;
              neighbor = pool.getOrCreateNBAFromTile(TILE(grid, cameFrom.i + i, cameFrom.j + j));
              if (!neighbor || neighbor.closed) continue;

              tentativeDistance = cameFrom[gKey] + DISTANCE(cameFrom.node, neighbor.node);

              if (tentativeDistance < neighbor[gKey]) {
                neighbor[gKey] = tentativeDistance;
                neighbor[fKey] = tentativeDistance + h(neighbor.node, endpoint);
                neighbor[pKey] = cameFrom;
                if (neighbor[hKey] < 0) currentSet.push(neighbor);
                else currentSet.updateItem(neighbor[hKey]);
              }

              potentialMin = neighbor.g1 + neighbor.g2;

              if (potentialMin < lMin) { 
                lMin = potentialMin;
                minNode = neighbor;
              }
            }
          }
        }

        if (currentSet.length) {
          if (currentSet === open1Set) f1 = open1Set.nextNode.f1;
          else f2 = open2Set.nextNode.f2;
        }
      }

      if (quitFast && minNode) break;
    }

    if (minNode) {
      const path = [ minNode.node ];
      let cur;

      for (cur = minNode.p1; cur; cur = cur.p1) path.push(cur.node);
      for (cur = minNode.p2; cur; cur = cur.p2) path.unshift(cur.node);
      return path;
    }

    return NO_PATH;
  }

  constructor() { throw new Error('NBAStar is a Static class and cannot be instantiated. Use NBAStar.search.'); }
};
