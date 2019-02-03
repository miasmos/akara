export class Size3 {
    public width: number = 0;
    public height: number = 0;
    public depth: number = 0;

    public constructor(width?: number, height?: number, depth?: number) {
        this.set(width, height, depth);
    }

    public set(width?: number, height?: number, depth?: number): void {
        if (typeof width !== 'undefined') {
            this.width = width;
        }
        if (typeof height !== 'undefined') {
            this.height = height;
        }
        if (typeof depth !== 'undefined') {
            this.depth = depth;
        }
    }

    public add(point: Size3): Size3 {
        return Size3.add(this, point);
    }

    public static add(a: Size3, b: Size3): Size3 {
        return new Size3(a.width + b.width, a.height + b.height, a.depth + b.depth);
    }

    public subtract(point: Size3): Size3 {
        return Size3.subtract(this, point);
    }

    public static subtract(a: Size3, b: Size3): Size3 {
        return new Size3(a.width - b.width, a.height - b.height, a.depth - b.depth);
    }

    public equals(point: Size3): boolean {
        return Size3.equals(this, point);
    }

    public static equals(a: Size3, b: Size3): boolean {
        return a.width === b.width && a.height === b.height && a.depth === b.depth;
    }
}
