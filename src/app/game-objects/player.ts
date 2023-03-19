type Point = { x: number; y: number };

export class Player {
  readonly ctx: CanvasRenderingContext2D;
  readonly id: string;
  readonly name: string;

  static sprite: HTMLImageElement;

  protected position: Point = { x: 0, y: 0 };
  protected destination: Point = { x: 0, y: 0 };
  protected radius = 16;

  protected speed = 70;

  constructor(ctx: CanvasRenderingContext2D, name: string) {
    this.id = 'temp_id_player_765';
    this.ctx = ctx;
    this.name = name;

    this.loadImage();
  }

  loadImage() {
    if (!Player.sprite) {
      Player.sprite = new Image();
      Player.sprite.src = 'src/assets/images/player/player1.png';
    }
  }

  drawPlayer() {
    this.ctx.drawImage(
      Player.sprite,
      this.position.x - this.radius - this.radius * 0.1,
      this.position.y - this.radius - this.radius * 0.1,
      this.radius * 2.2,
      this.radius * 2.2
    );
  }

  get Position(): Point {
    return this.position;
  }

  set Position(position: Point) {
    this.position = position;
  }

  get Destination(): Point {
    return this.destination;
  }

  set Destination(destination: Point) {
    this.destination = destination;
  }
}
