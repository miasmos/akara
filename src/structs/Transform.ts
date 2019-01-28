import { Point } from './Point';
import { Observer } from '../Observer';

export enum TransformEvent {
    X,
    Y,
    Width,
    Height,
    Scale
}

export class Transform extends Observer {
    private _scale: number = 1;
    private _width: number = 0;
    private _height: number = 0;
    private point: Point = new Point();

    public get x(): number {
        return this.point.x;
    }

    public set x(value: number) {
        if (value !== this.point.x) {
            this.point.x = value;
            this.emit(TransformEvent.X);
        }
    }

    public get y(): number {
        return this.point.y;
    }

    public set y(value: number) {
        if (value !== this.point.y) {
            this.point.y = value;
            this.emit(TransformEvent.Y);
        }
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        if (value !== this._width) {
            this._width = value;
            this.emit(TransformEvent.Width);
        }
    }

    public get height(): number {
        return this._width;
    }

    public set height(value: number) {
        if (value !== this._height) {
            this._height = value;
            this.emit(TransformEvent.Height);
        }
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(value: number) {
        if (value !== this._scale) {
            this._scale = value;
            this.emit(TransformEvent.Scale);
        }
    }
}
