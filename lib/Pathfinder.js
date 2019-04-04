'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _algorithms = require('./algorithms');var algorithms = _interopRequireWildcard(_algorithms);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var





















Pathfinder = function () {_createClass(Pathfinder, null, [{ key: 'create', value: function create(


    alg, opts) {return new this(alg, opts);} }, { key: 'search', value: function search(










    grid, to, from) {var startX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : from[1];var startY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : from[0];var algName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'NBAStar';var algOpts = arguments[6];
      var algorithm = algorithms[algName];

      if (!algorithm) throw new Error('Could not find pathfinder algorith: ' + algName);
      return this.processPath(algorithm.search(grid, to, from, algOpts), startX, startY);
    } }, { key: 'pathMapper', value: function pathMapper(

    tile) {
      return [tile.x, tile.y];
    } }, { key: 'processPath', value: function processPath(






    path, startX, startY) {
      if (!path || path.length < 2) return null;

      return path[0].x === startX && path[0].y === startY ?
      path.slice(1).reverse().map(this.pathMapper) :
      path.slice(0, -1).map(this.pathMapper);
    } }]);






  function Pathfinder() {var algName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'NBAStar';var algOpts = arguments[1];_classCallCheck(this, Pathfinder);
    this.opts = algOpts;
    this.algorithm = algorithms[algName];
    if (!this.algorithm) throw new Error('Could not find pathfinder algorith: ' + algName);
  }_createClass(Pathfinder, [{ key: 'search', value: function search(


















    grid, to, from) {var startX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : from[1];var startY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : from[0];
      return Pathfinder.processPath(this.algorithm.search(grid, to, from, this.opts), startX, startY);
    } }]);return Pathfinder;}();exports.default = Pathfinder;
;