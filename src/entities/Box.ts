import { Entity } from './Entity';
import { Color } from '../structs/Color';
import { EntityType } from './IEntity';
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
            width = 0,
            height = 0,
            scale = 1,
            layer = 1,
            backgroundColor = HexCode.White
        }: IBoxConfig
    ) {
        super({
            type: EntityType.Box,
            x,
            y,
            width,
            height,
            scale,
            layer
        });
        this.game = game;
        this.backgroundColor =
            typeof backgroundColor === 'string' ? new Color(backgroundColor) : backgroundColor;
    }
}
