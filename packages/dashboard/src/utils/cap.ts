import { Cap, Hosts } from '@psychedelic/cap-js';

export default {};

export const getCapInstance = async ({
  canisterId,
  host,
}: {
  canisterId: string,
  host: string,
}) => {
  const cap = await Cap.init({
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
