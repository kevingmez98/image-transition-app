import { useEffect, useState } from "react";
import { ExportButton } from "./components/ExportButton";
import { ExportVideoButton } from "./components/ExportVideoButton";
import { PreviewCanvas } from "./components/previewCanvas";
import { ShatterEffect } from "./effects/shatter/ShatterEffect";
import { exportSingleImage } from "./utils/exportSingleImage";
import { loadImage } from "./utils/loadImage";
import { getOptimalSize } from "./utils/getOptimalSize";
import { BrokenEffect } from "./effects/broken/BrokenEffect";

function App() {
  const [imageA, setImageA] = useState<HTMLImageElement | null>(null);
  const [imageB, setImageB] = useState<HTMLImageElement | null>(null);
  const [autoSize, setAutoSize] = useState(true);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [showPreview, setShowPreview] = useState(false);

  const handleUpload = async (file: File, type: 'A' | 'B') => {
    const img = await loadImage(file);
    type === 'A' ? setImageA(img) : setImageB(img);
    setShowPreview(false);
  };

  useEffect(() => {
    if (imageA && imageB && autoSize) {
      const sizeTemp = getOptimalSize(
        Math.max(imageA.width, imageB.width),
        Math.max(imageA.height, imageB.height)
      );
      setSize(sizeTemp);
    }
  }, [imageA, imageB]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Image Transition Tool</h1>
          <p className="text-gray-500">
            Crea transiciones entre imágenes fácilmente
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold text-lg">1. Subir imágenes</h2>

          <div className="grid grid-cols-2 gap-4">
            <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleUpload(e.target.files[0], 'A')
                }
              />
              {imageA ? "Reemplazar Imagen A" : "Subir Imagen A"}
            </label>

            <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleUpload(e.target.files[0], 'B')
                }
              />
              {imageB ? "Reemplazar Imagen B" : "Subir Imagen B"}
            </label>
          </div>

          {/* Preview */}
          {(imageA || imageB) && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {imageA && (
                <img src={imageA.src} className="rounded-xl shadow-md" />
              )}
              {imageB && (
                <img src={imageB.src} className="rounded-xl shadow-md" />
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold text-lg">2. Configuración</h2>

          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="number"
              value={size.width}
              disabled={autoSize}
              onChange={(e) =>
                setSize((prev) => ({
                  ...prev,
                  width: Number(e.target.value),
                }))
              }
              className="border p-2 rounded w-28 disabled:bg-gray-100"
              placeholder="Width"
            />

            <input
              type="number"
              value={size.height}
              disabled={autoSize}
              onChange={(e) =>
                setSize((prev) => ({
                  ...prev,
                  height: Number(e.target.value),
                }))
              }
              className="border p-2 rounded w-28 disabled:bg-gray-100"
              placeholder="Height"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoSize}
                onChange={(e) => setAutoSize(e.target.checked)}
              />
              Auto size (Instagram)
            </label>
          </div>
        </div>

        {/* Action */}
        {imageA && imageB && (
          <div className="text-center">
            <button
              onClick={() => setShowPreview(true)}
              className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Ver transición
            </button>
          </div>
        )}

        {/* Preview Canvas */}
        {showPreview && imageA && imageB && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h2 className="font-semibold text-lg">3. Preview</h2>
            <PreviewCanvas from={imageA} to={imageB} size={size} />
          </div>
        )}

        {/* Export */}
        {showPreview && imageA && imageB && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h2 className="font-semibold text-lg">4. Exportar</h2>

            <div className="flex flex-wrap gap-3">
              <ExportButton
                effect={ShatterEffect}
                imageA={imageA}
                imageB={imageB}
                size={size}
              />

              <ExportVideoButton
                effect={BrokenEffect}
                imageA={imageA}
                imageB={imageB}
                size={size}
              />

              <button
                onClick={() => {
                  if (imageA) exportSingleImage(imageA, size, 'imageA.png');
                }}
                className="border px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                Imagen A
              </button>

              <button
                onClick={() => {
                  if (imageB) exportSingleImage(imageB, size, 'imageB.png');
                }}
                className="border px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                Imagen B
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;