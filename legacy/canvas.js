import { Log } from './helpers'

export class Canvas extends Log {
    constructor(debug = false, color = '#fff') {
        super(debug)
        this.element = document.getElementsByTagName('canvas')[0]
        this.context = this.element.getContext('2d', { alpha: false })
        this.context.fillStyle = color
        this.type = this.constructor.name
    }

    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height)
    }

    set color(value = '#000') {
        this.context.fillStyle = value
    }

    get color() {
        return this.context.fillStyle
    }

    image(image, x, y, width, height) {
        this.context.drawImage(
            image,
            x,
            y,
            width,
            height
        )
    }

    buffer(b, x, y) {
        this.context.putImageData(b, x, y)
    }

    text(text, x, y) {
        this.context.fillText(text, x, y)
    }

    drawBox(x, y, width, height) {
        this.context.fillRect(x, y, width, height)
    }
}
