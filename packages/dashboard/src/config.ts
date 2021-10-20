import { Hosts } from '@psychedelic/cap-js';
import dfxJson from '../../../dfx.json';

if (!process.env.NODE_ENV) throw Error('Oops! Missing the NODE_ENV environment variable.');

enum Enviroments {
  production = 'production',
  staging = 'staging',
  development = 'development',
  test = 'test'
}

type Config = {
  [key in Enviroments]: {
    canisterId: string,
    host: string,
  }
}

// Safe-guard, although the webpack config
// fallback to NODE_ENV as `development`
if (!Object.values(Enviroments).includes(process.env.NODE_ENV as any)) {
  throw Error(`Oops! Unknown NODE_ENV environment variable (${process.env.NODE_ENV})`);
}

const env = process.env.NODE_ENV as Enviroments;

// TODO: Get these canister id from the NODE_ENV environment var
const MAINNET_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
const LOCAL_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

const config: Config = {
  production: {
    canisterId: MAINNET_CANISTER_ID,
    host: Hosts.mainnet,
  },
  staging: {
    canisterId: MAINNET_CANISTER_ID,
    host: Hosts.mainnet,
  },
  development: {
    canisterId: LOCAL_CANISTER_ID,
    host: dfxJson.networks.local.bind,
  },
  // Used by jest on React functional tests
  // e.g. the `test:dashboard`
  test: {
    canisterId: LOCAL_CANISTER_ID,
    host: dfxJson.networks.local.bind,
  },
};

// export default config[process.env.NODE_ENV as Enviroments];
export default config[env];