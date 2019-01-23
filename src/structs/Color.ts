import { observable, computed } from 'mobx';

export class Color {
    @observable
    private hex: string;

    @computed
    public get r(): string {
        return this.hex.substring(0, 2);
    }

    @computed
    public get g(): string {
        return this.hex.substring(2, 4);
    }

    @computed
    public get b(): string {
        return this.hex.substring(4);
    }

    public constructor(hex: string = '') {
        this.set(hex);
    }

    public set(hex: string): boolean {
        if (this.isHex(hex)) {
            if (hex.length === 3) {
                hex = hex.split('').reduce((char, previous) => previous + char + char, '');
            }
            this.hex = hex;
            return true;
        }
        return false;
    }

    public get(): string {
        return this.hex;
    }

    public toString(): string {
        return '#' + this.hex;
    }

    public equals(color: Color): boolean {
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
