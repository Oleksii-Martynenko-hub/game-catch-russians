type Fonts =
  | 'Helvetica'
  | 'Arial'
  | 'Arial Black'
  | 'Verdana'
  | 'Tahoma'
  | 'Trebuchet MS'
  | 'Impact'
  | 'Gill Sans'
  | 'Times New Roman'
  | 'Georgia'
  | 'Palatino'
  | 'Baskerville'
  | 'Andalé Mono'
  | 'Courier'
  | 'Lucida'
  | 'Monaco'
  | 'Bradley Hand'
  | 'Brush Script MT'
  | 'Luminari'
  | 'Comic Sans MS';

export const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  left: number,
  bottom: number,
  color = '#fff',
  fontSize = 20,
  fontFamily: Fonts = 'Arial'
) => {
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.fillText(text, left, bottom);
};
