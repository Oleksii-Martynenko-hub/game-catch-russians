export const getRowsCols = (num: number) => {
  let rows = Math.floor(Math.sqrt(num));
  const rest = num - rows ** 2;
  const cols = rest > 0 ? rows + 1 : rows;
  rows = rest > rows ? rows + 1 : rows;

  return { rows, cols };
};
