import { Asset, AssetType } from './Asset';

export class ImageAsset extends Asset {
    protected ref: HTMLImageElement;
    public readonly type: AssetType = AssetType.Image;

    public constructor(name: string, path: string) {
        super(name, path, 'load');
    }

    protected getLoader(): HTMLImageElement {
        return document.createElement('img') as HTMLImageElement;
    }

    public getRef(): HTMLImageElement {
        if (!this.ref) {
            this.ref = this.getLoader();
        }
        return this.ref;
    }
}
