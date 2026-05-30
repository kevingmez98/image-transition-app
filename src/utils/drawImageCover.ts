export const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) => {
  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    // Imagen más ancha → recortar lados
    drawHeight = canvasHeight;
    drawWidth = img.width * (canvasHeight / img.height);
    offsetX = (canvasWidth - drawWidth) / 2;
  } else {
    // Imagen más alta → recortar arriba/abajo
    drawWidth = canvasWidth;
    drawHeight = img.height * (canvasWidth / img.width);
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};