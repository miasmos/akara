import * as Util from '../util/Util';
import { EntityType, EntityEvent, IEntityConfig } from './base/IEntity';
import { Direction } from '../enum/Direction';
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
    load?: () => void;
    preupdate?: () => void;
    update?: () => void;
    postupdate?: () => void;
    start?: () => void;
    destroy?: () => void;
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
        pivotX = 0,
        pivotY = 0,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        alpha = 1,
        sizing = Sizing.Auto,
        tag,
        type = EntityType.Group,
        preupdate,
        update,
        postupdate,
        start,
        destroy,
        collision
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
            pivotX,
            pivotY,
            rotateX,
            rotateY,
            rotateZ,
            tag,
            alpha,
            preupdate,
            update,
            postupdate,
            start,
            destroy,
            collision
        });

        this.sizing = sizing;
    }

    // #region properties
    public get layer(): number {
        return this._layer;
    }

    public set layer(value: number) {
        if (this._layer !== value) {
            this._layer = value;
            this.children.forEach(child => {
                child.layer = value + 1;
            });
        }
    }
    // #endregion

    public add(entity: Entity | Entity[], addToGame: boolean = true): boolean {
        if (Array.isArray(entity)) {
            const allEntitiesWereAdded = entity.every(child => {
                const added = this.add(child, addToGame);
                return added;
            });

            return allEntitiesWereAdded;
        }

        if (this.equals(entity)) {
            Util.Debug.warn(ErrorMessage.CannotAddEntitySelf);
            return false;
        }
        if (entity.type === EntityType.Game || entity.type === EntityType.Scene) {
            Util.Debug.warn(ErrorMessage.CannotAddTopLevel);
            return false;
        }

        if (entity.parent) {
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
        entity.reconcile(
            this.world,
            this,
            Transform3Event.PivotX,
            entity,
            Direction.Down,
            Random.id(12)
        );
        entity.reconcile(
            this.world,
            this,
            Transform3Event.PivotY,
            entity,
            Direction.Down,
            Random.id(12)
        );
        return true;
    }

    public remove(entity: Entity | Entity[]): boolean {
        if (Array.isArray(entity)) {
            const allEntitiesWereRemoved = entity.every(child => {
                const remove = this.remove(child);
                return remove;
            });

            return allEntitiesWereRemoved;
        }

        if (entity.id in this.childrenById) {
            delete this.childrenById[entity.id];
            entity.off(EntityEvent.Transform, this.onChildTransformChange.bind(this));
            this.children.splice(this.children.indexOf(entity), 1);
            entity.parent = undefined;

            if (this.game) {
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
                        this.local.width = Util.Math.distance(bounds.x.low, bounds.x.high);
                        this.world.width = this.local.width;
                        break;
                    case Transform3Event.Height:
                    case Transform3Event.Y:
                    case Transform3Event.ScaleY:
                        this.local.height = Util.Math.distance(bounds.y.low, bounds.y.high);
                        this.world.height = this.local.height;
                        break;
                    case Transform3Event.Depth:
                    case Transform3Event.Z:
                    case Transform3Event.ScaleZ:
                        this.local.depth = Util.Math.distance(bounds.z.low, bounds.z.high);
                        this.world.depth = this.local.depth;
                        break;
                    default:
                }
            }
            this.local.suppress = false;
        }
        super.reconcile(transform, origin, changed, last, direction, id);

        if (this.isGroup) {
            const positionDidChange =
                changed === Transform3Event.X ||
                changed === Transform3Event.Y ||
                changed === Transform3Event.Z;

            if (positionDidChange) {
                if (direction === Direction.Down) {
                    this.children.forEach(child => {
                        child.reconcile(this.world, origin, changed, this, Direction.Down, id);
                    });
                } else {
                    const isRoot = this.parent && this.parent.type === EntityType.Scene;
                    if (isRoot) {
                        // TODO: fix reconciliation causing more updates than necessary
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

        const contained: boolean = this.children.some((child: Entity) => {
            if (child.isGroup) {
                if ((child as Group).contains(entity)) {
                    return true;
                }
            } else if (child.equals(entity)) {
                return true;
            }

            return false;
        });

        return contained;
    }

    public clear(): void {
        this.children.forEach((entity: Entity) => {
            this.remove(entity);
        });
    }

    private getBounds(): IBounds {
        const compare: IBounds = {
            x: { low: 0, high: 0 },
            y: { low: 0, high: 0 },
            z: { low: 0, high: 0 }
        };

        this.children.forEach((child: Entity) => {
            const x = child.x - child.width * child.pivotX;
            const y = child.y - child.height * child.pivotY;
            const { z, width, height, depth } = child;

            if (x < compare.x.low) {
                compare.x.low = x;
            }
            if (x + width > compare.x.high) {
                compare.x.high = x + width;
            }
            if (y < compare.y.low) {
                compare.y.low = y;
            }
            if (y + height > compare.y.high) {
                compare.y.high = y + height;
            }
            if (z < compare.z.low) {
                compare.z.low = z;
            }
            if (z + depth > compare.z.high) {
                compare.z.high = z + depth;
            }
        });

        const { clamp } = Util.Math;
        return {
            x: { low: clamp(compare.x.low, 0), high: compare.x.high },
            y: { low: clamp(compare.y.low, 0), high: compare.y.high },
            z: { low: clamp(compare.z.low, 0), high: compare.z.high }
        };
    }

    private sort(): void {
        this.children = this.children.slice().sort((a, b) => a.z - b.z);
    }

    // #region events
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
            default:
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
            default:
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
    // #endregion
}
