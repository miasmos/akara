import { AssetEntity } from './base/AssetEntity';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './SuperGroup';
import { Game } from './Game';
import { ImageAsset } from '../loader/assets/ImageAsset';
import { AssetType } from '../loader/assets/Asset';

export interface ISpriteConfig extends IGroupConfig {
    asset: string;
}

export class Sprite extends AssetEntity {
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
            asset,
            type = EntityType.Sprite
        }: ISpriteConfig
    ) {
        super(game, {
            assetType: AssetType.Image,
            type,
            asset,
            x,
            y,
            z,
            width,
            height,
            depth,
            scale
        });
    }

    public get image(): HTMLImageElement {
        return (this.asset as ImageAsset).getRef();
    }
}
