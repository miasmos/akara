import { Environment } from './';

export class Debug {
    public static isDebug: boolean = Environment.isDevelopment();
}
