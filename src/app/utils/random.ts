export const random = (max = 1, min = 0, float = false) => {
  let num = 0
  if (max && min) num = Math.random() * (max - min + 1) + min || 0;

  if (max && !min) num = Math.random() * max || 0;

  if (float) return num;

  return Math.floor(num);
};

