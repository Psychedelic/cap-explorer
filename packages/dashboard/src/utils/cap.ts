import {
  CapRouter,
  CapRoot,
} from '@psychedelic/cap-js';

export default {};

export const getCapRouterInstance = async ({
  canisterId,
  host,
}: {
  canisterId: string,
  host: string,
}) => await CapRouter.init({
  host,
  canisterId,
});

export const getCapRootInstance = async ({
  canisterId,
  host,
}: {
  canisterId: string,
  host: string,
}) => await CapRoot.init({
  host,
  canisterId,
});
