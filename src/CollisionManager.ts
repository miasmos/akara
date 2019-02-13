import { EntityManager } from './EntityManager';
import { Transform3Event } from './structs/Transform3';
import { EntityEvent } from './entities/base/IEntity';
import { Entity } from './entities/base/Entity';
import { Point3 } from './structs/Point3';
import { Game } from './entities/Game';
import { Observer } from './Observer';
import * as Util from './util/Util';

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
        const added = this.entities.add(entity);
        if (added) {
            entity.on(EntityEvent.Transform, this.onEntityTransformChange.bind(this));
            this.sectorsByEntity[entity.id] = [];
            this.resize(entity.x + entity.width, entity.y + entity.height, entity.z + entity.depth);
            this.updateEntity(entity);
        }

        return added;
    }

    public removeEntity(entity: Entity): boolean {
        const removed = this.entities.remove(entity);
        if (removed) {
            entity.off(EntityEvent.Transform, this.onEntityTransformChange.bind(this));
            this.sectorsByEntity[entity.id].forEach((origin: Point3) => {
                this.removeEntityFromSector(entity, origin.x, origin.y, origin.z);
            });
            delete this.sectorsByEntity[entity.id];
        }
        return removed;
    }

    // TODO: calculate only entities that moved this frame
    protected updateEntity(entity: Entity): void {
        const x1 = entity.x;
        const x2 = entity.x + entity.width;
        const y1 = entity.y;
        const y2 = entity.y + entity.height;
        const z1 = entity.z;
        const z2 = entity.z + entity.depth;

        this.sectorsByEntity[entity.id] = [];
        const startX = x1 - (x1 % this.resolution);
        const endX = x1 + x2 - ((x1 + x2) % this.resolution) + this.resolution;

        for (let index = startX; index <= endX; index += this.resolution) {
            const startY = y1 - (y1 % this.resolution);
            const endY = y1 + y2 - ((y1 + y2) % this.resolution) + this.resolution;
            for (let index1 = startY; index1 <= endY; index1 += this.resolution) {
                const startZ = z1 - (z1 % this.resolution);
                const endZ = z1 + z2 - ((z1 + z2) % this.resolution) + this.resolution;
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

        const diffX = Util.Math.clamp(x1 - this.sectors.length, 0);
        const diffY = Util.Math.clamp(y1 - this.sectors[0].length, 0);
        const diffZ = Util.Math.clamp(z1 - this.sectors[0][0].length, 0);
        const diff = Math.max(diffX, diffY, diffZ);
        if (diff > 0) {
            console.log('resize');
        }
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

    // TODO: fix collisions being emitted on every frame
    public update(): void {
        const collisions: string[] = [];
        const entitiesByCollision: { [key: string]: Entity[] } = {};

        for (let x = 0; x < this.size; x += this.resolution) {
            for (let y = 0; y < this.size; y += this.resolution) {
                for (let z = 0; z < this.size; z += this.resolution) {
                    const entities = this.sectors[x][y][z];
                    entities.forEach((entity: Entity) => {
                        entities.forEach((comparer: Entity) => {
                            if (
                                entity.equals(comparer) ||
                                !entity.collider ||
                                !entity.renderable ||
                                !comparer.collider ||
                                !comparer.renderable
                            ) {
                                return;
                            }

                            const id = [entity.id, comparer.id].sort().toString();
                            if (collisions.includes(id)) {
                                return;
                            }

                            const intersecting = entity.collider.test2(comparer);
                            if (intersecting) {
                                collisions.push(id);
                                entitiesByCollision[id] = [entity, comparer];
                            }
                        });
                    });
                }
            }
        }

        this.collisions.forEach((id: string) => {
            if (!collisions.includes(id)) {
                this.collisions.splice(this.collisions.indexOf(id), 1);
            } else {
                collisions.splice(collisions.indexOf(id), 1);
            }
        });
        collisions.forEach((id: string) => {
            const [entity, comparer] = entitiesByCollision[id];
            this.emit(CollisionEvent.Collision, entity, comparer);
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
    protected onEntityTransformChange(
        entity: Entity,
        previous: number,
        changed: Transform3Event
    ): void {
        let { x, y, z, width, height, depth } = entity;
        switch (changed) {
            case Transform3Event.X:
                x = previous;
            case Transform3Event.Y:
                y = previous;
            case Transform3Event.Z:
                z = previous;
            case Transform3Event.Height:
                height = previous;
            case Transform3Event.Width:
                width = previous;
            case Transform3Event.Depth:
                depth = previous;
                this.resize(
                    entity.x + entity.width,
                    entity.y + entity.height,
                    entity.z + entity.depth
                );
                this.sectorsByEntity[entity.id].forEach((value: Point3) => {
                    this.removeEntityFromSector(entity, value.x, value.y, value.z);
                });
                this.updateEntity(entity);
                break;
            default:
        }
    }

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
    // #endregion
}
