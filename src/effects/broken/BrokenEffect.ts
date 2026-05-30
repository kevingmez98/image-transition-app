import type { RenderSize } from "../../types/global";
import { drawImageCover } from "../../utils/drawImageCover";
import { getCoverDrawData } from "../../utils/getCoverDrawData";
import type { Effect, EffectImages } from "../base/Effect";
import type { Fragment, Point } from "./types";

export class BrokenEffect implements Effect {
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
        // Movimiento explosivo

        const move = fragment.distance * progress;
        const moveX =
            fragment.direction.x * move;

        const moveY =
            fragment.direction.y * move;

        const angle = fragment.rotationSpeed * progress * 5;
        // 🔹 fade out
        const fadeStart = 0.82;
        const alpha =
            progress < fadeStart
                ? 1
                : 1 - (progress - fadeStart) / (1 - fadeStart);


        ctx.save();
        const { drawWidth, drawHeight, offsetX, offsetY } =
            getCoverDrawData(from, size.width, size.height);

        ctx.save();

        ctx.globalAlpha = alpha;
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

        const fragments: Fragment[] = [];

        const cols = 20; // más columnas = más triángulos
        const rows = 15;

        const cellW = width / cols;
        const cellH = height / rows;

        const points: Point[][] = [];

        // 🔹 1. Crear puntos de la grilla con jitter
        for (let y = 0; y <= rows; y++) {
            points[y] = [];

            for (let x = 0; x <= cols; x++) {
                let px = x * cellW;
                let py = y * cellH;

                // no mover bordes
                const isEdge =
                    x === 0 ||
                    y === 0 ||
                    x === cols ||
                    y === rows;

                //jitter
                if (!isEdge) {
                    px += (Math.random() - 0.5) * cellW * 0.6;
                    py += (Math.random() - 0.5) * cellH * 0.6;
                }

                points[y][x] = [px, py];
            }
        }

        const centerX = width / 2;
        const centerY = height / 2;

        // 🔹 2. Convertir cada celda en 2 triángulos
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const p1 = points[y][x];
                const p2 = points[y][x + 1];
                const p3 = points[y + 1][x];
                const p4 = points[y + 1][x + 1];

                // alternar diagonal para hacerlo más natural
                const flip = (x + y) % 2 === 0;

                const triangles: Point[][] = flip
                    ? [
                        [p1, p2, p4],
                        [p1, p4, p3],
                    ]
                    : [
                        [p1, p2, p3],
                        [p2, p4, p3],
                    ];

                triangles.forEach(triangle => {
                    const fragmentCenter = this.getCenter(triangle);

                    let dirX = fragmentCenter.x - centerX;
                    let dirY = fragmentCenter.y - centerY;

                    // normalizar dirección
                    const len =
                        Math.hypot(dirX, dirY) || 1;

                    dirX /= len;
                    dirY /= len;

                    // fuerza según distancia al centro
                    const force =
                        len*4 / Math.max(width, height);

                    fragments.push({
                        points: triangle,
                        center: fragmentCenter,
                        direction: {
                            x: dirX,
                            y: dirY
                        },
                        distance:
                            80 +
                            force * 420 +
                            Math.random() * 80,
                        velocity: {
                            x: dirX * 0.15,
                            y: dirY * 0.15,
                        },

                        rotation: 0,

                        rotationSpeed:
                            (Math.random() - 0.5) * 0.4,
                    });
                });
            }
        }

        return fragments;
    }

    private getCenter(points: Point[]) {
        const x = points.reduce((sum, p) => sum + p[0], 0) / points.length;
        const y = points.reduce((sum, p) => sum + p[1], 0) / points.length;
        return { x, y };
    }


}