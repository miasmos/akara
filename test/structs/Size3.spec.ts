import { Size3 } from '../../src/structs/Size3';
import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Size3', () => {
    describe('set()', () => {
        it('should set width,height,depth values', () => {
            const result = new Size3();
            result.set(0.5, 0.5, 0.5);
            expect(result.width).to.equal(0.5);
            expect(result.height).to.equal(0.5);
            expect(result.depth).to.equal(0.5);
        });

        it('should do nothing given invalid values', () => {
            const result = new Size3(1, 1, 1);
            result.set();
            expect(result.width).to.equal(1);
            expect(result.height).to.equal(1);
            expect(result.depth).to.equal(1);
        });
    });

    describe('static add()', () => {
        it('should add 2 sizes', () => {
            const result = new Size3(0.2, 0.2, 0.2);
            const result1 = new Size3(0.2, 0.2, 0.2);
            const result2 = Size3.add(result, result1);
            expect(result2.width).to.equal(0.4);
            expect(result2.height).to.equal(0.4);
            expect(result2.depth).to.equal(0.4);
        });
    });

    describe('add()', () => {
        it('should add a point to itself', () => {
            const result = new Size3(0.2, 0.2, 0.2);
            const result1 = result.add(new Size3(0.2, 0.2, 0.2));
            expect(result1.width).to.equal(0.4);
            expect(result1.height).to.equal(0.4);
            expect(result1.depth).to.equal(0.4);
        });
    });

    describe('static subtract()', () => {
        it('should subtract 2 sizes', () => {
            const result = new Size3(0.2, 0.2, 0.2);
            const result1 = new Size3(0.2, 0.2, 0.2);
            const result2 = Size3.subtract(result, result1);
            expect(result2.width).to.equal(0);
            expect(result2.height).to.equal(0);
            expect(result2.depth).to.equal(0);
        });
    });

    describe('subtract()', () => {
        it('should subtract a size from itself', () => {
            const result = new Size3(0.2, 0.2, 0.2);
            const result1 = result.subtract(new Size3(0.2, 0.2, 0.2));
            expect(result1.width).to.equal(0);
            expect(result1.height).to.equal(0);
            expect(result1.depth).to.equal(0);
        });
    });

    describe('static equals()', () => {
        it('should return true if width,height,depth are equal', () => {
            const result = new Size3(0.2, 0.2, 0.2);
            const result1 = new Size3(0.2, 0.2, 0.2);
            const result2 = Size3.equals(result, result1);
            expect(result2).to.equal(true);
        });

        it('should return false if width,height,depth are not equal', () => {
            const result = new Size3(0, 0, 0);
            const result1 = new Size3(0.2, 0.2, 0.2);
            const result2 = Size3.equals(result, result1);
            expect(result2).to.equal(false);
        });
    });

    describe('equals()', () => {
        it('should return true if width,height,depth are equal', () => {
            const result = new Size3(0.2, 0.2, 0.2);
            const result1 = result.equals(new Size3(0.2, 0.2, 0.2));
            expect(result1).to.equal(true);
        });

        it('should return false if width,height,depth are not equal', () => {
            const result = new Size3(0.2, 0.2, 0.2);
            const result1 = result.equals(new Size3(0, 0, 0));
            expect(result1).to.equal(false);
        });
    });
});
