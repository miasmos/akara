import { Observer } from '../../Observer';
import { Game } from '../Game';
import { Transform3, Transform3Event } from '../../structs/Transform3';
import * as Util from '../../util/Util';
import { IEntity, EntityType, IEntityConfig, EntityEvent, Direction } from './IEntity';
import { Group } from '../Group';
import { Point3 } from '../../structs/Point3';
import { Size3 } from '../../structs/Size3';
import { ComponentManager, ComponentManagerEvent } from '../../ComponentManager';
import { TransformEvent, Transform } from '../../components/Transform';
import { Collider } from '../../components/Collider';
import { ComponentType, Component } from '../../components/Component';
import { Pivot2 } from '../../structs/Pivot2';

export class Entity extends Observer implements IEntity {
    public id: string = '';
    public type: EntityType;
    public parent: Group | undefined;
    public game: Game;
    protected _visible = true;
    protected _tag: string | undefined = '';
    protected _alpha: number = 1;
    protected _layer: number = 0;
    public components: ComponentManager = new ComponentManager();

    public constructor() {
        super();
        this.components.on(ComponentManagerEvent.Add, this.onComponentAdd.bind(this));
        this.components.on(ComponentManagerEvent.Remove, this.onComponentRemove.bind(this));
    }

    public configure({
        type = EntityType.Entity,
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        pivotX = 0,
        pivotY = 0,
        alpha = 1,
        tag,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: IEntityConfig): void {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;
        this.pivotX = pivotX;
        this.pivotY = pivotY;
        this.tag = tag;
        this.alpha = alpha;
        this.id = Util.Random.id(12);
        this.type = type;
        this.initialize({ update, preupdate, postupdate, start, destroy });
    }

    public addComponent(component: Component): boolean {
        const added = this.components.add(component);
        if (added) {
            component.attach(this);
            return true;
        } else {
            return false;
        }
    }

    public removeComponent(component: Component): boolean {
        const removed = this.components.remove(component);
        if (removed) {
            component.detach();
            return true;
        } else {
            return false;
        }
    }

    protected initialize({ update, preupdate, postupdate, start, destroy }): void {
        this.bind('update', update);
        this.bind('preupdate', preupdate);
        this.bind('postupdate', postupdate);
        this.bind('start', start);
        this.bind('destroy', destroy);
    }

    protected bind(key, fn): void {
        if (!(key in this) && typeof fn === 'function') {
            this[key] = fn.bind(this);
        }
    }

    protected call(key): void {
        if (key in this && typeof this[key] === 'function') {
            this[key]();
        }
    }

    //#region properties
    public get transform(): Transform | undefined {
        return this.components.get(ComponentType.Transform) as Transform;
    }

    public collider(): Collider | undefined {
        return this.components.get(ComponentType.Collider) as Collider;
    }

    public get moveable(): boolean {
        if (!!this.transform) {
            return this.transform.moveable;
        } else {
            return false;
        }
    }

    public get collidable(): boolean {
        if (!!this.collider) {
            return true;
        } else {
            return false;
        }
    }

    public get local(): Transform3 {
        if (!!this.transform) {
            return this.transform.local;
        } else {
            return new Transform3({});
        }
    }

    public get world(): Transform3 {
        if (!!this.transform) {
            return this.transform.world;
        } else {
            return new Transform3({});
        }
    }

    public get scale(): Point3 {
        if (!!this.transform) {
            return this.transform.scale;
        } else {
            return new Point3();
        }
    }

    public get x(): number {
        if (!!this.transform) {
            return this.transform.local.x;
        } else {
            return 0;
        }
    }

    public set x(value: number) {
        if (!!this.transform) {
            if (value !== this.transform.local.x) {
                this.transform.local.x = value;
            }
        }
    }

    public get y(): number {
        if (!!this.transform) {
            return this.transform.local.y;
        } else {
            return 0;
        }
    }

    public set y(value: number) {
        if (!!this.transform) {
            if (value !== this.transform.local.y) {
                this.transform.local.y = value;
            }
        }
    }

    public get z(): number {
        if (!!this.transform) {
            return this.transform.local.z;
        } else {
            return 0;
        }
    }

    public set z(value: number) {
        if (!!this.transform) {
            if (value !== this.transform.local.z) {
                this.transform.local.z = value;
            }
        }
    }

    public get width(): number {
        if (!!this.transform) {
            return this.transform.local.width;
        } else {
            return 0;
        }
    }

    public set width(value: number) {
        if (!!this.transform) {
            if (value !== this.transform.local.width) {
                this.transform.local.width = value;
            }
        }
    }

    public get height(): number {
        if (!!this.transform) {
            return this.transform.local.height;
        } else {
            return 0;
        }
    }

    public set height(value: number) {
        if (!!this.transform) {
            if (value !== this.transform.local.height) {
                this.transform.local.height = value;
            }
        }
    }

    public get depth(): number {
        if (!!this.transform) {
            return this.transform.local.depth;
        } else {
            return 0;
        }
    }

    public set depth(value: number) {
        if (!!this.transform) {
            if (value !== this.transform.local.depth) {
                this.transform.local.depth = value;
            }
        }
    }

    public get scaleX(): number {
        if (!!this.transform) {
            return this.transform.local.scaleX;
        } else {
            return 1;
        }
    }

    public set scaleX(value: number) {
        if (!!this.transform) {
            this.transform.local.scaleX = value;
        }
    }

    public get scaleY(): number {
        if (!!this.transform) {
            return this.transform.local.scaleY;
        } else {
            return 1;
        }
    }

    public set scaleY(value: number) {
        if (!!this.transform) {
            this.transform.local.scaleY = value;
        }
    }

    public get scaleZ(): number {
        if (!!this.transform) {
            return this.transform.local.scaleZ;
        } else {
            return 1;
        }
    }

    public set scaleZ(value: number) {
        const transform: Transform | undefined = this.components.get(
            ComponentType.Transform
        ) as Transform;

        if (!!transform) {
            transform.local.scaleZ = value;
        }
    }

    public get pivotX(): number {
        if (!!this.transform) {
            return this.transform.local.pivotX;
        } else {
            return 0;
        }
    }

    public set pivotX(value: number) {
        if (!!this.transform) {
            this.transform.local.pivotX = value;
        }
    }

    public get pivotY(): number {
        if (!!this.transform) {
            return this.transform.local.pivotY;
        } else {
            return 0;
        }
    }

    public set pivotY(value: number) {
        if (!!this.transform) {
            this.transform.local.pivotY = value;
        }
    }

    public get scaled(): Size3 {
        if (!!this.transform) {
            return this.transform.world.size;
        } else {
            return new Size3();
        }
    }

    public get visible(): boolean {
        return this._visible;
    }

    public set visible(value: boolean) {
        if (value !== this._visible) {
            const previous = this._visible;
            this._visible = value;
            this.onRenderedChange(previous);
        }
    }

    public get tag(): string | undefined {
        return this._tag;
    }

    public set tag(value: string | undefined) {
        if (
            (value !== this._tag && (typeof value === 'string' && value.length > 0)) ||
            typeof value === 'undefined'
        ) {
            let previous: string | undefined = this._tag;
            this._tag = value;
            this.onTagChange(previous);
        }
    }

    public get renderable(): boolean {
        const game = this.game;

        if (!this.transform) {
            return true;
        }

        const { x, y, width, height } = this.transform.world;

        if (!!game) {
            return !(
                x > game.width ||
                x + width < game.x ||
                y > game.height ||
                y + height < game.y
            );
        } else {
            return false;
        }
    }

    public get layer(): number {
        return this._layer;
    }

    public set layer(value: number) {
        if (this._layer !== value) {
            this._layer = value;
        }
    }

    public get alpha(): number {
        return this._alpha;
    }

    public set alpha(value: number) {
        const clamped = Util.Math.clamp(value, 0, 1);
        if (clamped !== this._alpha) {
            this._alpha = clamped;
        }
    }

    public get pivot(): Pivot2 {
        if (!!this.transform) {
            return this.transform.local.pivot;
        } else {
            return Pivot2.topLeft;
        }
    }
    //#endregion

    public get isGroup(): boolean {
        return this.type === EntityType.Group || this.type === EntityType.Scene;
    }

    public get shouldReconcile(): boolean {
        return !(this.type === EntityType.Scene || this.type === EntityType.Game);
    }

    public equals(entity: Entity): boolean {
        return entity.id === this.id && entity.type === this.type;
    }

    public reconcile(
        local: Transform3,
        origin: Entity,
        changed: Transform3Event,
        last: Entity,
        direction: Direction = Direction.Up,
        id: string
    ): void {
        if (!this.shouldReconcile) {
            return;
        }

        const transform: Transform | undefined = this.components.get(
            ComponentType.Transform
        ) as Transform;

        if (!transform) {
            return;
        }
        if (typeof this.type === 'undefined') {
            debugger;
        }

        console.log(
            Util.String.leftpad('', this.layer, '\t'),
            `c: ${EntityType[this.type]} (${this.id.slice(0, 3)})`,
            `o: ${origin.id.slice(0, 3)}`,
            `e: ${id.slice(0, 3)}`,
            changed,
            Direction[direction]
        );
        if (direction === Direction.Down) {
            switch (changed) {
                case Transform3Event.X:
                    transform.world.x = local.x + transform.local.x;
                    break;
                case Transform3Event.Y:
                    transform.world.y = local.y + transform.local.y;
                    break;
                case Transform3Event.Z:
                    transform.world.z = local.z + transform.local.z;
                    break;
            }
        } else {
            if (!!this.parent) {
                this.parent.reconcile(transform.local, origin, changed, this, Direction.Up, id);
            }
        }
    }

    //#region events
    protected onComponentAdd(type: ComponentType, component: Component): void {
        switch (type) {
            case ComponentType.Transform:
                this.onTransformAdd(component as Transform);
            case ComponentType.Collider:
                this.onColliderAdd(component as Collider);
        }
    }

    protected onComponentRemove(type: ComponentType, component: Component): void {
        switch (type) {
            case ComponentType.Transform:
                this.onTransformRemove(component as Transform);
            case ComponentType.Collider:
                this.onColliderRemove(component as Collider);
        }
    }

    protected onTransformAdd(component: Transform): void {}
    protected onColliderAdd(component: Collider): void {}

    protected onTransformRemove(component: Transform): void {}
    protected onColliderRemove(component: Collider): void {}

    public onTransformEvent(
        type: TransformEvent,
        transform: Transform,
        previous: number,
        changed: Transform3Event
    ): void {
        switch (type) {
            case TransformEvent.Transform:
                this.onTransformChange(previous, changed);
                break;
            case TransformEvent.Scale:
                this.onScaleChange(previous);
                break;
        }
    }

    protected onTransformChange(previous: number, changed: Transform3Event): void {
        const transform: Transform | undefined = this.components.get(
            ComponentType.Transform
        ) as Transform;

        if (!!transform) {
            this.reconcile(transform.local, this, changed, this, Direction.Up, Util.Random.id(12));
            this.emit(EntityEvent.Transform, this, previous, changed);
        }
    }

    protected onScaleChange(previous: number): void {
        this.emit(EntityEvent.Scale, this, previous);
    }

    protected onRenderedChange(previous: boolean): void {
        this.emit(EntityEvent.Rendered, this, previous);
    }

    protected onTagChange(previous: string | undefined): void {
        this.emit(EntityEvent.Tag, this, previous);
    }
    //#endregion
}
