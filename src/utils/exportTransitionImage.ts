import type { Effect, EffectImages } from "../effects/base/Effect";
import type { RenderSize } from "../types/global";


export const exportTransitionImage = async (
    EffectClass: new () => Effect,
    images:EffectImages,
    size: RenderSize,
    progress: number = 1
): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No context');

    canvas.width = size.width;
    canvas.height = size.height;

    const effect = new EffectClass();

    effect.init(ctx, images, size);

    effect.render(progress);

    return canvas.toDataURL('image/png');
};