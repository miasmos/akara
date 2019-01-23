import { computed, observable } from 'mobx';
import { Debug } from './util';
import { Color } from './structs';
import { ErrorMessage, HexCode } from './enum';

export class Canvas {
    private _color: Color = new Color(HexCode.Black);
    private element: HTMLCanvasElement;
    private id: string;

    @observable
    private context: CanvasRenderingContext2D;

    public constructor(id: string, color?: Color) {
        this.id = id;
        if (!!color) {
            this.color = color;
        }
        this.mount();
    }

    @computed
    public get ready(): boolean {
        return !!this.context;
    }

    private mount(): void {
        let targetElement: HTMLElement | null = document.getElementById(this.id);
        if (!targetElement) {
            Debug.error(ErrorMessage.ElementNotFound);
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
        } else {
            Debug.error(ErrorMessage.CanvasInstantiationError);
        }
    }

    public get color(): Color {
        return this._color;
    }

    public set color(color: Color) {
        this._color = color;
        this.context.fillStyle = color.toString();
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }

    public drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number): void {
        this.context.drawImage(image, x, y, w, h);
    }

    public drawBuffer(data: ImageData, x: number, y: number): void {
        this.context.putImageData(data, x, y);
    }

    public drawText(text: string, x: number, y: number): void {
        this.context.fillText(text, x, y);
    }

    public drawBox(x: number, y: number, w: number, h: number): void {
        this.context.fillRect(x, y, w, h);
    }
}
