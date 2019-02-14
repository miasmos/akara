import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Math', () => {
    describe('distance()', () => {
        it('should return distance between 2 positives', () => {
            const result = Util.Math.distance(2, 1);
            expect(result).to.equal(1);
        });

        it('should return distance between 2 negatives', () => {
            const result = Util.Math.distance(-2, -1);
            expect(result).to.equal(1);
        });

        it('should return distance between 1 positive and 1 negative', () => {
            const result = Util.Math.distance(-1, 1);
            expect(result).to.equal(2);
        });
    });

    describe('clamp()', () => {
        it('should clamp max', () => {
            const result = Util.Math.clamp(100, 1, 50);
            expect(result).to.equal(50);
        });

        it('should clamp min', () => {
            const result = Util.Math.clamp(-50, 1, 50);
            expect(result).to.equal(1);
        });

        it('should return the same value when clamped params are equal to it', () => {
            const result = Util.Math.clamp(1, 1, 1);
            expect(result).to.equal(1);
        });

        it('should return the same value when params are invalid', () => {
            const result = Util.Math.clamp(1, 100, 50);
            expect(result).to.equal(1);
        });
    });
});
