import { SortOrder } from '../enum/SortOrder';

export class Array {
    public static sortByKey<T>(arr: T[], key: string, sortOrder: SortOrder = SortOrder.Asc): T[] {
        let allObjectsHadProperty = true;

        return arr.sort((a, b) => {
            if (!allObjectsHadProperty) {
                return 0;
            }
            if (typeof a !== 'object' || typeof b !== 'object' || !(key in a) || !(key in b)) {
                allObjectsHadProperty = false;
                return 0;
            }

            switch (sortOrder) {
                case SortOrder.Asc:
                    return a[key] - b[key];
                case SortOrder.Desc:
                    return b[key] - a[key];
            }
        });
    }
}
