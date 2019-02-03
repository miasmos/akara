import { Observer } from '../../Observer';
import { Game } from '../Game';
import { Transform, TransformEvent } from '../../structs/Transform';
import * as Util from '../../util/Util';
import { IEntity, EntityType, IEntityConfig, EntityEvent, Direction } from './IEntity';
import { SuperGroup } from '../SuperGroup';
import { Point3 } from '../../structs/Point3';
import { Size3 } from '../../structs/Size3';

export class Entity extends Observer implements IEntity {
    public id: string = '';
    public moveable: boolean = true;
    public collidable: boolean = true;
    public readonly type: EntityType;
    public world: Transform = new Transform({});
    public local: Transform = new Transform({});
    public scale: Point3 = new Point3();
    public parent: SuperGroup | undefined;
    public game: Game;
    protected _visible = true;
    protected _tag: string | undefined = '';
    protected _alpha: number = 1;
    protected _layer: number = 0;

    public constructor({
        type = EntityType.Entity,
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        alpha = 1,
        tag,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: IEntityConfig) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;
        this.tag = tag;
        this.alpha = alpha;
        this.world = Transform.add(this.local, this.world);
        this.id = Util.Random.id(12);
        this.type = type;

        this.local.on(TransformEvent.X, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.X)
        );
        this.local.on(TransformEvent.Y, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Y)
        );
        this.local.on(TransformEvent.Z, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Z)
        );
        this.local.on(TransformEvent.Width, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Width)
        );
        this.local.on(TransformEvent.Height, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Height)
        );
        this.local.on(TransformEvent.Depth, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Depth)
        );
        this.local.on(TransformEvent.ScaleX, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.ScaleX)
        );
        this.local.on(TransformEvent.ScaleY, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.ScaleY)
        );
        this.local.on(TransformEvent.ScaleZ, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.ScaleZ)
        );
        this.initialize({ update, preupdate, postupdate, start, destroy });
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
    public get x(): number {
        return this.local.x;
    }

    public set x(value: number) {
        if (value !== this.local.x) {
            this.local.x = value;
        }
    }

    public get y(): number {
        return this.local.y;
    }

    public set y(value: number) {
        if (value !== this.local.y) {
            this.local.y = value;
        }
    }

    public get z(): number {
        return this.local.z;
    }

    public set z(value: number) {
        if (value !== this.local.z) {
            this.local.z = value;
        }
    }

    public get width(): number {
        return this.local.width;
    }

    public set width(value: number) {
        if (value !== this.local.width) {
            this.local.width = value;
        }
    }

    public get height(): number {
        return this.local.height;
    }

    public set height(value: number) {
        if (value !== this.local.height) {
            this.local.height = value;
        }
    }

    public get depth(): number {
        return this.local.depth;
    }

    public set depth(value: number) {
        if (value !== this.local.depth) {
            this.local.depth = value;
        }
    }

    public get scaleX(): number {
        return this.local.scaleX;
    }

    public set scaleX(value: number) {
        this.local.scaleX = value;
    }

    public get scaleY(): number {
        return this.local.scaleY;
    }

    public set scaleY(value: number) {
        this.local.scaleY = value;
    }

    public get scaleZ(): number {
        return this.local.scaleZ;
    }

    public set scaleZ(value: number) {
        this.local.scaleZ = value;
    }

    public get scaled(): Size3 {
        return this.world.scaled;
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
        const { x, y, width, height } = this.world;

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
        if (value < 0) {
            value = 0;
        } else if (value > 1) {
            value = 1;
        }
        if (value !== this._alpha) {
            this._alpha = value;
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
        transform: Transform,
        origin: Entity,
        changed: TransformEvent,
        last: Entity,
        direction: Direction = Direction.Up,
        id: string
    ): void {
        if (!this.shouldReconcile) {
            return;
        }

        console.log(
            Util.String.leftpad('', this.layer, '\t'),
            `c: ${EntityType[this.type]} (${this.id.slice(0, 3)})`,
            `o: ${origin.id.slice(0, 3)}`,
            `e: ${id.slice(0, 3)}`,
            TransformEvent[changed],
            Direction[direction]
        );
        if (direction === Direction.Down) {
            switch (changed) {
                case TransformEvent.X:
                    this.world.x = transform.x + this.local.x;
                    break;
                case TransformEvent.Y:
                    this.world.y = transform.y + this.local.y;
                    break;
                case TransformEvent.Z:
                    this.world.z = transform.z + this.local.z;
                    break;
            }
        } else {
            if (!!this.parent) {
                this.parent.reconcile(this.local, origin, changed, this, Direction.Up, id);
            }
        }
    }

    //#region events
    protected onTransformChange(previous: number, changed: TransformEvent): void {
        switch (changed) {
            case TransformEvent.Width:
                this.world.width = this.local.width;
                break;
            case TransformEvent.Height:
                this.world.height = this.local.height;
                break;
            case TransformEvent.Depth:
                this.world.depth = this.local.depth;
                break;
            case TransformEvent.ScaleX:
                this.world.scaleX = this.local.scaleX;
                break;
            case TransformEvent.ScaleY:
                this.world.scaleY = this.local.scaleY;
                break;
            case TransformEvent.ScaleZ:
                this.world.scaleZ = this.local.scaleZ;
                break;
        }

        this.reconcile(this.local, this, changed, this, Direction.Up, Util.Random.id(12));
        this.emit(EntityEvent.Transform, this, previous, changed);
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
