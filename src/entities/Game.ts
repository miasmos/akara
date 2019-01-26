import { Entity } from './Entity';
import { Engine } from '../Engine';
import { Loader } from '../loader/Loader';
import { HexCode } from '../enum/HexCode';
import { Color } from '../structs/Color';
import { Input } from '../Input';
import { SoundManager } from '../SoundManager';

export interface IGameConfig {
    color?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scale?: number;
}

export class Game extends Entity {
    public engine: Engine = new Engine();
    public load: Loader = new Loader();
    public input: Input = new Input();
    public sound: SoundManager = new SoundManager();

    public constructor({
        color = HexCode.Black,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        scale = 1
    }: IGameConfig) {
        super(undefined, {
            x,
            y,
            width,
            height,
            scale
        });
        this.engine.canvas.color = new Color(color);
        this.engine.game = this;
        this.game = this;
    }

    public start(): void {
        this.engine.start();
    }
}
