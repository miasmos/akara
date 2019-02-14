import { Pivot2 } from '../../src/structs/Pivot2';
import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Pivot2', () => {
    describe('set()', () => {
        it('should set x and y values', () => {
            const result = new Pivot2();
            result.set(0.5, 0.5);
            expect(result.x).to.equal(0.5);
            expect(result.y).to.equal(0.5);
        });

        it('should clamp values to a minimum of 0', () => {
            const result = new Pivot2();
            result.set(-5, 1);
            expect(result.x).to.equal(0);
        });

        it('should clamp values to a maximum of 1', () => {
            const result = new Pivot2();
            result.set(1, 5);
            expect(result.x).to.equal(1);
        });
    });

    describe('top()', () => {
        it('should set y to 0', () => {
            const result = new Pivot2(1, 1);
            result.top();
            expect(result.y).to.equal(0);
        });

        it("should retain it's x value", () => {
            const result = new Pivot2(1, 1);
            result.top();
            expect(result.x).to.equal(1);
        });
    });

    describe('bottom()', () => {
        it('should set y to 1', () => {
            const result = new Pivot2(1, 0);
            result.bottom();
            expect(result.y).to.equal(1);
        });

        it("should retain it's x value", () => {
            const result = new Pivot2(1, 1);
            result.bottom();
            expect(result.x).to.equal(1);
        });
    });

    describe('left()', () => {
        it('should set x to 0', () => {
            const result = new Pivot2(1, 1);
            result.left();
            expect(result.x).to.equal(0);
        });

        it("should retain it's y value", () => {
            const result = new Pivot2(1, 1);
            result.left();
            expect(result.y).to.equal(1);
        });
    });

    describe('right()', () => {
        it('should set x to 1', () => {
            const result = new Pivot2(1, 1);
            result.right();
            expect(result.x).to.equal(1);
        });

        it("should retain it's y value", () => {
            const result = new Pivot2(1, 1);
            result.right();
            expect(result.y).to.equal(1);
        });
    });

    describe('static add()', () => {
        it('should add 2 pivots', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = new Pivot2(0.2, 0.2);
            const result2 = Pivot2.add(result, result1);
            expect(result2.x).to.equal(0.4);
            expect(result2.y).to.equal(0.4);
        });

        it('should clamp values to maximum of 1', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = new Pivot2(1, 1);
            const result2 = Pivot2.add(result, result1);
            expect(result2.x).to.equal(1);
            expect(result2.y).to.equal(1);
        });
    });

    describe('add()', () => {
        it('should add a pivot to itself', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = result.add(new Pivot2(0.2, 0.2));
            expect(result1.x).to.equal(0.4);
            expect(result1.y).to.equal(0.4);
        });

        it('should clamp values to maximum of 1', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = result.add(new Pivot2(1, 1));
            expect(result1.x).to.equal(1);
            expect(result1.y).to.equal(1);
        });
    });

    describe('static subtract()', () => {
        it('should subtract 2 pivots', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = new Pivot2(0.2, 0.2);
            const result2 = Pivot2.subtract(result, result1);
            expect(result2.x).to.equal(0);
            expect(result2.y).to.equal(0);
        });

        it('should clamp values to minimum of 0', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = new Pivot2(1, 1);
            const result2 = Pivot2.subtract(result, result1);
            expect(result2.x).to.equal(0);
            expect(result2.y).to.equal(0);
        });
    });

    describe('subtract()', () => {
        it('should subtract a pivot from itself', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = result.subtract(new Pivot2(0.2, 0.2));
            expect(result1.x).to.equal(0);
            expect(result1.y).to.equal(0);
        });

        it('should clamp values to minimum of 0', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = result.subtract(new Pivot2(1, 1));
            expect(result1.x).to.equal(0);
            expect(result1.y).to.equal(0);
        });
    });

    describe('static equals()', () => {
        it('should return true if x,y are equal', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = new Pivot2(0.2, 0.2);
            const result2 = Pivot2.equals(result, result1);
            expect(result2).to.equal(true);
        });

        it('should return false if x,y are not equal', () => {
            const result = new Pivot2(0, 0);
            const result1 = new Pivot2(0.2, 0.2);
            const result2 = Pivot2.equals(result, result1);
            expect(result2).to.equal(false);
        });
    });

    describe('equals()', () => {
        it('should return true if x,y are equal', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = result.equals(new Pivot2(0.2, 0.2));
            expect(result1).to.equal(true);
        });

        it('should return false if x,y are not equal', () => {
            const result = new Pivot2(0.2, 0.2);
            const result1 = result.equals(new Pivot2(0, 0));
            expect(result1).to.equal(false);
        });
    });
});
