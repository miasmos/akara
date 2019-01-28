import { Engine } from '../Engine';
import { Loader } from '../loader/Loader';
import { Color } from '../structs/Color';
import { Input } from '../Input';
import { IGroupConfig, SuperGroup } from './SuperGroup';
import { HexCode } from '../enum/HexCode';
import { SceneManager, SceneName, SceneManagerEvent } from '../SceneManager';
import { Debug } from '../util/Debug';
import { ErrorMessage } from '../enum/ErrorMessage';
import { Entity } from './base/Entity';
import { Scene } from './Scene';

export interface IGameConfig extends IGroupConfig {
    backgroundColor?: Color | string;
    fps?: number;
}

export class Game extends SuperGroup {
    public engine: Engine;
    public load: Loader = new Loader();
    public input: Input = new Input();
    public scene: SceneManager;
    public started: boolean = false;

    public constructor({
        backgroundColor = HexCode.Black,
        x = 0,
        y = 0,
        z = 0,
        width = 400,
        height = 400,
        depth = 0,
        scale = 1,
        fps = 60
    }: IGameConfig) {
        super({
            x,
            y,
            z,
            width,
            height,
            depth,
            scale
        });

        this.moveable = false;
        this.collidable = false;
        this.game = this;
        this.scene = new SceneManager(this);
        this.engine = new Engine({
            game: this,
            width,
            height,
            backgroundColor,
            fps
        });

        this.scene.load(SceneName.Default);
    }

    public get loaded(): boolean {
        return this.scene.loaded;
    }

    public add(entity: Entity | Entity[]): boolean {
        if (Array.isArray(entity)) {
            let result = true;
            for (let entity1 of entity) {
                const result1 = this.add(entity1);
                if (!result1) {
                    result = false;
                }
            }
            return result;
        }

        if (entity instanceof Scene) {
            Debug.throw(ErrorMessage.CannotAddScene);
            return false;
        }

        if (!!this.scene.active) {
            return this.scene.add(entity);
        } else {
            Debug.error(ErrorMessage.TriedToAddToEmptyScene);
            return false;
        }
    }

    public remove(entity: Entity): boolean {
        if (Array.isArray(entity)) {
            let result = true;
            for (let entity1 of entity) {
                const result1 = this.remove(entity1);
                if (!result1) {
                    result = false;
                }
            }
            return result;
        }

        if (entity instanceof Scene) {
            Debug.error(ErrorMessage.CannotRemoveScene);
            return false;
        }

        if (!!this.scene.active) {
            return this.scene.remove(entity);
        } else {
            Debug.error(ErrorMessage.TriedToAddToEmptyScene);
            return false;
        }
    }

    public start(): void {
        this.started = true;

        if (!this.scene.active) {
            Debug.warn(ErrorMessage.NoActiveScene);
        } else {
            if (this.scene.loaded) {
                this.startEngine();
            } else {
                this.scene.on(SceneManagerEvent.Loaded, this.onSceneManagerLoaded.bind(this));
            }
        }
    }

    public stop(): void {
        this.started = false;
        this.scene.off(SceneManagerEvent.Loaded, this.onSceneManagerLoaded.bind(this));
        this.stopEngine();
    }

    private startEngine(): void {
        this.engine.start();
    }

    private stopEngine(): void {
        this.engine.stop();
    }

    //#region events
    private onSceneManagerLoaded(scene: Scene): void {
        if (this.started) {
            this.startEngine();
        }
    }
    //#endregion
}
