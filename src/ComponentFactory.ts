import { Game } from './entities/Game';
import { ComponentType, Component, IComponentConfig } from './components/Component';
import { Transform, ITransformConfig } from './components/Transform';
import { Collider, IColliderConfig } from './components/Collider';

export class ComponentFactory {
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
        }

        return this.component(game, config as IComponentConfig);
    }

    public static collider(game: Game, config: IColliderConfig): Collider {
        const collider = new Collider();
        collider.game = game;
        collider.configure(config);
        return collider;
    }

    public static transform(game: Game, config: ITransformConfig): Transform {
        const transform = new Transform();
        transform.game = game;
        transform.configure(config);
        return transform;
    }

    public static component(game: Game, config: IComponentConfig): Component {
        const component = new Component();
        component.game = game;
        component.configure(config);
        return component;
    }
}
