import { Point2 } from '../../src/structs/Point2';
import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Point2', () => {
    it('should accept x and y values', () => {
        const result = new Point2(100, 100);
        expect(result.x).to.equal(100);
        expect(result.y).to.equal(100);
    });

    describe('set()', () => {
        it('should set x and y values', () => {
            const result = new Point2();
            result.set(0.5, 0.5);
            expect(result.x).to.equal(0.5);
            expect(result.y).to.equal(0.5);
        });

        it('should do nothing given invalid values', () => {
            const result = new Point2(1, 1);
            result.set();
            expect(result.x).to.equal(1);
            expect(result.y).to.equal(1);
        });
    });

    describe('static add()', () => {
        it('should add 2 points', () => {
            const result = new Point2(0.2, 0.2);
            const result1 = new Point2(0.2, 0.2);
            const result2 = Point2.add(result, result1);
            expect(result2.x).to.equal(0.4);
            expect(result2.y).to.equal(0.4);
        });
    });

    describe('add()', () => {
        it('should add a point to itself', () => {
            const result = new Point2(0.2, 0.2);
            const result1 = result.add(new Point2(0.2, 0.2));
            expect(result1.x).to.equal(0.4);
            expect(result1.y).to.equal(0.4);
        });
    });

    describe('static subtract()', () => {
        it('should subtract 2 points', () => {
            const result = new Point2(0.2, 0.2);
            const result1 = new Point2(0.2, 0.2);
            const result2 = Point2.subtract(result, result1);
            expect(result2.x).to.equal(0);
            expect(result2.y).to.equal(0);
        });
    });

    describe('subtract()', () => {
        it('should subtract a point from itself', () => {
            const result = new Point2(0.2, 0.2);
            const result1 = result.subtract(new Point2(0.2, 0.2));
            expect(result1.x).to.equal(0);
            expect(result1.y).to.equal(0);
        });
    });

    describe('static equals()', () => {
        it('should return true if x,y are equal', () => {
            const result = new Point2(0.2, 0.2);
            const result1 = new Point2(0.2, 0.2);
            const result2 = Point2.equals(result, result1);
            expect(result2).to.equal(true);
        });

        it('should return false if x,y are not equal', () => {
            const result = new Point2(0, 0);
            const result1 = new Point2(0.2, 0.2);
            const result2 = Point2.equals(result, result1);
            expect(result2).to.equal(false);
        });
    });

    describe('equals()', () => {
        it('should return true if x,y are equal', () => {
            const result = new Point2(0.2, 0.2);
            const result1 = result.equals(new Point2(0.2, 0.2));
            expect(result1).to.equal(true);
        });

        it('should return false if x,y are not equal', () => {
            const result = new Point2(0.2, 0.2);
            const result1 = result.equals(new Point2(0, 0));
            expect(result1).to.equal(false);
        });
    });
});
