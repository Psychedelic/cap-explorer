import { Principal } from '@dfinity/principal';
import {
  isValidPrincipalFromTextId,
} from '@utils/config';

const decode32bits = (arr: Uint8Array): number => {
  let value = 0;
  for (let i = 0; i < 4; i += 1) {
    value = (value << 8) | arr[i];
  }
  return value;
};

export const decodeTokenId = (tokenId: string): number => {
  if (!isValidPrincipalFromTextId(tokenId)) {
    throw Error(`Oops! Is not a valid token id principal (${tokenId})`,);
  }

  const principal = Principal.fromText(tokenId);
  const bytes = principal.toUint8Array().slice(-4);
  return decode32bits(bytes);
}
