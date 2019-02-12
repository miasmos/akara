import { EntityFactory } from './EntityFactory';
import { Game, IGameConfig } from './entities/Game';
import { ComponentFactory } from './ComponentFactory';
import { IBoxConfig, Box } from './entities/Box';
import { Camera, ICameraConfig } from './entities/Camera';
import { IGroupConfig, Group } from './entities/Group';
import { ISceneConfig, Scene } from './entities/Scene';
import { ISoundConfig, Sound } from './entities/Sound';
import { ISpriteConfig, Sprite } from './entities/Sprite';
import { ITextConfig, Text } from './entities/Text';
import { IEntityConfig } from './entities/base/IEntity';
import { Entity } from './entities/base/Entity';
import { ITransformConfig, Transform } from './components/Transform';
import { Collider, IColliderConfig } from './components/Collider';
import { IComponentConfig, Component } from './components/Component';
import { Color } from './structs/Color';
import { Pivot2 } from './structs/Pivot2';
import { Point2 } from './structs/Point2';
import { Point3 } from './structs/Point3';
import { Rotation3 } from './structs/Rotation3';
import { Size3 } from './structs/Size3';
import { Time } from './structs/Time';
import { Transform3 } from './structs/Transform3';
import { Vector2 } from './structs/Vector2';

interface IAkara {
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

export namespace Akara {
    export const { game } = EntityFactory;
    export const { box } = EntityFactory;
    export const { camera } = EntityFactory;
    export const { group } = EntityFactory;
    export const { scene } = EntityFactory;
    export const { sound } = EntityFactory;
    export const { sprite } = EntityFactory;
    export const { text } = EntityFactory;
    export const { entity } = EntityFactory;
    export const { transform } = ComponentFactory;
    export const { collider } = ComponentFactory;
    export const { component } = ComponentFactory;
    export const color = Color;
    export const pivot2 = Pivot2;
    export const point2 = Point2;
    export const point3 = Point3;
    export const rotation3 = Rotation3;
    export const size3 = Size3;
    export const time = Time;
    export const transform3 = Transform3;
    export const vector2 = Vector2;
}

declare global {
    interface Window {
        Akara: IAkara;
    }
}
window.Akara = Akara;
