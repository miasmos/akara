import { expect, assert } from 'chai';
import 'mocha';
import { Loader } from '../../src/loader/Loader';
import { ImageAsset } from '../../src/loader/assets/ImageAsset';
import { AudioAsset } from '../../src/loader/assets/AudioAsset';
import { AssetType, Asset } from '../../src/loader/assets/Asset';
import { EmptyAsset } from '../../src/loader/assets/EmptyAsset';
import { LoaderEvent } from '../../src/enum/LoaderEvent';

describe('Loader', () => {
    describe('load event', () => {
        it('should emit an event when an asset is loaded', done => {
            const result = new Loader();
            result.on(LoaderEvent.Load, (asset: Asset) => {
                done();
            });
            const result1 = result.image('test', 'test');
            result.start();
            const ref = result1.getRef();
            if (ref) {
                ref.dispatchEvent(new Event('load'));
            } else {
                assert.fail();
            }
        });
    });

    describe('image()', () => {
        it('should return an image asset', () => {
            const result = new Loader();
            expect(result.image('', '') instanceof ImageAsset).to.equal(true);
        });

        it('should return the same image asset given the same name', () => {
            const result = new Loader();
            const result1 = result.image('test', 'test');
            expect(result.image('test', 'test').equals(result1)).to.equal(true);
        });
    });

    describe('sound()', () => {
        it('should return a sound asset', () => {
            const result = new Loader();
            expect(result.sound('', '') instanceof AudioAsset).to.equal(true);
        });
    });

    describe('empty()', () => {
        it('should return an empty asset', () => {
            const result = new Loader();
            expect(result.empty('') instanceof EmptyAsset).to.equal(true);
        });
    });

    describe('get()', () => {
        it('should return an asset', () => {
            const result = new Loader();
            result.image('test', 'test');
            expect(result.get(AssetType.Image, 'test')).to.not.be.a('undefined');
        });

        it('should return undefined given a name not yet instantiated', () => {
            const result = new Loader();
            expect(result.get(AssetType.Image, 'test')).to.be.a('undefined');
        });

        it('should load the asset if already started', () => {
            const result = new Loader();
            result.start();
            const result1 = result.image('test', 'test');
            expect(result1.loading).to.equal(true);
        });
    });

    describe('has()', () => {
        it('should return true given a valid asset', () => {
            const result = new Loader();
            result.image('test', 'test');
            expect(result.has(AssetType.Image, 'test')).to.equal(true);
        });

        it('should return false given a name not yet instantiated', () => {
            const result = new Loader();
            expect(result.has(AssetType.Image, 'test')).to.equal(false);
        });
    });

    describe('start()', () => {
        it('should return true if not yet started', () => {
            const result = new Loader();
            expect(result.start()).to.equal(true);
        });

        it('should return false if already started', () => {
            const result = new Loader();
            result.start();
            expect(result.start()).to.equal(false);
        });

        it('should start loading assets', () => {
            const result = new Loader();
            const result1 = result.image('test', 'test');
            result.start();
            expect(result1.loading).to.equal(true);
        });
    });
});
