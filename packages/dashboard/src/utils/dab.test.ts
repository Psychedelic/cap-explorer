import {
  createNFTDetailsHandlerPromiseList,
  GetNFTDetails,
} from './dab';
import {
  NFTDetails,
} from '@psychedelic/dab-js';

describe('Dab', () => {
  describe('createNFTDetailsHandlerPromiseList', () => {
    describe('on valid arguments', () => {
      describe('when no-cached NFT Item details', () => {
        const tokenId = 'qcg3w-tyaaa-aaaah-qakea-cai';
        const transactionEvents = [
          {
            amount: undefined,
            caller: undefined,
            details: [
              [
                "to",
                undefined
              ],
              [
                "token_id",
                undefined
              ],
            ],
            from: undefined,
            item: 1234n,
            operation: "transfer",
            time: "06/12/2021",
            to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
          },
          {
            amount: undefined,
            caller: undefined,
            details: [
              [
                "to",
                undefined
              ],
              [
                "token_id",
                undefined
              ],
            ],
            from: undefined,
            item: 2345n,
            operation: "transfer",
            time: "06/12/2021",
            to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
          }
        ];
        const nftItemDetails = {
          [tokenId]: {
            4071: {
              canister: tokenId,
              index: 4071n,
              metadata: {
                desc: "",
                id: 4071n,
                name: "ICPunk #4071",
                url: "/Token/4071",
              },
              name: "ICPunk #4071",
              standard: "ICPunks",
              url: "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/4071",
            },
          },
        };
        const standard = 'icpunks';
        const callback = async ({
          tokenId,
          tokenIndex,
          standard,
        }: GetNFTDetails) => {
          return ({
            index: BigInt(tokenIndex),
            canister: tokenId,
            id: tokenIndex.toString(),
            name: 'foobar',
            url: 'http://www.site/image.jpg',
            metadata: {},
            standard,
            collection: {},
          } as NFTDetails);
        };
  
        it('should provide a list of promises', async () => {
          const promises = await createNFTDetailsHandlerPromiseList({
            nftItemDetails,
            standard,
            tokenId,
            transactionEvents,
            callback,
          });
  
          expect(promises).toBeTruthy();
        });
  
        it('should provide the expected number of results', async () => {
          const promises = await createNFTDetailsHandlerPromiseList({
            nftItemDetails,
            standard,
            tokenId,
            transactionEvents,
            callback,
          });
  
          const count = Object.keys(transactionEvents).length;
  
          expect(promises?.length == count).toBeTruthy();
        });
      });
      describe('when at least one cached NFT Item details', () => {
        const tokenId = 'qcg3w-tyaaa-aaaah-qakea-cai';
        const transactionEvents = [
          {
            amount: undefined,
            caller: undefined,
            details: [
              [
                "to",
                undefined
              ],
              [
                "token_id",
                undefined
              ],
            ],
            from: undefined,
            item: 1234n,
            operation: "transfer",
            time: "06/12/2021",
            to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
          },
          {
            amount: undefined,
            caller: undefined,
            details: [
              [
                "to",
                undefined
              ],
              [
                "token_id",
                undefined
              ],
            ],
            from: undefined,
            item: 2345n,
            operation: "transfer",
            time: "06/12/2021",
            to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
          }
        ];
        const nftItemDetails = {
          [tokenId]: {
            1234: {
              canister: tokenId,
              index: 1234n,
              metadata: {
                desc: "",
                id: 1234n,
                name: "ICPunk #1234",
                url: "/Token/1234",
              },
              name: "ICPunk #1234",
              standard: "ICPunks",
              url: "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/1234",
            },
          },
        };
        const standard = 'icpunks';
        const callback = async ({
          tokenId,
          tokenIndex,
          standard,
        }: GetNFTDetails) => {
          return ({
            index: BigInt(tokenIndex),
            canister: tokenId,
            id: tokenIndex.toString(),
            name: 'foobar',
            url: 'http://www.site/image.jpg',
            metadata: {},
            standard,
            collection: {},
          } as NFTDetails);
        };
  
        it('should provide a list of promises', async () => {
          const promises = await createNFTDetailsHandlerPromiseList({
            nftItemDetails,
            standard,
            tokenId,
            transactionEvents,
            callback,
          });
  
          expect(promises).toBeTruthy();
        });
  
        it('should provide the expected number of results (minus cached item)', async () => {
          const promises = await createNFTDetailsHandlerPromiseList({
            nftItemDetails,
            standard,
            tokenId,
            transactionEvents,
            callback,
          });
  
          expect(promises?.length == 1).toBeTruthy();
        });
      });
      describe('when all cached NFT Item details', () => {
        const tokenId = 'qcg3w-tyaaa-aaaah-qakea-cai';
        const transactionEvents = [
          {
            amount: undefined,
            caller: undefined,
            details: [
              [
                "to",
                undefined
              ],
              [
                "token_id",
                undefined
              ],
            ],
            from: undefined,
            item: 1234n,
            operation: "transfer",
            time: "06/12/2021",
            to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
          },
          {
            amount: undefined,
            caller: undefined,
            details: [
              [
                "to",
                undefined
              ],
              [
                "token_id",
                undefined
              ],
            ],
            from: undefined,
            item: 2345n,
            operation: "transfer",
            time: "06/12/2021",
            to: "vkhca-m3sos-yukvp-khict-357gz-eamag-7vq6y-prgsi-pudkn-2t72c-qae"
          }
        ];
        const nftItemDetails = {
          [tokenId]: {
            1234: {
              canister: tokenId,
              index: 1234n,
              metadata: {
                desc: "",
                id: 1234n,
                name: "ICPunk #1234",
                url: "/Token/1234",
              },
              name: "ICPunk #1234",
              standard: "ICPunks",
              url: "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/1234",
            },
            2345: {
              canister: tokenId,
              index: 2345n,
              metadata: {
                desc: "",
                id: 2345n,
                name: "ICPunk #2345",
                url: "/Token/2345",
              },
              name: "ICPunk #2345",
              standard: "ICPunks",
              url: "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/2345",
            },
          },
        };
        const standard = 'icpunks';
        const callback = async ({
          tokenId,
          tokenIndex,
          standard,
        }: GetNFTDetails) => {
          return ({
            index: BigInt(tokenIndex),
            canister: tokenId,
            id: tokenIndex.toString(),
            name: 'foobar',
            url: 'http://www.site/image.jpg',
            metadata: {},
            standard,
            collection: {},
          } as NFTDetails);
        };
  
        it('should provide a list of promises', async () => {
          const promises = await createNFTDetailsHandlerPromiseList({
            nftItemDetails,
            standard,
            tokenId,
            transactionEvents,
            callback,
          });
  
          expect(promises).toBeTruthy();
        });
  
        it('should provide an empty list', async () => {
          const promises = await createNFTDetailsHandlerPromiseList({
            nftItemDetails,
            standard,
            tokenId,
            transactionEvents,
            callback,
          });
  
          expect(promises?.length == 0).toBeTruthy();
        });
      });
    });
    describe('on invalid arguments', () => {
      describe('when the transaction events is empty', () => {
        const tokenId = 'qcg3w-tyaaa-aaaah-qakea-cai';
        const transactionEvents: any[] = [];
        const nftItemDetails = {
          [tokenId]: {
            4071: {
              canister: tokenId,
              index: 4071n,
              metadata: {
                desc: "",
                id: 4071n,
                name: "ICPunk #4071",
                url: "/Token/4071",
              },
              name: "ICPunk #4071",
              standard: "ICPunks",
              url: "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/4071",
            },
          },
        };
        const standard = 'icpunks';
        const callback = async ({
          tokenId,
          tokenIndex,
          standard,
        }: GetNFTDetails) => {
          return ({
            index: BigInt(tokenIndex),
            canister: tokenId,
            id: tokenIndex.toString(),
            name: 'foobar',
            url: 'http://www.site/image.jpg',
            metadata: {},
            standard,
            collection: {},
          } as NFTDetails);
        };

        it('should return undefined', async () => {
          const promises = await createNFTDetailsHandlerPromiseList({
            nftItemDetails,
            standard,
            tokenId,
            transactionEvents,
            callback,
          });
  
          expect(promises).toBeUndefined();
        });
      });
    });
  });
});