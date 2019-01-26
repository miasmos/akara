import { Sound } from './Sound';

interface ISounds {
    [key: string]: Sound;
}

export class SoundManager {
    private sounds: ISounds = {};

    public add(sound: Sound): boolean {
        if (!(sound.id in this.sounds)) {
            this.sounds[sound.id] = sound;
            return true;
        }

        return false;
    }

    public remove(sound: Sound): boolean {
        if (sound.id in this.sounds) {
            this.sounds[sound.id];
            return true;
        }

        return false;
    }

    public get(id: string): Sound | undefined {
        if (id in this.sounds) {
            return this.sounds[id];
        }

        return undefined;
    }

    public clear(): void {
        this.sounds = {};
    }
}
