import { Entity } from './Entity';
import { EntityType } from './IEntity';
import { Game } from './Game';
import { IGroupConfig } from './SuperGroup';

export interface ISceneConfig extends IGroupConfig {}

export class Scene extends Entity {
    public constructor(
        game: Game,
        { x = 0, y = 0, width = 0, height = 0, scale = 1 }: ISceneConfig
    ) {
        super({
            type: EntityType.Scene,
            x,
            y,
            width,
            height,
            scale
        });

        this.game = game;
    }
}
