import { EntityType, EntityEvent } from './base/IEntity';
import { IGroupConfig, Group } from './Group';
import { AssetEntity } from './base/AssetEntity';
import { Entity } from './base/Entity';

export enum SceneEvent {
    Loaded = 'SceneEvent.Loaded'
}
export interface ISceneConfig extends IGroupConfig {
    name: string;
}

export class Scene extends Group {
    public type: EntityType = EntityType.Scene;
    public name: string;
    public loaded: boolean = false;
    public active: boolean = false;
    protected assetCount: number = 0;
    protected assetsLoaded: number = 0;

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
        movable = false,
        tag,
        name,
        load,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: ISceneConfig): void {
        super.configure({
            type: EntityType.Scene,
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
            tag,
            alpha,
            movable,
            collidable: false,
            load,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
        this.name = name;
        // if no assets were added on next frame, trigger scene load
        setTimeout(this.assetLoaded.bind(this), 0);
    }

    public add(entity: Entity): boolean {
        this.bindAsset(entity);
        return super.add(entity);
    }

    public remove(entity: Entity): boolean {
        if (entity instanceof AssetEntity) {
            entity.off(EntityEvent.Loaded, this.onEntityLoaded.bind(this));
            this.assetCount -= 1;
            if (entity.loaded) {
                this.assetsLoaded -= 1;
            }
        }
        return super.remove(entity);
    }

    protected bindAsset(entity: Entity): void {
        if (entity instanceof Group) {
            entity.children.forEach(child => this.bindAsset(child));
        } else if (entity instanceof AssetEntity) {
            this.assetCount += 1;
            if (entity.loaded) {
                this.assetsLoaded += 1;
            } else {
                entity.on(EntityEvent.Loaded, this.onEntityLoaded.bind(this));
            }
        }
    }

    protected assetLoaded(entity: AssetEntity | undefined): void {
        if (typeof entity !== 'undefined') {
            this.assetsLoaded += 1;
        }
        if (this.assetsLoaded >= this.assetCount) {
            if (!this.loaded) {
                this.loaded = true;
                this.emit(SceneEvent.Loaded, this);
            }
        }
    }

    // #region events
    protected onEntityLoaded(entity: AssetEntity): void {
        entity.off(EntityEvent.Loaded, this.onEntityLoaded.bind(this));
        this.assetLoaded(entity);
    }
    // #endregion
}
