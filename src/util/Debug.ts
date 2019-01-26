import { Environment } from './Environment';

export class Debug {
    public static isDebug: boolean = Environment.isDevelopment();

    public static log<T>(...args: T[]): void {
        if (true || Debug.isDebug) {
            window.console.log(...args);
        }
    }

    public static warn<T>(...args: T[]): void {
        if (Debug.isDebug) {
            window.console.warn(...args);
        }
    }

    public static error<T>(...args: T[]): void {
        if (Debug.isDebug) {
            window.console.error(...args);
        }
    }
}
