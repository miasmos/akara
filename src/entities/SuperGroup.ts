import { Array as ArrayUtil, SortOrder } from '../util/Array';
import { EntityType, EntityEvents, Direction } from './base/IEntity';
import { Entity } from './base/Entity';
import { TransformEvent, Transform } from '../structs/Transform';
import { Random } from '../util/Random';

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
    private didPropagateDownwards: boolean = false;
    private resolved: string[] = [];

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

        if (!!this.game && addToGame) {
            this.game.engine.add(entity);
        }

        // TODO: refactor reconcile to reconcile(transform:Transform, origin:Entity, changed: TransformEvent[], ...)
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.X,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.Y,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.Z,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.Width,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.Height,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.Depth,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(this.world, this, TransformEvent.X, entity, Direction.Down, Random.id(12));
        entity.reconcile(this.world, this, TransformEvent.Y, entity, Direction.Down, Random.id(12));
        entity.reconcile(this.world, this, TransformEvent.Z, entity, Direction.Down, Random.id(12));
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

    public reconcile(
        transform: Transform,
        origin: Entity,
        changed: TransformEvent,
        last: Entity,
        direction: Direction = Direction.Up,
        id: string
    ): void {
        if (typeof id === 'undefined') {
            id = Random.id(12);
        }

        if (this.type !== EntityType.Scene) {
            this.local.suppress = true;
            if (direction === Direction.Up) {
                if (this.didPropagateDownwards) {
                    if (this.resolved.includes(last.id)) {
                        this.resolved.splice(this.resolved.indexOf(last.id), 1);
                    }
                    if (this.resolved.length === 0) {
                        this.didPropagateDownwards = false;
                    }
                }

                if (!this.didPropagateDownwards) {
                    switch (changed) {
                        case TransformEvent.Width:
                        case TransformEvent.X:
                            this.local.width = this.world.width = this.children.reduce(
                                (previous: number, child: Entity) => {
                                    const length = child.x + child.width;
                                    return length > previous ? length : previous;
                                },
                                0
                            );
                            break;
                        case TransformEvent.Height:
                        case TransformEvent.Y:
                            this.local.height = this.world.height = this.children.reduce(
                                (previous: number, child: Entity) => {
                                    const length = child.y + child.height;
                                    return length > previous ? length : previous;
                                },
                                0
                            );
                            break;
                        case TransformEvent.Depth:
                        case TransformEvent.Z:
                            this.local.depth = this.world.depth = this.children.reduce(
                                (previous: number, child: Entity) => {
                                    const length = child.z + child.depth;
                                    return length > previous ? length : previous;
                                },
                                0
                            );
                            break;
                    }
                }
            }
            this.local.suppress = false;
        }
        super.reconcile(transform, origin, changed, last, direction, id);

        if (this.isGroup && direction === Direction.Down) {
            let positionDidChange =
                changed === TransformEvent.X ||
                changed === TransformEvent.Y ||
                changed === TransformEvent.Z;

            if (positionDidChange) {
                this.didPropagateDownwards = true;
                this.resolved = this.children.map(child => child.id);
                for (let child of this.children) {
                    child.reconcile(this.world, origin, changed, this, Direction.Down, id);
                }
            }
        }
    }

    public clear(): void {
        for (let entity of this.children) {
            this.remove(entity);
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
