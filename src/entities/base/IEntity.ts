import { Entity } from './Entity';
import { Game } from '../Game';
import { Group } from '../Group';
import { Transform3, Transform3Event } from '../../structs/Transform3';
import { Point3 } from '../../structs/Point3';
import { Direction } from '../../enum/Direction';
import { Point2 } from '../../structs/Point2';
import { MouseButton } from '../../enum/Mouse';

export enum EntityEvent {
    Rendered = 'EntityEvent.Rendered',
    Tag = 'EntityEvent.Tag',
    Transform = 'EntityEvent.Transform',
    Scale = 'EntityEvent.Scale',
    Loaded = 'EntityEvent.Loaded',
    ComponentAdd = 'EntityEvent.ComponentAdd',
    ComponentRemove = 'EntityEvent.ComponentRemove'
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
    preupdate?: () => void;
    update?: () => void;
    postupdate?: () => void;
    start?: () => void;
    destroy?: () => void;
    collision?: () => void;
    click?: () => void;
}

export interface IEntity {
    [key: string]: any;
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
    collision?(entity: Entity): void;
    click?(origin: Point2, button: MouseButton): void;
    reconcile(
        transform: Transform3,
        origin: Entity,
        changed: Transform3Event,
        last: Entity,
        direction?: Direction,
        id?: string
    ): void;
}

export interface IEntityRegisters {
    update?(): void;
    preupdate?(): void;
    postupdate?(): void;
    start?(): void;
    destroy?(): void;
    collision?(entity: Entity): void;
    click?(origin: Point2, button: MouseButton): void;
}
