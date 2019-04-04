'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var



NodeHeap = function () {_createClass(NodeHeap, [{ key: 'nextNode', get: function get()



    {return this.data[0];} }], [{ key: 'create', value: function create(data, options) {return new this(data, options);} }]);

  function NodeHeap(data) {var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},compareKey = _ref.compareKey,_ref$index = _ref.index,index = _ref$index === undefined ? 'heapIndex' : _ref$index;_classCallCheck(this, NodeHeap);
    var i = void 0;

    this.data = data || [];
    this.compareKey = compareKey;
    this.length = this.data.length;
    this.index = index;

    if (this.length > 0) {
      for (i = this.length >> 1; i >= 0; i--) {this._down(i);}
      for (i = 0; i < this.length; ++i) {this.data[i][index] = i;}
    }
  }_createClass(NodeHeap, [{ key: 'push', value: function push(

    item) {
      this.data.push(item);
      item[this.index] = this.length;
      this.length++;
      this._up(this.length - 1);
    } }, { key: 'pop', value: function pop()

    {
      if (this.length) {
        var top = this.data[0];

        this.length--;
        if (this.length > 0) {
          this.data[0] = this.data[this.length];
          this.data[0][this.index] = 0;
          this._down(0);
        }
        this.data.pop();

        return top;
      }
      return undefined;
    } }, { key: 'updateItem', value: function updateItem(

    pos) {
      this._down(pos);
      this._up(pos);
    } }, { key: '_up', value: function _up(

    pos) {
      var data = this.data;
      var compareKey = this.compareKey;
      var item = data[pos];
      var index = this.index;
      var parent = void 0,current = void 0,i = pos;

      while (i > 0) {
        parent = i - 1 >> 1;
        current = data[parent];

        if (item[compareKey] - current[compareKey] >= 0) break;

        data[i] = current;
        current[index] = i;
        i = parent;
      }

      data[i] = item;
      item[index] = i;
    } }, { key: '_down', value: function _down(

    pos) {
      var data = this.data;
      var compareKey = this.compareKey;
      var halfLength = this.length >> 1;
      var item = data[pos];
      var index = this.index;
      var left = void 0,right = void 0,best = void 0,i = pos;

      while (i < halfLength) {
        left = (i << 1) + 1;
        right = left + 1;
        best = data[left];

        if (right < this.length && data[right][compareKey] - best[compareKey] < 0) {
          left = right;
          best = data[right];
        }

        if (best[compareKey] - item[compareKey] >= 0) break;

        data[i] = best;
        best[index] = i;
        i = left;
      }

      data[i] = item;
      item[index] = i;
    } }]);return NodeHeap;}();exports.default = NodeHeap;
;