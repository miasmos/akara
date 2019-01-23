import { Keyboard } from './enum';
import { Observer } from './Observer';

export class Input extends Observer {
    private keys: Array<number> = new Array<number>(0);

    public constructor() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    public onKeyDown(): void {
        const key: number = event.keyCode || event.which;
        if (this.keys.indexOf(key) === -1) {
            this.keys.push(key);
        }

        this.emit(Keyboard.KeyDown, key);
    }

    public onKeyUp(): void {
        const key: number = event.keyCode || event.which;
        if (this.keys.indexOf(key) > -1) {
            this.keys.splice(this.keys.indexOf(key), 1);
        }

        this.emit(Keyboard.KeyUp, key);
    }

    public isDown(key): boolean {
        return this.keys.indexOf(key) > -1;
    }

    public isUp(key): boolean {
        return !this.isDown(key);
    }
}
