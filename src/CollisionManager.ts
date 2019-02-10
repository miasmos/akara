import { EntityManager } from './EntityManager';
import { Transform3Event } from './structs/Transform3';
import { ComponentType } from './components/Component';
import { EntityEvent } from './entities/base/IEntity';
import { Entity } from './entities/base/Entity';

export interface ICollisionManagerConfig {
    resolution?: number;
}

// TODO: complete collision implementation
export class CollisionManager {
    public sectors: number[][][][] = [];
    protected _resolution: number;
    protected readonly initialSize = 2000;
    protected entities: EntityManager = new EntityManager();

    public addEntity(entity: Entity): boolean {
        const added = this.entities.add(entity);
        if (!!added) {
            entity.on(EntityEvent.Transform, this.onTransformChange.bind(this));
        }
        return added;
    }

    public removeEntity(entity: Entity): boolean {
        const removed = this.entities.remove(entity);
        if (!!removed) {
            entity.off(EntityEvent.Transform, this.onTransformChange.bind(this));
        }
        return removed;
    }

    protected initialize(): void {
        const columnsTotal = Math.floor(this.initialSize / this.resolution) + 1;
        for (let index = 0; index <= columnsTotal; index += this.resolution) {
            this.sectors[index] = [];
            const x: number[][][] = this.sectors[index];

            for (let index1 = 0; index1 <= columnsTotal; index1 += this.resolution) {
                x[index1] = [];
                const y: number[][] = x[index1];

                for (let index2 = 0; index2 <= columnsTotal; index2 += this.resolution) {
                    y[index2] = [];
                }
            }
        }
    }

    protected sectorExists(x: number, y: number, z: number): boolean {
        return (
            x > this.sectors.length || y > this.sectors.length[0] || z > this.sectors.length[0][0]
        );
    }

    public configure({ resolution = 100 }: ICollisionManagerConfig) {
        this._resolution = resolution;
        this.initialize();
    }

    //#region properties
    public get resolution(): number {
        return this._resolution;
    }
    //#endregion

    //#region events
    protected onTransformChange(previous: number, changed: Transform3Event): void {
        switch (changed) {
            case Transform3Event.X:
            case Transform3Event.Y:
            case Transform3Event.Z:
            case Transform3Event.Height:
            case Transform3Event.Width:
            case Transform3Event.Depth:
            // const x =
        }
    }
    //#endregion
}
