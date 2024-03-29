import { Point3 } from './Point3';

export class Rotation3 extends Point3 {
    public set(x?: number, y?: number, z?: number): void {
        if (typeof x !== 'undefined') {
            if (Math.abs(x) > 360) {
                this.x = x % 360;
            } else {
                this.x = x;
            }
        }
        if (typeof y !== 'undefined') {
            if (Math.abs(y) > 360) {
                this.y = y % 360;
            } else {
                this.y = y;
            }
        }
        if (typeof z !== 'undefined') {
            if (Math.abs(z) > 360) {
                this.z = z % 360;
            } else {
                this.z = z;
            }
        }
    }

    public add(rotation: Rotation3): Rotation3 {
        return Rotation3.add(this, rotation);
    }

    public static add(a: Rotation3, b: Rotation3): Rotation3 {
        return new Rotation3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public subtract(rotation: Rotation3): Rotation3 {
        return Rotation3.subtract(this, rotation);
    }

    public static subtract(a: Rotation3, b: Rotation3): Rotation3 {
        return new Rotation3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public equals(rotation: Rotation3): boolean {
        return Rotation3.equals(this, rotation);
    }

    public static equals(a: Rotation3, b: Rotation3): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
}
