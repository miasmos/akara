import { Engine } from '../Engine';
import { Loader } from '../loader/Loader';
import { Color } from '../structs/Color';
import { Input } from '../Input';
import { SoundManager } from '../SoundManager';
import { IGroupConfig } from './SuperGroup';
import { SuperGroup } from './SuperGroup';
import { HexCode } from '../enum/HexCode';

export interface IGameConfig extends IGroupConfig {
    backgroundColor?: Color | string;
    fps?: number;
}

export class Game extends SuperGroup {
    public engine: Engine;
    public load: Loader = new Loader();
    public input: Input = new Input();
    public sound: SoundManager = new SoundManager();

    public constructor({
        backgroundColor = HexCode.Black,
        x = 0,
        y = 0,
        z = 0,
        width = 400,
        height = 400,
        depth = 0,
        scale = 1,
        fps = 60
    }: IGameConfig) {
        super({
            x,
            y,
            z,
            width,
            height,
            depth,
            scale
        });

        this.moveable = false;
        this.collidable = false;
        this.game = this;
        this.engine = new Engine({
            game: this,
            width,
            height,
            backgroundColor,
            fps
        });
    }

    public start(): void {
        this.engine.start();
    }

    public stop(): void {
        this.engine.stop();
    }
}
