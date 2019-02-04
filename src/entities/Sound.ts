import { AssetEntity } from './base/AssetEntity';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './Group';
import { AudioAsset } from '../loader/assets/AudioAsset';
import { AssetType } from '../loader/assets/Asset';

export interface ISoundConfig extends IGroupConfig {
    asset: string;
}

export class Sound extends AssetEntity {
    public type: EntityType = EntityType.Sound;

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
        tag,
        asset,
        load,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: ISoundConfig): void {
        super.configure({
            type: EntityType.Sound,
            assetType: AssetType.Audio,
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
            tag,
            asset,
            load,
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
