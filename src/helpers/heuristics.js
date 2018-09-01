export default {
  
  manhattan: (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y),

  euclid: (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)),

};
