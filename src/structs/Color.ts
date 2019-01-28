import { HexCode } from '../enum/HexCode';

export class Color {
    private _hex: string = '';

    public constructor(hex: string = HexCode.Black) {
        this.set(hex);
    }

    public get r(): string {
        return this.hex.substring(0, 2);
    }

    public get g(): string {
        return this.hex.substring(2, 4);
    }

    public get b(): string {
        return this.hex.substring(4);
    }

    public set hex(value: string) {
        value = value.toLowerCase();
        if (this.isHex(value)) {
            if (value.length === 3) {
                value = value.split('').reduce((previous, char) => previous + char + char, '');
            }
            if (value.length !== 6) {
                return;
            }
            this._hex = value;
        }
    }

    public get hex(): string {
        return this._hex;
    }

    public set(hex: string): void {
        this.hex = hex;
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
            hex = hex.toLowerCase();
            for (let char of hex) {
                const cast: string = parseInt(char, 16).toString(16);

                if (cast !== char) {
                    return false;
                }
            }
        } else {
            return false;
        }

        return true;
    }
}
