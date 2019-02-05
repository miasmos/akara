import { IComponentConfig, Component, ComponentType } from './Component';
import { Entity } from '../entities';

export enum ColliderEvent {}

export interface IColliderConfig extends IComponentConfig {
    collideable?: boolean;
}

interface IIntersections {
    [key: string]: Entity;
}

export class Collider extends Component {
    public collideable: boolean;
    protected intersections: Entity[] = [];
    protected intersectionsById: IIntersections = {};

    public configure({ collideable = true }: IColliderConfig): void {
        this.collideable = collideable;
        super.configure({ type: ComponentType.Collider });
    }

    public test(entity: Entity): boolean {
        if (!!this.parent) {
            if (!this.parent.collidable || !entity.collidable) {
                return false;
            }
            // return entity.world.x
            return true;
        } else {
            return false;
        }
    }

    public attach(entity: Entity): void {
        super.attach(entity);
    }

    public detach(): void {
        super.detach();
    }
}
