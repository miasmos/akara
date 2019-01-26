import { Debug } from './util/Debug';
import { Color } from './structs/Color';
import { ErrorMessage } from './enum/ErrorMessage';
import { HexCode } from './enum/HexCode';

export class Canvas {
    private _color: Color = new Color(HexCode.Black);
    public mounted: boolean = false;
    private context: CanvasRenderingContext2D | undefined;
    private element: HTMLCanvasElement | undefined;

    public constructor(color?: Color) {
        if (!!color) {
            this.color = color;
        }
    }

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

        const element: HTMLCanvasElement = targetElement.appendChild(
            document.createElement('canvas')
        );
        this.element = element;

        const context: CanvasRenderingContext2D | null = element.getContext('2d', { alpha: false });
        if (!!context) {
            this.context = context;
            this.mounted = true;
            return context;
        } else {
            Debug.error(ErrorMessage.CanvasInstantiationError);
        }

        return undefined;
    }

    public get color(): Color {
        return this._color;
    }

    public set color(color: Color) {
        this._color = color;
        if (!!this.context) {
            this.context.fillStyle = color.toString();
        }
    }

    public clear(): void {
        if (!!this.context && !!this.element) {
            this.context.clearRect(0, 0, this.element.width, this.element.height);
        }
    }

    public drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number): void {
        if (!!this.context) {
            this.context.drawImage(image, x, y, w, h);
        }
    }

    public drawBuffer(data: ImageData, x: number, y: number): void {
        if (!!this.context) {
            this.context.putImageData(data, x, y);
        }
    }

    public drawText(text: string, x: number, y: number): void {
        if (!!this.context) {
            this.context.fillText(text, x, y);
        }
    }

    public drawBox(x: number, y: number, w: number, h: number): void {
        if (!!this.context) {
            this.context.fillRect(x, y, w, h);
        }
    }
}
