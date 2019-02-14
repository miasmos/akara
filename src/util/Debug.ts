import { Environment } from './Environment';

export class Debug {
    public static isDebug: boolean = Environment.isDevelopment;

    public static log<T>(...args: T[]): boolean {
        if (Debug.isDebug) {
            window.console.log(...args);
            return true;
        }
        return false;
    }

    public static warn<T>(...args: T[]): boolean {
        if (Debug.isDebug) {
            window.console.warn(...args);
            return true;
        }
        return false;
    }

    public static error<T>(...args: T[]): boolean {
        if (Debug.isDebug) {
            window.console.error(...args);
            return true;
        }
        return false;
    }

    public static throw(...args: (string | undefined)[]): boolean {
        if (Debug.isDebug) {
            throw new Error(...args);
        }
        return false;
    }
}
