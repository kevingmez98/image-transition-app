type UpdateCallback = (progress: number) => void;

export class AnimationLoop {
    private startTime: number | null = null;
    private frameId: number | null = null;

    private duration: number;
    private onUpdate: UpdateCallback;

    constructor(duration: number, onUpdate: UpdateCallback) {
        this.duration = duration;
        this.onUpdate = onUpdate;
    }

    start() {
        this.startTime = null;
        const loop = (time: number) => {
            if (!this.startTime) this.startTime = time;

            const elapsed = time - this.startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            this.onUpdate(progress);

            if (progress < 1) {
                this.frameId = requestAnimationFrame(loop);
            }
        };

        this.frameId = requestAnimationFrame(loop);
    }

    stop() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
    }
}