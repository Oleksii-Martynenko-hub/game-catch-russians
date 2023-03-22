import { getCellByNumber } from '../utils/getCellByNumber';

export class Sprite {
  readonly sprite: HTMLImageElement;
  protected isLoaded = false;

  protected currentFrame = 0;
  protected lastUpdateFrameTime = 0;
  timeOfUpdateFrame = 0;

  constructor(
    readonly imageSrc: string,
    readonly spriteRows: number = 1,
    readonly spriteCols: number = 1,
    readonly scale: number = 1,
    public frameWidth: number = 0,
    public frameHeight: number = 0
  ) {
    this.sprite = new Image();
    this.sprite.onload = () => {
      this.frameWidth = this.sprite.width / this.spriteCols;
      this.frameHeight = this.sprite.height / this.spriteRows;
      this.isLoaded = true;
    };
    this.sprite.src = imageSrc;
  }

  getSpriteArgsToDraw() {
    const { row, col } = getCellByNumber(
      this.currentFrame + 1,
      this.spriteRows,
      this.spriteCols
    );

    return [
      (col - 1) * this.frameWidth,
      (row - 1) * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
    ] as const;
  }

  nextFrame(timeStamp = 0, updateTime = 0) {
    if (timeStamp - this.lastUpdateFrameTime > updateTime) {
      this.currentFrame++;
      if (this.currentFrame >= this.spriteCols) this.currentFrame = 0;
      this.lastUpdateFrameTime = timeStamp;
    }
  }

  setFrame(frame: number) {
    this.currentFrame = frame;
  }

  get IsLoaded() {
    return this.isLoaded;
  }
}
