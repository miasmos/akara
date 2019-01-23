import { Point } from './Point';

export class Vector extends Point {
    public static readonly down: Vector = new Vector(0, -1);
    public static readonly left: Vector = new Vector(-1, 0);
    public static readonly one: Vector = new Vector(1, 1);
    public static readonly right: Vector = new Vector(1, 0);
    public static readonly up: Vector = new Vector(0, 1);
    public static readonly zero: Vector = new Vector(0, 0);

    public set(x?: number, y?: number): void {
        if (typeof x !== 'undefined') {
            if (x < -1) {
                x = -1;
            } else if (x > 1) {
                x = 1;
            }
        }
        if (typeof y !== 'undefined') {
            if (y < -1) {
                y = -1;
            } else if (y > 1) {
                y = 1;
            }
        }
        super.set(x, y);
    }
}
