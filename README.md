# zimmed-pathfinder

Adapted from https://github.com/anvaka/ngraph.path and streamlined for a specific project I'm developing.

Shameless plug: https://www.patreon.com/divination
Still in the very early stages, but I'll be posting more about the development quite soon.

Using this NBAStar implementation got the pathfinding time for my game world (including post-processing) to ~0.2ms average, and ~0.5ms when requesting a blocked node as the end point.

Although this implementation is specific, you might be able to use it, or at least find it a helpful reference when rolling your own A* functions.

Do what thou Wilt.

### Installation

`$ npm i --save zimmed-pathfinder`

### Usage

```javascript
import Pathfinder from 'zimmed-pathfinder';

const createTile = (x, y, { weight=1, ...data }={}) => ({ x, y, weight, ...data });
const createGrid = (rows, cols, configurationMap={}) => Array(rows).fill(0).map(
  (_, i) => Array(cols).fill(0).map(
    (_, j) => createTile(j, i, configurationMap[`${j},${i}`])
  );
);
const grid = createGrid(100, 100, {
  '42,42': { weight: 0, entities: [ 'tree' ] },
  '40,40': { weight: 0 },
});
let path = Pathfinder.search(grid, [ 45, 45 ], [ 39, 37 ]);

console.log(path ? path.join(' <- ') : 'no path'); // 45,45 <- ... <- 40,38

grid[45][45].weight = 0;
path = Pathfinder.search(grid, [ 45, 45 ], [ 39, 37 ]);

console.log(path ? path.join(' <- ') : 'no path'); // 44,44 <- ... <- 40,38
```

#### If you like instantiating everything, for some reason:
```javascript
import Pathfinder from 'zimmed-pathfinder';

const pathFinder = Pathfinder.create('NBAStar', { quitFast: true }); // Or new Pathfinder(...)
const createTile = (x, y, { weight=1, ...data }={}) => ({ x, y, weight, ...data });
const createGrid = (rows, cols, configurationMap={}) => Array(rows).fill(0).map(
  (_, i) => Array(cols).fill(0).map(
    (_, j) => createTile(j * 2 + 10, i * 2 + 10, configurationMap[`${j * 2 + 10},${i * 2 + 10}`])
  );
);
const grid = createGrid(100, 100, {
  '94,94': { weight: 0, obstructions: [ 'A classical hierarchy' ] },
  '90,90': { weight: 0, obstructions: [ 'Imperative mutations on application state' ] },
});
let path = pathFinder.search(grid, [ 45, 45 ], [ 39, 37 ], 88, 84);

console.log(path ? path.join(' <- ') : 'no path'); // 100,100 <- ... <- 90,86

grid[45][45].weight = 0;
path = Pathfinder.search(grid, [ 45, 45 ], [ 39, 37 ], 88, 84);

console.log(path ? path.join(' <- ') : 'no path'); // 98,98 <- ... <- 90,86
```

### Include source to use your own transpilation rules

```javascript
import Pathfinder from 'zimmed-pathfinder/src';

...
```

### Build from source

`$ git clone https://github.com/zimmed/zimmed-pathfinder.git`
`$ cd zimmed-pathfinder`
`$ npm i`
`$ npm run build`

### License

Whatever man, it's math. No one owns math. Use it as you see fit.
