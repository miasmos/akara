import { observable, computed } from 'mobx';

export class Vector {
    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    public static down: Vector = new Vector(0, -1);
    public static left: Vector = new Vector(-1, 0);
    public static one: Vector = new Vector(1, 1);
    public static right: Vector = new Vector(1, 0);
    public static up: Vector = new Vector(0, 1);
    public static zero: Vector = new Vector(0, 0);

    public constructor(x?: number, y?: number) {
        this.set(x, y);
    }

    public set(x?: number, y?: number) {
        if (typeof x !== 'undefined') {
            if (x < -1) {
                x = -1;
            } else if (x > 1) {
                x = 1;
            }

            this.x = x;
        }
        if (typeof y !== 'undefined') {
            if (y < -1) {
                y = -1;
            } else if (y > 1) {
                y = 1;
            }

            this.y = y;
        }
    }

    public equals(vector: Vector) {
        return this.x === vector.x && this.y === vector.y;
    }

    public add(vector: Vector) {
        this.set(this.x + vector.x, this.y + vector.y);
    }

    public subtract(vector: Vector) {
        this.set(this.x - vector.x, this.y - vector.y);
    }

    public static distance(a: Vector, b: Vector) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
}
