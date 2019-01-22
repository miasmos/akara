import { Entity } from './entity'
import { Enum } from '../helpers'

export class Box extends Entity {
    constructor(game, config) {
        super(game, config)
        this.entityType = Enum.entityTypes.BOX
    }
}
