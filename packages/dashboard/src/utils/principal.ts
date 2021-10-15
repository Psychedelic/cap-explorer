import { Ed25519KeyIdentity } from '@dfinity/identity';

export default {};

export const getRandomIdentity = () =>
  Ed25519KeyIdentity.generate()?.getPrincipal();
