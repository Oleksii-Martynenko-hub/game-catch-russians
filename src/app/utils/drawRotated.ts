import { Point } from '../game-objects/player';

export const drawRotated = (
  ctx: CanvasRenderingContext2D,
  center: Point,
  degrees: number,
  callback: () => void
) => {
  ctx.translate(center.x, center.y);
  ctx.rotate((Math.PI / 180) * degrees);
  ctx.translate(-center.x, -center.y);

  callback();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
};
