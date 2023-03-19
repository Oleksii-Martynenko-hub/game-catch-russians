type Point = { x: number; y: number };

export class Player {
  readonly ctx: CanvasRenderingContext2D;
  readonly id: string;
  readonly name: string;

  protected position: Point = { x: 0, y: 0 };
  protected destination: Point = { x: 0, y: 0 };
  protected radius = 14;

  protected speed = 70;

  constructor(ctx: CanvasRenderingContext2D, name: string) {
    this.id = 'temp_id_player_765';
    this.ctx = ctx;
    this.name = name;
  }

  get Position(): Point {
    return this.position;
  }

  set Position(position: Point) {
    this.position = position;
  }
}
