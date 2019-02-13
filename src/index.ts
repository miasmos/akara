import { Game } from './entities/Game';
import { Box } from './entities/Box';
import { Camera } from './entities/Camera';
import { Group } from './entities/Group';
import { Scene } from './entities/Scene';
import { Sound } from './entities/Sound';
import { Sprite } from './entities/Sprite';
import { Text } from './entities/Text';
import { Entity } from './entities/base/Entity';
import { Transform } from './components/Transform';
import { Collider } from './components/Collider';
import { Component } from './components/Component';
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
    component: Component,
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
