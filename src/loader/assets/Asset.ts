import { Observer } from '../../Observer';
import { LoaderEvent } from '../../enum/LoaderEvent';
import { IEntityRegisters } from '../../entities/base/IEntity';
import { Debug } from '../../util/Util';

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
    public failed: boolean = false;
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
                this.ref.addEventListener(this.event, this.onLoaded.bind(this));
                this.ref.addEventListener('onerror', this.onLoadError.bind(this));
                this.loading = true;
                this.ref.src = this.path;
            }
        }
    }

    public equals(asset: Asset): boolean {
        return this.name === asset.name && this.type === asset.type;
    }

    public abstract getRef(): HTMLImageElement | HTMLAudioElement | undefined;

    // #region events
    protected onLoaded(): void {
        this.loaded = true;
        this.loading = false;
        this.emit(LoaderEvent.Load, this);
    }

    protected onLoadError(error: Error): void {
        this.loading = false;
        this.failed = true;
        Debug.error(error);
        this.emit(LoaderEvent.LoadError, this);
    }
    // #endregion
}
