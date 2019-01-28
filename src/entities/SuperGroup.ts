import { Array as ArrayUtil, SortOrder } from '../util/Array';
import { EntityType, Direction, EntityEvents } from './IEntity';
import { Entity } from './Entity';

interface IChildren {
    [key: string]: Entity;
}

export interface IGroupConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scale?: number;
    frame?: number;
    layer?: number;
}

// private group, consumed by game.ts, contains all group logic
export class SuperGroup extends Entity {
    public children: Entity[] = [];
    private childrenById: IChildren = {};

    public constructor({
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        scale = 1,
        layer = 1
    }: IGroupConfig) {
        super({
            type: EntityType.Group,
            x,
            y,
            width,
            height,
            scale,
            layer
        });
    }

    public add(entity: Entity, addToGame: boolean = true): boolean {
        if (!!entity.parent) {
            entity.parent.remove(entity);
        }
        this.children.push(entity);
        entity.on(EntityEvents.Layer, this.onChildLayerChange.bind(this, entity));
        this.sort();
        this.childrenById[entity.id] = entity;
        entity.parent = this;

        if (!!this.game && addToGame) {
            this.game.engine.add(entity);
        }
        return true;
    }

    public remove(entity: Entity): boolean {
        if (entity.id in this.childrenById) {
            delete this.childrenById[entity.id];
            entity.off(EntityEvents.Layer, this.onChildLayerChange.bind(this, entity));
            this.children.splice(this.children.indexOf(entity), 1);
            entity.parent = undefined;

            if (!!this.game) {
                this.game.engine.remove(entity);
            }
            return true;
        }
        return false;
    }

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

        const isRoot: boolean = !!this.parent;

        switch (direction) {
            case Direction.Down:
                if (!isRoot) {
                    for (let entity of this.children) {
                        if (origin !== entity) {
                            entity.reconcile(
                                this.x,
                                this.y,
                                this.width,
                                this.height,
                                this,
                                Direction.Down
                            );
                        }
                    }
                }
            case Direction.Up:
                if (isRoot) {
                    for (let entity of this.children) {
                        entity.reconcile(
                            this.x,
                            this.y,
                            this.width,
                            this.height,
                            this,
                            Direction.Down
                        );
                    }
                } else {
                    if (!!this.parent) {
                        this.parent.reconcile(
                            this.x,
                            this.y,
                            this.width,
                            this.height,
                            this,
                            Direction.Up
                        );
                    }
                }
        }
    }

    private sort(): void {
        this.children = ArrayUtil.sortByKey(this.children, 'layer', SortOrder.Asc);
    }

    //#region events
    private onChildLayerChange(): void {
        this.sort();
    }
    //#endregion
}
