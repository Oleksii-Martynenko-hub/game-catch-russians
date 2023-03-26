import { Point } from '../game-objects/player';
import { degreesToRadians } from './degreesToRadians';

export const getSecondPointInDirection = (
  pt1: Point,
  length: number,
  degrees: number
): Point => {
  const x2 = pt1.x + length * Math.cos(degreesToRadians(degrees));
  const y2 = pt1.y + length * Math.sin(degreesToRadians(degrees));
  return { x: x2, y: y2 };
};
