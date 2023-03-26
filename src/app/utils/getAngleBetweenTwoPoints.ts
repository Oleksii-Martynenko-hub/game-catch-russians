import { Point } from '../game-objects/player';
import { deg180To360 } from './deg180To360';
import { radiansToDegrees } from './radiansToDegrees';

export const getAngleBetweenTwoPoints = (pt1: Point, pt2: Point) => {
  const radians = Math.atan2(pt1.y - pt2.y, pt1.x - pt2.x);
  const degrees = radiansToDegrees(radians);
  return deg180To360(degrees);
};
