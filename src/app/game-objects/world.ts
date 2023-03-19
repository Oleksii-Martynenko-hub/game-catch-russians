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

  readonly player: {
    name: string;
    id: string;
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    player: { name: string; id: string }
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.player = player;
  }
}
