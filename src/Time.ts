export class Time {
    private static instance: Time;

    public deltaTime: number = 0;
    public last: number = Date.now();

    private Time(): void {}

    public static get Instance(): Time {
        return this.instance || (this.instance = new this());
    }

    public next(timestamp: number = Date.now()): number {
        this.deltaTime = timestamp - this.last;
        this.last = timestamp;
        return timestamp;
    }
}
