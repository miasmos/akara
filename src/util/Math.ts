export class Math2 {
    public static distance(n1: number, n2: number): number {
        const diff = n1 + n2;
        return Math.abs(n2 + diff - (n1 + diff));
    }

    public static clamp(
        source: number,
        min: number = Number.MAX_SAFE_INTEGER,
        max: number = Number.MAX_SAFE_INTEGER
    ): number {
        let result: number = source;
        if (min > max || max < min) {
            return source;
        }
        if (result < min) {
            result = min;
        }
        if (result > max) {
            result = max;
        }
        return result;
    }
}
