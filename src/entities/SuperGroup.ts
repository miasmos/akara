import * as Util from '../util/Util';
import { EntityType, EntityEvents, Direction } from './base/IEntity';
import { Entity } from './base/Entity';
import { TransformEvent, Transform } from '../structs/Transform';
import { SortOrder, ErrorMessage } from '../enum/Enum';
import { Random } from '../util/Random';
import { Group } from './Group';

interface IChildren {
    [key: string]: Entity;
}

interface IComparison {
    low: number;
    high: number;
}

interface IBounds {
    x: IComparison;
    y: IComparison;
    z: IComparison;
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
    load?: Function;
    preupdate?: Function;
    update?: Function;
    postupdate?: Function;
    start?: Function;
    destroy?: Function;
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
        type = EntityType.Group,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: IGroupConfig) {
        super({
            type,
            x,
            y,
            z,
            width,
            height,
            depth,
            scale,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
    }

    //#region properties
    public get layer(): number {
        return this._layer;
    }

    public set layer(value: number) {
        if (this._layer !== value) {
            this._layer = value;
            for (let child of this.children) {
                child.layer = value + 1;
            }
        }
    }
    //#endregion

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

        if (this.equals(entity)) {
            Util.Debug.error(ErrorMessage.CannotAddEntitySelf);
            return false;
        }

        if (!!entity.parent) {
            entity.parent.remove(entity);
        }
        this.children.push(entity);
        entity.on(EntityEvents.Transform, this.onChildTransformChange.bind(this));
        this.sort();
        this.childrenById[entity.id] = entity;
        entity.parent = this;
        entity.layer = this.layer + 1;

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
                    const bounds = this.getBounds();
                    switch (changed) {
                        case TransformEvent.Width:
                        case TransformEvent.X:
                            this.local.width = this.world.width = Util.Math.distance(
                                bounds.x.low,
                                bounds.x.high
                            );
                            break;
                        case TransformEvent.Height:
                        case TransformEvent.Y:
                            this.local.height = this.world.height = Util.Math.distance(
                                bounds.y.low,
                                bounds.y.high
                            );
                            break;
                        case TransformEvent.Depth:
                        case TransformEvent.Z:
                            this.local.depth = this.world.depth = Util.Math.distance(
                                bounds.z.low,
                                bounds.z.high
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

    public contains(entity: Entity): boolean {
        if (entity.id in this.childrenById) {
            return true;
        }
        for (let child of this.children) {
            if (child instanceof Group) {
                if (child.contains(entity)) {
                    return true;
                }
            } else {
                if (child.equals(entity)) {
                    return true;
                }
            }
        }
        return false;
    }

    public clear(): void {
        for (let entity of this.children) {
            this.remove(entity);
        }
    }

    private getBounds(): IBounds {
        const compare: IBounds = {
            x: { low: 0, high: 0 },
            y: { low: 0, high: 0 },
            z: { low: 0, high: 0 }
        };

        for (let child of this.children) {
            if (child.x < compare.x.low) {
                compare.x.low = child.x;
            }
            if (child.x + child.width > compare.x.high) {
                compare.x.high = child.x + child.width;
            }
            if (child.y < compare.y.low) {
                compare.y.low = child.y;
            }
            if (child.y + child.height > compare.y.high) {
                compare.y.high = child.y + child.height;
            }
            if (child.z < compare.z.low) {
                compare.z.low = child.z;
            }
            if (child.z + child.depth > compare.z.high) {
                compare.z.high = child.z + child.depth;
            }
        }

        return compare;
    }

    private sort(): void {
        this.children = Util.Array.sortByKey(this.children, 'z', SortOrder.Asc);
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
