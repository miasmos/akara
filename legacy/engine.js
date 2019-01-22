/*
    Tracks list of entities for drawing
    On init, waits for assets to be loaded then calls the following, in order
    loaded()
    create() -> entity[].create()
    loop()

    on each loop, calls the following, in order
    preupdate() -> entity[].preupdate()
    update() -> entity[].update()
    postupdate() -> entity[].postupdate()

    when an entity is added, calls
    entity.create(), if loop has started
    entity.preload(), if loop has not started

    when an entity is removed, calls
    entity.destroy()
*/

import { Observer, Log, Enum } from './helpers'
import { Canvas } from './canvas'
import { Loader } from './loader'
import { Input } from './input'
import { Audio } from './audio'

export class Engine extends Log {
    constructor(world, debug = false, fps = 60) {
        super(debug)
        this.fps = fps
        this.debug = debug
        this.lastTimestamp
        this.timeElapsed = 0
        this.started = false // true when assets are loaded and game loop has started
        this.entityList = []
        this.entities = {}
        this.entitiesByType = {}
        this.registry = new Map()
        this.type = this.constructor.name
        this.canvas = new Canvas(debug)
        this.load = new Loader(debug)
        this.load.on(Enum.events.LOAD_COMPLETE, this.onLoadComplete.bind(this))
        this.load.on(Enum.events.LOAD_ASSET, this.onAssetLoaded.bind(this))
        this.assets = this.load.assets
        this.events = new Observer()
        this.events.TYPE = Enum.events
        this.input = new Input(debug)
        this.sound = new Audio(
            this.load.getAssetsByType(Enum.assetTypes.SOUND)
        )
        this.world = world // reference to game entity
        this.frameTime = 1 / this.fps
    }

    onAssetLoaded(type, id) {
        this.events.emit(
            this.load.assetId(type, id),
            Enum.events.LOAD_ASSET,
            type,
            id
        )
    }

    onLoadComplete() {
        this.log('Loading complete.')
        this.started = true
        this.events.emit(Enum.events.LOAD_COMPLETE)
        this.create()
        this.start()
    }

    onRenderStateChanged(entity) {
        if (entity.rendered) {
            this.register('draw', entity)
        } else {
            this.unregister('draw', entity)
        }
    }

    start() {
        this.log('Start.')
        this.loopInterval = setInterval(this.loop.bind(this))
    }

    stop() {
        this.log('Stop.')
        clearInterval(this.loopInterval)
        this.canvas.clear()
    }

    loop() {
        // called as fast as possible
        const timestamp = Date.now()
        let deltaTime = 0

        if (!!this.lastTimestamp) {
            deltaTime = timestamp - this.lastTimestamp
        }
        this.timeElapsed += deltaTime

        if (this.timeElapsed >= this.frameTime) {
            this.timeElapsed = 0
            this.frame(deltaTime)
        }

        this.lastTimestamp = timestamp
    }

    clear() {
        for (let index in this.entities) {
            const entity = this.entities[index]

            if (typeof entity.scene === 'object') {
                this.remove(entity)
            }
        }
    }

    frame(deltaTime) {
        // called at the engine fps
        this.preupdate(deltaTime)
        this.update(deltaTime)
        this.postupdate(deltaTime)
    }

    add(entity) {
        this.entityList.push(entity.id)
        this.entities[entity.id] = entity
        if (!(entity.type in this.entitiesByType)) {
            this.entitiesByType[entity.type] = {}
        }
        this.entitiesByType[entity.type][entity.id] = entity
        this.register('preupdate', entity)
        this.register('update', entity)
        this.register('postupdate', entity)

        if (entity.rendered) {
            this.register('draw', entity)
        }
        entity.on(Enum.events.RENDERED_CHANGE, this.onRenderStateChanged.bind(this))
        if (!!entity.parent) {
            entity.parent = this
        }

        if (this.started) {
            entity.create.call(entity)
        } else {
            this.register('create', entity)
            entity.preload.call(entity)
        }
    }

    remove(entity) {
        entity.off(Enum.events.RENDERED_CHANGE, this.onRenderStateChanged.bind(this))
        entity.destroy.call(entity)

        this.unregister('preupdate', entity)
        this.unregister('update', entity)
        this.unregister('postupdate', entity)
        if (entity.rendered) {
            this.unregister('draw', entity)
        }

        this.entityList.splice(this.entityList.indexOf(entity.id), 1)
        delete this.entities[entity.id]

        if (entity.type in this.entitiesByType) {
            if (entity.id in this.entitiesByType[entity.type]) {
                delete this.entitiesByType[entity.type][entity.id]
            }

            if (!Object.keys(this.entitiesByType[entity.type]).length) {
                delete this.entitiesByType[entity.type]
            }
        }
    }

    get(id) {
        if (id in this.entities) {
            return this.entities[id]
        } else {
            return false
        }
    }

    getAll() {
        return this.entities
    }

    getAllByType(type) {
        if (type in this.entitiesByType) {
            return this.entitiesByType[type]
        } else {
            return false
        }
    }

    create() {
        this.invoke('create')
        this.registry.delete('create')
    }

    preupdate(deltaTime) {
        this.invoke('preupdate', deltaTime)
    }

    update(deltaTime) {
        this.invoke('update', deltaTime)
        this.canvas.clear();
        this.draw();
    }

    postupdate(deltaTime) {
        this.invoke('postupdate', deltaTime)
    }

    invoke(method, ...params) {
        if (this.registry.has(method)) {
            for (let [id, fn] of this.registry.get(method)) {
                fn(...params)
            }
        }
    }

    register(method, entity) {
        if (!this.registry.has(method)) {
            this.registry.set(method, new Map())
        }

        if (method === 'draw') {
            if (entity.rendered) {
                this.registry.get(method).set(entity.id, entity)
            }
        } else {
            if (method in entity && typeof entity[method] === 'function') {
                this.registry.get(method).set(entity.id, entity[method].bind(entity))
            }
        }
    }

    unregister(method, entity) {
        if (this.registry.has(method)) {
            const register = this.registry.get(method)
            if (register.has(entity.id)) {
                register.delete(entity.id)
            }
        }
    }

    draw() {
        if (!this.registry.has('draw')) {
            return
        }

        for (let [id, entity] of this.registry.get('draw')) {
            this.render(entity)
        }
    }

    render(entity, offsetX = 0, offsetY = 0, offsetWidth = 0, offsetHeight = 0) {
        if (!entity.rendered) {
            return
        }

        if (!!this.world) {
            if (
                entity.world.x > this.world.width ||
                entity.world.y > this.world.height ||
                entity.world.y + entity.height < this.world.y ||
                entity.world.x + entity.width < this.world.x
            ) {
                // if the entity is outside the bounds of the world, ignore it
                return
            }
        }

        if ((!!entity.color && entity.color !== this.canvas.color) || (!entity.color && this.canvas.color !== this.world.color)) {
            this.canvas.color = entity.color || this.world.color
        }

        const x = entity.x + offsetX,
            y = entity.y + offsetY,
            width = entity.width + offsetWidth,
            height = entity.height + offsetHeight,
            type = Enum.entityTypes

        switch (entity.entityType) {
            case type.SPRITE:
                const { image } = entity
                if (entity.assetType === Enum.assetTypes.IMAGE) {
                    this.canvas.image(image, x, y, width, height)
                } else {
                    this.canvas.buffer(image.getFrame(entity.frame), x, y)
                }
                break
            case type.TEXT:
                this.canvas.text(text, x, y)
                break
            case type.BOX:
                this.canvas.drawBox(x, y, width, height)
                break
        }
    }
}