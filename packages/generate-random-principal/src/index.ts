import { Ed25519KeyIdentity } from '@dfinity/identity';

export default {};

export const generateRandomPrincipal = () => {
  const identity = Ed25519KeyIdentity.generate();
  const principal = identity.getPrincipal();
  return principal;
};

const principal = generateRandomPrincipal();

(() => {
  if (typeof window !== 'undefined') return;

  process.stdout.write(principal.toText());
})();
