import { observable, computed } from 'mobx';

export class Color {
    @observable
    private hex: string;

    @computed
    get r(): string {
        return this.hex.substring(0, 2);
    }

    @computed
    get g(): string {
        return this.hex.substring(2, 4);
    }

    @computed
    get b(): string {
        return this.hex.substring(4);
    }

    constructor(hex: string = '') {
        this.set(hex);
    }

    set(hex: string): boolean {
        if (this.isHex(hex)) {
            if (hex.length === 3) {
                hex = hex.split('').reduce((char, previous) => previous + char + char, '');
            }
            this.hex = hex;
            return true;
        }
        return false;
    }

    get() {
        return this.hex;
    }

    toString(): string {
        return '#' + this.hex;
    }

    equals(color: Color) {
        return this.hex === color.hex;
    }

    private isHex(hex: string): boolean {
        if (hex.length === 6 || hex.length === 3) {
            for (let char of hex) {
                const cast: string = parseInt(char, 16).toString(16);

                if (cast !== hex) {
                    return false;
                }
            }
        }

        return true;
    }
}
