export class Log {
    constructor(debug = false, type, id) {
        this.debug = debug
        this.type = type
        this.id = id
    }

    construct(text, ...params) {
        let hasId = !!this.id;
        let message = `${this.type}`

        if (hasId) {
            message += ` (${this.id})`
        }

        return message + `: ${text}${params}`
    }

    error(message, ...params) {
        if (!this.debug) return
        console.error(this.construct(message, ...params))
    }

    log(message, ...params) {
        if (!this.debug) return
        console.log(this.construct(message, ...params))
    }

    warn(message, ...params) {
        if (!this.debug) return
        console.warn(this.construct(message, ...params))
    }
}