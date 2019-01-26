import { Asset as AssetEnum } from '../../enum/Asset';
import { Asset } from './Asset';

export class AudioAsset extends Asset {
    protected ref: HTMLAudioElement;
    public readonly type: AssetEnum = AssetEnum.Audio;

    public constructor(id: string, path: string) {
        super(id, path, 'canplaythrough');
    }

    protected getLoader(): HTMLAudioElement {
        return new Audio();
    }

    public getRef(): HTMLAudioElement {
        if (!this.ref) {
            return this.getLoader();
        } else {
            return this.ref;
        }
    }
}
