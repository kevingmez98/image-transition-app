import type { RenderSize } from "../../types/global";

export type EffectImages = {
  from: HTMLImageElement;
  to: HTMLImageElement;
};


export interface Effect {
  init(
    ctx: CanvasRenderingContext2D,
    images: EffectImages,
    size: RenderSize
  ): void;

  render(progress: number): void;

  destroy?(): void;
}