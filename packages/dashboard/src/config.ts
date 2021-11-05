import { Hosts } from '@psychedelic/cap-js';
import dfxJson from '../../../dfx.json';
import {
  Config,
  Environments,
  isValidEnvironment,
  isValidPrincipalFromTextId,
} from '@utils/config';

if (!process.env.NODE_ENV) throw Error('Oops! Missing the NODE_ENV environment variable.');

// Safe-guard, should have an expected environment
// although the webpack config fallback to NODE_ENV as `development`
if (!isValidEnvironment(process.env.NODE_ENV)) {
  throw Error(`Oops! Unknown NODE_ENV environment variable (${process.env.NODE_ENV})`);
}

// Safe-guard, should be a valid principal text id
// otherwise throw exception
if (!isValidPrincipalFromTextId(process.env.IC_HISTORY_ROUTER_ID)) {
  throw Error(`Oops! Missing the IC_HISTORY_ROUTER_ID environment variable (${process.env.IC_HISTORY_ROUTER_ID})`)
}

// Get these canister id from the NODE_ENV environment var
// this is set has IC_HISTORY_ROUTER_ID
// the IC_HISTORY_ROUTER_ID is previously validated, so safely set as string
const canisterId = process.env.IC_HISTORY_ROUTER_ID as string;

const config: Config = {
  production: {
    canisterId,
    host: Hosts.mainnet,
  },
  staging: {
    canisterId,
    host: Hosts.mainnet,
  },
  development: {
    // canisterId,
    // host: dfxJson.networks.local.bind,
    // TODO: This is TEMP, remove it after on PR
    // just done to point to staging mainnet
    canisterId: 'lj532-6iaaa-aaaah-qcc7a-cai',
    host: Hosts.mainnet,
  },
  // Used by jest on React functional tests
  // e.g. the `test:dashboard`
  test: {
    canisterId,
    host: dfxJson.networks.local.bind,
  },
};

// The NODE_ENV has been previously validated as Environments
export default config[process.env.NODE_ENV as Environments];
