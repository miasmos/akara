import { Game } from './Game';
import { SuperGroup, IGroupConfig } from './SuperGroup';

// public-facing group, requires passing game instance, simple interface to supergroup
export class Group extends SuperGroup {
    public constructor(
        game: Game,
        {
            x = 0,
            y = 0,
            z = 0,
            width = 0,
            height = 0,
            depth = 0,
            scale = 1,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        }: IGroupConfig
    ) {
        super({
            x,
            y,
            z,
            width,
            height,
            depth,
            scale,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
        this.game = game;
    }
}
