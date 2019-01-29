import { Observer } from './Observer';
import { Scene, SceneEvent } from './entities/Scene';
import { IGroupConfig } from './entities/SuperGroup';
import { Game } from './entities/Game';
import { Debug } from './util/Debug';
import { ErrorMessage } from './enum/ErrorMessage';
import { Entity } from './entities/base/Entity';

export enum SceneName {
    Default = 'DefaultScene'
}

export enum SceneManagerEvent {
    Loaded
}

interface IScenes {
    [key: string]: Scene;
}

export class SceneManager extends Observer {
    private scenes: Scene[] = [];
    private scenesByName: IScenes = {};
    private game: Game;
    public active: Scene | undefined;

    public constructor(game: Game) {
        super();
        this.game = game;

        const { x, y, z, width, height, depth } = game;
        this.add(
            new Scene(game, {
                name: SceneName.Default,
                x,
                y,
                z,
                width,
                height,
                depth
            })
        );
    }

    public get loaded(): boolean {
        return !!this.active ? this.active.loaded : true;
    }

    public load(name: string): boolean {
        if (this.has(name)) {
            this.unload();
            const scene = this.get(name);
            if (!!scene) {
                this.active = scene;
                scene.on(SceneEvent.Loaded, this.onSceneLoaded.bind(this));
                this.game.engine.add(scene);

                if (scene.loaded) {
                    this.emit(SceneManagerEvent.Loaded, scene);
                } else {
                    scene.off(SceneEvent.Loaded, this.onSceneLoaded.bind(this));
                }
                return true;
            }
        } else {
            Debug.error(ErrorMessage.SceneNotFound);
        }
        return false;
    }

    public unload(): boolean {
        if (!!this.active) {
            const scene = this.active;
            this.game.engine.remove(scene);
            scene.off(SceneEvent.Loaded, this.onSceneLoaded.bind(this));
            this.active = undefined;
            return true;
        }
        return false;
    }

    public add(target: Scene | Entity): boolean {
        if (target instanceof Scene) {
            if (!this.has(target.name)) {
                this.scenesByName[target.name] = target;
                this.scenes.push(target);
                return true;
            }
        } else {
            if (!!this.active) {
                return this.active.add(target);
            }
        }
        return false;
    }

    public remove(target: Scene | Entity): boolean {
        if (target instanceof Scene) {
            if (this.has(target.name)) {
                delete this.scenesByName[name];
                this.scenes.splice(this.scenes.indexOf(target), 1);
                return true;
            }
        } else {
            if (!!this.active) {
                return this.active.remove(target);
            }
        }
        return false;
    }

    public get(name: string): Scene | undefined {
        return this.has(name) ? this.scenesByName[name] : undefined;
    }

    public has(name: string): boolean {
        return name in this.scenesByName;
    }

    //#region events
    private onSceneLoaded(scene: Scene): void {
        this.emit(SceneManagerEvent.Loaded, scene);
    }
    //#endregion
}
