import { Observer } from '../Observer';
import { Mouse as MouseEnum } from '../enum/Mouse';

export class Mouse extends Observer {
    private target: HTMLCanvasElement;
    private state: MouseEnum;

    public constructor(target: HTMLCanvasElement) {
        super();
        this.target = target;
        this.target.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.target.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.target.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    public onMouseDown(event: MouseEvent): void {
        this.state = MouseEnum.MouseDown;
        const button = event.button;
        this.emit(MouseEnum.MouseDown, button);
    }

    public onMouseUp(event: MouseEvent): void {
        this.state = MouseEnum.MouseUp;
        const button = event.button;
        this.emit(MouseEnum.MouseUp, button);
    }

    public onMouseMove(event: MouseEvent): void {
        this.emit(MouseEnum.MouseMove);
    }

    public isDown(key: number): boolean {
        return this.state === MouseEnum.MouseDown;
    }

    public isUp(key: number): boolean {
        return this.state === MouseEnum.MouseUp;
    }
}
