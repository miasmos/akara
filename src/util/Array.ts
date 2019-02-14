import { SortOrder } from '../enum/SortOrder';

export class Array {
    public static sortByKey<T>(arr: T[], key: string, sortOrder: SortOrder = SortOrder.Asc): T[] {
        const allObjectsHadProperty = arr.every(value => typeof value === 'object' && key in value);

        if (!allObjectsHadProperty) {
            return arr;
        }

        return arr.slice().sort((a, b) => {
            switch (sortOrder) {
                case SortOrder.Asc:
                    return a[key] - b[key];
                default:
                    return b[key] - a[key];
            }
        });
    }
}
