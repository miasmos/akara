import { Debug } from './';

export class Logger {
    public static log(...args: any[]): void {
        if (true || Debug.isDebug) {
            console.log(...args);
        }
    }

    public static warn(...args: any[]): void {
        if (Debug.isDebug) {
            console.warn(...args);
        }
    }

    public static error(...args: any[]): void {
        if (Debug.isDebug) {
            console.error(...args);
        }
    }
}
