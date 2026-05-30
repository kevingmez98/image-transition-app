import type { Effect } from '../effects/base/Effect';
import  { exportTransitionImage } from '../utils/exportTransitionImage';
import type { RenderSize } from '../types/global';

type Props = {
  effect: new () => Effect;
  imageA: HTMLImageElement | null;
  imageB: HTMLImageElement | null;
  size?: RenderSize; // opcional (por defecto 1080x1080)
  progress?: number; // opcional (por defecto 1)
};

export const ExportButton = ({
  effect,
  imageA,
  imageB,
  size = { width: 1080, height: 1080 },
  progress = 1,
}: Props) => {
  const handleExport = async () => {
    if (!imageA || !imageB) {
      console.warn('Faltan imágenes para exportar');
      return;
    }

    try {
      const dataUrl = await exportTransitionImage(
        effect,
        { from: imageA, to: imageB },
        size,
        progress
      );

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `frame-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Error al exportar imagen:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      style={{
        padding: '10px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        background: '#222',
        color: '#fff',
        fontWeight: 500,
      }}
    >
      Export Image
    </button>
  );
};