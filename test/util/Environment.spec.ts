import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';
import { Environment } from '../../src/enum/Environment';

describe('Environment', () => {
    describe('isDevelopment', () => {
        it('should return false when environment is production', () => {
            const result: boolean = Util.Environment.isDevelopment;
            expect(result).to.equal(false);
        });
    });

    describe('isProduction', () => {
        it('should return true when environment is production', () => {
            const result: boolean = Util.Environment.isProduction;
            expect(result).to.equal(true);
        });
    });

    describe('is()', () => {
        it('should return true when production matches', () => {
            const result: boolean = Util.Environment.is(Environment.Production);
            expect(result).to.equal(true);
        });

        it('should return false when development does not match', () => {
            const result: boolean = Util.Environment.is(Environment.Development);
            expect(result).to.equal(false);
        });
    });
});
