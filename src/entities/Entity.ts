import { Observer } from '../Observer';
import { Game } from './Game';
import { Transform, TransformEvent } from '../structs/Transform';
import { Random } from '../util/Random';
import {
    IEntity,
    EntityType,
    IEntityConfig,
    EntityEvents as EntityEvent,
    Direction
} from './IEntity';
import { SuperGroup } from './SuperGroup';

export class Entity extends Observer implements IEntity {
    public id: string = '';
    public moveable: boolean = true;
    public collidable: boolean = true;
    public world: Transform = new Transform({});
    public readonly type: EntityType;
    protected transform: Transform = new Transform({});
    private _tag: string = '';

    public parent: SuperGroup | undefined;
    public game: Game;
    protected _visible = true;

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
        this.id = Random.id(12);
        this.type = type;

        this.transform.on(TransformEvent.X, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.X)
        );
        this.transform.on(TransformEvent.Y, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Y)
        );
        this.transform.on(TransformEvent.Z, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Z)
        );
        this.transform.on(TransformEvent.Width, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Width)
        );
        this.transform.on(TransformEvent.Height, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Height)
        );
        this.transform.on(TransformEvent.Depth, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Depth)
        );
        this.transform.on(TransformEvent.Scale, (previous: number) =>
            this.onTransformChange(previous, TransformEvent.Scale)
        );
    }

    //#region properties
    public get x(): number {
        return this.transform.x;
    }

    public set x(value: number) {
        if (value !== this.transform.x) {
            this.transform.x = value;
        }
    }

    public get y(): number {
        return this.transform.y;
    }

    public set y(value: number) {
        if (value !== this.transform.y) {
            this.transform.y = value;
        }
    }

    public get z(): number {
        return this.transform.z;
    }

    public set z(value: number) {
        if (value !== this.transform.z) {
            this.transform.z = value;
        }
    }

    public get width(): number {
        return this.transform.width;
    }

    public set width(value: number) {
        if (value !== this.transform.width) {
            this.transform.width = value;
        }
    }

    public get height(): number {
        return this.transform.height;
    }

    public set height(value: number) {
        if (value !== this.transform.height) {
            this.transform.height = value;
        }
    }

    public get depth(): number {
        return this.transform.depth;
    }

    public set depth(value: number) {
        if (value !== this.transform.depth) {
            this.transform.depth = value;
        }
    }

    public get scale(): number {
        return this.transform.scale;
    }

    public set scale(value: number) {
        if (value !== this.transform.scale) {
            this.transform.scale = value;
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
            return x > game.width || x + width < game.x || y > game.height || y + height < game.y;
        } else {
            return false;
        }
    }
    //#endregion

    public reconcile(
        transform: Transform,
        origin: Entity,
        last: Entity,
        direction: Direction = Direction.Up
    ): void {
        if (origin !== this) {
            this.world = Transform.add(this.transform, transform);
        }

        if (!!this.parent && direction === Direction.Up) {
            this.parent.reconcile(this.transform, origin, this, Direction.Up);
        }
    }

    //#region events
    protected onTransformChange(previous: number, changed: TransformEvent): void {
        this.reconcile(this.transform, this, this, Direction.Up);
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
