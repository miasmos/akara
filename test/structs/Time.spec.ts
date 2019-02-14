import { Time } from '../../src/structs/Time';
import { expect } from 'chai';
import 'mocha';

describe('Time', () => {
    describe('next()', () => {
        it('should return a valid timestamp', () => {
            const now = Date.now();
            const result = Time.next(now);
            expect(new Date(result).getTime()).to.not.equal(0);
        });

        it('should return the next timestamp', () => {
            const now = Date.now();
            const timestamp = Time.next(now);
            const result = Time.next(now + 1);
            expect(result).to.equal(now + 1);
        });

        it('should set Time.deltaTime', () => {
            const now = Date.now();
            const timestamp = Time.next(now);
            const result = Time.next(now + 1);
            expect(Time.deltaTime).to.equal(1);
        });

        it('should return Date.now() given no parameters', () => {
            const result = Time.next();
            expect(result).to.equal(Date.now());
        });
    });
});
