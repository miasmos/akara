import { Array as ArrayUtil, SortOrder } from '../util/Array';
import { EntityType, Direction, EntityEvents } from './IEntity';
import { Entity } from './Entity';
import { TransformEvent, Transform } from '../structs/Transform';

interface IChildren {
    [key: string]: Entity;
}

export interface IGroupConfig {
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    scale?: number;
    frame?: number;
}

// private group, consumed by game.ts, contains all group logic
export class SuperGroup extends Entity {
    public children: Entity[] = [];
    private childrenById: IChildren = {};

    public constructor({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scale = 1
    }: IGroupConfig) {
        super({
            type: EntityType.Group,
            x,
            y,
            z,
            width,
            height,
            depth,
            scale
        });
    }

    public add(entity: Entity, addToGame: boolean = true): boolean {
        if (!!entity.parent) {
            entity.parent.remove(entity);
        }
        this.children.push(entity);
        entity.on(EntityEvents.Transform, this.onChildTransformChange.bind(this));
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
            entity.off(EntityEvents.Transform, this.onChildTransformChange.bind(this));
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
        transform: Transform,
        origin: Entity,
        last: Entity,
        direction: Direction = Direction.Up
    ): void {
        if (origin.id !== this.id) {
            this.world = this.transform.add(transform);
        }

        const isRoot: boolean = !!this.parent;

        switch (direction) {
            case Direction.Down:
                if (!isRoot) {
                    for (let entity of this.children) {
                        if (origin !== entity) {
                            entity.reconcile(this.transform, origin, this, Direction.Down);
                        }
                    }
                }
            case Direction.Up:
                if (isRoot) {
                    for (let entity of this.children) {
                        entity.reconcile(this.transform, origin, this, Direction.Down);
                    }
                } else {
                    if (!!this.parent) {
                        this.parent.reconcile(this.transform, origin, this, Direction.Up);
                    }
                }
        }
    }

    private sort(): void {
        this.children = ArrayUtil.sortByKey(this.children, 'z', SortOrder.Asc);
    }

    //#region events
    private onChildTransformChange(
        entity: Entity,
        previous: number,
        changed: TransformEvent
    ): void {
        if (changed === TransformEvent.Z) {
            this.sort();
        }
    }
    //#endregion
}
