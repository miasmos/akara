import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Random', () => {
    describe('range()', () => {
        it('should return value between min and max exclusive', () => {
            const values: Number[] = [];
            values.fill(0, 1000, Util.Random.range(1, 2));
            const result: boolean = values.every(value => value >= 1 && value < 2);
            expect(result).to.equal(true);
        });
    });

    describe('id()', () => {
        it('should return an id of the given length', () => {
            const result: string = Util.Random.id(12);
            expect(result.length).to.equal(12);
        });

        it('should contain the supplied prefix', () => {
            const result: string = Util.Random.id(12, 'test');
            expect(result.indexOf('test')).to.equal(0);
        });

        it('should return length of 1 if length less than 1', () => {
            const result: string = Util.Random.id(-1);
            expect(result.length).to.equal(1);
        });

        it('should return length of 1 if no params are specified', () => {
            const result: string = Util.Random.id();
            expect(result.length).to.equal(1);
        });
    });
});
