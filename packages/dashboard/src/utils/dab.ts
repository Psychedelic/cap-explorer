import config from '../config';
import {
  getCanisterInfo,
  getNFTActor,
  NFTDetails,
} from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { mockCanisterMetadata } from '@utils/mocks/dabMetadata';
import { shouldUseMockup } from '@utils/mocks';

export default {};

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
    canisterId, // TODO: why is this here? Typo? remove it
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
