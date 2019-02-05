import { Component, ComponentEvent, ComponentType, IComponentConfig } from './Component';
import { Point3 } from '../structs/Point3';
import { Transform3, Transform3Event } from '../structs/Transform3';
import { Entity } from '../entities';

export interface ITransformConfig extends IComponentConfig {
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    pivotX?: number;
    pivotY?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    moveable?: boolean;
}

export enum TransformEvent {
    Transform = 'TransformEvent.Transform',
    Scale = 'TransformEvent.Scale'
}

export class Transform extends Component {
    protected _world: Transform3 = new Transform3({});
    protected _local: Transform3 = new Transform3({});
    protected _scale: Point3 = new Point3();
    public moveable: boolean = true;

    public configure({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        pivotX = 0,
        pivotY = 0,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        moveable = true
    }: ITransformConfig): void {
        this._local = new Transform3({
            x,
            y,
            z,
            width,
            height,
            depth,
            pivotX,
            pivotY,
            scaleX,
            scaleY,
            scaleZ,
            rotateX,
            rotateY,
            rotateZ
        });
        this._world = Transform3.add(this._local, this._world);
        this.moveable = moveable;

        this._local.on(Transform3Event.X, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.X)
        );
        this._local.on(Transform3Event.Y, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Y)
        );
        this._local.on(Transform3Event.Z, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Z)
        );
        this._local.on(Transform3Event.Width, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Width)
        );
        this._local.on(Transform3Event.Height, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Height)
        );
        this._local.on(Transform3Event.Depth, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Depth)
        );
        this._local.on(Transform3Event.ScaleX, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.ScaleX)
        );
        this._local.on(Transform3Event.ScaleY, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.ScaleY)
        );
        this._local.on(Transform3Event.ScaleZ, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.ScaleZ)
        );
        this._local.on(Transform3Event.PivotX, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.PivotX)
        );
        this._local.on(Transform3Event.PivotY, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.PivotY)
        );
        this._local.on(Transform3Event.RotateX, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.RotateX)
        );
        this._local.on(Transform3Event.RotateY, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.RotateY)
        );
        this._local.on(Transform3Event.RotateZ, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.RotateZ)
        );
        super.configure({ type: ComponentType.Transform });
    }

    public get world(): Transform3 {
        return this._world;
    }

    public set world(value: Transform3) {
        this._world.x = value.x;
        this._world.y = value.y;
        this._world.z = value.z;
    }

    public get local(): Transform3 {
        return this._local;
    }

    public set local(value: Transform3) {
        this._local.x = value.x;
        this._local.y = value.y;
        this._local.z = value.z;
    }

    public get scale(): Point3 {
        return this._scale;
    }

    public set scale(value: Point3) {
        this._scale.x = value.x;
        this._scale.y = value.y;
        this._scale.z = value.z;
    }

    public attach(entity: Entity): void {
        this.detach();
        this.on(ComponentEvent.Transform, entity.onTransformEvent.bind(entity));
        super.attach(entity);
    }

    public detach(): void {
        if (!!this.parent) {
            this.off(ComponentEvent.Transform, this.parent.onTransformEvent.bind(this.parent));
        }
        super.detach();
    }

    //#region events
    public onTransformChange(previous: number, changed: Transform3Event): void {
        switch (changed) {
            case Transform3Event.Width:
                this._world.width = this._local.width;
                break;
            case Transform3Event.Height:
                this._world.height = this._local.height;
                break;
            case Transform3Event.Depth:
                this._world.depth = this._local.depth;
                break;
            case Transform3Event.ScaleX:
                this._world.scaleX = this._local.scaleX;
                break;
            case Transform3Event.ScaleY:
                this._world.scaleY = this._local.scaleY;
                break;
            case Transform3Event.ScaleZ:
                this._world.scaleZ = this._local.scaleZ;
                break;
            case Transform3Event.PivotX:
                this._world.pivotX = this._local.pivotX;
                break;
            case Transform3Event.PivotY:
                this._world.pivotY = this._local.pivotY;
                break;
            case Transform3Event.RotateX:
                this._world.rotateX = this._local.rotateX;
                break;
            case Transform3Event.RotateY:
                this._world.rotateY = this._local.rotateY;
                break;
            case Transform3Event.RotateZ:
                this._world.rotateZ = this._local.rotateZ;
                break;
        }

        this.emit(ComponentEvent.Transform, TransformEvent.Transform, this, previous, changed);
    }

    protected onScaleChange(previous: number): void {
        this.emit(ComponentEvent.Transform, TransformEvent.Scale, this, previous);
    }
    //#endregion
}
