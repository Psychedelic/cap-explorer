import config from '../config';
import {
  getCanisterInfo,
  getNFTActor,
  NFTDetails,
  standards,
} from '@psychedelic/dab-js';
import {
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { HttpAgent } from '@dfinity/agent';
import { mockCanisterMetadata } from '@utils/mocks/dabMetadata';
import { shouldUseMockup } from '@utils/mocks';

export default {};

export type NFTItemDetails = {
  [tokenContractId: string]: {
    [index: string]: NFTDetails,
  }
}

export interface CanisterMetadata {
  url: string;
  name: string;
  description: string;
  version: number;
  logo_url: string;
}

export type ContractPairedMetadata = {
  contractId: string;
  metadata: CanisterMetadata;
};

export type ContractKeyPairedMetadata = Record<string, CanisterMetadata>;

export type CanisterKeyPairedMetadata = { [canisterId: string]: CanisterMetadata; };
export type CanisterNameKeyPairedId = Record<string, string>;

const USE_MOCKUP = shouldUseMockup();

export const getDabMetadata = async ({
  canisterId,
}: {
  canisterId: string,
}) => {
  if (USE_MOCKUP) {
    return mockCanisterMetadata;
  }

  let metadata: Awaited<ReturnType<typeof getCanisterInfo>>;

  const httpAgentArgs = {
    host: config.host,
  };
  
  try {
    const agent = new HttpAgent(httpAgentArgs);

    // TODO: check why tsc fails for agent type
    metadata = await getCanisterInfo({
      canisterId,
      agent: (agent as any),
    });
  } catch (err) {
    console.warn(`Oops! Metadata for ${canisterId} not found in dab!`);
  }

  return metadata;
}

export const DAB_IDENTITY_UNKNOWN = 'Unknown';

export const getNFTDetails = async ({
  tokenId,
  tokenIndex,
  standard,
}: {
  tokenId: string,
  tokenIndex: number,
  standard: string,
}): Promise<NFTDetails> => {
  const httpAgentArgs = {
    host: 'https://ic0.app/',
    canisterId: tokenId,
  };

  const agent = new HttpAgent(httpAgentArgs);
  
  const actor = await getNFTActor({
    agent,
    canisterId: tokenId,
    standard,
  });

  const details = await actor.details(
    tokenIndex,
  );

  return details;
};

export type TokenStandards = keyof typeof standards;

export const isValidStandard = (name: string) => standards.hasOwnProperty(name.toLowerCase());

export const createNFTDetailsHandlerPromiseList = ({
  nftItemDetails,
  standard,
  tokenId,
  transactionEvents,
}: {
  nftItemDetails: NFTItemDetails,
  standard: TokenStandards,
  tokenId: string,
  transactionEvents: TransactionEvent[]
}): Promise<NFTDetails>[] | undefined => {
  if (!Array.isArray(transactionEvents)) return;

  const promises = transactionEvents.map(
    (item) => {
      // Skip, what's already in cache
      if (nftItemDetails?.[tokenId]?.[Number(item.item).toString()]) {
        return;
      }

      const tokenIndex = item?.item;

      if (!tokenIndex) return;

      return getNFTDetails({
        tokenId,
        tokenIndex,
        standard,
      });
    }
  )
  // Filter out none callbacks
  .filter((metadataPromise) => typeof metadataPromise !== 'undefined') as Promise<NFTDetails>[];

  return promises;
}
