import type { RenderSize } from "../../types/global";
import { drawImageCover } from "../../utils/drawImageCover";
import { getCoverDrawData } from "../../utils/getCoverDrawData";
import type { Effect, EffectImages } from "../base/Effect";
import { shatterPatterns } from "./ShatterPatterns";
import type { Fragment, Point } from "./types";

export class ShatterEffect implements Effect {
    private fragments: Fragment[] = [];
    private ctx!: CanvasRenderingContext2D;
    private from!: HTMLImageElement;
    private to!: HTMLImageElement;
    private size!: RenderSize;

    init(ctx: CanvasRenderingContext2D, images: EffectImages, size: RenderSize) {
        this.ctx = ctx;
        this.from = images.from;
        this.to = images.to;
        this.size = size;
        this.fragments = this.createFragments();
    }


    render(progress: number) {
        const { ctx } = this;
        const { width, height } = ctx.canvas;

        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const p = ease(progress);

        ctx.clearRect(0, 0, width, height);

        // 🔹 1. Dibujar imagen final (debajo)
        //ctx.globalAlpha = p;
        ctx.globalAlpha = 1;
        drawImageCover(this.ctx, this.to, this.size.width, this.size.height);
        ctx.globalAlpha = 1;

        // 🔹 2. Dibujar fragmentos encima
        this.fragments.forEach(fragment => {
            this.drawFragment(fragment, p);
        });
    }

    private drawFragment(fragment: Fragment, progress: number) {
        const { ctx, from, size } = this;

        const moveX = fragment.velocity.x * progress * 2;
        const moveY = fragment.velocity.y * progress * 2;

        const angle = fragment.rotationSpeed * progress * 5;

        const fadeStart = 0.75;

        const alpha =
            progress < fadeStart
                ? 1
                : 1 - (progress - fadeStart) / (1 - fadeStart);

        ctx.save();
        const { drawWidth, drawHeight, offsetX, offsetY } =
            getCoverDrawData(from, size.width, size.height);

        // mover al centro del fragmento
        ctx.translate(
            fragment.center.x + moveX,
            fragment.center.y + moveY
        );

        ctx.rotate(angle);

        // dibujar relativo al centro
        ctx.beginPath();
        fragment.points.forEach(([x, y], i) => {
            const localX = x - fragment.center.x;
            const localY = y - fragment.center.y;

            if (i === 0) ctx.moveTo(localX, localY);
            else ctx.lineTo(localX, localY);
        });
        ctx.closePath();

        ctx.clip();

        ctx.globalAlpha = alpha;
        ctx.drawImage(
            from,
            offsetX - fragment.center.x,
            offsetY - fragment.center.y,
            drawWidth,
            drawHeight
        );

        ctx.restore();
    }

    private createFragments(): Fragment[] {
        const { width, height } = this.ctx.canvas;

        // Fragmentos simples tipo "pantalla rota"
        const fragments: Fragment[] = [];

        const centerX = width / 2;
        const centerY = height / 2;

        // Generar puntos segun los patrones
        const points = shatterPatterns.irregular(width, height);

        for (let i = 0; i < points.length; i++) {
            const next = (i + 1) % points.length;

            const triangle: Point[] = [
                [centerX, centerY],
                points[i],
                points[next],
            ];
            const fragmentCenter = this.getCenter(triangle);

            // dirección desde el centro (explosión)
            const dirX = fragmentCenter.x - centerX;
            const dirY = fragmentCenter.y - centerY;

            fragments.push({
                points: triangle,
                center: this.getCenter(triangle),

                velocity: {
                    x: dirX * 0.9,
                    y: dirY * 0.45,
                },

                rotation: 0.8,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
            });
        }

        return fragments;
    }

    private getCenter(points: Point[]) {
        const x = points.reduce((sum, p) => sum + p[0], 0) / points.length;
        const y = points.reduce((sum, p) => sum + p[1], 0) / points.length;
        return { x, y };
    }
}