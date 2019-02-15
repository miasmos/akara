import { EntityManager } from './EntityManager';
import { Transform3Event } from './structs/Transform3';
import { EntityEvent } from './entities/base/IEntity';
import { Entity } from './entities/base/Entity';
import { Point3 } from './structs/Point3';
import { Game } from './entities/Game';
import { Observer } from './Observer';
import * as Util from './util/Util';
import { ComponentType, Component } from './components/Component';

export enum CollisionEvent {
    Collision
}

export interface ICollisionManagerConfig {
    resolution?: number;
}

interface Sectors {
    [key: string]: Point3[];
}

export class CollisionManager extends Observer {
    public sectors: Entity[][][][] = [];
    protected game: Game;
    private sectorsByEntity: Sectors = {};
    protected _resolution: number;
    protected entities: EntityManager = new EntityManager();
    public collisions: string[] = [];

    public constructor(game: Game) {
        super();
        this.game = game;
    }

    public addEntity(entity: Entity): boolean {
        if (entity.collider && entity.transform) {
            const added = this.entities.add(entity);

            if (added) {
                this.sectorsByEntity[entity.id] = [];
                entity.on(EntityEvent.ComponentRemove, this.onEntityComponentRemove.bind(this));
                entity.off(EntityEvent.ComponentAdd, this.onEntityComponentAdd.bind(this));
                this.resize(
                    entity.x + entity.width,
                    entity.y + entity.height,
                    entity.z + entity.depth
                );
                this.updateEntity(entity);
            }
            return added;
        }

        entity.on(EntityEvent.ComponentAdd, this.onEntityComponentAdd.bind(this));
        return false;
    }

    public removeEntity(entity: Entity): boolean {
        const removed = this.entities.remove(entity);
        if (removed) {
            entity.off(EntityEvent.ComponentAdd, this.onEntityComponentAdd.bind(this));
            entity.off(EntityEvent.ComponentRemove, this.onEntityComponentRemove.bind(this));
            this.sectorsByEntity[entity.id].forEach((origin: Point3) => {
                this.removeEntityFromSector(entity, origin.x, origin.y, origin.z);
            });
            delete this.sectorsByEntity[entity.id];
        }
        return removed;
    }

    protected updateEntity(entity: Entity): void {
        const x1 = entity.world.x;
        const x2 = entity.world.x + entity.world.width;
        const y1 = entity.world.y;
        const y2 = entity.world.y + entity.world.height;
        const z1 = entity.world.z;
        const z2 = entity.world.z + entity.world.depth;

        // TODO: slight optimization, implement diffing instead of complete removal
        this.sectorsByEntity[entity.id].forEach((value: Point3) => {
            this.removeEntityFromSector(entity, value.x, value.y, value.z);
        });

        this.sectorsByEntity[entity.id] = [];
        const startX = x1 - (x1 % this.resolution);
        const endX = x2 - x1 - ((x1 + x2) % this.resolution);

        for (let index = startX; index <= endX; index += this.resolution) {
            const startY = y1 - (y1 % this.resolution);
            const endY = y2 - y1 - ((y1 + y2) % this.resolution);
            for (let index1 = startY; index1 <= endY; index1 += this.resolution) {
                const startZ = z1 - (z1 % this.resolution);
                const endZ = z2 - z1 - ((z1 + z2) % this.resolution);
                for (let index2 = startZ; index2 <= endZ; index2 += this.resolution) {
                    if (!this.sectors[index][index1][index2].includes(entity)) {
                        this.sectors[index][index1][index2].push(entity);
                        this.sectorsByEntity[entity.id].push(new Point3(index, index1, index2));
                    }
                }
            }
        }
    }

    protected removeEntityFromSector(entity: Entity, x: number, y: number, z: number): boolean {
        const sector = this.getSector(x, y, z);
        const count = sector.length;
        sector.splice(sector.indexOf(entity), 1);
        return count !== sector.length;
    }

    public getSector(x: number, y: number, z: number): Entity[] {
        const clampX = x - (x % this.resolution);
        const clampY = y - (y % this.resolution);
        const clampZ = z - (z % this.resolution);

        if (this.sectorExists(clampX, clampY, clampZ)) {
            return this.sectors[clampX][clampY][clampZ];
        }

        return [];
    }

    protected sectorExists(x: number, y: number, z: number): boolean {
        return (
            x > this.sectors.length || y > this.sectors[0].length || z > this.sectors[0][0].length
        );
    }

