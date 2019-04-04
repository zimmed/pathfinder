'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();





var _helpers = require('../helpers');function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

var TIMEOUT = 2000;
var BY_FROM = 1;
var BY_TO = 2;
var NO_PATH = [];
var ROOT_2 = Math.sqrt(2);
var DISTANCE = function DISTANCE(a, b) {return a.x !== b.x && a.y !== b.y ? ROOT_2 : 1;};
var TILE = function TILE(grid, i, j) {
  var tile = grid[i] && grid[i][j];

  return tile && tile.weight ? { tile: tile, i: i, j: j } : null;
};

var pool = _helpers.SearchStatePool.create();var

GreedyAStar = function () {_createClass(GreedyAStar, null, [{ key: 'closestNeighbor', value: function closestNeighbor(

    grid, i, j, from, heuristic) {
      var neighbors = [];
      var closestScore = Infinity;
      var a = void 0,b = void 0,l = void 0,item = void 0,closest = void 0;

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
      if (closest.tile.weight) return [closest.i, closest.j, closest.tile];
      neighbors.sort(function (a, b) {return a.score < b.score ? -1 : a.score > b.score ? 1 : 0;});
      for (a = 0, l = neighbors.length; a < l; a++) {if (neighbors[a].tile.weight) return [neighbors[a].i, neighbors[a].j, neighbors[a].tile];}
      return this.closestNeighbor(grid, neighbors[0].pos, neighbors[0].tile, from, heuristic);
    } }, { key: 'search', value: function search(

    grid, _ref, _ref2) {var _ref5 = _slicedToArray(_ref, 2),i2 = _ref5[0],j2 = _ref5[1];var _ref4 = _slicedToArray(_ref2, 2),i1 = _ref4[0],j1 = _ref4[1];var _ref3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},_ref3$heuristic = _ref3.heuristic,heuristic = _ref3$heuristic === undefined ? 'manhattan' : _ref3$heuristic,_ref3$timeout = _ref3.timeout,timeout = _ref3$timeout === undefined ? TIMEOUT : _ref3$timeout;
      var h = _helpers.heuristics.get(heuristic);
      var from = grid[i1][j1];
      var to = grid[i2][j2];
      var iFinal = i2;
      var jFinal = j2;

      if (from === to) return NO_PATH;

      if (!to.weight) {;var _closestNeighbor = this.closestNeighbor(grid, iFinal, jFinal, from, h);var _closestNeighbor2 = _slicedToArray(_closestNeighbor, 3);iFinal = _closestNeighbor2[0];jFinal = _closestNeighbor2[1];to = _closestNeighbor2[2];}

      if (from === to) return NO_PATH;
      pool.reset();

      var stopTime = timeout ? Date.now() + timeout : 0;
      var openSetFrom = _helpers.NodeHeap.create(null, { compareKey: 'fScore' });
      var openSetTo = _helpers.NodeHeap.create(null, { compareKey: 'fScore' });
      var startNode = pool.createNewState(from, i1, j1);
      var endNode = pool.createNewState(to, iFinal, jFinal);
      var lMin = Infinity;
      var currentSet = openSetFrom;
      var currentOpener = BY_FROM;
      var minFrom = void 0,minTo = void 0,current = void 0,i = void 0,j = void 0,potentialLMin = void 0,tentativeDistance = void 0,neighbor = void 0,target = void 0,newFScore = void 0;

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
                minTo = current;
                lMin = potentialLMin;
              }

              continue;
            }

            tentativeDistance = current.distanceToSource + DISTANCE(neighbor.node, current.node);
            if (tentativeDistance >= neighbor.distanceToSource) continue;
            target = currentOpener === BY_FROM ? to : from;
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
          var path = [];
          var parent = void 0;

          for (parent = minFrom; parent; parent = parent.parent) {path.push(parent.node);}
          for (parent = minTo; parent; parent = parent.parent) {path.unshift(parent.node);}

          return path;
        }
      }

      return NO_PATH;
    } }]);

  function GreedyAStar() {_classCallCheck(this, GreedyAStar);throw new Error('GreedyAStar is a Static class and cannot be instantiated. Use GreedyAStar.search.');}return GreedyAStar;}();exports.default = GreedyAStar;
;