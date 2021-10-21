export default {};

export enum Enviroments {
  production = 'production',
  staging = 'staging',
  development = 'development',
  test = 'test'
};

export type Config = {
  [key in Enviroments]: {
    canisterId: string,
    host: string,
  }
};

export const isValidEnvironment = (env: any) => Object.values(Enviroments).includes(env);
