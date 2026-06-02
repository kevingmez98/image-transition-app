import type { RenderSize } from "../../../types/global";
import { drawImageCover } from "../../../utils/drawImageCover";
import type { Effect, EffectImages } from "../../base/Effect";


export class BattleEffect1DirectReveal implements Effect {
    private stripeCount: number = 0; // Número de lineas totales (inicializada en init segun el tamaño de barras)
    private stripeHeight = 10;
    private ctx!: CanvasRenderingContext2D;
    private from!: HTMLImageElement;
    private to!: HTMLImageElement;
    private size!: RenderSize;

    // Variables para saber hasta donde va cada fase
    private readonly FLASH_END = 0.2;
    private readonly STRIPES_END = 1;

    init(ctx: CanvasRenderingContext2D, images: EffectImages, size: RenderSize) {
        this.ctx = ctx;
        this.from = images.from;
        this.to = images.to;
        this.size = size;

        // Número de lineas o barras
        this.stripeCount = Math.ceil(
            this.size.height / this.stripeHeight
        );

    }
    render(progress: number) {

        if (progress < this.FLASH_END) {
            this.renderFlash(progress);
        }
        else if (progress <= this.STRIPES_END) {
            this.renderStripes(progress);
        }
    }

    private renderFlash(progress: number) {
        const localProgress =
            progress / this.FLASH_END;
        const alpha = // Alpha segun el progreso
            Math.pow(
                Math.abs(
                    Math.sin(localProgress * Math.PI * 2)
                ),
                2
            ) * 0.4;
        const { ctx } = this;

        ctx.clearRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        // Dibujar imagen de inicio
        drawImageCover(
            ctx,
            this.from,
            this.size.width,
            this.size.height
        );

        // Cambiar el alpha o transparencia a la dada por la función
        ctx.globalAlpha = alpha;

        ctx.fillStyle = "white";
        ctx.fillRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        ctx.globalAlpha = 1;
    }

    private renderStripes(progress: number) {
        const localProgress = // Normalizar
            (progress - this.FLASH_END) /
            (this.STRIPES_END - this.FLASH_END);
        const { ctx } = this;
        const stripeCount = Math.ceil(
            this.size.height / this.stripeHeight
        );
        // Limpiar canvas
        ctx.clearRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        // dibujar primero la imagen destino
        drawImageCover(
            ctx,
            this.to,
            this.size.width,
            this.size.height
        );


        // Recorrer cada franja y dibujarla
        for (let i = 0; i < stripeCount; i++) {

            // Posición de la franja
            const stripeY =
                i * this.stripeHeight;

            // Definir dirección a la que se irá, izq o der
            const direction =
                i % 2 === 0
                    ? -1
                    : 1;

            // Posición de la franja ssegun el progreso
            const offsetX =
                direction *
                ctx.canvas.width *
                localProgress;

            ctx.save();

            ctx.beginPath();
            ctx.rect(
                0,
                stripeY,
                ctx.canvas.width,
                this.stripeHeight
            );
            ctx.clip();

            ctx.translate(offsetX, 0);

            drawImageCover(
                ctx,
                this.from,
                this.size.width,
                this.size.height
            );

            ctx.restore();
        }
    }

}