import { Entity } from './base/Entity';
import { Color } from '../structs/Color';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './SuperGroup';
import { Game } from './Game';
import { HexCode } from '../enum/HexCode';

export interface IBoxConfig extends IGroupConfig {
    backgroundColor?: string | Color;
}

export class Box extends Entity {
    public backgroundColor: Color = new Color();

    public constructor(
        game: Game,
        {
            x = 0,
            y = 0,
            z = 0,
            width = 0,
            height = 0,
            scale = 1,
            backgroundColor = HexCode.White,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        }: IBoxConfig
    ) {
        super({
            type: EntityType.Box,
            x,
            y,
            z,
            width,
            height,
            scale,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
        this.game = game;
        this.backgroundColor =
            typeof backgroundColor === 'string' ? new Color(backgroundColor) : backgroundColor;
    }
}
