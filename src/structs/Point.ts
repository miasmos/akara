export class Point {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    public constructor(x?: number, y?: number, z?: number) {
        this.set(x, y, z);
    }

    public set(x?: number, y?: number, z?: number): void {
        if (typeof x !== 'undefined') {
            this.x = x;
        }
        if (typeof y !== 'undefined') {
            this.y = y;
        }
        if (typeof z !== 'undefined') {
            this.z = z;
        }
    }

    public add(point: Point): Point {
        return Point.add(this, point);
    }

    public static add(a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public subtract(point: Point): Point {
        return Point.subtract(this, point);
    }

    public static subtract(a: Point, b: Point): Point {
        return new Point(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public equals(point: Point): boolean {
        return Point.equals(this, point);
    }

    public static equals(a: Point, b: Point): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
}
