import { Debug } from './util/Util';
import { Color } from './structs/Color';
import { ErrorMessage } from './enum/ErrorMessage';
import { Transform3 } from './structs/Transform3';
import { HexCode } from './enum/HexCode';

export interface ICanvasConfig {
    width?: number;
    height?: number;
    backgroundColor?: string | Color;
}

export class Canvas {
    public backgroundColor: Color = new Color();
    public mounted: boolean = false;
    private context: CanvasRenderingContext2D | undefined;
    private _element: HTMLCanvasElement | undefined;
    private transform: Transform3 = new Transform3({});
    private saved: boolean = false;

    public constructor({
        width = 400,
        height = 400,
        backgroundColor = HexCode.Black
    }: ICanvasConfig) {
        this.width = width;
        this.height = height;
        this.backgroundColor =
            typeof backgroundColor === 'string' ? new Color(backgroundColor) : backgroundColor;
    }

    // #region properties
    public get width(): number {
        return this.transform.width;
    }

    public set width(value: number) {
        if (value !== this.transform.width) {
            this.transform.width = value;
            if (this._element) {
                this._element.width = value;
            }
        }
    }

    public get height(): number {
        return this.transform.height;
    }

    public set height(value: number) {
        if (value !== this.transform.height) {
            this.transform.height = value;
            if (this._element) {
                this._element.height = value;
            }
        }
    }

    public get y(): number {
        if (this._element) {
            this.transform.y = this._element.offsetTop;
        }

        return this.transform.y;
    }

    public get x(): number {
        if (this._element) {
            this.transform.x = this._element.offsetLeft;
        }

        return this.transform.x;
    }

    public get element(): HTMLCanvasElement | undefined {
        return this._element;
    }

    public get alpha(): number {
        if (this.context) {
            return this.context.globalAlpha;
        }
        return 1;
    }

    public set alpha(value: number) {
        if (this.context) {
            this.save();
            this.context.globalAlpha = value;
        }
    }
    // #endregion

    public mount(id?: string): CanvasRenderingContext2D | undefined {
        if (typeof id === 'undefined') {
            id = '';
        }

        let targetElement: HTMLElement | null = document.getElementById(id);
        if (!targetElement) {
            if (id !== '') {
                Debug.error(ErrorMessage.ElementNotFound);
            }
            const elements: HTMLCollectionOf<HTMLElement> = document.getElementsByTagName('body');
            targetElement = elements[0];
        }

        const _element: HTMLCanvasElement = document.createElement('canvas');
        targetElement.appendChild(_element);
        this._element = _element;

        const context: CanvasRenderingContext2D | null = _element.getContext('2d', {
            alpha: false
        });
        if (context) {
            this.context = context;
            this.mounted = true;
            this._element.width = this.width;
            this._element.height = this.height;
            return context;
        }

        Debug.error(ErrorMessage.CanvasInstantiationError);
        return undefined;
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public translate(x: number, y: number): boolean {
        if (this.context) {
            this.save();
            this.context.translate(x, y);
            return true;
        }
        return false;
    }

    public save(): boolean {
        if (!this.saved) {
            if (this.context) {
                this.context.save();
                this.saved = true;
                return true;
            }
        }
        return false;
    }

    public restore(): boolean {
        if (this.saved) {
            if (this.context) {
                this.context.restore();
                this.saved = false;
                return true;
            }
        }
        return false;
    }

    public rotate(degrees: number): boolean {
        if (this.context) {
            this.context.rotate((degrees * Math.PI) / 180);
            return true;
        }
        return false;
    }

    public get(): HTMLCanvasElement | undefined {
        return this._element;
    }

    public clear(): boolean {
        if (this.context && this._element) {
            this.context.clearRect(0, 0, this._element.width, this._element.height);
            return true;
        }
        return false;
    }

    public drawImage(
        image: CanvasImageSource,
        x: number,
        y: number,
        width: number,
        height: number
    ): boolean {
        if (this.context) {
            this.context.drawImage(image, x, y, width, height);
            return true;
        }
        return false;
    }

    public drawBuffer(data: ImageData, x: number, y: number): boolean {
        if (this.context) {
            this.context.putImageData(data, x, y);
            return true;
        }
        return false;
    }

    public drawText(text: string, color: Color, x: number, y: number): boolean {
        if (this.context) {
            this.context.fillStyle = color.toString();
            this.context.fillText(text, x, y);
            return true;
        }
        return false;
    }

    public drawBox(color: Color, x: number, y: number, width: number, height: number): boolean {
        if (this.context) {
            this.context.fillStyle = color.toString();
            this.context.fillRect(x, y, width, height);
            return true;
        }
        return false;
    }

    public drawOutline(
        color: Color,
        outline: Color,
        x: number,
        y: number,
        width: number,
        height: number,
        stroke: number = 1
    ): boolean {
        if (this.context) {
            this.context.fillStyle = color.toString();
            this.context.strokeStyle = outline.toString();
            this.context.lineWidth = stroke;
            this.context.strokeRect(x, y, width, height);
            this.context.restore();
            return true;
        }
        return false;
    }

    public drawLine(
        color: Color,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        stroke: number = 1
    ): boolean {
        if (this.context) {
            this.context.lineWidth = stroke;
            this.context.strokeStyle = color.toString();
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
            this.context.restore();
            return true;
        }
        return false;
    }
}
