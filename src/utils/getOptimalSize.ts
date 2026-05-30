type Size = { width: number; height: number };

export const getOptimalSize = (
  imgWidth: number,
  imgHeight: number,
  maxWidth: number = 1080
): Size => {
  const ratio = imgWidth / imgHeight;

  // límites de instagram
  const MIN_RATIO = 1.91; // horizontal
  const MAX_RATIO = 4 / 5; // vertical (0.8)

  let finalRatio = ratio;

  // clamp del ratio
  if (ratio > MIN_RATIO) {
    finalRatio = MIN_RATIO;
  } else if (ratio < MAX_RATIO) {
    finalRatio = MAX_RATIO;
  }

  let width = maxWidth;
  let height = Math.round(width / finalRatio);

  return { width, height };
};