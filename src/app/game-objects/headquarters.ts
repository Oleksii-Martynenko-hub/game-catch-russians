import { v4 as uuidv4 } from 'uuid';

import { drawText } from '../utils/drawText';
import { drawRotated } from '../utils/drawRotated';

import { Sprite } from './sprite';

import headquartersImageUrl from 'src/assets/images/headquarter.png';

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export class Headquarters {
  readonly id: string;

  readonly headquartersImage = new Sprite(headquartersImageUrl);

  isColliding = false;

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly square: Rect,
    public rotate: number,
    public place: number
  ) {
    this.id = uuidv4();
  }

  drawHeadquarters() {
    drawRotated(
      this.ctx,
      {
        x: this.square.x + this.square.w / 2,
        y: this.square.y + this.square.h / 2,
      },
      this.rotate,
      () => {
        this.ctx.drawImage(
          this.headquartersImage.sprite,
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
      }
    );
  }
}
