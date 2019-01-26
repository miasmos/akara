import { Asset as AssetEnum } from '../../enum/Asset';
import { Asset } from './Asset';
export class ImageAsset extends Asset {
    protected ref: HTMLImageElement;
    public readonly type: AssetEnum = AssetEnum.Image;

    public constructor(id: string, path: string) {
        super(id, path, 'load');
    }

    protected getLoader(): HTMLImageElement {
        return new Image();
    }

    public getRef(): HTMLImageElement {
        if (!this.ref) {
            return this.getLoader();
        } else {
            return this.ref;
        }
    }
}
