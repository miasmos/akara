import { EntityType, EntityEvents } from './base/IEntity';
import { Game } from './Game';
import { IGroupConfig, SuperGroup } from './SuperGroup';
import { AssetEntity } from './base/AssetEntity';
import { Entity } from './base/Entity';
import { Group } from './Group';

export enum SceneEvent {
    Loaded
}
export interface ISceneConfig extends IGroupConfig {
    name: string;
}

export class Scene extends SuperGroup {
    public name: string;
    public loaded: boolean = false;
    public active: boolean = false;
    protected assetCount: number = 0;
    protected assetsLoaded: number = 0;

    public constructor(
        game: Game,
        { x = 0, y = 0, z = 0, width = 0, height = 0, depth = 0, scale = 1, name }: ISceneConfig
    ) {
        super({
            type: EntityType.Scene,
            x,
            y,
            z,
            width,
            height,
            depth,
            scale
        });
        this.name = name;
        this.game = game;
    }

    public add(entity: Entity): boolean {
        this.initialize(entity);
        return super.add(entity);
    }

    public remove(entity: Entity): boolean {
        if (entity instanceof AssetEntity) {
            entity.off(EntityEvents.Loaded, this.onEntityLoaded.bind(this));
            this.assetCount--;
            if (entity.loaded) {
                this.assetsLoaded--;
            }
        }
        return super.remove(entity);
    }

    private initialize(entity: Entity): void {
        if (entity instanceof Group) {
            for (let child of entity.children) {
                this.initialize(child);
            }
        } else if (entity instanceof AssetEntity) {
            this.assetCount++;
            if (entity.loaded) {
                this.assetsLoaded++;
            } else {
                entity.on(EntityEvents.Loaded, this.onEntityLoaded.bind(this));
            }
        }
    }

    //#region events
    protected onEntityLoaded(entity: AssetEntity): void {
        entity.off(EntityEvents.Loaded, this.onEntityLoaded.bind(this));
        this.assetsLoaded++;
        if (this.assetsLoaded >= this.assetCount) {
            if (!this.loaded) {
                this.loaded = true;
                this.emit(SceneEvent.Loaded, this);
            }
        }
    }
    //#endregion
}
