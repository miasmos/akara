import * as Enum from '../enum';
const env: string | undefined = process.env.NODE_ENV;

export class Environment {
    public static isDevelopment(): boolean {
        return env === Enum.Environment.Development;
    }

    public static isProduction(): boolean {
        return env === Enum.Environment.Production;
    }

    public static is(environment: Enum.Environment): boolean {
        return environment === env;
    }
}
