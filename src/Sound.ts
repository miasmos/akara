import { AudioAsset } from './loader/assets/AudioAsset';

export class Sound {
    private asset: AudioAsset;

    constructor(asset: AudioAsset) {
        this.asset = asset;
    }

    play() {
        this.ref.play();
    }

    stop() {
        this.pause();
        this.ref.currentTime = 0;
    }

    pause() {
        this.ref.pause();
    }

    get ref(): HTMLAudioElement {
        return this.asset.getRef();
    }

    get id(): string {
        return this.asset.id;
    }
}
