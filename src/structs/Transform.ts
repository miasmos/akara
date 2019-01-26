import { Point } from './Point';

export class Transform {
    public scale: number = 1;
    public width: number = 0;
    public height: number = 0;
    private point: Point = new Point();

    public get x(): number {
        return this.point.x;
    }

    public set x(value: number) {
        this.point.x = value;
    }

    public get y(): number {
        return this.point.y;
    }

    public set y(value: number) {
        this.point.y = value;
    }
}
