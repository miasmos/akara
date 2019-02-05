export class TimeClass {
    public deltaTime: number = 0;
    public last: number = Date.now();

    public next(timestamp: number = Date.now()): number {
        this.deltaTime = timestamp - this.last;
        this.last = timestamp;
        return timestamp;
    }
}

export const Time = new TimeClass();
