import { Engine } from '../Engine';
import { Loader } from '../loader/Loader';
import { Color } from '../structs/Color';
import { Input } from '../Input';
import { HexCode } from '../enum/HexCode';
import { SceneManager, SceneName, SceneManagerEvent } from '../SceneManager';
import { Debug } from '../util/Debug';
import { ErrorMessage } from '../enum/ErrorMessage';
import { Entity } from './base/Entity';
import { Scene } from './Scene';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './SuperGroup';
import { Sizing } from '../enum/Sizing';

export interface IDebugConfig {
    outlines: boolean;
    grid: boolean;
}
export interface IGameSettings {
    sizing: Sizing;
}
export interface IGameConfig extends IGroupConfig {
    backgroundColor?: Color | string;
    fps?: number;
    debug?: IDebugConfig;
    sizing?: Sizing;
}

export class Game extends Entity {
    public engine: Engine;
    public load: Loader = new Loader();
    public input: Input = new Input();
    public scene: SceneManager;
    public started: boolean = false;
    public settings: IGameSettings = {
        sizing: Sizing.Auto
    };
    public debug: IDebugConfig = {
        outlines: false,
        grid: false
    };

    public constructor({
        backgroundColor = HexCode.Black,
        x = 0,
        y = 0,
        z = 0,
        width = 400,
        height = 400,
        depth = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        alpha = 1,
        sizing = Sizing.Auto,
        fps = 60,
        debug = {
            outlines: false,
            grid: false
        }
    }: IGameConfig) {
        super({
            type: EntityType.Game,
            x,
            y,
            z,
            width,
            height,
            depth,
            scaleX,
            scaleY,
            scaleZ,
            alpha
        });

        this.moveable = false;
        this.collidable = false;
        this.debug = {
            ...this.debug,
            ...debug
        };
        this.settings = {
            sizing
        };
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

    public get children(): Entity[] {
        if (!!this.scene.active) {
            return this.scene.active.children;
        } else {
            return [];
        }
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
        if (!this.started) {
            this.started = true;
            this.load.start();

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
    private onSceneManagerLoaded(): void {
        if (this.started) {
            this.startEngine();
        }
    }
    //#endregion
}
