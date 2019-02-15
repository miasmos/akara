import { Asset, AssetType } from './Asset';

export class EmptyAsset extends Asset {
    protected ref: undefined;
    public readonly type: AssetType = AssetType.Empty;

    public constructor(name: string = '', path: string = '', event: string = '') {
        super(name, path, event);
    }

    protected getLoader(): undefined {
        return undefined;
    }

    public getRef(): undefined {
        if (!this.ref) {
            this.ref = this.getLoader();
        }
        return this.ref;
    }
}
