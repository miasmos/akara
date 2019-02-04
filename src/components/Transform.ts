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
    moveable?: boolean;
}

export enum TransformEvent {
    Transform = 'TransformEvent.Transform',
    Scale = 'TransformEvent.Scale'
}

export class Transform extends Component {
    public world: Transform3 = new Transform3({});
    public local: Transform3 = new Transform3({});
    public scale: Point3 = new Point3();
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
        moveable = true
    }: ITransformConfig): void {
        this.local = new Transform3({
            x,
            y,
            z,
            width,
            height,
            depth,
            scaleX,
            scaleY,
            scaleZ
        });
        this.world = Transform3.add(this.local, this.world);
        this.moveable = moveable;

        this.local.on(Transform3Event.X, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.X)
        );
        this.local.on(Transform3Event.Y, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Y)
        );
        this.local.on(Transform3Event.Z, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Z)
        );
        this.local.on(Transform3Event.Width, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Width)
        );
        this.local.on(Transform3Event.Height, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Height)
        );
        this.local.on(Transform3Event.Depth, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.Depth)
        );
        this.local.on(Transform3Event.ScaleX, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.ScaleX)
        );
        this.local.on(Transform3Event.ScaleY, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.ScaleY)
        );
        this.local.on(Transform3Event.ScaleZ, (previous: number) =>
            this.onTransformChange(previous, Transform3Event.ScaleZ)
        );
        super.configure({ type: ComponentType.Transform });
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
                this.world.width = this.local.width;
                break;
            case Transform3Event.Height:
                this.world.height = this.local.height;
                break;
            case Transform3Event.Depth:
                this.world.depth = this.local.depth;
                break;
            case Transform3Event.ScaleX:
                this.world.scaleX = this.local.scaleX;
                break;
            case Transform3Event.ScaleY:
                this.world.scaleY = this.local.scaleY;
                break;
            case Transform3Event.ScaleZ:
                this.world.scaleZ = this.local.scaleZ;
                break;
        }

        this.emit(ComponentEvent.Transform, TransformEvent.Transform, this, previous, changed);
    }

    protected onScaleChange(previous: number): void {
        this.emit(ComponentEvent.Transform, TransformEvent.Scale, this, previous);
    }
    //#endregion
}