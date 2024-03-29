import { Entity } from './base/Entity';
import { EntityType } from './base/IEntity';
import { Color } from '../structs/Color';
import { IGroupConfig } from './Group';

export interface ITextConfig extends IGroupConfig {
    text?: string;
    color?: string | Color;
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
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        alpha = 1,
        movable = true,
        collidable = true,
        tag,
        text = '',
        color = new Color(),
        preupdate,
        update,
        postupdate,
        start,
        destroy,
        collision
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
            rotateX,
            rotateY,
            rotateZ,
            alpha,
            movable,
            collidable,
            tag,
            preupdate,
            update,
            postupdate,
            start,
            destroy,
            collision
        });
        this.text = text;
        if (typeof color === 'string') {
            this.color = new Color(color);
        } else {
            this.color = color;
        }
    }

    public set text(value: string) {
        this._text = value;
    }

    public get text(): string {
        return this._text;
    }
}
