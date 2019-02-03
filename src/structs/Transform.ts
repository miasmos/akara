import { Point3 } from './Point3';
import { Observer } from '../Observer';
import * as Util from '../util/Util';
import { Size3 } from './Size3';

export enum TransformEvent {
    X,
    Y,
    Z,
    Width,
    Height,
    Depth,
    ScaleX,
    ScaleY,
    ScaleZ
}

export interface ITransformConfig {
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
}

export class Transform extends Observer {
    public scaled: Size3;
    protected size: Size3;
    protected point: Point3;
    protected scale: Point3;

    public constructor({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1
    }: ITransformConfig) {
        super();
        this.point = new Point3(x, y, z);
        this.scale = new Point3(scaleX, scaleY, scaleZ);
        this.size = new Size3(width, height, depth);
        this.scaled = new Size3(width * scaleX, height * scaleY, depth * scaleZ);
    }

    public get x(): number {
        return this.point.x;
    }

    public set x(value: number) {
        if (value !== this.point.x) {
            const previous = this.point.x;
            this.point.x = value;
            this.emit(TransformEvent.X, previous);
        }
    }

    public get y(): number {
        return this.point.y;
    }

    public set y(value: number) {
        if (value !== this.point.y) {
            const previous = this.point.y;
            this.point.y = value;
            this.emit(TransformEvent.Y, previous);
        }
    }

    public get z(): number {
        return this.point.z;
    }

    public set z(value: number) {
        if (value !== this.point.z) {
            const previous = this.point.z;
            this.point.z = value;
            this.emit(TransformEvent.Z, previous);
        }
    }

    public get width(): number {
        return this.scaled.width;
    }

    public set width(value: number) {
        if (value !== this.size.width) {
            const previous = this.size.width;
            this.size.width = value;
            this.scaled.width = this.scaleX * value;
            this.emit(TransformEvent.Width, previous);
        }
    }

    public get height(): number {
        return this.scaled.height;
    }

    public set height(value: number) {
        if (value !== this.size.height) {
            const previous = this.size.height;
            this.size.height = value;
            this.scaled.height = this.scaleY * value;
            this.emit(TransformEvent.Height, previous);
        }
    }

    public get depth(): number {
        return this.size.depth;
    }

    public set depth(value: number) {
        if (value !== this.size.depth) {
            const previous = this.size.depth;
            this.size.depth = value;
            this.scaled.depth = this.scaleZ * value;
            this.emit(TransformEvent.Depth, previous);
        }
    }

    public get scaleX(): number {
        return this.scale.x;
    }

    public set scaleX(value: number) {
        if (value !== this.scale.x) {
            let previous: number = this.scale.x;
            this.scale.x = value;
            this.scaled.width = value * this.size.width;
            this.emit(TransformEvent.ScaleX, previous);
        }
    }

    public get scaleY(): number {
        return this.scale.y;
    }

    public set scaleY(value: number) {
        if (value !== this.scale.y) {
            let previous: number = this.scale.y;
            this.scale.y = value;
            this.scaled.height = value * this.size.height;
            this.emit(TransformEvent.ScaleY, previous);
        }
    }

    public get scaleZ(): number {
        return this.scale.z;
    }

    public set scaleZ(value: number) {
        if (value !== this.scale.z) {
            let previous: number = this.scale.z;
            this.scale.z = value;
            this.scaled.depth = value * this.size.depth;
            this.emit(TransformEvent.ScaleZ, previous);
        }
    }

    public add(transform: Transform): Transform {
        return Transform.add(this, transform);
    }

    public static add(a: Transform, b: Transform): Transform {
        return new Transform({
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z,
            width: a.width + b.width,
            height: a.height + b.height,
            depth: a.depth + b.depth,
            scaleX: a.scale.x,
            scaleY: a.scale.y,
            scaleZ: a.scale.z
        });
    }

    public subtract(transform: Transform): Transform {
        return Transform.subtract(this, transform);
    }

    public static subtract(a: Transform, b: Transform): Transform {
        return new Transform({
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z,
            width: a.width - b.width,
            height: a.height - b.height,
            depth: a.depth - b.depth,
            scaleX: a.scale.x,
            scaleY: a.scale.y,
            scaleZ: a.scale.z
        });
    }

    public distance(transform: Transform): Transform {
        return Transform.distance(this, transform);
    }

    public static distance(a: Transform, b: Transform): Transform {
        return new Transform({
            x: Util.Math.distance(a.x, b.x),
            y: Util.Math.distance(a.y, b.y),
            z: Util.Math.distance(a.z, b.z),
            width: Util.Math.distance(a.width, b.width),
            height: Util.Math.distance(a.height, b.height),
            depth: Util.Math.distance(a.depth, b.depth),
            scaleX: a.scale.x,
            scaleY: a.scale.y,
            scaleZ: a.scale.z
        });
    }

    public equals(transform: Transform): boolean {
        return Transform.equals(this, transform);
    }

    public static equals(a: Transform, b: Transform): boolean {
        return (
            a.point === b.point &&
            a.width === b.width &&
            a.height === b.height &&
            a.depth === b.depth
        );
    }
}
