import type { Effect } from '../effects/base/Effect';
import type { RenderSize } from '../types/global';
import  { exportVideo } from '../utils/exportVideo';

type Props = {
  effect: new () => Effect;
  imageA: HTMLImageElement | null;
  imageB: HTMLImageElement | null;
  size: RenderSize,
  duration: number;
};

export const ExportVideoButton = ({
  effect,
  imageA,
  imageB,
  size,
  duration
}: Props) => {  
  const handleExport = async () => {
    if (!imageA || !imageB) return;

    const blob = await exportVideo(
      effect,
      { from: imageA, to: imageB },
      size,
      duration,
      30
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'animation.webm';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport}>
      Export Video
    </button>
  );
};