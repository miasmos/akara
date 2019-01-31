import { AssetEntity } from './base/AssetEntity';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './SuperGroup';
import { Game } from './Game';
import { AudioAsset } from '../loader/assets/AudioAsset';
import { AssetType } from '../loader/assets/Asset';

export interface ISoundConfig extends IGroupConfig {
    asset: string;
}

export class Sound extends AssetEntity {
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
            preupdate,
            update,
            postupdate,
            start,
            destroy
        }: ISoundConfig
    ) {
        super(game, {
            type: EntityType.Sound,
            assetType: AssetType.Audio,
            x,
            y,
            z,
            width,
            height,
            depth,
            scale,
            asset,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
    }

    public get sound(): HTMLAudioElement {
        return (this.asset as AudioAsset).getRef();
    }
}
