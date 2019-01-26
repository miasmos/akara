import { Observer } from '../Observer';
import { Game } from './Game';
import { Transform } from '../structs/Transform';
import { Array as ArrayUtil, SortOrder } from '../util/Array';

export enum EntityEvents {
    Rendered
}

export enum EntityTypes {
    Sprite,
    Text,
    Box
}

interface IChildren {
    [key: string]: Entity;
}

export interface IEntityConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scale?: number;
}

export class Entity extends Observer {
    public id: string = '';
    public moveable: boolean = true;
    public collidable: boolean = true;
    public world: Transform = new Transform();
    private transform: Transform = new Transform();

    public parent: Entity | undefined;
    public children: Entity[];
    public layer: number = 0;
    public game: Game;
    private _renderable = true;
    private childrenById: IChildren = {};

    public constructor(
        game: Game | undefined,
        { x = 0, y = 0, width = 0, height = 0, scale = 1 }: IEntityConfig
    ) {
        super();
        if (!!game) {
            this.game = game;
        }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

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
        return this.transform.x;
    }

    public set y(value: number) {
        if (value !== this.transform.y) {
            this.transform.y = value;
            this.onTransformChange();
        }
    }

    public get width(): number {
        return this.transform.x;
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

    public get renderable(): boolean {
        return this._renderable;
    }

    public set renderable(value: boolean) {
        if (value !== this._renderable) {
            this._renderable = value;
            this.onRenderedChange();
        }
    }

    public start(): void {}
    public preupdate(): void {}
    public update(): void {}
    public postupdate(): void {}
    public draw(): void {}
    public destroy(): void {}

    public add(entity: Entity): boolean {
        if (!!entity.parent) {
            entity.parent.remove(entity);
        }
        this.children.push(entity);
        this.children = ArrayUtil.sortByKey(this.children, 'layer', SortOrder.Desc);
        this.childrenById[entity.id] = entity;
        entity.parent = this;

        this.game.engine.add(entity);
        return true;
    }

    public remove(entity: Entity): boolean {
        if (entity.id in this.childrenById) {
            delete this.childrenById[entity.id];
            this.children.splice(this.children.indexOf(entity), 1);
            entity.parent = undefined;
            this.game.engine.remove(entity);
            return true;
        }
        return false;
    }

    public reconcile(x: number, y: number, width: number, height: number): void {
        this.world.x = x + this.x;
        this.world.y = y + this.y;
        this.world.width = width + this.width;
        this.world.height = height + this.height;

        for (let entity of this.children) {
            entity.reconcile(this.x, this.y, this.width, this.height);
        }
    }

    private onTransformChange(): void {
        if (!!this.parent) {
            this.reconcile(this.parent.x, this.parent.y, this.parent.width, this.parent.height);
        } else {
            this.reconcile(0, 0, 0, 0);
        }
    }

    private onRenderedChange(): void {
        this.emit(EntityEvents.Rendered, this);
    }
}
