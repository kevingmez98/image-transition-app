import { useEffect, useRef } from 'react';
import { AnimationLoop } from '../canvas/animationLoop';
import { FadeEffect } from '../effects/fade/FadeEffect';
import { ZoomEffect } from '../effects/zoom/ZoomEffect';
import { WipeEffect } from '../effects/wipe/WipeEffect';
import { ShatterEffect } from '../effects/shatter/ShatterEffect';
import type { RenderSize } from '../types/global';
import type { Effect } from '../effects/base/Effect';
import { BrokenEffect } from '../effects/broken/BrokenEffect';

type Props = {
    from: HTMLImageElement;
    to: HTMLImageElement;
    size: RenderSize;
};

export const PreviewCanvas = ({ from, to, size }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;

        canvas.width = size.width;
        canvas.height = size.height;

    }, [size]);

    useEffect(() => {
        if (!canvasRef.current || !from || !to) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // const effect = new FadeEffect();
        // const effect = new ZoomEffect();
        //const effect = new WipeEffect();
       // const effect = new ShatterEffect();
       const effect = new BrokenEffect();
        effect.init(ctx, {
            from: from,
            to: to
        },
            { width: size.width, height: size.height })
        const loop = new AnimationLoop(6000, (progress) => {
            effect.render(progress);
        });

        loop.start();
        return () => loop.stop();
    }, [from, to]);


    return <canvas ref={canvasRef} />;
};