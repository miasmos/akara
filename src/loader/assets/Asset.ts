import { Observer } from '../../Observer';
import { Asset as AssetEnum } from '../../enum/Asset';
import { LoaderEvents } from '../Loader';
export abstract class Asset extends Observer {
    public readonly type: AssetEnum;
    public loaded: boolean = false;
    protected abstract ref: HTMLImageElement | HTMLAudioElement;
    public id: string;
    public path: string;
    public event: string;

    public constructor(id: string, path: string, event: string) {
        super();
        this.id = id;
        this.path = path;
        this.event = event;
    }
    protected abstract getLoader(): HTMLImageElement | HTMLAudioElement;

    public load(): void {
        this.ref = this.getLoader();
        this.ref.src = this.path;
        this.ref.addEventListener(this.event, this.onLoaded.bind(this));
    }

    private onLoaded(): void {
        this.emit(LoaderEvents.Load, this);
    }

    public abstract getRef(): HTMLImageElement | HTMLAudioElement
}
