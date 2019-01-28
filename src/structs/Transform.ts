import { Point } from './Point';
import { Observer } from '../Observer';

export enum TransformEvent {
    X,
    Y,
    Z,
    Width,
    Height,
    Depth,
    Scale
}

export interface ITransformConfig {
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    scale?: number;
}

export class Transform extends Observer {
    private _scale: number = 1;
    private _width: number = 0;
    private _height: number = 0;
    private _depth: number = 0;
    protected point: Point = new Point();

    public constructor({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scale = 1
    }: ITransformConfig) {
        super();
        this.point = new Point(x, y, z);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.scale = scale;
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
        return this._width;
    }

    public set width(value: number) {
        if (value !== this._width) {
            const previous = this._width;
            this._width = value;
            this.emit(TransformEvent.Width, previous);
        }
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        if (value !== this._height) {
            const previous = this._height;
            this._height = value;
            this.emit(TransformEvent.Height, previous);
        }
    }

    public get depth(): number {
        return this._depth;
    }

    public set depth(value: number) {
        if (value !== this._depth) {
            const previous = this._depth;
            this._depth = value;
            this.emit(TransformEvent.Depth, previous);
        }
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(value: number) {
        if (value !== this._scale) {
            const previous = this._scale;
            this._scale = value;
            this.emit(TransformEvent.Scale, previous);
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
            scale: a.scale
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
            scale: a.scale
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
