import { Game, IGameConfig } from './entities/Game';
import { Box, IBoxConfig } from './entities/Box';
import { Camera, ICameraConfig } from './entities/Camera';
import { Group, IGroupConfig } from './entities/Group';
import { Scene, ISceneConfig } from './entities/Scene';
import { Sound, ISoundConfig } from './entities/Sound';
import { Sprite, ISpriteConfig } from './entities/Sprite';
import { Text, ITextConfig } from './entities/Text';
import { Entity } from './entities/base/Entity';
import { Transform, ITransformConfig } from './components/Transform';
import { Collider, IColliderConfig } from './components/Collider';
import { Component, IComponentConfig } from './components/Component';
import { Color } from './structs/Color';
import { Pivot2 } from './structs/Pivot2';
import { Point2 } from './structs/Point2';
import { Point3 } from './structs/Point3';
import { Rotation3 } from './structs/Rotation3';
import { Size3 } from './structs/Size3';
import { Time } from './structs/Time';
import { Transform3 } from './structs/Transform3';
import { Vector2 } from './structs/Vector2';
import { EntityFactory } from './EntityFactory';
import { ComponentFactory } from './ComponentFactory';
import { IEntityConfig } from './entities/base/IEntity';

interface IBase {
    game: typeof Game;
    box: typeof Box;
    camera: typeof Camera;
    group: typeof Group;
    scene: typeof Scene;
    sound: typeof Sound;
    sprite: typeof Sprite;
    text: typeof Text;
    entity: typeof Entity;
    transform: typeof Transform;
    collider: typeof Collider;
    component: typeof Component;
}

interface IAkara {
    base: IBase;
    game(config: IGameConfig): Game;
    box(game: Game, config: IBoxConfig): Box;
    camera(game: Game, config: ICameraConfig): Camera;
    group(game: Game, config: IGroupConfig): Group;
    scene(game: Game, config: ISceneConfig): Scene;
    sound(game: Game, config: ISoundConfig): Sound;
    sprite(game: Game, config: ISpriteConfig): Sprite;
    text(game: Game, config: ITextConfig): Text;
    entity(game: Game, config: IEntityConfig): Entity;
    transform(game: Game, config: ITransformConfig): Transform;
    collider(game: Game, config: IColliderConfig): Collider;
    component(game: Game, config: IComponentConfig): Component;
    color: typeof Color;
    pivot2: typeof Pivot2;
    point2: typeof Point2;
    point3: typeof Point3;
    rotation3: typeof Rotation3;
    size3: typeof Size3;
    time: typeof Time;
    transform3: typeof Transform3;
    vector2: typeof Vector2;
}

export const Akara: IAkara = {
    base: {
        game: Game,
        box: Box,
        camera: Camera,
        group: Group,
        scene: Scene,
        sound: Sound,
        sprite: Sprite,
        text: Text,
        entity: Entity,
        transform: Transform,
        collider: Collider,
        component: Component
    },
    game: EntityFactory.game,
    box: EntityFactory.box,
    camera: EntityFactory.camera,
    group: EntityFactory.group,
    scene: EntityFactory.scene,
    sound: EntityFactory.sound,
    sprite: EntityFactory.sprite,
    text: EntityFactory.text,
    entity: EntityFactory.entity,
    transform: ComponentFactory.transform,
    collider: ComponentFactory.collider,
    component: ComponentFactory.component,
    color: Color,
    pivot2: Pivot2,
    point2: Point2,
    point3: Point3,
    rotation3: Rotation3,
    size3: Size3,
    time: Time,
    transform3: Transform3,
    vector2: Vector2
};

declare global {
    interface Window {
        Akara: IAkara;
    }
}
window.Akara = Akara;
