"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var



SearchStatePool = function () {function SearchStatePool() {_classCallCheck(this, SearchStatePool);this.



    currentInCache = 0;this.
    nodeCache = [];this.
    stateCache = {};}_createClass(SearchStatePool, [{ key: "getOrCreateFromTile", value: function getOrCreateFromTile(




    item) {
      return item ? this.getState(item.i, item.j) || this.createNewState(item.tile, item.i, item.j) : null;
    } }, { key: "getOrCreateNBAFromTile", value: function getOrCreateNBAFromTile(
    item) {
      return item ? this.getState(item.i, item.j) || this.createNewNBAState(item.tile, item.i, item.j) : null;
    } }, { key: "getState", value: function getState(

    i, j) {return this.stateCache[i + "," + j];} }, { key: "setState", value: function setState(
    state, i, j) {this.stateCache[i + "," + j] = state;} }, { key: "createNewNBAState", value: function createNewNBAState(

    node, i, j) {var _newState;
      var newState = (_newState = {
        node: node,
        i: i,
        j: j,
        p2: null }, _defineProperty(_newState, "p2",
      null), _defineProperty(_newState, "closed",
      false), _defineProperty(_newState, "g1",
      Infinity), _defineProperty(_newState, "g2",
      Infinity), _defineProperty(_newState, "f1",
      Infinity), _defineProperty(_newState, "f2",
      Infinity), _defineProperty(_newState, "h1",
      -1), _defineProperty(_newState, "h2",
      -1), _newState);


      this.cached = newState;
      this.currentInCache++;
      this.setState(newState, i, j);
      return newState;
    } }, { key: "createNewState", value: function createNewState(

    node, i, j) {
      var newState = {
        node: node,
        i: i,
        j: j,
        parent: null,
        closed: false,
        open: 0,
        distanceToSource: Infinity,
        fScore: Infinity,
        heapIndex: -1 };


      this.cached = newState;
      this.currentInCache++;
      this.setState(newState, i, j);
      return newState;
    } }, { key: "reset", value: function reset()

    {
      this.currentInCache = 0;
      this.stateCache = {};
    } }, { key: "cached", get: function get() {return this.nodeCache[this.currentInCache];}, set: function set(v) {this.nodeCache[this.currentInCache] = v;} }], [{ key: "create", value: function create() {return new this();} }]);return SearchStatePool;}();exports.default = SearchStatePool;
;