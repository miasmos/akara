import { Keyboard as KeyboardEnum } from '../enum/Keyboard';
import { Observer } from '../Observer';

export class Keyboard extends Observer {
    private keys: number[] = [];
    private target: HTMLCanvasElement;

    public constructor(target: HTMLCanvasElement) {
        super();
        this.target = target;
        target.addEventListener('keydown', this.onKeyDown.bind(this));
        target.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    public onKeyDown(event: KeyboardEvent): void {
        const key: number = event.keyCode || event.which;
        if (this.keys.indexOf(key) === -1) {
            this.keys.push(key);
        }

        this.emit(KeyboardEnum.KeyDown, key);
    }

    public onKeyUp(event: KeyboardEvent): void {
        const key: number = event.keyCode || event.which;
        if (this.keys.indexOf(key) > -1) {
            this.keys.splice(this.keys.indexOf(key), 1);
        }

        this.emit(KeyboardEnum.KeyUp, key);
    }

    public isDown(key: number): boolean {
        return this.keys.indexOf(key) > -1;
    }

    public isUp(key: number): boolean {
        return !this.isDown(key);
    }
}
