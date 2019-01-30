export class Point3 {
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

    public add(point: Point3): Point3 {
        return Point3.add(this, point);
    }

    public static add(a: Point3, b: Point3): Point3 {
        return new Point3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public subtract(point: Point3): Point3 {
        return Point3.subtract(this, point);
    }

    public static subtract(a: Point3, b: Point3): Point3 {
        return new Point3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public equals(point: Point3): boolean {
        return Point3.equals(this, point);
    }

    public static equals(a: Point3, b: Point3): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
}
