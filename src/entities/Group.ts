import * as Util from '../util/Util';
import { EntityType, EntityEvent, Direction, IEntityConfig } from './base/IEntity';
import { Entity } from './base/Entity';
import { Transform3Event, Transform3 } from '../structs/Transform3';
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

export interface IGroupConfig extends IEntityConfig {
    moveable?: boolean;
    sizing?: Sizing;
    load?: Function;
    preupdate?: Function;
    update?: Function;
    postupdate?: Function;
    start?: Function;
    destroy?: Function;
}

export class Group extends Entity {
    public type: EntityType = EntityType.Group;
    public children: Entity[] = [];
    public sizing: Sizing = Sizing.Auto;
    private childrenById: IChildren = {};

    public configure({
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
    }: IGroupConfig): void {
        super.configure({
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
            Transform3Event.X,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.Y,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.Z,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.ScaleX,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.ScaleY,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.ScaleZ,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.Width,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.Height,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            entity.local,
            entity,
            Transform3Event.Depth,
            entity,
            Direction.Up,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            Transform3Event.X,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            Transform3Event.Y,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            Transform3Event.Z,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            Transform3Event.ScaleX,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            Transform3Event.ScaleY,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            Transform3Event.ScaleZ,
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
        transform: Transform3,
        origin: Entity,
        changed: Transform3Event,
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
                    case Transform3Event.Width:
                    case Transform3Event.X:
                    case Transform3Event.ScaleX:
                        this.local.width = this.world.width = Util.Math.distance(
                            bounds.x.low,
                            bounds.x.high
                        );
                        break;
                    case Transform3Event.Height:
                    case Transform3Event.Y:
                    case Transform3Event.ScaleY:
                        this.local.height = this.world.height = Util.Math.distance(
                            bounds.y.low,
                            bounds.y.high
                        );
                        break;
                    case Transform3Event.Depth:
                    case Transform3Event.Z:
                    case Transform3Event.ScaleZ:
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
                changed === Transform3Event.X ||
                changed === Transform3Event.Y ||
                changed === Transform3Event.Z;

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
                if ((child as Group).contains(entity)) {
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
    public onTransformChange(previous: number, changed: Transform3Event): void {
        switch (changed) {
            case Transform3Event.Width:
                this.world.width = this.local.width;
                break;
            case Transform3Event.Height:
                this.world.height = this.local.height;
                break;
            case Transform3Event.Depth:
                this.world.depth = this.local.depth;
                break;
        }

        switch (changed) {
            case Transform3Event.X:
            case Transform3Event.Y:
            case Transform3Event.Z:
                this.reconcile(this.local, this, changed, this, Direction.Down, Util.Random.id(12));
            case Transform3Event.Width:
            case Transform3Event.Height:
            case Transform3Event.Depth:
                this.reconcile(this.local, this, changed, this, Direction.Up, Util.Random.id(12));
        }
        this.emit(EntityEvent.Transform, this, previous, changed);
    }

    private onChildTransformChange(
        entity: Entity,
        previous: number,
        changed: Transform3Event
    ): void {
        if (changed === Transform3Event.Z) {
            this.sort();
        }
    }
    //#endregion
}
