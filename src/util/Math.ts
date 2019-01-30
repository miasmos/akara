export class Math2 {
    public static distance(n1: number, n2: number): number {
        const diff = n1 + n2;
        return Math.abs(n2 + diff - (n1 + diff));
    }
}
