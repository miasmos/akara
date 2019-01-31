import { Entity } from './base/Entity';
import { EntityType } from './base/IEntity';
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
            z = 0,
            width = 0,
            height = 0,
            depth = 0,
            scale = 1,
            text = '',
            color = new Color(),
            preupdate,
            update,
            postupdate,
            start,
            destroy
        }: ITextConfig
    ) {
        super({
            type: EntityType.Text,
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
