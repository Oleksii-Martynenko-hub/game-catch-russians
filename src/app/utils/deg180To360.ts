export const deg180To360 = (degrees: number) => {
  if (degrees < 0) return 180 + 180 - Math.abs(degrees);
  return degrees;
};
