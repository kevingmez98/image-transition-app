// Extraer datos del cover
export const getCoverDrawData = (
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) => {
  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

  if (imgRatio > canvasRatio) {
    drawHeight = canvasHeight;
    drawWidth = img.width * (canvasHeight / img.height);
    offsetX = (canvasWidth - drawWidth) / 2;
  } else {
    drawWidth = canvasWidth;
    drawHeight = img.height * (canvasWidth / img.width);
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  return { drawWidth, drawHeight, offsetX, offsetY };
};