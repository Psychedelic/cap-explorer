import { Hosts } from '@psychedelic/cap-js';
import dfxJson from '../../../dfx.json';
import {
  Config,
  Enviroments,
  isValidEnvironment,
} from '@utils/config';

if (!process.env.NODE_ENV) throw Error('Oops! Missing the NODE_ENV environment variable.');

// Safe-guard, should have an expected environment
// although the webpack config fallback to NODE_ENV as `development`
if (!isValidEnvironment(process.env.NODE_ENV)) {
  throw Error(`Oops! Unknown NODE_ENV environment variable (${process.env.NODE_ENV})`);
}

const env = process.env.NODE_ENV as Enviroments;

// TODO: Get these canister id from the NODE_ENV environment var
// this is set has IC_HISTORY_ROUTER_ID
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