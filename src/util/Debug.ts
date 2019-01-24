import { Environment } from './Environment';

export class Debug {
    public static isDebug: boolean = Environment.isDevelopment();

    public static log(...args: any[]): void {
        if (true || Debug.isDebug) {
            window.console.log(...args);
        }
    }

    public static warn(...args: any[]): void {
        if (Debug.isDebug) {
            window.console.warn(...args);
        }
    }

    public static error(...args: any[]): void {
        if (Debug.isDebug) {
            window.console.error(...args);
        }
    }
}
