import { v4 as uuidv4 } from 'uuid';

import { getSecondPointInDirection } from '../utils/getSecondPointInDirection';
import { radiansToDegrees } from '../utils/radiansToDegrees';
import { random } from '../utils/random';

import { Rect } from './headquarters';
import { Point } from './player';
import { World } from './world';

import enemy1ImageUrl from 'src/assets/images/enemy/enemy1.png';
import enemy2ImageUrl from 'src/assets/images/enemy/enemy2.png';
import enemy3ImageUrl from 'src/assets/images/enemy/enemy3.png';

export enum EnemySizes {
  SMALL = 20,
  MEDIUM = 25,
  LARGE = 30,
}

export class Enemy {
  readonly ctx: CanvasRenderingContext2D;
  readonly id: string;

  protected sprite: HTMLImageElement;

  protected position: Point;
  protected velocity: Point;

  readonly radius: number;
  protected angle: number; // angle in radians
  protected speed = 100;

  // weight of balls
  mass: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    rows: number,
    cols: number,
    place: number
  ) {
    this.id = uuidv4();
    this.ctx = ctx;

    const randomSize = random(99, 1);
    this.radius =
      randomSize < 34
        ? EnemySizes.SMALL
        : randomSize < 67
        ? EnemySizes.MEDIUM
        : EnemySizes.LARGE;

    const row = place % rows || rows;
    const col = Math.ceil(place / rows);

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    this.position = {
      x: col * cellWidth - cellWidth / 2,
      y: row * cellHeight - cellHeight / 2,
    };

    this.angle = Math.atan2(
      random(height, this.radius) - this.position.y || 1,
      random(width, this.radius) - this.position.x || 1
    );

    this.velocity = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed,
    };

    this.mass = (4 / 3) * Math.PI * (this.radius / 10) ** 3;

    this.sprite = new Image();
    this.sprite.src =
      this.typeSize() === 1
        ? enemy1ImageUrl
        : this.typeSize() === 2
        ? enemy2ImageUrl
        : enemy3ImageUrl;
  }

  private typeSize() {
    if (this.radius === EnemySizes.SMALL) return 1;
    if (this.radius === EnemySizes.MEDIUM) return 2;
    if (this.radius === EnemySizes.LARGE) return 3;
  }

  drawEnemy() {
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate((Math.PI / 180) * (radiansToDegrees(this.angle) + 0));
    this.ctx.translate(-this.position.x, -this.position.y);

    this.ctx.drawImage(
      this.sprite,
      this.position.x - this.radius - this.radius * 0.1,
      this.position.y - this.radius - this.radius * 0.1,
      this.radius * 2.2,
      this.radius * 2.2
    );

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  updatePosition(deltaTime: number) {
    this.position.x += this.velocity.x * Math.min(deltaTime, 0.1);
    this.position.y += this.velocity.y * Math.min(deltaTime, 0.1);
  }

  deceleration() {
    if (this.speed > 200) {
      this.speed -= (this.speed - 200) * 0.05;
    }
  }

  updateAngle() {
    this.angle = Math.atan2(this.velocity.y, this.velocity.x);
  }

  updateSpeed() {
    this.speed = Math.hypot(this.velocity.x, this.velocity.y);
  }

  updateVelocity() {
    this.velocity.x = Math.cos(this.angle) * this.speed;
    this.velocity.y = Math.sin(this.angle) * this.speed;
  }

  updateEnemyState(deltaTime: number) {
    this.updateAngle();
    this.updateSpeed();
    this.deceleration();
    this.updateVelocity();
    this.updatePosition(deltaTime);
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

  handleCollisionCircleToRect(r: Rect) {
    const isColliding = World.checkCollisionCircleToRect(this, r);
    if (!isColliding) return;

    const distance = World.getDistanceCircleToRect(this, r);
    const { nearestX, nearestY } = World.getNearestCircleToRect(this, r);

    const angleFromNearestToPosition = Math.atan2(
      nearestY - this.position.y,
      nearestX - this.position.x
    );

    if (distance - this.radius < 0) {
      const newPosition = getSecondPointInDirection(
        this.position,
        distance - this.radius,
        radiansToDegrees(angleFromNearestToPosition)
      );
      this.Position = newPosition;
    }

    const updatedAngle =
      angleFromNearestToPosition - this.angle + angleFromNearestToPosition;

    this.velocity.x = -Math.cos(updatedAngle) * this.speed;
    this.velocity.y = -Math.sin(updatedAngle) * this.speed;
  }

  enemyCollisionHandler(enemy: Enemy) {
    const vCollision = {
      x: enemy.Position.x - this.Position.x,
      y: enemy.Position.y - this.Position.y,
    };

    const distance = Math.hypot(
      enemy.Position.x - this.Position.x,
      enemy.Position.y - this.Position.y
    );

    const vCollisionNorm = {
      x: vCollision.x / distance,
      y: vCollision.y / distance,
    };

    const vRelativeVelocity = {
      x: this.Velocity.x - enemy.Velocity.x,
      y: this.Velocity.y - enemy.Velocity.y,
    };
    const speed =
      vRelativeVelocity.x * vCollisionNorm.x +
      vRelativeVelocity.y * vCollisionNorm.y;

    if (speed < 0) {
      return;
    }
    const impulse = (2 * speed) / (this.mass + enemy.mass);
    this.Velocity.x = this.Velocity.x - impulse * enemy.mass * vCollisionNorm.x;
    this.Velocity.y = this.Velocity.y - impulse * enemy.mass * vCollisionNorm.y;
    enemy.Velocity.x =
      enemy.Velocity.x + impulse * this.mass * vCollisionNorm.x;
    enemy.Velocity.y =
      enemy.Velocity.y + impulse * this.mass * vCollisionNorm.y;
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
