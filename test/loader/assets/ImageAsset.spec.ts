import { ImageAsset } from '../../../src/loader/assets/ImageAsset';
import { EmptyAsset } from '../../../src/loader/assets/EmptyAsset';
import { expect } from 'chai';
import 'mocha';
import { LoaderEvent } from '../../../src/enum/LoaderEvent';
import { Asset } from '../../../src/loader/assets/Asset';

describe('ImageAsset', () => {
    it('should accept a name parameter', () => {
        const result = new ImageAsset('test', 'test1');
        expect(result.name).to.equal('test');
    });

    it('should accept a path parameter', () => {
        const result = new ImageAsset('test', 'test1');
        expect(result.name).to.equal('test');
    });

    it('should accept an event parameter', () => {
        const result = new EmptyAsset('test', 'test1', 'test2');
        expect(result.event).to.equal('test2');
    });

    describe('load event', () => {
        it('should emit an event when loading is complete', done => {
            const result = new ImageAsset('test', 'test1');
            result.on(LoaderEvent.Load, (asset: Asset) => {
                done();
            });
            result.load();
            result.getRef().dispatchEvent(new Event('load'));
        }).timeout(10);

        it('should set the loading property to false', done => {
            const result = new ImageAsset('test', 'test1');
            result.on(LoaderEvent.Load, (asset: Asset) => {
                expect(result.loading).to.equal(false);
                done();
            });
            result.load();
            result.getRef().dispatchEvent(new Event('load'));
        }).timeout(10);

        it('should set the loaded property to true', done => {
            const result = new ImageAsset('test', 'test1');
            result.on(LoaderEvent.Load, (asset: Asset) => {
                expect(result.loaded).to.equal(true);
                done();
            });
            result.load();
            result.getRef().dispatchEvent(new Event('load'));
        }).timeout(10);
    });

    describe('load event error', () => {
        it('should emit an event when loading fails', done => {
            const result = new ImageAsset('test', 'test1');
            result.on(LoaderEvent.LoadError, (asset: Asset) => {
                done();
            });
            result.load();
            result.getRef().dispatchEvent(new Event('onerror'));
        }).timeout(10);

        it('should set the loading property to false', done => {
            const result = new ImageAsset('test', 'test1');
            result.on(LoaderEvent.LoadError, (asset: Asset) => {
                expect(result.loading).to.equal(false);
                done();
            });
            result.load();
            result.getRef().dispatchEvent(new Event('onerror'));
        }).timeout(10);

        it('should set the failed property to true', done => {
            const result = new ImageAsset('test', 'test1');
            result.on(LoaderEvent.LoadError, (asset: Asset) => {
                expect(result.failed).to.equal(true);
                done();
            });
            result.load();
            result.getRef().dispatchEvent(new Event('onerror'));
        }).timeout(10);
    });

    describe('load()', () => {
        it('should should set the ref property', () => {
            const result = new ImageAsset('test', 'test1');
            result.load();
            expect(result.getRef()).to.not.equal(undefined);
        });

        it('should set ref.src to the path parameter', () => {
            const result = new ImageAsset('test', 'test1');
            result.load();
            expect(result.getRef().src).to.equal('test1');
        });

        it('should set the loading property to true', () => {
            const result = new ImageAsset('test', 'test1');
            result.load();
            expect(result.loading).to.equal(true);
        });
    });

    describe('equals()', () => {
        it('should return true given an asset with the same name and type', () => {
            const result = new ImageAsset('test', 'test1');
            const result1 = result.equals(new ImageAsset('test', 'test1'));
            expect(result1).to.equal(true);
        });
    });

    describe('getRef()', () => {
        it('should return the ref type', () => {
            const result = new ImageAsset('test', 'test1');
            console.log(result.getRef());
            expect(result.getRef() instanceof HTMLImageElement).to.equal(true);
        });
    });
});
