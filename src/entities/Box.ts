import { Entity } from './base/Entity';
import { Color } from '../structs/Color';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './Group';
import { HexCode } from '../enum/HexCode';

export interface IBoxConfig extends IGroupConfig {
    backgroundColor?: string | Color;
}

export class Box extends Entity {
    public type: EntityType = EntityType.Box;
    public backgroundColor: Color = new Color();

    public configure({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        pivotX = 0,
        pivotY = 0,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        movable = true,
        collidable = true,
        alpha = 1,
        tag,
        backgroundColor = HexCode.White,
        preupdate,
        update,
        postupdate,
        start,
        destroy,
        collision
    }: IBoxConfig): void {
        super.configure({
            type: EntityType.Box,
            x,
            y,
            z,
            width,
            height,
            scaleX,
            scaleY,
            scaleZ,
            pivotX,
            pivotY,
            rotateX,
            rotateY,
            rotateZ,
            tag,
            alpha,
            preupdate,
            update,
            postupdate,
            start,
            destroy,
            collision
        });
        this.backgroundColor =
            typeof backgroundColor === 'string' ? new Color(backgroundColor) : backgroundColor;
    }
}
