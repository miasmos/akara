import { Observer } from './Observer';
import { Asset as AssetEnum } from './enum/Asset';
import { Random } from './util/Random';

export enum LoaderEvents {
    Load,
    Complete
}

export abstract class Asset extends Observer {
    public readonly type: AssetEnum;
    public loaded: boolean = false;
    protected ref: HTMLImageElement | HTMLAudioElement;
    public id: string;
    public path: string;
    public event: string;

    public constructor(id: string, path: string, event: string) {
        super();
        this.id = id;
        this.path = path;
        this.event = event;
    }
    public abstract getLoader(): HTMLImageElement | HTMLAudioElement;
    public load(): void {
        this.ref = this.getLoader();
        this.ref.src = this.path;
        this.ref.addEventListener(this.event, this.onLoaded.bind(this));
    }
    private onLoaded(): void {
        this.emit(LoaderEvents.Load, this);
    }
}

class ImageAsset extends Asset {
    public constructor(id: string, path: string) {
        super(id, path, 'load');
    }
    public readonly type: AssetEnum = AssetEnum.Image;
    public getLoader(): HTMLImageElement {
        return new Image();
    }
}

class AudioAsset extends Asset {
    public constructor(id: string, path: string) {
        super(id, path, 'canplaythrough');
    }
    public readonly type: AssetEnum = AssetEnum.Audio;
    public getLoader(): HTMLAudioElement {
        return new Audio();
    }
}

interface Assets {
    [key: number]: AssetCategory;
}
interface AssetCategory {
    [key: string]: Asset;
}

export class Loader extends Observer {
    private assets: Assets = {};
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
