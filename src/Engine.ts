import { Entity } from './entities';
import { Time } from './Time';

export class Engine {
    public readonly fps: number = 60;
    public started: boolean = false;
    private entities: Entity[] = [];
    private time: Time = Time.Instance;

    private frameTime: number = 0;
    private intervals = {
        frame: undefined as number | undefined
    };

    public Engine(fps: number = 60): void {
        this.frameTime = 1 / fps;
    }

    public start(): void {
        if (!this.started) {
            this.intervals.frame = window.setInterval(this.frame.bind(this), this.fps);
            this.started = true;
        }
    }

    public stop(): void {
        if (this.started) {
            clearInterval(this.intervals.frame);
            this.intervals.frame = undefined;
        }
    }

    public frame(): void {
        this.time.next();
        console.log(this.time.deltaTime);
    }
}
