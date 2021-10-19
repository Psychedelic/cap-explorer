import {
  CapRouter,
  CapRoot,
  CapBase,
  Hosts,
} from '@psychedelic/cap-js';

export default {};

const getCapInstanceHandler = async <T extends { init: (arg: { host: string; canisterId: string; }) => any }>({
  canisterId,
  host,
  baseClass,
}: {
  canisterId: string,
  host: string,
  baseClass: T,
}) => {
  const cap = await baseClass.init({
    host,
    canisterId,
  });

  if (!cap) {
    // TODO: what to do when initialisation fails?
    console.warn('Oops! Failed to create root instance of CAP-js');

    return;
  }

  return cap;
};

export const getCapRouterInstance = async ({
  canisterId,
  host,
}: {
  canisterId: string,
  host: string,
}) => getCapInstanceHandler({
  host,
  canisterId,
  baseClass: CapRouter,
});

export const getCapRootInstance = async ({
  canisterId,
  host,
}: {
  canisterId: string,
  host: string,
}) => getCapInstanceHandler({
  host,
  canisterId,
  baseClass: CapRoot,
});
