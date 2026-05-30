import { drawImageCover } from "./drawImageCover";

type DrawImageOptions = {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  maxSize?: number;
};

export const drawImageToCanvas = ({
  image,
  canvas,
  maxSize = 500,
}: DrawImageOptions) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scale = Math.min(
    maxSize / image.width,
    maxSize / image.height
  );

  const width = image.width * scale;
  const height = image.height * scale;

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  drawImageCover(ctx, image, width, height);
};