import { observable } from 'mobx';

export class Point {
    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    public constructor(x?: number, y?: number) {
        this.set(x, y);
    }

    public set(x?: number, y?: number): void {
        if (typeof x !== 'undefined') {
            this.x = x;
        }
        if (typeof y !== 'undefined') {
            this.y = y;
        }
    }

    public equals(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }

    public add(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y);
    }

    public subtract(point: Point): Point {
        return new Point(this.x - point.x, this.y - point.y);
    }

    public static distance(a: Point, b: Point): Point {
        return new Point(a.x - b.x, a.y - b.y);
    }
}
