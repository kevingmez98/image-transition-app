import type { Effect, EffectImages } from '../base/Effect';

export class ZoomEffect implements Effect {
    // Contexto del canvas (donde se dibuja)
    private ctx!: CanvasRenderingContext2D;
    // Imagen inicial (la que se va)
    private from!: HTMLImageElement;
    // Imagen final (la que entra)
    private to!: HTMLImageElement;

    // Se inicializa el efecto con el contexto y las imágenes
    init(ctx: CanvasRenderingContext2D, images: EffectImages) {
        this.ctx = ctx;
        this.from = images.from;
        this.to = images.to;
    }
    // Este método se llama en cada frame de la animación
    // progress va de 0 a 1
    render(progress: number) {
        const { ctx, from, to } = this;
        const { width, height } = ctx.canvas;
        // Limpia el canvas antes de dibujar el siguiente frame
        ctx.clearRect(0, 0, width, height);

        // Empieza en escala 1 y reduce hasta 0.7
        const scaleFrom = 1 - progress * 0.3;

        ctx.save();  // Guarda el estado actual del contexto 
        // Mueve el origen al centro del canvas
        ctx.translate(width / 2, height / 2);
        // Aplica el zoom (escala)
        ctx.scale(scaleFrom, scaleFrom);
        // Dibuja la imagen centrada
        ctx.drawImage(from, -width / 2, -height / 2, width, height);
        // Restaura el estado original
        ctx.restore();

        // Zoom in de la imagen final
        // Empieza en 1.3 (más grande) y baja hasta 1
        const scaleTo = 1.3 - progress * 0.3;

        ctx.save();
        // Hace fade-in (de transparente a visible)
        ctx.globalAlpha = progress;
        // Mueve el origen al centro
        ctx.translate(width / 2, height / 2);
        // Aplica zoom
        ctx.scale(scaleTo, scaleTo);
        // Dibuja la imagen centrada
        ctx.drawImage(to, width / 2, -height / 2, -width, height);
        ctx.restore();
        // Resetea la opacidad
        ctx.globalAlpha = 1;
    }
}