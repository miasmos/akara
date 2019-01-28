import { Entity } from './Entity';
import { Game } from './Game';
import { SuperGroup } from './SuperGroup';
import { Transform } from '../structs/Transform';

export enum EntityEvents {
    Rendered,
    Tag,
    Layer
}

export enum EntityType {
    Entity,
    Sprite,
    Text,
    Box,
    Group,
    Scene
}

export interface IEntityConfig {
    type: EntityType;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scale?: number;
    layer?: number;
}

export enum Direction {
    Up,
    Down
}

export interface IEntity {
    id: string;
    moveable: boolean;
    collidable: boolean;
    world: Transform;
    readonly type: EntityType;
    parent: SuperGroup | undefined;
    layer: number;
    game: Game;
    tag: string | undefined;

    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    visible: boolean;
    renderable: boolean;

    start?(): void;
    preupdate?(): void;
    update?(): void;
    postupdate?(): void;
    destroy?(): void;
    reconcile(
        x: number,
        y: number,
        width: number,
        height: number,
        origin: Entity,
        direction?: Direction
    ): void;
}
