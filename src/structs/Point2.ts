export class Point2 {
    public x: number = 0;
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

    public add(point: Point2): Point2 {
        return Point2.add(this, point);
    }

    public static add(a: Point2, b: Point2): Point2 {
        return new Point2(a.x + b.x, a.y + b.y);
    }

    public subtract(point: Point2): Point2 {
        return Point2.subtract(this, point);
    }

    public static subtract(a: Point2, b: Point2): Point2 {
        return new Point2(a.x - b.x, a.y - b.y);
    }

    public equals(point: Point2): boolean {
        return Point2.equals(this, point);
    }

    public static equals(a: Point2, b: Point2): boolean {
        return a.x === b.x && a.y === b.y;
    }
}
