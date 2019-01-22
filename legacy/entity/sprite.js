import { Entity } from './entity'
import { Enum } from '../helpers'

export class Sprite extends Entity {
    constructor(
        game,
        {
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            moveable = true,
            collision = true,
            render = true,
            type = Enum.assetTypes.SPRITESHEET
        },
        id
    ) {
        super(undefined, {
            x,
            y,
            width,
            height,
            moveable,
            collision,
            render
        });
        this.image
        this.assetId
        this.imageId = id
        this.assetType = type
        this.entityType = Enum.entityTypes.SPRITE
        this.game = game
        this.frame = 0
    }

    onAssetEvent(event, ...params) {
        switch (event) {
            case Enum.events.LOAD_ASSET:
                this.onAssetLoaded(...params)
                break
        }
    }

    onAssetLoaded() {
        const asset = this.engine.assets[this.assetId].asset
        this.image = asset
    }

    create() {
        super.create()
        if (!this.image) {
            this.warn(Enum.messages.ASSET_MISSING.replace('%s', this.imageId))
        }
    }

    set game(value) {
        super.game = value;

        this.assetId = this.engine.load.assetId(
            this.assetType,
            this.imageId
        )

        if (
            this.assetId in this.engine.assets &&
            this.engine.assets[this.assetId].loaded
        ) {
            this.onAssetLoaded()
        } else {
            this.engine.events.on(this.assetId, this.onAssetEvent.bind(this))
        }
    }

    get game() {
        return super.game
    }
}
