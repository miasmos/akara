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
    protected _rawSize: Size3; // raw inputs from w/h/d setters
    protected _rawOrigin: Point3; // raw inputs from x/y/z setters

    public _scale: Point3;
    public _pivot: Pivot2;
    public _size: Size3; // computed w/h/d taking into account scaling
    public _origin: Point3; // computed x/y/z taking into account pivot point
    public _rotation: Rotation3; // raw inputs from rx/ry/rz setters

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
        this._rotation = new Rotation3(rotateX, rotateY, rotateZ);
        this._pivot = new Pivot2(pivotX, pivotY);
        this._rawOrigin = new Point3(x, y, z);
        this._scale = new Point3(scaleX, scaleY, scaleZ);
        this._rawSize = new Size3(width, height, depth);
        this._size = new Size3(width * scaleX, height * scaleY, depth * scaleZ);
        this._origin = new Point3(
            x - this.size.width * this.pivot.x,
            y - this.size.height * this.pivot.y,
            z
        );
    }

    public get rotation(): Point3 {
        return this._rotation;
    }

    public set rotation(value: Point3) {
        this.rotateX = value.x;
        this.rotateY = value.y;
        this.rotateZ = value.z;
    }

    public get origin(): Point3 {
        return this._origin;
    }

    public set origin(value: Point3) {
        this.x = value.x;
        this.y = value.y;
        this.z = value.z;
    }

    public get size(): Size3 {
        return this._size;
    }

    public set size(value: Size3) {
        this.width = value.width;
        this.height = value.height;
        this.depth = value.depth;
    }

    public get pivot(): Pivot2 {
        return this._pivot;
    }

    public set pivot(value: Pivot2) {
        this.pivotX = value.x;
        this.pivotY = value.y;
    }

    public get scale(): Point3 {
        return this._scale;
    }

    public set scale(value: Point3) {
        this.scaleX = value.x;
        this.scaleY = value.y;
    }

    public get x(): number {
        return this._rawOrigin.x;
    }

    public set x(value: number) {
        if (value !== this._rawOrigin.x) {
            const previous = this._rawOrigin.x;
            this._rawOrigin.x = value;
            this._origin.x = this.x;
            this.emit(Transform3Event.X, previous);
        }
    }

    public get y(): number {
        return this._rawOrigin.y;
    }

    public set y(value: number) {
        if (value !== this._rawOrigin.y) {
            const previous = this._rawOrigin.y;
            this._rawOrigin.y = value;
            this._origin.y = this.y;
            this.emit(Transform3Event.Y, previous);
        }
    }

    public get z(): number {
        return this._rawOrigin.z;
    }

    public set z(value: number) {
        if (value !== this._rawOrigin.z) {
            const previous = this._rawOrigin.z;
            this._rawOrigin.z = value;
            this.emit(Transform3Event.Z, previous);
        }
    }

    public get width(): number {
        return this._size.width;
    }

    public set width(value: number) {
        if (value !== this._rawSize.width) {
            const previous = this._rawSize.width;
            this._rawSize.width = value;
            this._size.width = this.scaleX * value;
            this._origin.x = this.x;
            this.emit(Transform3Event.Width, previous);
        }
    }

    public get height(): number {
        return this._size.height;
    }

    public set height(value: number) {
        if (value !== this._rawSize.height) {
            const previous = this._rawSize.height;
            this._rawSize.height = value;
            this._size.height = this.scaleY * value;
            this._origin.y = this.y;
            this.emit(Transform3Event.Height, previous);
        }
    }

    public get depth(): number {
        return this._rawSize.depth;
    }

    public set depth(value: number) {
        if (value !== this._rawSize.depth) {
            const previous = this._rawSize.depth;
            this._rawSize.depth = value;
            this._size.depth = this.scaleZ * value;
            this.emit(Transform3Event.Depth, previous);
        }
    }

    public get scaleX(): number {
        return this._scale.x;
    }

    public set scaleX(value: number) {
        if (value !== this._scale.x) {
            let previous: number = this._scale.x;
            this._scale.x = value;
            this._size.width = value * this._rawSize.width;
            this._origin.x = this.x;
            this.emit(Transform3Event.ScaleX, previous);
        }
    }

    public get scaleY(): number {
        return this._scale.y;
    }

    public set scaleY(value: number) {
        if (value !== this._scale.y) {
            let previous: number = this._scale.y;
            this._scale.y = value;
            this._size.height = value * this._rawSize.height;
            this._origin.y = this.y;
            this.emit(Transform3Event.ScaleY, previous);
        }
    }

    public get scaleZ(): number {
        return this._scale.z;
    }

    public set scaleZ(value: number) {
        if (value !== this._scale.z) {
            let previous: number = this._scale.z;
            this._scale.z = value;
            this._size.depth = value * this._rawSize.depth;
            this.emit(Transform3Event.ScaleZ, previous);
        }
    }

    public get pivotX(): number {
        return this._pivot.x;
    }

    public set pivotX(value: number) {
        if (value !== this._pivot.x) {
            let previous: number = this._pivot.x;
            this._pivot.x = value;
            this._origin.x = this.x;
            this.emit(Transform3Event.PivotX, previous);
        }
    }

    public get pivotY(): number {
        return this._pivot.y;
    }

    public set pivotY(value: number) {
        if (value !== this._pivot.y) {
            let previous: number = this._pivot.y;
            this._pivot.y = value;
            this._origin.y = this.y;
            this.emit(Transform3Event.PivotY, previous);
        }
    }

    public get rotateX(): number {
        return this.rotation.x;
    }

    public set rotateX(value: number) {
        if (value !== this.rotation.x) {
            let previous: number = this.rotation.x;
            this.rotation.x = value;
            this.emit(Transform3Event.RotateX, previous);
        }
    }

    public get rotateY(): number {
        return this.rotation.y;
    }

    public set rotateY(value: number) {
        if (value !== this.rotation.y) {
            let previous: number = this.rotation.y;
            this.rotation.y = value;
            this.emit(Transform3Event.RotateY, previous);
        }
    }

    public get rotateZ(): number {
        return this.rotation.z;
    }

    public set rotateZ(value: number) {
        if (value !== this.rotation.z) {
            let previous: number = this.rotation.z;
            this.rotation.z = value;
            this.emit(Transform3Event.RotateZ, previous);
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
            a._rawOrigin === b._rawOrigin &&
            a.width === b.width &&
            a.height === b.height &&
            a.depth === b.depth
        );
    }
}
