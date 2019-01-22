import { Observer, Enum } from './helpers'

export class Input extends Observer {
    constructor(debug = false) {
        super()
        window.addEventListener('keydown', this.onKeyDown.bind(this))
        window.addEventListener('keyup', this.onKeyUp.bind(this))

        this.type = this.constructor.name
        this.keys = []
    }

    onKeyDown(event) {
        const key = event.keyCode || event.which
        if (this.keys.indexOf(key) === -1) {
            this.keys.push(key)
        }

        this.emit(Enum.events.KEY_DOWN, key)
    }

    onKeyUp(event) {
        const key = event.keyCode || event.which
        if (this.keys.indexOf(key) > -1) {
            this.keys.splice(this.keys.indexOf(key), 1)
        }

        this.emit(Enum.events.KEY_UP, key)
    }

    isDown(key) {
        return this.keys.indexOf(key) > -1
    }

    isUp(key) {
        return !this.isDown(key)
    }
}
