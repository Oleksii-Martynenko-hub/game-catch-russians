import { v4 as uuidv4 } from 'uuid';

import { drawText } from '../utils/drawText';

import headquartersImageUrl from 'src/assets/images/headquarter.png';

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export class Headquarters {
  readonly ctx: CanvasRenderingContext2D;
  readonly id: string;

  static sprite: HTMLImageElement;

  readonly square: Rect;

  isColliding = false;

  rotate: number;
  place: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    square: Rect,
    rotate: number,
    place: number
  ) {
    this.id = uuidv4();
    this.square = square;
    this.ctx = ctx;
    this.rotate = rotate;
    this.place = place;
    this.loadImage();
  }

  loadImage() {
    if (!Headquarters.sprite) {
      Headquarters.sprite = new Image();
      Headquarters.sprite.src = headquartersImageUrl;
    }
  }
  drawHeadquarters() {
    this.ctx.translate(
      this.square.x + this.square.w / 2,
      this.square.y + this.square.h / 2
    );
    this.ctx.rotate((Math.PI / 180) * this.rotate);
    this.ctx.translate(
      -(this.square.x + this.square.w / 2),
      -(this.square.y + this.square.h / 2)
    );

    this.ctx.drawImage(
      Headquarters.sprite,
      this.square.x,
      this.square.y,
      this.square.w,
      this.square.h
    );

    drawText(
      this.ctx,
      this.place.toString(),
      this.square.x + this.square.w / 2 - 13,
      this.square.y + this.square.h / 2 - 12,
      this.isColliding ? '#0099b0' : '#ffffff',
      18
    );

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
