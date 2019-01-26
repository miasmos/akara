import { Entity } from './entities/Entity';

export interface IEntities {
    [key: string]: Entity;
}

export class EntityManager {
    private entities: IEntities = {};

    public add(entity: Entity): boolean {
        if (!(entity.id in this.entities)) {
            this.entities[entity.id] = entity;
            return true;
        }

        return false;
    }

    public remove(entity: Entity): boolean {
        if (entity.id in this.entities) {
            delete this.entities[entity.id];
            return true;
        }

        return false;
    }

    public get(id: string): Entity | undefined {
        if (id in this.entities) {
            return this.entities[id];
        }

        return undefined;
    }
}
