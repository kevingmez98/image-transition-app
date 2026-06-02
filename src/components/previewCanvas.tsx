import { useEffect, useRef } from 'react';
import { AnimationLoop } from '../canvas/animationLoop';
import { BattleEffect1 } from '../effects/pokemon/battle-pokemon-1/BattleEffect1';
import { BattleEffect1DirectReveal } from '../effects/pokemon/battle-pokemon-1/BattleEffect1DirectReveal';
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
    duration: number;
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
       //const effect = new BrokenEffect();
      // const effect = new BattleEffect1(); 
       const effect = new BattleEffect1DirectReveal(); 
       effect.init(ctx, {
            from: from,
            to: to
        },
            { width: size.width, height: size.height })
        const loop = new AnimationLoop(3000, (progress) => {
            effect.render(progress);
        });

        loop.start();
        return () => loop.stop();
    }, [from, to]);


    return <canvas ref={canvasRef} />;
};