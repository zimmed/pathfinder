export { default } from './src';

type Algorithm = 'NBAStar' | 'GreedyAStar';

type Heuristic = 'manhattan' | 'euclid';

/**
 * @type {Array} RPos
 * @type {number} RPos[0] - The I (or Y) value in the position.
 * @type {number} RPos[1] - The J (or X) value in the position.
 */
type RPos = [ number, number ];

/**
 * @type {Array} Pos
 * @type {number} Pos[0] - The X value in the position.
 * @type {number} Pos[1] - The Y value in the position.
 */
type Pos = [ number, number ];

interface IOpts {
  quitFast?: boolean,
  timeout?: number,
  heuristic?: Heuristic,
}

interface ITile {
  readonly x: number,
  readonly y: number,
  weight?: number;

  [x: string]: any;
}


declare module 'zimmed-pathfinder' {

  export default class Pathfinder {
    public static create(alg: Algoirthm = 'NBAStar', opts: IOpts = {}): Pathfinder;
    public static search(
      grid: ITile[][],
      to: RPos,
      from: RPos,
      startX: number = from[1],
      startY: number = from[0],
      algName: Alogirthm = 'NBAStar',
      algOpts: IOpts = {}
    ): Pos[] | null;
    public constructor(algName: Algorithm, algOpts: IOpts = {});
    public search(
      grid: ITile[][],
      to: RPos,
      from: RPos,
      startX: number = from[1],
      startY: number = from[0]
    ): Pos[] | null;
  }
}
