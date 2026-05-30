import type { Effect } from '../effects/base/Effect';
import type { RenderSize } from '../types/global';

type Images = {
    from: HTMLImageElement;
    to: HTMLImageElement;
};

export const exportVideo = async (
    EffectClass: new () => Effect,
    images: Images,
    size: RenderSize,
    duration: number = 6000,
    fps: number = 24
): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No context');

    canvas.width = size.width;
    canvas.height = size.height;

    const effect = new EffectClass();
    effect.init(ctx, images, size);

    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
    });

    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };
    alert("duration "+duration);
    recorder.start();


    const startTime = performance.now();

    await new Promise<void>((resolve) => {
        const renderLoop = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            effect.render(progress);

            if (progress < 1) {
                requestAnimationFrame(renderLoop);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(renderLoop);
    });

    recorder.stop();
    alert("recorder finished");


    return new Promise((resolve) => {
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            resolve(blob);
        };
    });
};