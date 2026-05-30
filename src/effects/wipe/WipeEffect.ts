import type { RenderSize } from '../../types/global';
import { drawImageCover } from '../../utils/drawImageCover';
import type { Effect, EffectImages } from '../base/Effect';

export class WipeEffect implements Effect {
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
    const { width, height } = ctx.canvas;

    // Definir area total 
    ctx.clearRect(0, 0, this.size.width, this.size.height);


    // 1. Dibujar imagen base
    drawImageCover(this.ctx, from, this.size.width, this.size.height);

    // 2. Definir área visible de la imagen final durante el frame actual
    const wipeWidth = width * progress;

    ctx.save();

    // CLIP: solo se dibuja dentro de este rectángulo
    ctx.beginPath();
    ctx.rect(0, 0, wipeWidth, height);
    ctx.clip();

    // 3. Dibujar imagen final dentro del clip
    drawImageCover(this.ctx, to, this.size.width, this.size.height);

    ctx.restore();
  }
}