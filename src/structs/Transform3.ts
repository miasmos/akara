import { Point3 } from './Point3';
import { Observer } from '../Observer';
import * as Util from '../util/Util';
import { Size3 } from './Size3';
import { Pivot2 } from './Pivot2';
import { Rotation3 } from './Rotation3';

export enum Transform3Event {
    X = 'Transform3Event.X',
    Y = 'Transform3Event.Y',
    Z = 'Transform3Event.Z',
    Width = 'Transform3Event.Width',
    Height = 'Transform3Event.Height',
    Depth = 'Transform3Event.Depth',
    ScaleX = 'Transform3Event.ScaleX',
    ScaleY = 'Transform3Event.ScaleY',
    ScaleZ = 'Transform3Event.ScaleZ',
    PivotX = 'Transform3Event.PivotX',
    PivotY = 'Transform3Event.PivotY',
    RotateX = 'Transform3Event.RotateX',
    RotateY = 'Transform3Event.RotateY',
    RotateZ = 'Transform3Event.RotateZ'
}

export interface ITransform3Config {
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    pivotX?: number;
    pivotY?: number;
}

export class Transform3 extends Observer {
    protected _size: Size3; // raw inputs from w/h/d setters
    protected _origin: Point3; // raw inputs from x/y/z setters

    public scale: Point3;
    public pivot: Pivot2;
    public size: Size3; // computed w/h/d taking into account scaling
    public origin: Point3; // computed x/y/z taking into account pivot point
    public rotation: Rotation3; // raw inputs from rx/ry/rz setters

    public constructor({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        pivotX = 0,
        pivotY = 0
    }: ITransform3Config) {
        super();
        this.rotation = new Rotation3(rotateX, rotateY, rotateZ);
        this.pivot = new Pivot2(pivotX, pivotY);
        this._origin = new Point3(x, y, z);
        this.scale = new Point3(scaleX, scaleY, scaleZ);
        this._size = new Size3(width, height, depth);
        this.size = new Size3(width * scaleX, height * scaleY, depth * scaleZ);
        this.origin = new Point3(
            x - this.size.width * this.pivot.x,
            y - this.size.height * this.pivot.y,
            z
        );
    }

    public get x(): number {
        return this._origin.x;
    }

    public set x(value: number) {
        if (value !== this._origin.x) {
            const previous = this._origin.x;
            this._origin.x = value;
            this.origin.x = this.x - this.size.width * this.pivot.x;
            this.emit(Transform3Event.X, previous);
        }
    }

    public get y(): number {
        return this._origin.y;
    }

    public set y(value: number) {
        if (value !== this._origin.y) {
            const previous = this._origin.y;
            this._origin.y = value;
            this.origin.y = this.y - this.size.height * this.pivot.y;
            this.emit(Transform3Event.Y, previous);
        }
    }

    public get z(): number {
        return this._origin.z;
    }

    public set z(value: number) {
        if (value !== this._origin.z) {
            const previous = this._origin.z;
            this._origin.z = value;
            this.emit(Transform3Event.Z, previous);
        }
    }

    public get width(): number {
        return this.size.width;
    }

    public set width(value: number) {
        if (value !== this._size.width) {
            const previous = this._size.width;
            this._size.width = value;
            this.size.width = this.scaleX * value;
            this.origin.x = this.x - this.size.width * this.pivot.x;
            this.emit(Transform3Event.Width, previous);
        }
    }

    public get height(): number {
        return this.size.height;
    }

    public set height(value: number) {
        if (value !== this._size.height) {
            const previous = this._size.height;
            this._size.height = value;
            this.size.height = this.scaleY * value;
            this.origin.y = this.y - this.size.height * this.pivot.y;
            this.emit(Transform3Event.Height, previous);
        }
    }

    public get depth(): number {
        return this._size.depth;
    }

    public set depth(value: number) {
        if (value !== this._size.depth) {
            const previous = this._size.depth;
            this._size.depth = value;
            this.size.depth = this.scaleZ * value;
            this.emit(Transform3Event.Depth, previous);
        }
    }

    public get scaleX(): number {
        return this.scale.x;
    }

    public set scaleX(value: number) {
        if (value !== this.scale.x) {
            let previous: number = this.scale.x;
            this.scale.x = value;
            this.size.width = value * this._size.width;
            this.emit(Transform3Event.ScaleX, previous);
        }
    }

    public get scaleY(): number {
        return this.scale.y;
    }

    public set scaleY(value: number) {
        if (value !== this.scale.y) {
            let previous: number = this.scale.y;
            this.scale.y = value;
            this.size.height = value * this._size.height;
            this.emit(Transform3Event.ScaleY, previous);
        }
    }

    public get scaleZ(): number {
        return this.scale.z;
    }

    public set scaleZ(value: number) {
        if (value !== this.scale.z) {
            let previous: number = this.scale.z;
            this.scale.z = value;
            this.size.depth = value * this._size.depth;
            this.emit(Transform3Event.ScaleZ, previous);
        }
    }

    public get pivotX(): number {
        return this.pivot.x;
    }

    public set pivotX(value: number) {
        if (value !== this.pivot.x) {
            let previous: number = this.pivot.x;
            this.pivot.x = value;
            this.origin.x = this.x - this.size.width * this.pivot.x;
            this.emit(Transform3Event.PivotX);
        }
    }

    public get pivotY(): number {
        return this.pivot.y;
    }

    public set pivotY(value: number) {
        if (value !== this.pivot.y) {
            let previous: number = this.pivot.y;
            this.pivot.y = value;
            this.origin.y = this.y - this.size.height * this.pivot.y;
            this.emit(Transform3Event.PivotY);
        }
    }

    public get rotateX(): number {
        return this.rotation.x;
    }

    public set rotateX(value: number) {
        if (value !== this.rotation.x) {
            this.rotation.x = value;
            this.emit(Transform3Event.RotateX);
        }
    }

    public get rotateY(): number {
        return this.rotation.y;
    }

    public set rotateY(value: number) {
        if (value !== this.rotation.y) {
            this.rotation.y = value;
            this.emit(Transform3Event.RotateY);
        }
    }

    public get rotateZ(): number {
        return this.rotation.z;
    }

    public set rotateZ(value: number) {
        if (value !== this.rotation.z) {
            this.rotation.z = value;
            this.emit(Transform3Event.RotateZ);
        }
    }

    public add(transform: Transform3): Transform3 {
        return Transform3.add(this, transform);
    }

    public static add(a: Transform3, b: Transform3): Transform3 {
        return new Transform3({
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

    public subtract(transform: Transform3): Transform3 {
        return Transform3.subtract(this, transform);
    }

    public static subtract(a: Transform3, b: Transform3): Transform3 {
        return new Transform3({
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

    public distance(transform: Transform3): Transform3 {
        return Transform3.distance(this, transform);
    }

    public static distance(a: Transform3, b: Transform3): Transform3 {
        return new Transform3({
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

    public equals(transform: Transform3): boolean {
        return Transform3.equals(this, transform);
    }

    public static equals(a: Transform3, b: Transform3): boolean {
        return (
            a._origin === b._origin &&
            a.width === b.width &&
            a.height === b.height &&
            a.depth === b.depth
        );
    }
}
