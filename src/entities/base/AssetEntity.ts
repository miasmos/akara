import { Entity } from './Entity';
import { IEntityConfig, EntityEvent, IEntity } from './IEntity';
import { Asset, AssetType, IAssetRegisters } from '../../loader/assets/Asset';
import { LoaderEvent } from '../../enum/LoaderEvent';
import { EmptyAsset } from '../../loader/assets/EmptyAsset';
import { Game } from '../Game';

export interface IAssetEntity extends IEntity {
    load?: () => void;
}

export interface IAssetEntityConfig extends IEntityConfig {
    asset: string;
    assetType: AssetType;
    load?: () => void;
}

export class AssetEntity extends Entity implements IAssetEntity {
    public asset: Asset;
    private assetType: AssetType;
    private assetName: string;

    public configure({
        type,
        assetType,
        asset,
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
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
        load,
        preupdate,
        update,
        postupdate,
        start,
        destroy,
        collision,
        click
    }: IAssetEntityConfig): void {
        super.configure({
            type,
            x,
            y,
            z,
            width,
            height,
            scaleX,
            scaleY,
            scaleZ,
            pivotX,
            pivotY,
            rotateX,
            rotateY,
            rotateZ,
            tag,
            alpha,
            preupdate,
            update,
            postupdate,
            start,
            destroy,
            collision,
            click
        });

        this.assetType = assetType;
        this.assetName = asset;
        this.initialize({ load, update, preupdate, postupdate, start, destroy, collision, click });
        this.bindAsset();
    }

    protected initialize({
        load,
        update,
        preupdate,
        postupdate,
        start,
        destroy,
        collision,
        click
    }: IAssetRegisters): void {
        this.bind('load', load);
        this.bind('update', update);
        this.bind('preupdate', preupdate);
        this.bind('postupdate', postupdate);
        this.bind('start', start);
        this.bind('destroy', destroy);
        this.bind('collision', collision);
        this.bind('click', click);
    }

    private bindAsset(): void {
        const loader = this.game.load;
        const asset = loader.get(this.assetType, this.assetName);
        const { engine } = this.game;

        if (asset) {
            this.asset = asset;
            if (asset.loaded) {
                this.onAssetLoaded(this.asset);
            } else {
                loader.on(LoaderEvent.Load, this.onAssetLoaded.bind(this));

                if (engine.started) {
                    this.asset.load();
                }
            }
        } else {
            this.asset = new EmptyAsset();
            loader.on(LoaderEvent.Add, this.onAssetAdded.bind(this));
        }
    }

    public get hasAsset(): boolean {
        return !!this.asset;
    }

    public get loaded(): boolean {
        return this.asset.loaded;
    }

    // #region events
    protected onAssetLoaded(asset: Asset): void {
        if (asset.equals(this.asset)) {
            this.call('load');
            this.emit(EntityEvent.Loaded, this);
            this.game.load.off(LoaderEvent.Load, this.onAssetLoaded.bind(this));
        }
    }

    protected onAssetAdded(asset: Asset): void {
        if (asset.type === this.assetType && asset.name === this.assetName) {
            this.asset = asset;
            this.game.load.off(LoaderEvent.Add, this.onAssetAdded.bind(this));

            if (asset.loaded) {
                this.emit(EntityEvent.Loaded, this);
            } else {
                this.game.load.on(LoaderEvent.Load, this.onAssetLoaded.bind(this));
            }
        }
    }
    // #endregion
}
