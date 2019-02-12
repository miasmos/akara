import { Engine } from '../Engine';
import { Loader } from '../loader/Loader';
import { Color } from '../structs/Color';
import { HexCode } from '../enum/HexCode';
import { SceneManager, SceneName, SceneManagerEvent } from '../SceneManager';
import { Debug } from '../util/Debug';
import { ErrorMessage } from '../enum/ErrorMessage';
import { Entity } from './base/Entity';
import { Scene } from './Scene';
import { EntityType } from './base/IEntity';
import { IGroupConfig } from './Group';
import { Sizing } from '../enum/Sizing';
import { EntityFactory } from '../EntityFactory';
import { CameraManager } from '../CameraManager';
import { CollisionManager } from '../CollisionManager';

export interface IDebugConfig {
    outline?: boolean;
    grid?: boolean;
    pivot?: boolean;
}
export interface IGameSettings {
    sizing: Sizing;
}
export interface IGameConfig extends IGroupConfig {
    backgroundColor?: Color | string;
    fps?: number;
    debug?: IDebugConfig | boolean;
    sizing?: Sizing;
}

export class Game extends Entity {
    public type: EntityType = EntityType.Game;
    public engine: Engine;
    public load: Loader = new Loader();
    public entity = new EntityFactory(this);
    public scene: SceneManager = new SceneManager(this);
    public camera: CameraManager = new CameraManager(this);
    public started: boolean = false;
    public collisions: CollisionManager = new CollisionManager(this);
    public settings: IGameSettings = {
        sizing: Sizing.Auto
    };

    public debug: IDebugConfig = {
        outline: false,
        grid: false,
        pivot: false
    };

    public configure({
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
        pivotX = 0,
        pivotY = 0,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        alpha = 1,
        tag,
        sizing = Sizing.Auto,
        fps = 60,
        debug = {
            outline: false,
            grid: false,
            pivot: false
        }
    }: IGameConfig): void {
        super.configure({
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
            pivotX,
            pivotY,
            rotateX,
            rotateY,
            rotateZ,
            alpha,
            tag
        });

        let debugOpts = {};
        if (typeof debug === 'boolean') {
            debugOpts = {
                outline: debug,
                grid: debug,
                pivot: debug
            };
        } else {
            debugOpts = debug;
        }

        this.debug = {
            ...this.debug,
            ...debugOpts
        };
        this.settings = {
            sizing
        };
        this.engine = new Engine({
            game: this,
            width,
            height,
            backgroundColor,
            fps
        });
        this.collisions.configure({});
        this.scene.add(
            this.entity.scene({
                name: SceneName.Default,
                x: this.x,
                y: this.y,
                z: this.z,
                width: this.width,
                height: this.height,
                depth: this.depth
            })
        );
        this.scene.load(SceneName.Default);
        this.camera.active = this.entity.camera({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
    }

    public get loaded(): boolean {
        return this.scene.loaded;
    }

    public get children(): Entity[] {
        if (this.scene.active) {
            return this.scene.active.children;
        }

        return [];
    }

    public add(entity: Entity | Entity[]): boolean {
        if (Array.isArray(entity)) {
            const allEntitiesWereAdded = entity.some((child: Entity) => {
                const added = this.add(child);
                return added;
            });
            return allEntitiesWereAdded;
        }

        if (entity instanceof Scene) {
            Debug.throw(ErrorMessage.CannotAddScene);
            return false;
        }

        if (this.scene.active) {
            return this.scene.add(entity);
        }

        Debug.error(ErrorMessage.TriedToAddToEmptyScene);
        return false;
    }

    public remove(entity: Entity): boolean {
        if (Array.isArray(entity)) {
            const allEntitiesWereRemoved = entity.some((child: Entity) => {
                const removed = this.remove(child);
                return removed;
            });
            return allEntitiesWereRemoved;
        }

        if (entity instanceof Scene) {
            Debug.error(ErrorMessage.CannotRemoveScene);
            return false;
        }

        if (this.scene.active) {
            return this.scene.remove(entity);
        }

        Debug.error(ErrorMessage.TriedToAddToEmptyScene);
        return false;
    }

    public start(): void {
        if (!this.started) {
            this.started = true;
            this.load.start();

            if (!this.scene.active) {
                Debug.warn(ErrorMessage.NoActiveScene);
            } else if (this.scene.loaded) {
                this.startEngine();
            } else if (!this.scene.loaded) {
                this.scene.on(SceneManagerEvent.Loaded, this.onSceneManagerLoaded.bind(this));
            }
        }
    }

    public stop(): void {
        this.started = false;
        this.scene.off(SceneManagerEvent.Loaded, this.onSceneManagerLoaded.bind(this));
        this.stopEngine();
    }

    public getByTag(tag: string): Entity[] {
        if (this.scene.active) {
            return this.scene.active.getByTag(tag);
        }

        return [];
    }

    public getByType(type: EntityType): Entity[] {
        if (this.scene.active) {
            return this.scene.active.getByType(type);
        }

        return [];
    }

    private startEngine(): void {
        this.engine.start();
    }

    private stopEngine(): void {
        this.engine.stop();
    }

    // #region events
    private onSceneManagerLoaded(): void {
        if (this.started) {
            this.startEngine();
        }
    }
    // #endregion
}
