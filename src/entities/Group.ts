import { Game } from './Game';
import { SuperGroup, IGroupConfig } from './SuperGroup';

// public-facing group, requires passing game instance, simple interface to supergroup
export class Group extends SuperGroup {
    public constructor(
        game: Game,
        { x = 0, y = 0, width = 0, height = 0, scale = 1, layer = 1 }: IGroupConfig
    ) {
        super({
            x,
            y,
            width,
            height,
            scale,
            layer
        });
        this.game = game;
    }
}
