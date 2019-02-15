import { EmptyAsset } from '../../../src/loader/assets/EmptyAsset';
import { expect } from 'chai';
import 'mocha';
import { LoaderEvents } from '../../../src/enum/LoaderEvents';
import { Asset } from '../../../src/loader/assets/Asset';

describe('EmptyAsset', () => {
    describe('load()', () => {
        it('should should set the ref property', () => {
            const result = new EmptyAsset();
            result.load();
            expect(result.getRef()).to.be.an('undefined');
        });
    });

    describe('equals()', () => {
        it('should return true given an asset with the same name and type', () => {
            const result = new EmptyAsset();
            const result1 = result.equals(new EmptyAsset());
            expect(result1).to.equal(true);
        });
    });

    describe('getRef()', () => {
        it('should return the ref type', () => {
            const result = new EmptyAsset();
            expect(result.getRef()).to.be.an('undefined');
        });
    });
});
