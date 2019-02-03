import { Game } from './Game';
import { SuperGroup, IGroupConfig } from './SuperGroup';
import { Sizing } from '../enum/Sizing';

// public-facing group, requires passing game instance, simple interface to supergroup
export class Group extends SuperGroup {
    public sizing: Sizing = Sizing.Auto;

    public constructor(
        game: Game,
        {
            x = 0,
            y = 0,
            z = 0,
            width = 0,
            height = 0,
            depth = 0,
            scaleX = 1,
            scaleY = 1,
            scaleZ = 1,
            alpha = 1,
            sizing,
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
            scaleX,
            scaleY,
            scaleZ,
            alpha,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
        this.game = game;

        if (typeof sizing !== 'undefined') {
            this.sizing = sizing;
        } else {
            this.sizing = game.settings.sizing;
        }
    }
}
