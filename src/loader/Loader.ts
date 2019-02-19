import { Observer } from '../Observer';
import { Random } from '../util/Util';
import { Asset, AssetType } from './assets/Asset';
import { AudioAsset } from './assets/AudioAsset';
import { ImageAsset } from './assets/ImageAsset';
import { EmptyAsset } from './assets/EmptyAsset';
import { LoaderEvent } from '../enum/LoaderEvent';

interface IAssetCategory {
    [key: string]: Asset;
}

interface IAssets {
    [key: string]: IAssetCategory;
}

export class Loader extends Observer {
    private assets: IAssets = {};
    public count: number = 0;
    private assetsLoaded: number = 0;
    public started: boolean = false;

    public image(path: string, name: string): Asset {
        return this.instantiate(AssetType.Image, path, name);
    }

    public sound(path: string, name: string): Asset {
        return this.instantiate(AssetType.Audio, path, name);
    }

    public empty(name: string): Asset {
        return this.instantiate(AssetType.Empty, '', name);
    }

    public get(type: AssetType, name: string): Asset | undefined {
        if (type in this.assets) {
            if (name in this.assets[type]) {
                return this.assets[type][name];
            }
        }

        return undefined;
    }

    public has(type: AssetType, name: string): boolean {
        return !!this.get(type, name);
    }

    public start(): boolean {
        if (!this.started) {
            this.started = true;
            Object.keys(this.assets).forEach((value: string) => {
                const assetCategories: IAssetCategory = this.assets[value];
                Object.values(assetCategories).forEach((asset: Asset) => asset.load());
            });

            return true;
        }
        return false;
    }

    private instantiate(type: AssetType, path: string, name: string): Asset {
        let asset;
        if (this.has(type, name)) {
            asset = this.get(type, name) as Asset;
        } else {
            asset = this.load(this.getAssetInstance(type, path, name));
            this.emit(LoaderEvent.Add, asset);
        }
        return asset;
    }

    private getAssetInstance(
        type: AssetType,
        path: string,
        name: string
    ): ImageAsset | AudioAsset | EmptyAsset {
        switch (type) {
            case AssetType.Image:
                return new ImageAsset(name, path);
            case AssetType.Audio:
                return new AudioAsset(name, path);
            default:
                return new EmptyAsset();
        }
    }

    private load(asset: Asset): Asset {
        if (!(asset.type in this.assets)) {
            this.assets[asset.type] = {};
        }
        this.assets[asset.type][asset.name] = asset;
        asset.on(LoaderEvent.Load, this.onAssetLoaded.bind(this));
        this.count += 1;

        if (this.started) {
            asset.load();
        }
        return asset;
    }

    private onAssetLoaded(asset: Asset): void {
        this.assetsLoaded += 1;
        this.emit(LoaderEvent.Load, asset);
    }
}
