import { Game } from './entities/Game';
import { ComponentType, Component, IComponentConfig } from './components/Component';
import { Transform, ITransformConfig } from './components/Transform';
import { Collider, IColliderConfig } from './components/Collider';

interface IComponentFactoryConfig {
    game: Game;
}

export class ComponentFactory {
    public game: Game;

    public configure({ game }: IComponentFactoryConfig): void {
        this.game = game;
    }

    public static get(
        game: Game,
        type: ComponentType,
        config: IComponentConfig | IColliderConfig | ITransformConfig
    ): Component {
        switch (type) {
            case ComponentType.Transform:
                return this.transform(game, config as ITransformConfig);
            case ComponentType.Collider:
                return this.collider(game, config as IColliderConfig);
            default:
        }

        return this.component(game, config as IComponentConfig);
    }

    public get(
        type: ComponentType,
        config: IComponentConfig | IColliderConfig | ITransformConfig
    ): Component {
        return ComponentFactory.get(this.game, type, config);
    }

    public static collider(game: Game, config: IColliderConfig): Collider {
        const collider = new Collider();
        collider.game = game;
        collider.configure(config);
        return collider;
    }

    public collider(config: IColliderConfig): Collider {
        return ComponentFactory.collider(this.game, config);
    }

    public static transform(game: Game, config: ITransformConfig): Transform {
        const transform = new Transform();
        transform.game = game;
        transform.configure(config);
        return transform;
    }

    public transform(config: ITransformConfig): Transform {
        return ComponentFactory.transform(this.game, config);
    }

    public static component(game: Game, config: IComponentConfig): Component {
        const component = new Component();
        component.game = game;
        component.configure(config);
        return component;
    }

    public component(config: IComponentConfig): Component {
        return ComponentFactory.component(this.game, config);
    }
}
