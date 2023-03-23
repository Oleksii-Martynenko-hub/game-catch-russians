import { v4 as uuidv4 } from 'uuid';

import { random } from '../utils/random';
import { drawCircle } from '../utils/drawCircle';
import { drawRotated } from '../utils/drawRotated';
import { getCellByNumber } from '../utils/getCellByNumber';
import { radiansToDegrees } from '../utils/radiansToDegrees';
import { getSecondPointInDirection } from '../utils/getSecondPointInDirection';

import { World } from './world';
import { Point } from './player';
import { Sprite } from './sprite';
import { Rect } from './headquarters';

import enemySpriteImageUrl from 'src/assets/images/enemy/enemySprite.png';
import panicSpriteImageUrl from 'src/assets/images/enemy/enemyPanicSprite.png';
import { Circle } from './circle';

export enum EnemySizes {
  SMALL = 20,
  MEDIUM = 25,
  LARGE = 30,
}

export class Enemy extends Circle {
  readonly enemyImage = new Sprite(enemySpriteImageUrl, 1, 4);
  readonly panicImage = new Sprite(panicSpriteImageUrl, 1, 5);

  private readonly maxSpeed = 200;

  // enemy touched the player has red mark
  isKiller = false;

  // weight of balls
  mass: number;

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly place: number,
    width: number,
    height: number,
    rows: number,
    cols: number
  ) {
    const randomSize = random(99, 1);
    const radius =
      randomSize < 34
        ? EnemySizes.SMALL
        : randomSize < 67
        ? EnemySizes.MEDIUM
        : EnemySizes.LARGE;

    const { row, col } = getCellByNumber(place, rows, cols, true);

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const position = {
      x: col * cellWidth - cellWidth / 2,
      y: row * cellHeight - cellHeight / 2,
    };

    const angle = Math.atan2(
      random(height, radius) - position.y || 1,
      random(width, radius) - position.x || 1
    );

    super(uuidv4(), position, radius, 80, angle);

    this.velocity = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed,
    };

    this.mass = (4 / 3) * Math.PI * (this.radius / 10) ** 3;
  }

  private typeSize() {
    if (this.radius === EnemySizes.SMALL) return 1;
    if (this.radius === EnemySizes.MEDIUM) return 2;
    if (this.radius === EnemySizes.LARGE) return 3;
  }

  drawEnemy() {
    drawRotated(
      this.ctx,
      this.position,
      radiansToDegrees(this.angle) + 0,
      () => {
        const spriteArgs = this.enemyImage.getSpriteArgsToDraw();

        this.ctx.drawImage(
          this.enemyImage.sprite,
          ...spriteArgs,
          this.position.x - this.radius - this.radius * 0.1,
          this.position.y - this.radius - this.radius * 0.1,
          this.radius * 2.2,
          this.radius * 2.2
        );
      }
    );
    if (this.place === 5) {
      // TODO: temporary condition
      const panicArgs = this.panicImage.getSpriteArgsToDraw();
      this.ctx.drawImage(
        this.panicImage.sprite,
        ...panicArgs,
        this.position.x - this.radius,
        this.position.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
    }

    if (this.isKiller) {
      drawCircle(this.ctx, this.position.x, this.position.y, 5, true, 'red');
    }
  }

  updateFrame(timeStamp: number, isStarted: boolean) {
    if (!isStarted || this.isKiller) return;

    this.enemyImage.nextFrame(timeStamp, 1000 / (this.speed / 10));
    this.panicImage.nextFrame(timeStamp, 70);
  }

  updatePosition(deltaTime: number) {
    this.position.x += this.velocity.x * Math.min(deltaTime, 0.1);
    this.position.y += this.velocity.y * Math.min(deltaTime, 0.1);
  }

  deceleration() {
    if (this.speed > this.maxSpeed) {
      this.speed -= (this.speed - this.maxSpeed) * 0.05;
    }
  }

  updateAngle() {
    this.angle = Math.atan2(this.velocity.y, this.velocity.x);
  }

  updateSpeed() {
    this.speed = Math.hypot(this.velocity.x, this.velocity.y);
  }

  updateEnemyState(deltaTime: number, isStarted: boolean) {
    if (!isStarted || this.isKiller) return;
    this.updateAngle();
    this.updateSpeed();
    this.deceleration();
    this.updateVelocity();
    this.updatePosition(deltaTime);
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
}
