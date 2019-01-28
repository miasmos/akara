import { Asset, AssetType } from './Asset';

export class EmptyAsset extends Asset {
    protected ref: undefined;
    public readonly type: AssetType = AssetType.Empty;

    public constructor() {
        super('', '', '');
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
