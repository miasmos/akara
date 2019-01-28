import { Array as ArrayUtil, SortOrder } from '../util/Array';
import { EntityType, Direction, EntityEvents } from './base/IEntity';
import { Entity } from './base/Entity';
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
    type?: EntityType;
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
        scale = 1,
        type = EntityType.Group
    }: IGroupConfig) {
        super({
            type,
            x,
            y,
            z,
            width,
            height,
            depth,
            scale
        });
    }

    public add(entity: Entity | Entity[], addToGame: boolean = true): boolean {
        if (Array.isArray(entity)) {
            let result = true;
            for (let entity1 of entity) {
                const result1 = this.add(entity1, addToGame);
                if (!result1) {
                    result = false;
                }
            }
            return result;
        }

        if (!!entity.parent) {
            entity.parent.remove(entity);
        }
        this.children.push(entity);
        entity.on(EntityEvents.Transform, this.onChildTransformChange.bind(this));
        this.sort();
        this.childrenById[entity.id] = entity;
        entity.parent = this;

        if (!!this.game && !!this.parent && addToGame) {
            this.game.engine.add(entity);
        }
        return true;
    }

    public remove(entity: Entity | Entity[]): boolean {
        if (Array.isArray(entity)) {
            let result = true;
            for (let entity1 of entity) {
                const result1 = this.remove(entity1);
                if (!result1) {
                    result = false;
                }
            }
            return result;
        }

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

    public clear(): void {
        for (let entity of this.children) {
            this.remove(entity);
        }
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
