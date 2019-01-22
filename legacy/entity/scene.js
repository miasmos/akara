import { Group } from './group'
import { Enum } from '../helpers'

export class Scene extends Group {
    constructor(game, config = { name: '', render: false }) {
        super(game, config)
        this.name = config.name
        this.entityType = Enum.entityTypes.SCENE
    }

    add(entity) {
        entity.scene = this
        super.add(entity)
        return entity
    }
}