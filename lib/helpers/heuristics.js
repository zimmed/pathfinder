"use strict";Object.defineProperty(exports, "__esModule", { value: true });var heuristics = {

  manhattan: function manhattan(a, b) {return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);},

  euclid: function euclid(a, b) {return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));} };exports.default =



{
  get: function get(name) {
    var h = heuristics[name];

    if (!h) {
      throw new Error("Couldn't find heuristic definition for " + name);
    }

    return h;
  } };