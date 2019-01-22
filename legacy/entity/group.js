import { Entity } from './entity'
import { Enum } from '../helpers'

export class Group extends Entity {
    constructor(game, config) {
        super(game, config)
        this.entityType = Enum.entityTypes.GROUP
        this.children = new Map()
    }

    add(entity) {
        if (!(this.children.has(entity.id))) {
            this.children.set(entity.id, entity)
            entity.on(Enum.events.SIZE_CHANGE, this.onSizeChange.bind(this))
            entity.on(Enum.events.POSITION_CHANGE, this.onPositionChange.bind(this))
            entity.parent = this
            if (!!this.scene) {
                entity.scene = this.scene
            }
            this.game.add(entity)
        }

        this.calculate()
    }

    remove(entity) {
        if (this.children.has(entity.id)) {
            this.children.delete(entity.id)
            entity.off(Enum.events.SIZE_CHANGE, this.onSizeChange.bind(this))
            entity.off(Enum.events.POSITION_CHANGE, this.onPositionChange.bind(this))
            this.game.remove(entity)
        }

        this.calculate()
    }

    pop() {
        if (this.children.size > 0) {
            const entity = this.children.values()[this.children.size - 1]
            this.remove(entity)
        }
    }

    clear() {
        this.children = new Map()
        this.calculate()
    }

    onPositionChange(entity) {
        this.calculate()
    }

    onSizeChange(entity) {
        this.calculate()
    }

    calculate() {
        // TODO: fix nested groups not having the correct dimensions on update of their children

        let width = 0, height = 0
        for (let [id, entity] of this.children) {
            if (!entity.rendered) {
                continue
            }
            const eWidth = entity.x + entity.width,
                eHeight = entity.y + entity.height

            if (eWidth > width) {
                width = eWidth
            }
            if (eHeight > height) {
                height = eHeight
            }
        }
        this.width = width
        this.height = height
    }
}
