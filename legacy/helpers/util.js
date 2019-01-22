export class Util {
    static uuid() {
        // this will clash at some point, but for the purposes of this assignment it should be fine
        return Math.random()
            .toString(36)
            .substr(2, 13)
    }

    static propIsTruthy(obj, prop) {
        return prop in obj ? !!obj[prop] : false
    }

    static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        // rgba
        return !!result && result.length ?
            [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255]
            : false
    }
}