    protected resize(x: number, y: number, z: number): void {
        const x1 = x - (x % this.resolution);
        const y1 = y - (y % this.resolution);
        const z1 = z - (z % this.resolution);

        if (typeof this.sectors === 'undefined') {
            this.sectors = [];
        }
        if (typeof this.sectors[0] === 'undefined') {
            this.sectors[0] = [];
        }
        if (typeof this.sectors[0][0] === 'undefined') {
            this.sectors[0][0] = [];
        }

        if (
            x1 < this.sectors.length &&
            y1 < this.sectors[0].length &&
            z1 < this.sectors[0][0].length
        ) {
            return;
        }

        const diffX = Util.Math.clamp(x1 - this.sectors.length, 0);
        const diffY = Util.Math.clamp(y1 - this.sectors[0].length, 0);
        const diffZ = Util.Math.clamp(z1 - this.sectors[0][0].length, 0);
        const diff = Math.max(diffX, diffY, diffZ);
        const start = this.sectors.length - 1;

        for (let index = start; index < diff + this.resolution; index += this.resolution) {
            if (typeof this.sectors[index] === 'undefined') {
                this.sectors[index] = [];
            }

            for (let index1 = start; index1 < diff + this.resolution; index1 += this.resolution) {
                if (typeof this.sectors[index][index1] === 'undefined') {
                    this.sectors[index][index1] = [];
                }

                for (
                    let index2 = start;
                    index2 < diff + this.resolution;
                    index2 += this.resolution
                ) {
                    if (typeof this.sectors[index][index1][index2] === 'undefined') {
                        this.sectors[index][index1][index2] = [];
                    }
                }
            }
        }
    }

    public configure({ resolution = 100 }: ICollisionManagerConfig): void {
        this._resolution = resolution;
        this.game.on(EntityEvent.Transform, this.onGameTransformChange.bind(this));
        this.resize(this.game.width, this.game.height, this.game.depth);
    }

    public update(): void {
        const movedEntities: string[] = this.game.engine.getMovedEntities();
        let maxX = 0;
        let maxY = 0;
        let maxZ = 0;

        // update entity matrix
        movedEntities.forEach(id => {
            const entity = this.entities.get(id);
            if (entity) {
                if (entity.x + entity.width > maxX) {
                    maxX = entity.x + entity.width;
                }
                if (entity.y + entity.height > maxY) {
                    maxY = entity.y + entity.height;
                }
                if (entity.z + entity.depth > maxZ) {
                    maxZ = entity.z + entity.depth;
                }

                this.updateEntity(entity);
            }
        });
        this.resize(maxX, maxY, maxZ);

        // calculate collisions
        const collisions: string[] = [];
        const entitiesByCollision: { [key: string]: Entity[] } = {};

        for (let x = 0; x < this.size; x += this.resolution) {
            for (let y = 0; y < this.size; y += this.resolution) {
                for (let z = 0; z < this.size; z += this.resolution) {
                    const entities = this.sectors[x][y][z];
                    entities.forEach((entity: Entity) => {
                        if (
                            !entity.collider ||
                            !entity.renderable ||
                            !movedEntities.includes(entity.id)
                        ) {
                            return;
                        }

                        entities.forEach((comparer: Entity) => {
                            if (
                                entity.equals(comparer) ||
                                !comparer.collider ||
                                !comparer.renderable
                            ) {
                                return;
                            }

                            const id = [entity.id, comparer.id].sort().toString();
                            if (collisions.includes(id)) {
                                return;
                            }

                            if (entity.collider) {
                                const intersecting = entity.collider.test2(comparer);
                                if (intersecting) {
                                    collisions.push(id);
                                    entitiesByCollision[id] = [entity, comparer];
                                }
                            }
                        });
                    });
                }
            }
        }

        // if collision exists already in master list, discard it
        // if not, add it to the master list
        const removals = this.collisions.filter(id => !collisions.includes(id));
        collisions.forEach((id: string) => {
            if (this.collisions.includes(id)) {
                collisions.splice(collisions.indexOf(id), 1);
            } else {
                this.collisions.push(id);
            }
        });

        // remove collisions that no longer exist from master list / entities
        this.collisions = this.collisions.filter(id => {
            const shouldRemove = !removals.includes(id);

            if (id in entitiesByCollision) {
                const [entity, comparer] = entitiesByCollision[id];
                let { collider } = entity;
                if (collider) {
                    collider.removeCollision(comparer);
                }
                ({ collider } = comparer);
                if (collider) {
                    collider.removeCollision(entity);
                }
            }

            return shouldRemove;
        });

        // add new collisions to master list / entities
        collisions.forEach((id: string) => {
            if (id in entitiesByCollision) {
                const [entity, comparer] = entitiesByCollision[id];
                let { collider } = entity;
                if (collider) {
                    collider.addCollision(comparer);
                }
                ({ collider } = comparer);
                if (collider) {
                    collider.addCollision(entity);
                }

                this.emit(CollisionEvent.Collision, entity, comparer);
            }
        });
    }

    // #region properties
    public get resolution(): number {
        return this._resolution;
    }

    public get size(): number {
        return this.sectors.length;
    }
    // #endregion

    // #region events
    protected onGameTransformChange(
        entity: Entity,
        previous: number,
        changed: Transform3Event
    ): void {
        switch (changed) {
            case Transform3Event.Height:
            case Transform3Event.Width:
            case Transform3Event.Depth:
                this.resize(
                    entity.x + entity.width,
                    entity.y + entity.height,
                    entity.z + entity.depth
                );
                break;
            default:
        }
    }

    protected onEntityComponentAdd(entity: Entity, component: Component): void {
        switch (component.type) {
            case ComponentType.Collider:
            case ComponentType.Transform:
                this.addEntity(entity);
                break;
            default:
        }
    }

    protected onEntityComponentRemove(entity: Entity, component: Component): void {
        switch (component.type) {
            case ComponentType.Collider:
            case ComponentType.Transform:
                this.removeEntity(entity);
                break;
            default:
        }
    }
    // #endregion
}
