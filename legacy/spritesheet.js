import { Util } from './helpers'

export class Spritesheet {
    constructor(data, context) {
        this.palette = {}
        this.name = data.name
        this.index = 0
        this.context = context
        this.frames = []

        data.frames.map(value => {
            let row = value.data,
                palette = value.palette
            Object.entries(palette).map(([id, color]) => {
                if (!(id in this.palette)) {
                    this.palette[id] = Util.hexToRgb(color)
                }
            })

            let buffer = new Uint8ClampedArray(row.length * row[0].length * 4)
            row.map((column, index) => column.split('').map((colorKey, index1) => {
                var rgb = this.getPixel(colorKey) || [0, 0, 0, 255],
                    pos = (index * column.length + index1) * 4

                rgb.map((value, index2) => {
                    buffer[pos + index2] = value
                })
            }))

            const imageData = this.context.createImageData(row[0].length, row.length)
            imageData.data.set(buffer)
            this.frames.push(imageData)
        })

        this.frame = this.getFrame()
    }

    getFrame(index) {
        if (typeof index === 'undefined') {
            return this.frames[this.index]
        }

        if (index >= 0 && index < this.frames.length) {
            return this.frames[index]
        } else {
            return false
        }
    }

    getPixel(char) {
        if (!char) return false
        if (char in this.palette) {
            return this.palette[char]
        } else {
            return false
        }
    }

    get width() {
        return this.frame[0].length
    }

    set width(value) {
        throw new Error('Not implemented')
    }

    get height() {
        return this.frame.length
    }

    set height(value) {
        throw new Error('Not implemented')
    }
}