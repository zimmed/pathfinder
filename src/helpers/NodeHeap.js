/**
 * Based on https://github.com/anvaka/ngraph.path/blob/master/a-star/NodeHeap.js
 */

export default class NodeHeap {

  static create(data, options) { return new this(data, options); }

  get nextNode() { return this.data[0]; }

  constructor(data, { compareKey, index='heapIndex' }={}) {
    let i;

    this.data = data || [];
    this.compareKey = compareKey;
    this.length = this.data.length;
    this.index = index;

    if (this.length > 0) {
      for (i = (this.length >> 1); i >= 0; i--) this._down(i);
      for (i = 0; i < this.length; ++i) this.data[i][index] = i;
    }
  }

  push(item) {
    this.data.push(item);
    item[this.index] = this.length;
    this.length++;
    this._up(this.length - 1);
  }

  pop() {
    if (this.length) {
      const top = this.data[0];

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
  }

  updateItem(pos) {
    this._down(pos);
    this._up(pos);
  }

  _up(pos) {
    const data = this.data;
    const compareKey = this.compareKey;
    const item = data[pos];
    const index = this.index;
    let parent, current, i = pos;

    while (i > 0) {
      parent = (i - 1) >> 1;
      current = data[parent];

      if (item[compareKey] - current[compareKey] >= 0) break;

      data[i] = current;
      current[index] = i;
      i = parent;
    }

    data[i] = item;
    item[index] = i;
  }

  _down(pos) {
    const data = this.data;
    const compareKey = this.compareKey;
    const halfLength = this.length >> 1;
    const item = data[pos];
    const index = this.index;
    let left, right, best, i = pos;

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
  }
};
