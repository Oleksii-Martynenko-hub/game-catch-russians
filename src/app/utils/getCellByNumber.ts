export const getCellByNumber = (
  place: number,
  rows: number,
  cols: number,
  isVertical = false
) => {
  if (isVertical) {
    const row = place % rows || rows;
    const col = Math.ceil(place / rows);
    return { row, col };
  }

  const row = place % cols || cols;
  const col = Math.ceil(place / cols);
  return { row, col };
};
