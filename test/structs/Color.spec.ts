import { Color } from '../../src/structs/Color';
import { expect } from 'chai';
import 'mocha';

describe('Color', () => {
    it('should have a default color of #000', () => {
        const result = new Color();
        expect(result.hex).to.equal('000000');
    });

    it('should accept a string hex value', () => {
        const result = new Color('FFF');
        expect(result.hex).to.equal('ffffff');
    });

    it('should be empty if given an invalid hex digit', () => {
        const result = new Color('0G0');
        expect(result.hex).to.equal('');
    });

    it('should by empty if given an invalid hex length', () => {
        const result = new Color('0000');
        expect(result.hex).to.equal('');
    });

    it('should accept both lowercase and uppercase digits', () => {
        const result = new Color('FfF');
        expect(result.hex).to.equal('ffffff');
    });

    describe('r', () => {
        it('should return the first 2 digits of the hex value', () => {
            const result = new Color('00ff11');
            expect(result.r).to.equal('00');
        });
    });

    describe('g', () => {
        it('should return the middle 2 digits of the hex value', () => {
            const result = new Color('00ff11');
            expect(result.g).to.equal('ff');
        });
    });

    describe('b', () => {
        it('should return the last 2 digits of the hex value', () => {
            const result = new Color('00ff11');
            expect(result.b).to.equal('11');
        });
    });

    describe('get()', () => {
        it('should return the hex value', () => {
            const result = new Color('fff');
            expect(result.get()).to.equal('ffffff');
        });
    });

    describe('toString()', () => {
        it('should return a valid CSS hex value', () => {
            const result = new Color('fff');
            expect(result.toString()).to.equal('#ffffff');
        });
    });

    describe('equals()', () => {
        it('should return true given a another Color with the same hex value', () => {
            const result = new Color('fff');
            const result1 = new Color('fff');
            expect(result.equals(result1)).to.equal(true);
        });

        it('should return false given a another Color with the a different hex value', () => {
            const result = new Color('fff');
            const result1 = new Color('000');
            expect(result.equals(result1)).to.equal(false);
        });
    });

    describe('isHex()', () => {
        it('should return true given a valid 3 digit hex value', () => {
            const result = Color.isHex('fff');
            expect(result).to.equal(true);
        });

        it('should return false given an invalid 3 digit hex value', () => {
            const result = Color.isHex('0g0');
            expect(result).to.equal(false);
        });

        it('should return true given a valid 6 digit hex value', () => {
            const result = Color.isHex('ffffff');
            expect(result).to.equal(true);
        });

        it('should return false given an invalid 6 digit hex value', () => {
            const result = Color.isHex('0g0g0g');
            expect(result).to.equal(false);
        });

        it('should return false given a value with invalid length', () => {
            const result = Color.isHex('ffff');
            expect(result).to.equal(false);
        });

        it('should accept both lowercase and uppercase digits', () => {
            const result = Color.isHex('FfF');
            expect(result).to.equal(true);
        });
    });
});
