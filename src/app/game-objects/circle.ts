import { Point } from './player';

export abstract class Circle {
  protected velocity: Point = { x: 0, y: 0 };

  constructor(
    readonly id: string,
    protected position: Point,
    readonly radius: number = 25,
    protected speed = 70,
    protected angle: number = 0
  ) {}

  updateVelocity() {
    this.velocity.x = Math.cos(this.angle) * this.speed;
    this.velocity.y = Math.sin(this.angle) * this.speed;
  }

  wallsCollisionHandler(width: number, height: number) {
    const restitution = 1.2; // coefficient changing speed by bouncing of the wall, 1 = not changing

    if (this.position.x < this.radius) {
      this.velocity.x = Math.abs(this.velocity.x) * restitution;
      this.position.x = this.radius;
    } else if (this.position.x > width - this.radius) {
      this.velocity.x = -Math.abs(this.velocity.x) * restitution;
      this.position.x = width - this.radius;
    }

    if (this.position.y < this.radius) {
      this.velocity.y = Math.abs(this.velocity.y) * restitution;
      this.position.y = this.radius;
    } else if (this.position.y > height - this.radius) {
      this.velocity.y = -Math.abs(this.velocity.y) * restitution;
      this.position.y = height - this.radius;
    }
  }

  get Position(): Point {
    return this.position;
  }

  set Position(position: Point) {
    this.position = position;
  }

  get Velocity(): Point {
    return this.velocity;
  }

  set Velocity(velocity: Point) {
    this.velocity = velocity;
  }
}
