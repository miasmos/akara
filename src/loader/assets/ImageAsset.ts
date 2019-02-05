import { Asset, AssetType } from './Asset';

export class ImageAsset extends Asset {
    protected ref: HTMLImageElement;
    public readonly type: AssetType = AssetType.Image;

    public constructor(name: string, path: string) {
        super(name, path, 'load');
    }

    protected getLoader(): HTMLImageElement {
        return new Image();
    }

    public getRef(): HTMLImageElement {
        if (!this.ref) {
            this.ref = this.getLoader();
        }
        return this.ref;
    }
}
