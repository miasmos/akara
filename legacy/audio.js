export class Audio {
    constructor(sounds = {}) {
        this.sounds = sounds
    }

    play(id) {
        if (id in this.sounds) {
            this.sounds[id].asset.cloneNode().play()
        }
    }
}
