import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';

describe('Debug', () => {
    describe('log()', () => {
        it('should not log when environment is production', () => {
            const result: boolean = Util.Debug.log();
            expect(result).to.equal(false);
        });
    });

    describe('warn()', () => {
        it('should not warn when environment is production', () => {
            const result: boolean = Util.Debug.warn();
            expect(result).to.equal(false);
        });
    });

    describe('error()', () => {
        it('should not error when environment is production', () => {
            const result: boolean = Util.Debug.error();
            expect(result).to.equal(false);
        });
    });

    describe('throw()', () => {
        it('should not throw when environment is production', () => {
            const result: boolean = Util.Debug.throw();
            expect(result).to.equal(false);
        });
    });
});
