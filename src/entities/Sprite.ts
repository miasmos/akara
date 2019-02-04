import { AssetEntity } from './base/AssetEntity';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './Group';
import { ImageAsset } from '../loader/assets/ImageAsset';
import { AssetType, Asset } from '../loader/assets/Asset';

export interface ISpriteConfig extends IGroupConfig {
    asset: string;
}

export class Sprite extends AssetEntity {
    public type: EntityType = EntityType.Sprite;

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
        asset,
        type = EntityType.Sprite,
        load,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: ISpriteConfig): void {
        super.configure({
            assetType: AssetType.Image,
            type,
            asset,
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
            load,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
    }

    public get image(): HTMLImageElement {
        return (this.asset as ImageAsset).getRef();
    }

    //#region events
    protected onAssetLoaded(asset: Asset): void {
        this.local.width = this.image.width;
        this.local.height = this.image.height;
        super.onAssetLoaded(asset);
    }
    //#endregion
}
