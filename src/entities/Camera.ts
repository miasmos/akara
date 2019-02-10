import { Entity } from './base/Entity';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './Group';
import { Sizing } from '../enum/Sizing';

export interface ICameraConfig extends IGroupConfig {
    sizing?: Sizing;
}

export class Camera extends Entity {
    public type: EntityType = EntityType.Camera;
    public sizing: Sizing = Sizing.Auto;

    public configure({
        x = 0,
        y = 0,
        z = 1,
        width = 0,
        height = 0,
        depth = 10,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        pivotX = 0,
        pivotY = 0,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        alpha = 1,
        sizing = Sizing.Auto,
        tag,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: ICameraConfig): void {
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
            tag,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });

        this.sizing = sizing;
    }
}
