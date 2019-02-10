import { Camera } from './entities/Camera';
import { EntityManager } from './EntityManager';
import { Game } from './entities/Game';
import { ComponentEvent } from './components/Component';
import { Transform, TransformEvent } from './components/Transform';
import { Transform3Event } from './structs/Transform3';
import { Sizing } from './enum/Sizing';

export class CameraManager extends EntityManager {
    protected _active: Camera | undefined;
    public game: Game;

    public constructor(game: Game) {
        super();
        this.game = game;
    }

    // #region properties
    public get active(): Camera | undefined {
        return this._active;
    }

    public set active(value: Camera | undefined) {
        const shouldSet = !value || (!this.active || value.id !== this.active.id);
        if (shouldSet) {
            const current = this._active;
            if (current) {
                this.game.off(this.onGameTransformChange.bind(this));
            }
            if (value && this.game.transform) {
                this.game.transform.on(
                    ComponentEvent.Transform,
                    this.onGameTransformChange.bind(this)
                );
            }
            this._active = value;
        }
    }
    // #endregion

    public add(camera: Camera): boolean {
        if (!(camera instanceof Camera)) {
            return false;
        }

        return super.add(camera);
    }

    public remove(camera: Camera): boolean {
        return super.remove(camera);
    }

    // #region events
    public onGameTransformChange(
        type: TransformEvent,
        transform: Transform,
        previous: number,
        changed: Transform3Event
    ): void {
        switch (changed) {
            case Transform3Event.Width:
            case Transform3Event.Height:
                if (this.active && this.active.sizing === Sizing.Auto) {
                    this.active.width = transform.world.width;
                    this.active.height = transform.world.height;
                }
                break;
            default:
        }
    }
    // #endregion
}
