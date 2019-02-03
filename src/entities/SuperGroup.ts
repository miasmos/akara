import * as Util from '../util/Util';
import { EntityType, EntityEvent, Direction } from './base/IEntity';
import { Entity } from './base/Entity';
import { TransformEvent, Transform } from '../structs/Transform';
import { SortOrder, ErrorMessage } from '../enum/Enum';
import { Random } from '../util/Random';
import { Sizing } from '../enum/Sizing';

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
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    alpha?: number;
    tag?: string;
    type?: EntityType;
    sizing?: Sizing;
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
    public sizing: Sizing = Sizing.Auto;
    private childrenById: IChildren = {};

    public constructor({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        alpha = 1,
        tag,
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
            scaleX,
            scaleY,
            scaleZ,
            tag,
            alpha,
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
            Util.Debug.warn(ErrorMessage.CannotAddEntitySelf);
            return false;
        }
        if (entity.type === EntityType.Game || entity.type === EntityType.Scene) {
            Util.Debug.warn(ErrorMessage.CannotAddTopLevel);
            return false;
        }

        if (!!entity.parent) {
            entity.parent.remove(entity);
        }
        this.children.push(entity);
        entity.on(EntityEvent.Transform, this.onChildTransformChange.bind(this));
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
            TransformEvent.ScaleX,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.ScaleY,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            TransformEvent.ScaleZ,
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
        entity.reconcile(
            this.world,
            this,
            TransformEvent.ScaleX,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            TransformEvent.ScaleY,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            TransformEvent.ScaleZ,
            entity,
            Direction.Down,
            Random.id(12)
        );
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
            entity.off(EntityEvent.Transform, this.onChildTransformChange.bind(this));
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

        if (this.type !== EntityType.Scene && this.sizing === Sizing.Auto) {
            this.local.suppress = true;
            if (direction === Direction.Up) {
                const bounds = this.getBounds();

                switch (changed) {
                    case TransformEvent.Width:
                    case TransformEvent.X:
                    case TransformEvent.ScaleX:
                        this.local.width = this.world.width = Util.Math.distance(
                            bounds.x.low,
                            bounds.x.high
                        );
                        break;
                    case TransformEvent.Height:
                    case TransformEvent.Y:
                    case TransformEvent.ScaleY:
                        this.local.height = this.world.height = Util.Math.distance(
                            bounds.y.low,
                            bounds.y.high
                        );
                        break;
                    case TransformEvent.Depth:
                    case TransformEvent.Z:
                    case TransformEvent.ScaleZ:
                        this.local.depth = this.world.depth = Util.Math.distance(
                            bounds.z.low,
                            bounds.z.high
                        );
                        break;
                }
            }
            this.local.suppress = false;
        }
        super.reconcile(transform, origin, changed, last, direction, id);

        if (this.isGroup) {
            let positionDidChange =
                changed === TransformEvent.X ||
                changed === TransformEvent.Y ||
                changed === TransformEvent.Z;

            if (positionDidChange) {
                if (direction === Direction.Down) {
                    for (let child of this.children) {
                        child.reconcile(this.world, origin, changed, this, Direction.Down, id);
                    }
                } else {
                    const isRoot =
                        !!this.parent && this.parent.type === EntityType.Scene ? true : false;
                    if (isRoot) {
                        // TODO: fix reconciliation causing more updates than necessary, track stack as event travels up then only update entities in the stack on the way down
                        last.reconcile(this.world, origin, changed, this, Direction.Down, id);
                    }
                }
            }
        }
    }

    public getByTag(tag: string): Entity[] {
        return this.game.engine.getEntitiesByTag(tag);
    }

    public getByType(type: EntityType): Entity[] {
        return this.game.engine.getEntitiesByType(type);
    }

    public contains(entity: Entity): boolean {
        if (entity.id in this.childrenById) {
            return true;
        }
        for (let child of this.children) {
            if (child.isGroup) {
                if ((child as SuperGroup).contains(entity)) {
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
        const clamp = Util.Math.clamp;
        return {
            x: { low: clamp(compare.x.low, 0), high: compare.x.high },
            y: { low: clamp(compare.y.low, 0), high: compare.y.high },
            z: { low: clamp(compare.z.low, 0), high: compare.z.high }
        };
    }

    private sort(): void {
        this.children = Util.Array.sortByKey(this.children, 'z', SortOrder.Asc);
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
