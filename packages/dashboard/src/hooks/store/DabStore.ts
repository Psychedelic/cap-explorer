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
import { getDabMetadata, CanisterMetadata } from '@utils/dab';
import { HOSTS } from '../../config';

type TokenContractId = string;

export interface DabStore {
  isLoading: boolean,
  nftItemDetails: NFTItemDetails,
  dabCollection: DABCollection,
  canisterMetada: CanisterMetadata | undefined,
  tokenContractKeyPairedStandard: TokenContractKeyPairedStandard,
  fetchDabCollection: () => Promise<DABCollection>,
  fetchDabItemDetails: ({
    data,
    tokenId,
    standard,
  }: {
    // TODO: missing type definition for dab data
    data: any[],
    tokenId: string,
    standard: TokenStandards,
  }) => void,
  fetchTokenContractDabMetadata: (tokenContractId: TokenContractId) => void,
}

export const useDabStore = create<DabStore>((set, get) => ({
  isLoading: false,
  nftItemDetails: {},
  dabCollection: [],
  canisterMetada: undefined,
  tokenContractKeyPairedStandard: {},
  fetchDabCollection: async () => {
    const agent = new HttpAgent({
      // TODO: At the moment we are not interested
      // in testing DAB Locally, so we use the mainnet for Dab
      host: HOSTS.mainnet,
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

    return dabCollection;
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
  fetchTokenContractDabMetadata: async (tokenContactId) => {
    set({
      isLoading: true,
    });

    const canisterMetada = await getDabMetadata({
      canisterId: tokenContactId,
    });

    if (!canisterMetada) {
      console.warn('Oops! Failed to get Dab metadata for Token Contracts')

      set({
        isLoading: false,
      });

      return;
    }
    
    set({
      isLoading: false,
      canisterMetada,
    })
  },
}));
