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
        let lowercase = value.toLowerCase();
        if (Color.isHex(lowercase)) {
            if (lowercase.length === 3) {
                lowercase = lowercase
                    .split('')
                    .reduce((previous, char) => previous + char + char, '');
            }
            if (lowercase.length !== 6) {
                return;
            }
            this._hex = lowercase;
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
        return `#${this.hex}`;
    }

    public equals(color: Color): boolean {
        return this.hex === color.hex;
    }

    public static isHex(hex: string): boolean {
        if (hex.length !== 6 && hex.length !== 3) {
            return false;
        }

        const isValid = hex
            .toLowerCase()
            .split('')
            .every(char => {
                const cast: string = parseInt(char, 16).toString(16);
                return cast === char;
            });
        return isValid;
    }
}
