import { Rotation3 } from '../../src/structs/Rotation3';
import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Rotation3', () => {
    describe('set()', () => {
        it('should set x,y,z values', () => {
            const result = new Rotation3();
            result.set(0.5, 0.5, 0.5);
            expect(result.x).to.equal(0.5);
            expect(result.y).to.equal(0.5);
            expect(result.z).to.equal(0.5);
        });

        it('should do nothing given invalid values', () => {
            const result = new Rotation3(1, 1, 1);
            result.set();
            expect(result.x).to.equal(1);
            expect(result.y).to.equal(1);
            expect(result.z).to.equal(1);
        });

        it('should clamp values to a maximum of 360, retaining the remainder', () => {
            const result = new Rotation3();
            result.set(1081, 361, 362);
            expect(result.x).to.equal(1);
            expect(result.y).to.equal(1);
            expect(result.z).to.equal(2);
        });

        it('should accept negative values', () => {
            const result = new Rotation3();
            result.set(-1081, 0, 0);
            expect(result.x).to.equal(-1);
        });
    });

    describe('static add()', () => {
        it('should add 2 rotations', () => {
            const result = new Rotation3(0.2, 0.2, 0.2);
            const result1 = new Rotation3(0.2, 0.2, 0.2);
            const result2 = Rotation3.add(result, result1);
            expect(result2.x).to.equal(0.4);
            expect(result2.y).to.equal(0.4);
            expect(result2.z).to.equal(0.4);
        });
    });

    describe('add()', () => {
        it('should add a point to itself', () => {
            const result = new Rotation3(0.2, 0.2, 0.2);
            const result1 = result.add(new Rotation3(0.2, 0.2, 0.2));
            expect(result1.x).to.equal(0.4);
            expect(result1.y).to.equal(0.4);
            expect(result1.z).to.equal(0.4);
        });
    });

    describe('static subtract()', () => {
        it('should subtract 2 rotations', () => {
            const result = new Rotation3(0.2, 0.2, 0.2);
            const result1 = new Rotation3(0.2, 0.2, 0.2);
            const result2 = Rotation3.subtract(result, result1);
            expect(result2.x).to.equal(0);
            expect(result2.y).to.equal(0);
            expect(result2.z).to.equal(0);
        });
    });

    describe('subtract()', () => {
        it('should subtract a rotation from itself', () => {
            const result = new Rotation3(0.2, 0.2, 0.2);
            const result1 = result.subtract(new Rotation3(0.2, 0.2, 0.2));
            expect(result1.x).to.equal(0);
            expect(result1.y).to.equal(0);
            expect(result1.z).to.equal(0);
        });
    });

    describe('static equals()', () => {
        it('should return true if x,y,z are equal', () => {
            const result = new Rotation3(0.2, 0.2, 0.2);
            const result1 = new Rotation3(0.2, 0.2, 0.2);
            const result2 = Rotation3.equals(result, result1);
            expect(result2).to.equal(true);
        });

        it('should return false if x,y,z are not equal', () => {
            const result = new Rotation3(0, 0, 0);
            const result1 = new Rotation3(0.2, 0.2, 0.2);
            const result2 = Rotation3.equals(result, result1);
            expect(result2).to.equal(false);
        });
    });

    describe('equals()', () => {
        it('should return true if x,y,z are equal', () => {
            const result = new Rotation3(0.2, 0.2, 0.2);
            const result1 = result.equals(new Rotation3(0.2, 0.2, 0.2));
            expect(result1).to.equal(true);
        });

        it('should return false if x,y,z are not equal', () => {
            const result = new Rotation3(0.2, 0.2, 0.2);
            const result1 = result.equals(new Rotation3(0, 0, 0));
            expect(result1).to.equal(false);
        });
    });
});
