import { Observer } from '../../Observer';
import { Game } from '../Game';
import { Transform, TransformEvent } from '../../structs/Transform';
import * as Util from '../../util/Util';
import {
    IEntity,
    EntityType,
    IEntityConfig,
    EntityEvents as EntityEvent,
    Direction
} from './IEntity';
import { SuperGroup } from '../SuperGroup';

export class Entity extends Observer implements IEntity {
    public id: string = '';
    public moveable: boolean = true;
    public collidable: boolean = true;
    public readonly type: EntityType;
    public world: Transform = new Transform({});
    public local: Transform = new Transform({});
    public parent: SuperGroup | undefined;
    public game: Game;
    protected _visible = true;
    protected _tag: string = '';
    protected _layer: number = 0;

    public constructor({
        type = EntityType.Entity,
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        scale = 1
    }: IEntityConfig) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.scale = scale;
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
        this.local.on(TransformEvent.Scale, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Scale)
        );
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

    public get scale(): number {
        return this.local.scale;
    }

    public set scale(value: number) {
        if (value !== this.local.scale) {
            this.local.scale = value;
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

    public get tag(): string {
        return this._tag;
    }

    public set tag(value: string) {
        if (value !== this._tag && value.length > 0) {
            let previous: string = this._tag;
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
    //#endregion

    protected get isGroup(): boolean {
        return this.type === EntityType.Group || this.type === EntityType.Scene;
    }

    protected get shouldReconcile(): boolean {
        return !(this.type === EntityType.Scene || this.type === EntityType.Game);
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
        }

        switch (changed) {
            case TransformEvent.X:
            case TransformEvent.Y:
            case TransformEvent.Z:
                this.reconcile(this.local, this, changed, this, Direction.Down, Util.Random.id(12));
            case TransformEvent.Width:
            case TransformEvent.Height:
            case TransformEvent.Depth:
                this.reconcile(this.local, this, changed, this, Direction.Up, Util.Random.id(12));
        }
        this.emit(EntityEvent.Transform, this, previous, changed);
    }

    protected onRenderedChange(previous: boolean): void {
        this.emit(EntityEvent.Rendered, this, previous);
    }

    protected onTagChange(previous: string): void {
        this.emit(EntityEvent.Tag, this, previous);
    }
    //#endregion
}
