import { Keyboard } from '../enum/Keyboard';
import { Observer } from '../Observer';

export class Input extends Observer {
    private keys: number[] = [];

    public constructor() {
        super();
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    public onKeyDown(event: KeyboardEvent): void {
        const key: number = event.keyCode || event.which;
        if (this.keys.indexOf(key) === -1) {
            this.keys.push(key);
        }

        this.emit(Keyboard.KeyDown, key);
    }

    public onKeyUp(event: KeyboardEvent): void {
        const key: number = event.keyCode || event.which;
        if (this.keys.indexOf(key) > -1) {
            this.keys.splice(this.keys.indexOf(key), 1);
        }

        this.emit(Keyboard.KeyUp, key);
    }

    public isDown(key: number): boolean {
        return this.keys.indexOf(key) > -1;
    }

    public isUp(key: number): boolean {
        return !this.isDown(key);
    }
}
