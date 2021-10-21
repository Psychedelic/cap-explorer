import { Principal } from "@dfinity/principal";

export default {};

export enum Environments {
  production = 'production',
  staging = 'staging',
  development = 'development',
  test = 'test'
};

export type Config = {
  [key in Environments]: {
    canisterId: string,
    host: string,
  }
};

export const isValidEnvironment = (env: any) => Object.values(Environments).includes(env);
// The Id can be anything, thus set as any and should be validated
export const isValidPrincipalFromTextId = (id: any) => {
  if (typeof id !== 'string') return false;

  try {
    Principal.fromText(id);
  } catch (err) {
    return false;
  }

  return true;
}
