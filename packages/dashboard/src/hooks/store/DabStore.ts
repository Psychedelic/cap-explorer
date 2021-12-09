import create from 'zustand';
import config from '../../config';
import {
  DABCollection,
  createNFTDetailsHandlerPromiseList,
  mapNftDetailsPromisesResult,
  NFTItemDetails,
  TokenStandards,
  TokenContractKeyPairedStandard,
} from '@utils/dab';
import { HttpAgent } from "@dfinity/agent";
import {
  NFTDetails,
  getAllNFTS,  
} from '@psychedelic/dab-js';
import {
  Event as TransactionEvent,
} from '@psychedelic/cap-js';


export interface DabStore {
  isLoading: boolean,
  nftItemDetails: NFTItemDetails,
  dabCollection: DABCollection,
  tokenContractKeyPairedStandard: TokenContractKeyPairedStandard,
  fetchDabCollection: () => void,
  fetchDabItemDetails: ({
    data,
    tokenId,
    standard,
  }: {
    data: any[],
    tokenId: string,
    standard: TokenStandards,
  }) => void,
}

export const useDabStore = create<DabStore>((set, get) => ({
  isLoading: false,
  nftItemDetails: {},
  dabCollection: [],
  tokenContractKeyPairedStandard: {},
  fetchDabCollection: async () => {
    const agent = new HttpAgent({
      host: config.host,
    });
  
    const dabCollection = await getAllNFTS({ agent });

    const tokenContractKeyPairedStandard = dabCollection.reduce((acc, curr) => {
      const id = curr?.principal_id?.toString();

      if (!id || !curr?.standard) return acc;

      acc[id] = curr.standard;

      return acc;
    }, {} as TokenContractKeyPairedStandard);

    set((state: any) => ({
      // TODO: the set function merges state
      // there seems to be no need to spread the data
      ...state,
      tokenContractKeyPairedStandard,
      dabCollection,
    }));
  },
  fetchDabItemDetails: async ({
    data,
    tokenId,
    standard,
  }: {
    data: TransactionEvent[],
    tokenId: string,
    standard: TokenStandards,
  }) => {
    const nftItemDetails = get().nftItemDetails;

    const dabNFTMetadataPromises = createNFTDetailsHandlerPromiseList({
      nftItemDetails,
      standard,
      tokenId,
      transactionEvents: data,
    });

    if (!dabNFTMetadataPromises) {
      console.warn('Oops! NFT Details handling will not proceed. Is the transaction events empty?')

      return;
    }

    set({
      isLoading: true,
    });

    // TODO: Could split into parts to accelerate availability to end user?
    // If so, this seems to be done outside this scope
    const dabNFTMetadataPromiseRes: NFTDetails[] = await Promise.all(dabNFTMetadataPromises);

    const currNftItemDetails = mapNftDetailsPromisesResult({
      dabNFTMetadataPromiseRes,
      cachedNftItemDetails: nftItemDetails,
    });

    set({
      isLoading: false,
      nftItemDetails: currNftItemDetails,
    })
  },
}));
