import { EntityType, IEntityConfig } from './entities/base/IEntity';
import { IGroupConfig, Group } from './entities/Group';
import { Box, IBoxConfig } from './entities/Box';
import { Game, IGameConfig } from './entities/Game';
import { Entity } from './entities/base/Entity';
import { Scene, ISceneConfig } from './entities/Scene';
import { ISoundConfig, Sound } from './entities/Sound';
import { ISpriteConfig, Sprite } from './entities/Sprite';
import { ComponentType } from './components/Component';
import { ComponentFactory } from './ComponentFactory';
import { ICameraConfig, Camera } from './entities/Camera';
import { ITextConfig, Text } from './entities/Text';

interface IEntityFactoryConfig {
    game: Game;
}

export class EntityFactory {
    protected _game: Game;

    public configure({ game }: IEntityFactoryConfig): void {
        this._game = game;
    }

    public static get(
        type: EntityType,
        game: Game,
        config:
            | IGroupConfig
            | IEntityConfig
            | ISceneConfig
            | IGameConfig
            | ISoundConfig
            | ICameraConfig
    ): Entity | Sound | Scene | Sprite | Game | Box | Camera {
        switch (type) {
            case EntityType.Game:
                return EntityFactory.game(config as IGameConfig);
            case EntityType.Box:
                return this.box(game, config as IEntityConfig);
            case EntityType.Scene:
                return this.scene(game, config as ISceneConfig);
            case EntityType.Group:
                return this.group(game, config as IGroupConfig);
            case EntityType.Sound:
                return this.sound(game, config as ISoundConfig);
            case EntityType.Sprite:
                return this.sprite(game, config as ISpriteConfig);
            case EntityType.Camera:
                return this.camera(game, config as ICameraConfig);
            default:
                return this.entity(game, config as IEntityConfig);
        }
    }

    public get(
        type: EntityType,
        config:
            | IGroupConfig
            | IEntityConfig
            | ISceneConfig
            | IGameConfig
            | ISoundConfig
            | ICameraConfig
    ): Entity | Sound | Scene | Sprite | Game | Box | Camera {
        return EntityFactory.get(type, this._game, config);
    }

    public static game(config: IGameConfig): Game {
        const game = new Game();
        game.game = game;
        const transform = ComponentFactory.transform(game, {});
        game.addComponent(transform);
        game.configure(config);
        return game;
    }

    public game(config: IGameConfig): Game {
        return EntityFactory.game(config);
    }

    public static sprite(game: Game, config: ISpriteConfig): Sprite {
        const sprite = new Sprite();
        sprite.game = game;
        const transform = ComponentFactory.transform(game, {});
        sprite.addComponent(transform);
        const collider = ComponentFactory.collider(game, {});
        sprite.addComponent(collider);
        sprite.configure(config);
        return sprite;
    }

    public sprite(config: ISpriteConfig): Sprite {
        return EntityFactory.sprite(this._game, config);
    }

    public static sound(game: Game, config: ISoundConfig): Sound {
        const sound = new Sound();
        sound.game = game;
        const transform = ComponentFactory.transform(game, {});
        sound.addComponent(transform);
        sound.configure(config);
        return sound;
    }

    public sound(config: ISoundConfig): Sound {
        return EntityFactory.sound(this._game, config);
    }

    public static group(game: Game, config: IGroupConfig): Group {
        const group = new Group();
        group.game = game;
        const transform = ComponentFactory.transform(game, {});
        group.addComponent(transform);
        group.configure(config);
        return group;
    }

    public group(config: IGroupConfig): Group {
        return EntityFactory.group(this._game, config);
    }

    public static scene(game: Game, config: ISceneConfig): Scene {
        const scene = new Scene();
        scene.game = game;
        scene.configure(config);
        return scene;
    }

    public scene(config: ISceneConfig): Scene {
        return EntityFactory.scene(this._game, config);
    }

    public static box(game: Game, config: IBoxConfig): Box {
        const box = new Box();
        box.game = game;
        const transform = ComponentFactory.transform(game, {});
        box.addComponent(transform);
        const collider = ComponentFactory.collider(game, {});
        box.addComponent(collider);
        box.configure(config);
        return box;
    }

    public box(config: IBoxConfig): Box {
        return EntityFactory.box(this._game, config);
    }

    public static camera(game: Game, config: ICameraConfig): Camera {
        const camera = new Camera();
        camera.game = game;
        const transform = ComponentFactory.transform(game, {});
        camera.addComponent(transform);
        camera.configure(config);
        return camera;
    }

    public camera(config: ICameraConfig): Camera {
        return EntityFactory.camera(this._game, config);
    }

    public static text(game: Game, config: ITextConfig): Text {
        const text = new Text();
        text.game = game;
        const transform = ComponentFactory.transform(game, {});
        text.addComponent(transform);
        text.configure(config);
        return text;
    }

    public text(config: ITextConfig): Text {
        return EntityFactory.text(this._game, config);
    }

    public static entity(game: Game, config: IEntityConfig): Entity {
        const entity = new Entity();
        entity.game = game;
        const transform = ComponentFactory.transform(game, {});
        entity.addComponent(transform);
        entity.configure(config);
        return entity;
    }

    public entity(config: IEntityConfig): Entity {
        return EntityFactory.entity(this._game, config);
    }
}
