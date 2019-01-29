import { Observer } from '../../Observer';
import { LoaderEvents } from '../Loader';

export enum AssetType {
    Image,
    Audio,
    Empty
}

export abstract class Asset extends Observer {
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
            if (!!this.ref) {
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
