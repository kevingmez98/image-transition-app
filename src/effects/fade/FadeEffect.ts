import type { RenderSize } from '../../types/global';
import { drawImageCover } from '../../utils/drawImageCover';
import type { Effect } from '../base/Effect';
import type { EffectImages } from '../base/Effect';

export class FadeEffect implements Effect {
    private ctx!: CanvasRenderingContext2D;
    private from!: HTMLImageElement;
    private to!: HTMLImageElement;
    private size!: RenderSize;

    init(ctx: CanvasRenderingContext2D, images: EffectImages, size: RenderSize) {
        this.ctx = ctx;
        this.from = images.from;
        this.to = images.to;
        this.size = size;
    }

    render(progress: number) {
        const { ctx, from, to } = this;

        ctx.clearRect(0, 0, this.size.width, this.size.height);

        // Imagen base
        ctx.globalAlpha = 1;
        drawImageCover(this.ctx, from, this.size.width, this.size.height);
        // Fade hacia la segunda
        ctx.globalAlpha = progress;
        drawImageCover(this.ctx, to, this.size.width, this.size.height);

        ctx.globalAlpha = 1;
    }
}