import { Vector2 } from '../../src/structs/Vector2';
import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Vector2', () => {
    describe('set()', () => {
        it('should set x and y values', () => {
            const result = new Vector2();
            result.set(0.5, 0.5);
            expect(result.x).to.equal(0.5);
            expect(result.y).to.equal(0.5);
        });

        it('should clamp values to a minimum of -1', () => {
            const result = new Vector2();
            result.set(-2, 1);
            expect(result.x).to.equal(-1);
        });

        it('should clamp values to a maximum of 1', () => {
            const result = new Vector2();
            result.set(1, 5);
            expect(result.x).to.equal(1);
        });
    });
});
