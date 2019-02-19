import { Mouse } from './Mouse';
import { Keyboard } from './Keyboard';
import { Game } from '../entities/Game';
import { Debug } from '../util/Util';
import { ErrorMessage } from '../enum/Enum';
import { MouseEvent, MouseButton } from '../enum/Mouse';
import { Point2 } from '../structs/Point2';
import { Point3 } from '../structs/Point3';
import { Observer } from '../Observer';

export interface IInputConfig {
    game: Game;
}

export class Input extends Observer {
    public mouse: Mouse;
    public keyboard: Keyboard;
    public game: Game;

    public configure({ game }: IInputConfig): void {
        this.game = game;
        const canvas = game.engine.canvas.get();
        if (canvas) {
            this.mouse = new Mouse(canvas);
            this.mouse.on(MouseEvent.MouseDown, this.onMouseDown.bind(this));
            this.keyboard = new Keyboard(canvas);
            game.engine.bindInput();
        } else {
            Debug.warn(ErrorMessage.InputInstantiationError);
        }
    }

    // #region events
    protected onMouseDown(origin: Point2, button: MouseButton) {
        const entity = this.game.engine.collision.getTopmostEntity(
            new Point3(origin.x, origin.y, 0)
        );
        if (entity) {
            this.emit(MouseEvent.MouseDown, entity, origin, button);
        }
    }
    // #endregion
}
