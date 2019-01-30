import { Point2 } from './Point2';

export class Vector2 extends Point2 {
    public static readonly down: Vector2 = new Vector2(0, -1);
    public static readonly left: Vector2 = new Vector2(-1, 0);
    public static readonly one: Vector2 = new Vector2(1, 1);
    public static readonly right: Vector2 = new Vector2(1, 0);
    public static readonly up: Vector2 = new Vector2(0, 1);
    public static readonly zero: Vector2 = new Vector2(0, 0);

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
