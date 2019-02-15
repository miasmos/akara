import { expect } from 'chai';
import 'mocha';
import { Loader } from '../../src/loader/Loader';
import { ImageAsset } from '../../src/loader/assets/ImageAsset';

describe('Loader', () => {
    describe('image()', () => {
        it('should return an image asset', () => {
            const result = new Loader();
            expect(result.image('', '') instanceof ImageAsset).to.equal(true);
        });
    });
});
