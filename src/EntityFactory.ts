import { EntityType, IEntityConfig } from './entities/base/IEntity';
import { IGroupConfig } from './entities/Group';
import { Box, IBoxConfig } from './entities/Box';
import { Game, IGameConfig } from './entities/Game';
import { Entity } from './entities/base/Entity';
import { Scene, ISceneConfig } from './entities/Scene';
import { Group } from './entities/Group';
import { ISoundConfig, Sound } from './entities/Sound';
import { ISpriteConfig, Sprite } from './entities/Sprite';
import { ComponentType } from './components/Component';
import { ComponentFactory } from './ComponentFactory';

export class EntityFactory {
    protected _game: Game;

    public constructor(game: Game) {
        this._game = game;
    }

    public get(
        type: EntityType,
        config: IGroupConfig | IEntityConfig | ISceneConfig | IGameConfig | ISoundConfig
    ): Entity | Sound | Scene | Sprite | Game | Box {
        switch (type) {
            case EntityType.Game:
                return EntityFactory.game(config as IGameConfig);
            case EntityType.Box:
                return this.box(config as IEntityConfig);
            case EntityType.Scene:
                return this.scene(config as ISceneConfig);
            case EntityType.Group:
                return this.group(config as IGroupConfig);
            case EntityType.Sound:
                return this.sound(config as ISoundConfig);
            case EntityType.Sprite:
                return this.sprite(config as ISpriteConfig);
        }

        return this.entity(config as IEntityConfig);
    }

    public static game(config: IGameConfig): Game {
        const game = new Game();
        game.game = game;
        const transform = ComponentFactory.get(game, ComponentType.Transform, {});
        game.addComponent(transform);
        game.configure(config);
        return game;
    }

    public sprite(config: ISpriteConfig): Sprite {
        const sprite = new Sprite();
        sprite.game = this._game;
        const transform = ComponentFactory.get(this._game, ComponentType.Transform, {});
        sprite.addComponent(transform);
        sprite.configure(config);
        return sprite;
    }

    public sound(config: ISoundConfig): Sound {
        const sound = new Sound();
        sound.game = this._game;
        const transform = ComponentFactory.get(this._game, ComponentType.Transform, {});
        sound.addComponent(transform);
        sound.configure(config);
        return sound;
    }

    public group(config: IGroupConfig): Group {
        const group = new Group();
        group.game = this._game;
        const transform = ComponentFactory.get(this._game, ComponentType.Transform, {});
        group.addComponent(transform);
        group.configure(config);
        return group;
    }

    public scene(config: ISceneConfig): Scene {
        const scene = new Scene();
        scene.game = this._game;
        scene.configure(config);
        return scene;
    }

    public box(config: IBoxConfig): Box {
        const box = new Box();
        box.game = this._game;
        const transform = ComponentFactory.get(this._game, ComponentType.Transform, {});
        box.addComponent(transform);
        box.configure(config);
        return box;
    }

    public entity(config: IEntityConfig): Entity {
        const entity = new Entity();
        entity.game = this._game;
        entity.configure(config);
        return entity;
    }
}
