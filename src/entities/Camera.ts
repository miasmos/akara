import { Entity } from './base/Entity';
import { EntityType, EntityEvent } from './base/IEntity';
import { IGroupConfig } from './Group';
import { Sizing } from '../enum/Sizing';
import { Transform3Event } from '../structs/Transform3';

export interface ICameraConfig extends IGroupConfig {
    sizing?: Sizing;
}

export class Camera extends Entity {
    public type: EntityType = EntityType.Camera;
    public sizing: Sizing = Sizing.Auto;
    protected _target: Entity | undefined;

    public configure({
        x = 0,
        y = 0,
        z = 100,
        width = 0,
        height = 0,
        depth = 1,
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
        destroy,
        collision
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
        if (typeof this.target === 'undefined') {
            this.follow(this.game);
        }
    }

    public follow(entity: Entity | undefined): void {
        this._target = entity;
    }

    public unfollow(entity: Entity): void {
        this._target = undefined;
    }

    // #region properties
    public get target(): Entity | undefined {
        return this._target;
    }

    public set target(value: Entity | undefined) {
        if (typeof this.target !== 'undefined') {
            this.target.off(EntityEvent.Transform, this.onTargetMove.bind(this));
        }
        if (typeof value !== 'undefined') {
            value.on(EntityEvent.Transform, this.onTargetMove.bind(this));
        }
        this._target = value;
    }
    // #endregion

    // #region events
    protected onTargetMove(entity: Entity, previous: number, changed: Transform3Event): void {
        switch (changed) {
            case Transform3Event.X:
            case Transform3Event.Y:
            case Transform3Event.Z:
                if (this.game.camera.active) {
                    this.x = entity.x - this.game.camera.active.width / 2;
                    this.y = entity.y - this.game.camera.active.height / 2;
                }
                break;
            default:
        }
    }
    // #endregion
}
