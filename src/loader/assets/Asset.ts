import { Observer } from '../../Observer';
import { LoaderEvents } from '../Loader';
import { IEntityRegisters } from '../../entities/base/IEntity';

export enum AssetType {
    Image = 'AssetType.Image',
    Audio = 'AssetType.Audio',
    Empty = 'AssetType.Empty'
}

export interface IAsset {
    readonly type: AssetType;
    loaded: boolean;
    loading: boolean;
    name: string;
    path: string;
    event: string;

    load(): void;
    equals(asset: Asset): boolean;
    getRef(): HTMLImageElement | HTMLAudioElement | undefined;
}

export interface IAssetRegisters extends IEntityRegisters {
    load?(): void;
}

export abstract class Asset extends Observer implements IAsset {
    public readonly type: AssetType;
    public loaded: boolean = false;
    public loading: boolean = false;
    protected abstract ref: HTMLImageElement | HTMLAudioElement | undefined;
    public name: string;
    public path: string;
    public event: string;

    public constructor(name: string, path: string, event: string) {
        super();
        this.name = name;
        this.path = path;
        this.event = event;
    }

    protected abstract getLoader(): HTMLImageElement | HTMLAudioElement | undefined;

    public load(): void {
        if (!this.ref) {
            this.ref = this.getLoader();
            if (this.ref) {
                this.ref.src = this.path;
                this.loading = true;
                this.ref.addEventListener(this.event, this.onLoaded.bind(this));
            }
        }
    }

    public equals(asset: Asset): boolean {
        return this.name === asset.name && this.type === asset.type;
    }

    protected onLoaded(): void {
        this.loaded = true;
        this.loading = false;
        this.emit(LoaderEvents.Load, this);
    }

    public abstract getRef(): HTMLImageElement | HTMLAudioElement | undefined;
}
