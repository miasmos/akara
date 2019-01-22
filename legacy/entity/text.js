import { Entity } from './entity'
import { Enum } from '../helpers'

export class Text extends Entity {
    constructor(game, { x, y, text = '', color = '#000' } = {}) {
        super(game, { x, y })
        this.entityType = Enum.entityTypes.TEXT
        this.color = color
        this.text = text
    }
}
