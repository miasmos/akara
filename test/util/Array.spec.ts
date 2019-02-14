import * as Util from '../../src/util/Util';
import { expect } from 'chai';
import 'mocha';
import { SortOrder } from '../../src/enum/SortOrder';

describe('Array', () => {
    describe('sortByKey()', () => {
        interface IDataObject {
            test?: number;
        }
        const data: IDataObject[] = [{ test: 5 }, { test: 101 }, { test: -1 }, { test: 0 }];

        it('should return in ascending order', () => {
            const result = Util.Array.sortByKey(data, 'test', SortOrder.Asc);
            expect(result[0].test).to.equal(-1);
            expect(result[1].test).to.equal(0);
        });

        it('should return in descending order', () => {
            const result = Util.Array.sortByKey(data, 'test', SortOrder.Desc);
            expect(result[0].test).to.equal(101);
            expect(result[1].test).to.equal(5);
        });

        it("should return original order if property doesn't exist on all objects", () => {
            let data1: IDataObject[] = data.slice();
            data1.push({});
            const result = Util.Array.sortByKey(data1, 'test', SortOrder.Asc);
            expect(result[0].test).to.equal(5);
            expect(result[1].test).to.equal(101);
        });
    });
});
