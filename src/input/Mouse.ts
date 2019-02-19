import { Observer } from '../Observer';
import { MouseEvent as CustomMouseEvent } from '../enum/Mouse';
import { Point2 } from '../structs/Point2';

export class Mouse extends Observer {
    private target: HTMLCanvasElement;
    private state: CustomMouseEvent;

    public constructor(target: HTMLCanvasElement) {
        super();
        this.target = target;
        this.target.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.target.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.target.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    public onMouseDown(event: MouseEvent): void {
        event.preventDefault();
        this.state = CustomMouseEvent.MouseDown;
        const { button, offsetX, offsetY } = event;
        const origin: Point2 = new Point2(offsetX, offsetY);
        this.emit(CustomMouseEvent.MouseDown, origin, button);
    }

    public onMouseUp(event: MouseEvent): void {
        event.preventDefault();
        this.state = CustomMouseEvent.MouseUp;
        const { button, offsetX, offsetY } = event;
        const origin: Point2 = new Point2(offsetX, offsetY);
        this.emit(CustomMouseEvent.MouseUp, origin, button);
    }

    public onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        this.emit(CustomMouseEvent.MouseMove);
    }

    public isDown(key: number): boolean {
        return this.state === CustomMouseEvent.MouseDown;
    }

    public isUp(key: number): boolean {
        return this.state === CustomMouseEvent.MouseUp;
    }
}
