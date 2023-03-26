import { drawCircle } from '../utils/drawCircle';
import { drawRotated } from '../utils/drawRotated';
import { radiansToDegrees } from '../utils/radiansToDegrees';

import { Sprite } from './sprite';

import playerImageUrl from 'src/assets/images/player/player1.png';
import { Circle } from './circle';

export type Point = { x: number; y: number };

export class Player extends Circle {
  readonly playerImage = new Sprite(playerImageUrl);

  protected destination: Point = { x: 0, y: 0 };

  protected distanceToDestination = 0;

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly name: string,
    width: number,
    height: number
  ) {
    super('temp_id_player_765', { x: width / 2, y: height / 2 });
    this.destination.x = width / 2;
    this.destination.y = height / 2;
  }

  drawPlayer() {
    drawCircle(
      this.ctx,
      this.destination.x,
      this.destination.y,
      this.radius - 4,
      false,
      'red'
    );
    drawCircle(
      this.ctx,
      this.destination.x + (this.velocity.x / this.speed) * 3,
      this.destination.y + (this.velocity.y / this.speed) * 3,
      1,
      false,
      'red'
    );

    drawRotated(
      this.ctx,
      this.position,
      radiansToDegrees(this.angle) + 90,
      () => {
        this.ctx.drawImage(
          this.playerImage.sprite,
          this.position.x - this.radius - this.radius * 0.1,
          this.position.y - this.radius - this.radius * 0.1,
          this.radius * 2.2,
          this.radius * 2.2
        );
      }
    );
  }

  updatePosition(deltaTime: number) {
    if (this.distanceToDestination > 2) {
      this.position.x += this.velocity.x * Math.min(deltaTime, 0.1);
      this.position.y += this.velocity.y * Math.min(deltaTime, 0.1);
    }
  }

  updateAngle() {
    this.angle = Math.atan2(
      this.destination.y - this.position.y,
      this.destination.x - this.position.x
    );
  }

  updateDistanceToDestination() {
    this.distanceToDestination = Math.hypot(
      this.destination.x - this.position.x,
      this.destination.y - this.position.y
    );
  }

  updatePlayerState(deltaTime: number) {
    this.updateAngle();
    this.updateDistanceToDestination();
    this.updateVelocity();
    this.updatePosition(deltaTime);
  }

  get Destination(): Point {
    return this.destination;
  }

  set Destination(destination: Point) {
    this.destination = destination;
  }
}
