import { Environment as EnvironmentEnum } from '../enum/Environment';
const env: string | undefined = process.env.NODE_ENV;

export class Environment {
    public static isDevelopment(): boolean {
        return env === EnvironmentEnum.Development;
    }

    public static isProduction(): boolean {
        return env === EnvironmentEnum.Production;
    }

    public static is(environment: EnvironmentEnum): boolean {
        return environment === env;
    }
}
