import { Entity } from './entities/base/Entity';
import { EntityEvent, EntityType } from './entities/base/IEntity';

export interface IEntities {
    [key: string]: Entity;
}

interface IEntitiesByString {
    [key: string]: string[];
}

export class EntityManager {
    private entities: IEntities = {};
    private entitiesByTag: IEntitiesByString = {};
    private entitiesByType: IEntitiesByString = {};

    // #region properties
    public get count(): number {
        return Object.keys(this.entities).length;
    }
    // #endregion

    public add(entity: Entity): boolean {
        if (!(entity.id in this.entities)) {
            this.entities[entity.id] = entity;
            this.addEntityToTag(entity);
            this.addEntityToType(entity);
            entity.on(EntityEvent.Tag, this.onTagChange.bind(this));
            return true;
        }

        return false;
    }

    public remove(entity: Entity): boolean {
        if (entity.id in this.entities) {
            delete this.entities[entity.id];
            entity.off(EntityEvent.Tag, this.onTagChange.bind(this));
            this.removeEntityFromType(entity);
            this.removeEntityFromTag(entity, entity.tag);
            return true;
        }

        return false;
    }

    public clear(): void {
        Object.values(this.entities).forEach((entity: Entity) => {
            this.remove(entity);
        });
    }

    public get(id: string): Entity | undefined {
        if (id in this.entities) {
            return this.entities[id];
        }

        return undefined;
    }

    public getTag(tag: string): Entity[] {
        if (tag in this.entitiesByTag) {
            const entities: Entity[] = [];
            Object.values(this.entitiesByTag[tag]).forEach((id: string) => {
                const entity = this.get(id);
                if (entity) {
                    entities.push(entity);
                }
            });
            return entities;
        }

        return [];
    }

    public getType(type: EntityType): Entity[] {
        const key = type.toString();
        if (key in this.entitiesByType) {
            const entities: Entity[] = [];
            Object.values(this.entitiesByType[type]).forEach((id: string) => {
                const entity = this.get(id);
                if (entity) {
                    entities.push(entity);
                }
            });
            return entities;
        }

        return [];
    }

    private addEntityToType(entity: Entity): void {
        const key = entity.type.toString();
        if (!(key in this.entitiesByType)) {
            this.entitiesByType[key] = [];
        }

        this.entitiesByType[key].push(entity.id);
    }

    private removeEntityFromType(entity: Entity): void {
        const key = entity.type.toString();
        if (key in this.entitiesByType) {
            const ref = this.entitiesByType[key];
            if (ref.includes(entity.id)) {
                ref.splice(ref.indexOf(entity.id), 1);
            }
        }
    }

    private addEntityToTag(entity: Entity): void {
        if (typeof entity.tag !== 'string' || entity.tag.length === 0) {
            return;
        }
        if (!(entity.tag in this.entitiesByTag)) {
            this.entitiesByTag[entity.tag] = [];
        }

        this.entitiesByTag[entity.tag].push(entity.id);
    }

    private removeEntityFromTag(entity: Entity, tag: string | undefined): void {
        if (
            typeof entity.tag !== 'string' ||
            typeof tag === 'undefined' ||
            (typeof tag === 'string' && tag.length === 0)
        ) {
            return;
        }
        if (tag in this.entitiesByTag) {
            const ref = this.entitiesByTag[tag];
            if (ref.includes(entity.id)) {
                ref.splice(ref.indexOf(entity.id), 1);
            }
        }
    }

    // #region events
    private onTagChange(entity: Entity, previous: string | undefined): void {
        if (!!previous && previous.length) {
            this.removeEntityFromTag(entity, previous);
        }
        this.addEntityToTag(entity);
    }
    // #endregion
}
