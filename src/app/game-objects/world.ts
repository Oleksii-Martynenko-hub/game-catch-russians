import { Enemy } from './enemy';
import { Player } from './player';

export class World {
  readonly ctx: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;

  private isGameOver = false;
  private isGameStarted = false;

  lastTimeStamp = 0;
  deltaTime = 0;
  score = 0;
  enemyQuantity = 50;

  enemies: Enemy[];

  readonly player: Player;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerName: string
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.player = new Player(this.ctx, playerName);
    const { rows, cols } = World.getRowsCols(this.enemyQuantity);
    this.enemies = [...Array(this.enemyQuantity).keys()].map(
      (i) => new Enemy(this.ctx, width, height, cols, rows, i + 1)
    );
  }

  get Player() {
    return this.player;
  }

  static getRowsCols = (num: number) => {
    let rows = Math.floor(Math.sqrt(num));
    const rest = num - rows ** 2;
    const cols = rest > 0 ? rows + 1 : rows;
    rows = rest > rows ? rows + 1 : rows;

    return { rows, cols };
  };

  static getDistanceBetweenCircles(c1: Player | Enemy, c2: Player | Enemy) {
    return Math.hypot(
      c1.Position.x - c2.Position.x,
      c1.Position.y - c2.Position.y
    );
  }

  static checkCollisionBetweenCircles(c1: Player | Enemy, c2: Player | Enemy) {
    const distance = World.getDistanceBetweenCircles(c1, c2);

    return distance <= c1.radius + c2.radius;
  }

  static getDistanceCircleToSquare(c1: Player | Enemy, c2: Player | Enemy) {
    return Math.hypot(
      c1.Position.x - c2.Position.x,
      c1.Position.y - c2.Position.y
    );
  }

  static checkCollisionCircleToSquare(c1: Player | Enemy, c2: Player | Enemy) {
    const distance = World.getDistanceBetweenCircles(c1, c2);

    return distance <= c1.radius + c2.radius;
  }

  updateTimes(timeStamp: number) {
    this.deltaTime = (timeStamp - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = timeStamp;
  }

  drawGameBoard() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawFps() {
    const fps = Math.round(1 / this.deltaTime);

    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = fps > 45 ? 'green' : fps > 25 ? 'blue' : 'red';
    this.ctx.fillText('FPS: ' + fps, 8, 22);
  }
}
