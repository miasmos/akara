import { Observer } from '../Observer';
import { Random } from '../util/Random';
import { AudioAsset } from './assets/AudioAsset';
import { ImageAsset } from './assets/ImageAsset';
import { Asset } from './assets/Asset';

export enum LoaderEvents {
    Load,
    Complete
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

    public image(path: string, id?: string): void {
        if (!id) {
            id = this.nextId();
        }
        this.load(new ImageAsset(id, path));
    }

    public sound(path: string, id?: string): void {
        if (!id) {
            id = this.nextId();
        }
        this.load(new AudioAsset(id, path));
    }

    public start(): void {
        if (this.count === 0) {
            this.onLoadComplete();
            return;
        }

        for (let index in this.assets) {
            for (let index1 in this.assets[index]) {
                const asset: Asset = this.assets[index][index1];
                asset.load();
            }
        }
    }

    private load(asset: Asset): void {
        if (!(asset.type in this.assets)) {
            this.assets[asset.type] = {};
        }
        this.assets[asset.type][asset.id] = asset;
        asset.on(LoaderEvents.Load, this.onAssetLoaded.bind(this));
        this.count++;
    }

    private nextId(): string {
        const id = Random.id(7);

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

        if (this.assetsLoaded >= this.count) {
            this.onLoadComplete();
        }
    }

    private onLoadComplete(): void {
        this.emit(LoaderEvents.Complete);
    }
}
