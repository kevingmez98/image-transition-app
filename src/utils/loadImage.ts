export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.src = url;

    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};