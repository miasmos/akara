import { Entity } from './Entity';
import { Game } from '../Game';
import { Group } from '../Group';
import { Transform3, Transform3Event } from '../../structs/Transform3';
import { Point3 } from '../../structs/Point3';

export enum EntityEvent {
    Rendered = 'EntityEvent.Rendered',
    Tag = 'EntityEvent.Tag',
    Transform = 'EntityEvent.Transform',
    Scale = 'EntityEvent.Scale',
    Loaded = 'EntityEvent.Loaded'
}

export enum EntityType {
    Entity,
    Sprite,
    Text,
    Box,
    Group,
    Sound,
    Scene,
    Game,
    Camera
}

export interface IEntityConfig {
    type?: EntityType;
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    pivotX?: number;
    pivotY?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    alpha?: number;
    tag?: string;
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
    world: Transform3;
    readonly type: EntityType;
    parent: Group | undefined;
    scale: Point3;
    game: Game;
    tag: string | undefined;

    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    pivotX: number;
    pivotY: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    visible: boolean;
    alpha: number;
    renderable: boolean;

    equals(entity: Entity): boolean;
    start?(): void;
    preupdate?(): void;
    update?(): void;
    postupdate?(): void;
    destroy?(): void;
    reconcile(
        transform: Transform3,
        origin: Entity,
        changed: Transform3Event,
        last: Entity,
        direction?: Direction,
        id?: string
    ): void;
}
