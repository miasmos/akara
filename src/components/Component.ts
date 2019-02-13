import * as Util from '../util/Util';
import { Game } from '../entities/Game';
import { Observer } from '../Observer';
import { Entity } from '../entities/base/Entity';

export interface IComponentConfig {
    type?: ComponentType;
}

export enum ComponentEvent {
    Transform = 'ComponentEvent.Transform'
}

export enum ComponentType {
    Component = 'component',
    Transform = 'transform',
    ShapeRenderer = 'shapeRenderer',
    Collider = 'collider'
}

export class Component extends Observer {
    public type: ComponentType;
    public id: string = Util.Random.id(12);
    public game: Game;
    public parent: Entity | undefined;

    public configure({ type = ComponentType.Component }: IComponentConfig): void {
        this.type = type;
    }

    public attach(entity: Entity): void {
        this.detach();
        this.parent = entity;
    }

    public detach(): void {
        this.parent = undefined;
    }
}
