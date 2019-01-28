import { Observer } from '../Observer';
import { Random } from '../util/Random';
import { AudioAsset } from './assets/AudioAsset';
import { ImageAsset } from './assets/ImageAsset';
import { Asset, AssetType } from './assets/Asset';
import { EmptyAsset } from './assets/EmptyAsset';

export enum LoaderEvents {
    Load,
    Add
}

interface IAssets {
    [key: number]: IAssetCategory;
}
interface IAssetCategory {
    [key: string]: Asset;
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
            for (let index in this.assets) {
                for (let index1 in this.assets[index]) {
                    const asset: Asset = this.assets[index][index1];
                    asset.load();
                }
            }
            return true;
        }
        return false;
    }

    private instantiate(type: AssetType, path: string, name: string): Asset {
        let asset;
        if (this.has(type, name)) {
            asset = this.get(type, name);
        } else {
            asset = this.load(this.getAssetInstance(type, path, name));
            this.emit(LoaderEvents.Add, asset);
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
        asset.on(LoaderEvents.Load, this.onAssetLoaded.bind(this));
        this.count++;

        if (this.started) {
            asset.load();
        }
        return asset;
    }

    private nextId(): string {
        const id = Random.id(12);

        if (id in this.assets) {
            return this.nextId();
        } else {
            return id;
        }
    }

    private onAssetLoaded(asset: Asset): void {
        this.assetsLoaded++;
        asset.loaded = true;
        this.emit(LoaderEvents.Load, asset);
    }
}
