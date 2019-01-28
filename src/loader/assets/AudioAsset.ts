import { Asset, AssetType } from './Asset';

export class AudioAsset extends Asset {
    protected ref: HTMLAudioElement;
    public readonly type: AssetType = AssetType.Audio;

    public constructor(name: string, path: string) {
        super(name, path, 'canplaythrough');
    }

    protected getLoader(): HTMLAudioElement {
        return new Audio();
    }

    public getRef(): HTMLAudioElement {
        if (!this.ref) {
            this.ref = this.getLoader();
        }
        return this.ref;
    }
}
