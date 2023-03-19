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

  enemies = [];

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
  }

  get Player() {
    return this.player;
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
