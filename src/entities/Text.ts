import { Entity } from './base/Entity';
import { EntityType } from './base/IEntity';
import { Color } from '../structs/Color';
import { IGroupConfig } from './Group';

export interface ITextConfig extends IGroupConfig {
    text?: string;
    color?: Color;
}

export class Text extends Entity {
    public type: EntityType = EntityType.Text;
    private _text: string = '';
    public color: Color = new Color();

    public configure({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        pivotX = 0,
        pivotY = 0,
        alpha = 1,
        tag,
        text = '',
        color = new Color(),
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: ITextConfig): void {
        super.configure({
            type: EntityType.Text,
            x,
            y,
            z,
            width,
            height,
            depth,
            scaleX,
            scaleY,
            scaleZ,
            pivotX,
            pivotY,
            alpha,
            tag,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
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
