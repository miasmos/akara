import { Entity } from './Entity';
import { EntityType } from './IEntity';
import { Game } from './Game';
import { Color } from '../structs/Color';
import { IGroupConfig } from './SuperGroup';

export interface ITextConfig extends IGroupConfig {
    text?: string;
    color?: Color;
}

export class Text extends Entity {
    private _text: string = '';
    public color: Color = new Color();

    public constructor(
        game: Game,
        {
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            scale = 1,
            text = '',
            layer = 1,
            color = new Color()
        }: ITextConfig
    ) {
        super({
            type: EntityType.Text,
            x,
            y,
            width,
            height,
            scale,
            layer
        });
        this.game = game;
        this.text = text;
        this.color = color;
    }

    public set text(value: string) {
        this._text = value;
    }

    public get text(): string {
        return this._text;
    }
}
