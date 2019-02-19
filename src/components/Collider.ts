import { IComponentConfig, Component, ComponentType } from './Component';
import { Entity } from '../entities/base/Entity';

export interface IColliderConfig extends IComponentConfig {
    collidable?: boolean;
}

interface IIntersections {
    [key: string]: Entity;
}

export class Collider extends Component {
    public collidable: boolean = true;
    protected intersections: Entity[] = [];
    protected intersectionsById: IIntersections = {};

    public configure({ collidable = true }: IColliderConfig): void {
        this.collidable = collidable;
        super.configure({ type: ComponentType.Collider });
    }

    public addCollision(entity: Entity): boolean {
        if (!this.parent || entity.id === this.parent.id) {
            return false;
        }
        if (!(entity.id in this.intersectionsById)) {
            this.intersections.push(entity);
            this.intersectionsById[entity.id] = entity;
            return true;
        }
        return false;
    }

    public removeCollision(entity: Entity): boolean {
        if (this.parent && entity.id === this.parent.id) {
            return false;
        }
        if (entity.id in this.intersectionsById) {
            this.intersections.splice(this.intersections.indexOf(entity), 1);
            delete this.intersectionsById[entity.id];
            return true;
        }
        return false;
    }

    public hasCollision(entity: Entity): boolean {
        return entity.id in this.intersectionsById;
    }

    public test2(entity: Entity): boolean {
        if (this.parent) {
            if (!this.parent.collidable || !entity.collidable) {
                return false;
            }
            return (
                entity.world.x + entity.world.width >= this.parent.world.x &&
                entity.world.x <= this.parent.world.x + this.parent.world.width &&
                entity.world.y + entity.world.height >= this.parent.world.y &&
                entity.world.y <= this.parent.world.y + this.parent.world.height
            );
        }

        return false;
    }

    public test3(entity: Entity): boolean {
        if (this.parent) {
            return (
                this.test2(entity) &&
                entity.world.z + entity.world.depth >= this.parent.world.z &&
                entity.world.z + entity.world.depth <= this.parent.world.z + this.parent.world.depth
            );
        }

        return false;
    }

    public attach(entity: Entity): void {
        super.attach(entity);
    }

    public detach(): void {
        super.detach();
    }
}
