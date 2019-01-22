import { Observer, Log, Enum } from './helpers'
import { Spritesheet } from './spritesheet'

export class Loader extends Observer {
    constructor(debug = false) {
        super();
        this.loadedCount = 0
        this.assetCount = 0
        this.assets = {}
        this.TYPE = Enum.entityTypes
        this.assetsByType = {}
        this.logger = new Log(debug)
        this.context = document.createElement('canvas').getContext('2d') // used for caching of spritesheet data

        setTimeout(this.start.bind(this), 100)
    }

    getAssetsByType(type) {
        if (type in this.assetsByType) {
            return this.assetsByType[type]
        } else {
            return {}
        }
    }

    image(id, path) {
        // assumes the image exists and is valid
        this.asset(id, path, 'load', Image, Enum.assetTypes.IMAGE)
    }

    sound(id, path) {
        this.asset(id, path, 'canplaythrough', Audio, Enum.assetTypes.SOUND)
    }

    spritesheet(id, data) {
        this.asset(id, undefined, undefined, undefined, Enum.assetTypes.SPRITESHEET, data)
    }

    asset(id, path, event, api, type, asset) {
        this.assetCount++
        const ref = this.assetModel(id, type, path, api, event, asset)
        this.assets[this.assetId(type, id)] = ref
        if (!(type in this.assetsByType)) {
            this.assetsByType[type] = {}
        }

        this.assetsByType[type][id] = ref
    }

    start() {
        if (Object.keys(this.assets).length === 0) {
            this.loaded()
            return
        }

        Object.entries(this.assets).map(([index, asset]) => {
            let obj

            if (asset.type === Enum.assetTypes.SPRITESHEET) {
                obj = new Spritesheet(asset.asset, this.context)
            } else {
                obj = new asset.api(asset.path)
                obj.src = asset.path
            }

            obj.type = asset.type
            this.cache(index, asset, obj)
        })
    }

    cache(index, asset, obj) {
        this.assets[index].asset = obj

        if (asset.type === Enum.assetTypes.SPRITESHEET) {
            this.loaded(obj.type, asset.id)
        } else {
            obj.addEventListener(
                asset.event,
                this.loaded.bind(this, asset.type, asset.id)
            )
        }
    }

    assetId(type, id) {
        return type + '_' + id
    }

    assetModel(id, type, path, api, event, asset) {
        return {
            asset,
            id,
            api,
            event,
            path,
            loaded: false,
            type
        }
    }

    loaded(type = false, id = false) {
        if (type && id) {
            const assetId = this.assetId(type, id)
            const asset = this.assets[assetId]
            asset.loaded = true
            this.emit(Enum.events.LOAD_ASSET, type, id)
        }

        if (this.loadedCount > this.assetCount) {
            return
        }
        if (++this.loadedCount >= this.assetCount) {
            this.emit(Enum.events.LOAD_COMPLETE, this.assets)
        }
    }
}
