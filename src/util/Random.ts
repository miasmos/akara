export class Random {
    public static range(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static id(length: number, prefix: string = ''): string {
        if (length < 1) {
            length = 1;
        }
        const seed = Math.random()
            .toString(36)
            .substr(2, 9);

        if (prefix.length + seed.length < length) {
            return this.id(length, prefix + seed);
        }

        const id = prefix + seed;
        return id.substring(0, length - 1);
    }
}
