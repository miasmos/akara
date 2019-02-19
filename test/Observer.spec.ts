import { expect, assert } from 'chai';
import 'mocha';
import { Observer } from '../src/Observer';

describe('Observer', () => {
    describe('on()', () => {
        it('should register and emit an event', done => {
            const observer = new Observer();
            observer.on('test', () => {
                done();
            });
            observer.emit('test');
        });
    });

    describe('off()', () => {
        it('should unregister a specific callback', done => {
            const observer = new Observer();
            const callback = () => {
                assert.fail();
            };
            observer.on('test', callback);
            observer.off('test', callback);
            observer.emit('test');
            done();
        });

        it('should unregister the entire event array', done => {
            const observer = new Observer();
            const callback = () => {
                assert.fail();
            };
            observer.on('test', callback);
            observer.on('test', callback);
            observer.on('test', callback);
            observer.off('test');
            observer.emit('test');
            done();
        });

        it('should return false if event does not exist', () => {
            const observer = new Observer();
            expect(observer.off('test')).to.equal(false);
        });
    });

    describe('emit()', () => {
        it('should suppress events when suppress is true', done => {
            const observer = new Observer();
            observer.suppress = true;
            observer.on('test', () => {
                assert.fail();
            });
            observer.emit('test');
            done();
        });
    });
});
