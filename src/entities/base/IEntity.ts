import { Entity } from './Entity';
import { Game } from '../Game';
import { SuperGroup } from '../SuperGroup';
import { Transform, TransformEvent } from '../../structs/Transform';

export enum EntityEvents {
    Rendered,
    Tag,
    Transform,
    Loaded
}

export enum EntityType {
    Entity,
    Sprite,
    Text,
    Box,
    Group,
    Sound,
    Scene,
    Game
}

export interface IEntityConfig {
    type: EntityType;
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    scale?: number;
    preupdate?: Function;
    update?: Function;
    postupdate?: Function;
    start?: Function;
    destroy?: Function;
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
    game: Game;
    tag: string | undefined;

    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
    scale: number;
    visible: boolean;
    renderable: boolean;

    start?(): void;
    preupdate?(): void;
    update?(): void;
    postupdate?(): void;
    destroy?(): void;
    reconcile(
        transform: Transform,
        origin: Entity,
        changed: TransformEvent,
        last: Entity,
        direction?: Direction,
        id?: string
    ): void;
}
