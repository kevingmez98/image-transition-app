import type { RenderSize } from "../types/global";

export const exportSingleImage = (
  image: HTMLImageElement,
  size: RenderSize,
  fileName: string = 'image.png'
) => {
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Opcional: fondo negro o transparente
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🔑 Escalado manteniendo proporción
  const scale = Math.min(
    canvas.width / image.width,
    canvas.height / image.height
  );

  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;

  const offsetX = (canvas.width - drawWidth) / 2;
  const offsetY = (canvas.height - drawHeight) / 2;

  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  // Descargar
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png');
  link.click();
};