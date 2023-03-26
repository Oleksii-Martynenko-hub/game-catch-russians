import { random } from '../utils/random';
import { drawText } from '../utils/drawText';
import { drawRect } from '../utils/drawRect';
import { getRowsCols } from '../utils/getRowsCols';

import { Enemy } from './enemy';
import { Sprite } from './sprite';
import { Player, Point } from './player';
import { Headquarters, Rect } from './headquarters';

import grassSpriteImageUrl from 'src/assets/images/grass_sprite.png';

export class World {
  isGameOver = false;
  isGameStarted = false;

  lastTimeStamp = 0;
  deltaTime = 0;
  score = 0;
  enemyQuantity = 5 ** 2 - 1;

  timeToMakePanic: number | null = null;

  readonly player: Player;
  enemies: Enemy[];
  headquarters: Headquarters[];

  readonly grassImage = new Sprite(grassSpriteImageUrl, 5, 6, 3);
  private grassFrames: (Point & { frame: number })[] = [];

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly width: number,
    readonly height: number,
    playerName: string
  ) {
    this.player = new Player(this.ctx, playerName, width, height);

    const { rows, cols } = getRowsCols(this.enemyQuantity);

    this.enemies = [...Array(this.enemyQuantity).keys()].map(
      (i) =>
        new Enemy(
          this.ctx,
          i + (i > this.enemyQuantity / 2 - 1 ? 2 : 1),
          width,
          height,
          cols,
          rows
        )
    );

    const headquarters = [
      { x: width - 70, y: 0, w: 70, h: 70, rotate: 180 },
      { x: width - 70, y: height - 70, w: 70, h: 70, rotate: 0 },
      { x: 0, y: height - 70, w: 70, h: 70, rotate: 0 },
    ];

    this.headquarters = headquarters.map(
      ({ rotate, ...rect }, i) =>
        new Headquarters(this.ctx, rect, rotate, i + 1)
    );
  }

  generateGrass() {
    this.grassFrames = [...Array(70).keys()]
      .map((i) => ({
        x: random(
          this.width,
          -this.grassImage.frameWidth / this.grassImage.scale
        ),
        y: random(
          this.height,
          -this.grassImage.frameHeight / (this.grassImage.scale + 1)
        ),
      }))
      .map((place) => {
        return [...Array(random(100, 60)).keys()].map((i) => ({
          x: random(
            place.x - this.grassImage.frameWidth,
            place.x + this.grassImage.frameWidth
          ),
          y: random(
            place.y - this.grassImage.frameHeight,
            place.y + this.grassImage.frameHeight
          ),
          frame: random(
            this.grassImage.spriteRows * this.grassImage.spriteCols,
            1
          ),
        }));
      })
      .reduce((a, b) => a.concat(b))
      .sort((a, b) => a.y - b.y);
  }

  makeRandomEnemyPanic() {
    if (this.timeToMakePanic === null) {
      this.timeToMakePanic = random(12, 3);
      return;
    }

    if (this.timeToMakePanic > 0) {
      this.timeToMakePanic -= this.deltaTime;
      return;
    }

    this.enemies.filter((e) => !e.isKiller)[
      random(this.enemies.length - 1)
    ].panicLevel = 1;

    this.timeToMakePanic = null;
  }

  setIsGameStarted() {
    if (!this.isGameStarted) {
      if (this.lastTimeStamp > 3000) this.isGameStarted = true;
    }
  }

  updateTimes(timeStamp: number) {
    this.deltaTime = (timeStamp - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = timeStamp;
  }

  drawGameBoard() {
    if (!this.grassFrames.length && this.grassImage.IsLoaded) {
      this.generateGrass();
    }

    drawRect(this.ctx, 0, 0, this.width, this.height, 'rgba(0, 0, 0, 0.2)');
    drawRect(this.ctx, 0, 0, this.width, this.height, 'rgba(211, 189, 132, 1)');

    this.grassFrames.forEach(({ x, y, frame }) => {
      this.grassImage.setFrame(frame);

      const spriteArgs = this.grassImage.getSpriteArgsToDraw();

      this.ctx.drawImage(
        this.grassImage.sprite,
        ...spriteArgs,
        x,
        y,
        this.grassImage.frameWidth / this.grassImage.scale,
        this.grassImage.frameHeight / this.grassImage.scale
      );
    });

    drawRect(this.ctx, 0, 0, this.width, this.height, 'rgba(0, 0, 0, 0.25)');
  }

  drawFps() {
    const fps = Math.round(1 / this.deltaTime);

    drawRect(this.ctx, 0, 0, 90, 32, 'rgba(0, 0, 0, 0.45)');

    drawText(this.ctx, 'FPS: ' + fps, 8, 22, fps > 25 ? 'green' : 'red');
  }

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

  static getNearestCircleToRect(c1: Player | Enemy, r: Rect) {
    const nearestX = Math.max(r.x, Math.min(c1.Position.x, r.x + r.w));
    const nearestY = Math.max(r.y, Math.min(c1.Position.y, r.y + r.h));
    return { nearestX, nearestY };
  }

  static getDistanceCircleToRect(c1: Player | Enemy, r: Rect) {
    const { nearestX, nearestY } = World.getNearestCircleToRect(c1, r);
    return Math.hypot(c1.Position.x - nearestX, c1.Position.y - nearestY);
  }

  static checkCollisionCircleToRect(c1: Player | Enemy, r: Rect) {
    const distance = World.getDistanceCircleToRect(c1, r);

    return distance <= c1.radius;
  }
}
