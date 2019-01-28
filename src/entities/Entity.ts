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
import { Debug } from '../util/Debug';

export class Entity extends Observer implements IEntity {
    public id: string = '';
    public moveable: boolean = true;
    public collidable: boolean = true;
    public world: Transform = new Transform();
    public readonly type: EntityType;
    protected transform: Transform = new Transform();
    private _tag: string = '';
    private _layer: number = 1;

    public parent: SuperGroup | undefined;
    public game: Game;
    protected _visible = true;

    public constructor({
        type = EntityType.Entity,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        scale = 1,
        layer = 1
    }: IEntityConfig) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.id = Random.id(12);
        this.type = type;
        this.layer = layer;

        this.transform.on(TransformEvent.X, this.onTransformChange.bind(this, TransformEvent.X));
        this.transform.on(TransformEvent.Y, this.onTransformChange.bind(this, TransformEvent.Y));
        this.transform.on(
            TransformEvent.Width,
            this.onTransformChange.bind(this, TransformEvent.Width)
        );
        this.transform.on(
            TransformEvent.Height,
            this.onTransformChange.bind(this, TransformEvent.Height)
        );
    }

    //#region properties
    public get x(): number {
        return this.transform.x;
    }

    public set x(value: number) {
        if (value !== this.transform.x) {
            this.transform.x = value;
            this.onTransformChange();
        }
    }

    public get y(): number {
        return this.transform.y;
    }

    public set y(value: number) {
        if (value !== this.transform.y) {
            this.transform.y = value;
            this.onTransformChange();
        }
    }

    public get width(): number {
        return this.transform.width;
    }

    public set width(value: number) {
        if (value !== this.transform.width) {
            this.transform.width = value;
            this.onTransformChange();
        }
    }

    public get height(): number {
        return this.transform.height;
    }

    public set height(value: number) {
        if (value !== this.transform.height) {
            this.transform.height = value;
            this.onTransformChange();
        }
    }

    public get scale(): number {
        return this.transform.scale;
    }

    public set scale(value: number) {
        if (value !== this.transform.scale) {
            this.transform.scale = value;
            this.onTransformChange();
        }
    }

    public get visible(): boolean {
        return this._visible;
    }

    public set visible(value: boolean) {
        if (value !== this._visible) {
            this._visible = value;
            this.onRenderedChange();
        }
    }

    public get layer(): number {
        return this._layer;
    }

    public set layer(value: number) {
        if (this._layer !== value) {
            const previous = this._layer;
            this._layer = value;
            this.onLayerChange(previous);
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
        x: number,
        y: number,
        width: number,
        height: number,
        origin: Entity,
        direction: Direction = Direction.Up
    ): void {
        if (origin !== this) {
            this.world.x = x + this.x;
            this.world.y = y + this.y;
            this.world.width = width + this.width;
            this.world.height = height + this.height;
        }

        if (!!this.parent && direction === Direction.Up) {
            this.parent.reconcile(this.x, this.y, this.width, this.height, this, Direction.Up);
        }
    }

    //#region events
    protected onTransformChange(): void {
        this.reconcile(this.x, this.y, this.width, this.height, this, Direction.Up);
    }

    protected onRenderedChange(): void {
        this.emit(EntityEvent.Rendered, this);
    }

    protected onTagChange(previous: string): void {
        this.emit(EntityEvent.Tag, this, previous);
    }

    protected onLayerChange(previous: number): void {
        Debug.log(this.id, previous.toString(), this.layer.toString());
        this.emit(EntityEvent.Layer, this, previous);
    }
    //#endregion
}
