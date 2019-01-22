import { Engine } from './engine'
import { Enum } from './helpers'
import * as Entities from './entity'

export class Game extends Entities.Entity {
    constructor(config = { debug: false, background: '#000' }) {
        super(undefined, { rendered: false, ...config })
        this.entity = Entities
        Object.assign(this, config)
        this.engine = new Engine(undefined, this.debug)
        this.engine.world = this
        this.game = this
        this.load = this.engine.load
        this.input = this.engine.input
        this.events = this.engine.events
        this.scenes = new Map()
        this.currentScene
        this.engine.add(this)
    }

    scene(name, s) {
        this.scenes.set(name, s)
    }

    setScene(name) {
        if (this.scenes.has(name) && name !== this.currentScene) {
            if (!!this.currentScene) {
                this.engine.clear()
            }
            this.currentScene = name

            const ref = this.scenes.get(name),
                s = new ref(this)
            s.scene = s
            this.add(s)
        }
    }

    add(entity) {
        this.engine.add(entity)
        return entity
    }

    remove(entity) {
        this.engine.remove(entity)
    }

    stop() {
        this.engine.stop()
    }
}
